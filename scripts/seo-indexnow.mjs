#!/usr/bin/env node
/**
 * IndexNow 색인 자동 제출 엔진.
 *
 * 발행/수정된 URL을 IndexNow(api.indexnow.org)에 배치 POST 한다. 한 곳에
 * 제출하면 참여 엔진 전체(Bing·Naver·Yandex·Seznam·Yep 등)에 공유된다.
 * 구글은 IndexNow 미참여 — sitemap lastmod(G2-T1)가 구글 대응의 전부다.
 *
 * URL 소스는 배포된 /sitemap.xml 이다(설계 근거: docs/seo/PROGRAM.md G2).
 * getPublishedPosts() 직접 재사용은 불가 — blog-component-posts.tsx 가 .mdx 를
 * import 해서 플레인 Node 로 로드되지 않는다. sitemap 은 그 함수의 산출물이라
 * 중복 없는 단일 소스이고, 동시에 "배포가 라이브인가"를 증명한다.
 *
 * 사용:
 *   node scripts/seo-indexnow.mjs --init-key          키 생성 + public/<key>.txt 작성
 *   node scripts/seo-indexnow.mjs --dry-run           후보 URL 만 출력, 제출 안 함
 *   node scripts/seo-indexnow.mjs --all               라이브 sitemap 전량 제출(수동 복구용)
 *   node scripts/seo-indexnow.mjs --urls a,b,c        URL 직접 지정
 *   node scripts/seo-indexnow.mjs --base X --head Y   git diff 범위 지정(CI 가 넘김)
 *   node scripts/seo-indexnow.mjs --no-wait           라이브 폴링 생략
 *   node scripts/seo-indexnow.mjs --force             라이브 검증 게이트를 경고로 강등
 *
 * env: INDEXNOW_KEY (제출 시 필수 — 키는 /<key>.txt 로 공개되는 값이라 시크릿 아님)
 *      NEXT_PUBLIC_SITE_URL (없으면 https://yohanstudio.co)
 *
 * 종료는 process.exitCode 로만 한다. fetch 소켓이 열린 채 process.exit() 를
 * 부르면 Windows 에서 libuv assertion(UV_HANDLE_CLOSING) 크래시가 나
 * 종료 코드가 비결정적이 된다(실측).
 */
import { randomBytes } from "node:crypto"
import { execFileSync } from "node:child_process"
import { writeFileSync, readdirSync } from "node:fs"

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://yohanstudio.co").replace(/\/$/, "")
const HOST = new URL(SITE).host
const ENDPOINT = "https://api.indexnow.org/indexnow"
const POLL_INTERVAL_MS = 15_000
const POLL_MAX = 40 // 15s × 40 = 상한 10분

const args = process.argv.slice(2)
const has = (f) => args.includes(f)
const val = (f) => {
  const i = args.indexOf(f)
  return i >= 0 && args[i + 1] !== undefined ? args[i + 1] : null
}

// ── --init-key: 키 생성 + public/<key>.txt ─────────────────────────
function initKey() {
  const existing = readdirSync("public").filter((f) => /^[0-9a-f]{32}\.txt$/.test(f))
  if (existing.length > 0) {
    console.error(`이미 키 파일이 있다: public/${existing[0]} — 교체하려면 먼저 삭제하라.`)
    return 1
  }
  const key = randomBytes(16).toString("hex") // 32자 hex — IndexNow 규격(8~128자) 충족
  writeFileSync(`public/${key}.txt`, key, "utf8")
  console.log(`키 생성: ${key}`)
  console.log(`파일: public/${key}.txt`)
  console.log("")
  console.log("다음 단계(사람):")
  console.log("  1. 이 파일을 커밋·머지해 배포한다 (키는 공개값 — 커밋이 정상이다)")
  console.log(`  2. https://${HOST}/${key}.txt 가 200 인지 확인한다`)
  console.log("  3. GitHub 레포 Settings → Variables 에 INDEXNOW_KEY 로 등록한다 (Secrets 아님)")
  console.log(`  4. 로컬은 셸에서 $env:INDEXNOW_KEY = "${key}"`)
  return 0
}

// ── 라이브 sitemap 로드 ─────────────────────────────────────────────
async function fetchSitemapUrls() {
  const res = await fetch(`${SITE}/sitemap.xml?nocache=${Date.now()}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  })
  if (!res.ok) throw new Error(`sitemap ${res.status}`)
  const xml = await res.text()
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/\/$/, "") || SITE)
}

// ── 후보 URL 산출 ───────────────────────────────────────────────────
// 경로 → URL 매핑 (docs/seo/PROGRAM.md G2 매핑표):
//   src/content/blog/<slug>.mdx     → /blog/<slug> + /blog
//   src/blog/posts/*.mdx            → /blog (개별 slug 는 파일명≠slug 가능성이 있어 목록만)
//   src/content/updates/*.mdx       → /updates (개별 URL 없음 — ADR-004)
//   src/content/showroom/<slug>.mdx → /showroom/<slug> + /showroom
function candidatesFromDiff(base, head) {
  const out = execFileSync("git", ["diff", "--name-status", `${base}...${head}`], { encoding: "utf8" })
  const urls = new Set()
  const dropped = []
  for (const line of out.split("\n")) {
    const m = line.match(/^([AMDR])\S*\t(.+?)(?:\t(.+))?$/)
    if (!m) continue
    const status = m[1]
    const path = (m[3] ?? m[2]).replace(/\\/g, "/") // rename 은 새 경로
    let mm
    if ((mm = path.match(/^src\/content\/blog\/([a-z0-9-]+)\.mdx$/))) {
      if (status === "D") dropped.push(path)
      else { urls.add(`${SITE}/blog/${mm[1]}`); urls.add(`${SITE}/blog`) }
    } else if (/^src\/blog\/posts\/.+\.mdx$/.test(path)) {
      if (status !== "D") urls.add(`${SITE}/blog`)
    } else if (/^src\/content\/updates\/.+\.mdx$/.test(path)) {
      if (status !== "D") urls.add(`${SITE}/updates`)
    } else if ((mm = path.match(/^src\/content\/showroom\/([a-z0-9-]+)\.mdx$/))) {
      if (status === "D") dropped.push(path)
      else { urls.add(`${SITE}/showroom/${mm[1]}`); urls.add(`${SITE}/showroom`) }
    }
  }
  if (dropped.length) {
    // 삭제 URL 자동 통보는 하지 않는다(설계 결정: 404/410 통보 규격을 1차 출처로
    // 확인하지 못함 — 검증 안 된 동작에 자동화 금지). 필요 시 --urls 수동.
    console.log(`[삭제 감지 — 자동 제출 제외] ${dropped.join(", ")}`)
  }
  return [...urls]
}

// ── 메인 ───────────────────────────────────────────────────────────
async function main() {
  if (has("--init-key")) return initKey()

  // 1) 후보 산출
  let candidates
  if (val("--urls")) {
    candidates = val("--urls").split(",").map((u) => u.trim().replace(/\/$/, "")).filter(Boolean)
  } else if (has("--all")) {
    candidates = await fetchSitemapUrls()
    console.log(`[--all] 라이브 sitemap 전량 ${candidates.length}건`)
  } else {
    const base = val("--base") ?? "HEAD~1"
    const head = val("--head") ?? "HEAD"
    try {
      candidates = candidatesFromDiff(base, head)
    } catch (e) {
      console.error(`git diff 실패 (${base}...${head}): ${e.message}`)
      return 1
    }
    console.log(`[diff ${base}...${head}] 후보 ${candidates.length}건`)
  }

  // 호스트 불일치 사전 차단(422 예방)
  candidates = candidates.filter((u) => {
    try {
      if (new URL(u).host === HOST) return true
    } catch { /* 무효 URL */ }
    console.warn(`  ⚠ 호스트 불일치/무효 제외: ${u}`)
    return false
  })

  if (candidates.length === 0) {
    console.log("제출할 URL 없음 — 종료 (콘텐츠 변경이 없는 push 이거나 삭제뿐)")
    return 0
  }
  for (const u of candidates) console.log(`  · ${u}`)

  if (has("--dry-run")) {
    console.log("\n--dry-run — 제출하지 않음")
    return 0
  }

  // 2) 라이브 sitemap 교차검증 (published:false→true 는 sitemap 존재가 발행 증명,
  //    비공개 전환·오타 slug 는 sitemap 부재로 자동 제외)
  if (!has("--no-wait")) {
    const started = Date.now()
    let confirmed = []
    for (let i = 1; i <= POLL_MAX; i++) {
      let live = []
      try {
        live = await fetchSitemapUrls()
      } catch (e) {
        console.warn(`  폴링 ${i}/${POLL_MAX}: sitemap 조회 실패 (${e.message})`)
      }
      const liveSet = new Set(live)
      confirmed = candidates.filter((u) => liveSet.has(u))
      if (confirmed.length === candidates.length) break
      const missing = candidates.filter((u) => !liveSet.has(u))
      console.log(`  폴링 ${i}/${POLL_MAX}: sitemap 미반영 ${missing.length}건 — ${missing.join(", ")}`)
      if (i < POLL_MAX) await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
    }
    const missing = candidates.filter((u) => !confirmed.includes(u))
    if (missing.length > 0) {
      if (has("--force")) {
        console.warn(`  ⚠ --force: sitemap 부재 ${missing.length}건을 제외하고 진행`)
        candidates = confirmed
      } else {
        console.error(
          `\n라이브 sitemap 검증 실패 — ${Math.round((Date.now() - started) / 1000)}초 대기 후에도 ${missing.length}건 미반영:\n` +
            missing.map((u) => `  ✗ ${u}`).join("\n") +
            `\n\n없는 페이지를 검색엔진에 제출하지 않는다(404 통보 방지).` +
            `\n원인 후보: 배포 미완료 / published:false / slug 오타 / 비공개 전환.` +
            `\n수동 복구: 배포 확인 후  npm run seo:ping -- --urls ${missing.join(",")}`,
        )
        return 1
      }
    }
    if (candidates.length === 0) {
      console.log("검증 통과 URL 이 없어 종료")
      return 0
    }
    console.log(`라이브 검증 통과: ${candidates.length}건`)
  }

  // 3) 키 파일 게이트 — 403 사고를 제출 전에 차단
  const key = process.env.INDEXNOW_KEY?.trim()
  if (!key) {
    console.error("INDEXNOW_KEY 필요 (셸 env 또는 GitHub Variables). 최초 설정: --init-key")
    return 1
  }
  {
    const keyUrl = `${SITE}/${key}.txt`
    let body = ""
    try {
      const res = await fetch(keyUrl, { cache: "no-store", signal: AbortSignal.timeout(10_000) })
      if (res.ok) body = (await res.text()).trim()
    } catch { /* 아래에서 실패 처리 */ }
    if (body !== key) {
      console.error(
        `키 파일 게이트 실패: ${keyUrl} 가 키와 일치하지 않는다 (읽음: ${body ? body.slice(0, 8) + "…" : "없음"}).\n` +
          `public/<key>.txt 가 배포됐는지, INDEXNOW_KEY 값이 맞는지 확인하라.`,
      )
      return 1
    }
    console.log(`키 파일 게이트 통과: ${keyUrl}`)
  }

  // 4) 배치 POST + 재시도 (429/5xx 는 Retry-After 존중 백오프 2회, 4xx 는 즉시 중단)
  const payload = { host: HOST, key, keyLocation: `${SITE}/${key}.txt`, urlList: candidates }
  let attempt = 0
  for (;;) {
    attempt++
    let res
    try {
      res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(20_000),
      })
    } catch (e) {
      res = null
      console.warn(`  시도 ${attempt}: 네트워크 실패 (${e.message})`)
    }

    if (res && (res.status === 200 || res.status === 202)) {
      console.log(`\nIndexNow 제출 성공: HTTP ${res.status}${res.status === 202 ? " (202 = 접수됨, 키 검증 대기)" : ""}`)
      console.log(`  ${candidates.length}건 → ${ENDPOINT} (전 참여 엔진 공유)`)
      console.log(`  검증: Bing Webmaster Tools → IndexNow 제출 로그`)
      return 0
    }

    const retriable = !res || res.status === 429 || res.status >= 500
    if (!retriable || attempt > 2) {
      const bodyText = res ? (await res.text()).slice(0, 300) : "(무응답)"
      console.error(`\nIndexNow 제출 실패: HTTP ${res?.status ?? "네트워크"} — ${bodyText}`)
      if (res?.status === 403) console.error("403 = 키 불일치. 키 파일 배포 상태를 확인하라.")
      if (res?.status === 422) console.error("422 = URL 호스트 불일치. urlList 의 도메인을 확인하라.")
      console.error(`수동 재시도: npm run seo:ping -- --urls ${candidates.join(",")}`)
      return 1
    }
    const retryAfter = Number(res?.headers.get("retry-after")) || (attempt === 1 ? 30 : 120)
    console.warn(`  시도 ${attempt}: HTTP ${res?.status ?? "실패"} — ${retryAfter}초 후 재시도`)
    await new Promise((r) => setTimeout(r, retryAfter * 1000))
  }
}

process.exitCode = await main()
