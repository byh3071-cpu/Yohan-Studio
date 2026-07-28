import * as Sentry from "@sentry/nextjs"

import { generateSpeech, TTSError } from "@/lib/tts"
import { createRateLimiter, getClientKey } from "@/lib/rateLimit"

export const runtime = "nodejs"
export const maxDuration = 15

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 30
const MAX_TEXT_CHARS = 2_000
const MAX_BODY_BYTES = 16 * 1024

const limiter = createRateLimiter({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX,
})

function jsonError(status: number, error: string, extraHeaders?: Record<string, string>) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "content-type": "application/json", ...extraHeaders },
  })
}

export async function POST(req: Request) {
  if (!limiter.check(getClientKey(req))) {
    return jsonError(429, "Too many requests", { "retry-after": "60" })
  }

  const contentLength = Number(req.headers.get("content-length") ?? "0")
  if (contentLength > MAX_BODY_BYTES) {
    return jsonError(413, "Payload too large")
  }

  let parsed: unknown
  try {
    parsed = await req.json()
  } catch {
    return jsonError(400, "Invalid JSON")
  }

  if (!parsed || typeof parsed !== "object" || !("text" in parsed)) {
    return jsonError(400, "Invalid body")
  }
  const { text } = parsed as { text: unknown }
  if (typeof text !== "string" || text.trim().length === 0) {
    return jsonError(400, "text must be non-empty string")
  }

  const truncated = text.slice(0, MAX_TEXT_CHARS)

  try {
    const audio = await generateSpeech(truncated)
    return new Response(audio, {
      status: 200,
      headers: {
        "content-type": "audio/mpeg",
        "content-length": String(audio.byteLength),
        "cache-control": "private, max-age=0, no-store",
      },
    })
  } catch (err) {
    console.error("[/api/tts] error:", err)
    Sentry.captureException(err)
    const status = err instanceof TTSError ? err.status : 503
    return jsonError(
      status === 500 ? 503 : status,
      "음성 재생을 일시적으로 사용할 수 없습니다",
    )
  }
}
