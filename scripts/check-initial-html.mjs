#!/usr/bin/env node
/**
 * 초기 HTML 회귀 가드 — 크롤러가 받는 HTML에 목록과 canonical이 실려 있는가.
 *
 * 왜 Playwright가 아니라 이 스크립트인가:
 *  - 이 결함(useSearchParams + Suspense fallback=null → CSR 바일아웃)은
 *    프로덕션 빌드에서만 재현된다. Next 공식 문서: "In development, routes are
 *    rendered on-demand, so useSearchParams doesn't suspend." 현 playwright.config는
 *    webServer가 `npm run dev`라 결함이 재현되지 않아 테스트가 항상 통과한다.
 *  - 검사 대상이 "JS 실행 후 화면"이 아니라 "서버가 보낸 HTML"이다. 브라우저가 필요 없다.
 *  - AI 크롤러(GPTBot·ClaudeBot·PerplexityBot)는 JS를 실행하지 않으므로
 *    이 HTML이 곧 그들이 보는 전부다.
 *
 * 기대값은 하드코딩하지 않고 같은 빌드의 sitemap에서 뽑는다(글이 늘고 줄어도 자동 추종).
 *
 * 사용: npm run build && npm run seo:check
 */
import { readFileSync, existsSync, readdirSync } from "node:fs"

const APP = ".next/server/app"
const SITEMAP = `${APP}/sitemap.xml.body`

const fail = []
const pass = []

function read(path, label) {
  if (!existsSync(path)) {
    fail.push(`${label}: 빌드 산출물 없음 (${path}) — 먼저 npm run build`)
    return null
  }
  return readFileSync(path, "utf8")
}

function uniq(html, re) {
  return new Set(html.match(re) ?? []).size
}

const sitemap = read(SITEMAP, "sitemap")
if (!sitemap) {
  console.error("✗ sitemap 산출물이 없어 기대값을 뽑을 수 없다. npm run build 먼저.")
  process.exit(1)
}

const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
const base = locs[0]?.replace(/\/$/, "") ?? ""
const expectBlog = locs.filter((u) => /\/blog\/[^/]+$/.test(u)).length
const expectShowroom = locs.filter((u) => /\/showroom\/[^/]+$/.test(u)).length

// ── 1) 목록이 초기 HTML에 실려 있는가 ──────────────────────────────
const checks = [
  {
    label: "/blog 글 링크",
    file: `${APP}/blog.html`,
    re: /href="\/blog\/[a-z0-9-]+"/g,
    expect: expectBlog,
    why: "sitemap의 /blog/<slug> 수와 일치해야 한다",
  },
  {
    label: "/showroom 프로젝트 링크",
    file: `${APP}/showroom.html`,
    re: /href="\/showroom\/[a-z0-9-]+"/g,
    expect: expectShowroom,
    why: "sitemap의 /showroom/<slug> 수와 일치해야 한다",
  },
]

for (const c of checks) {
  const html = read(c.file, c.label)
  if (!html) continue
  const got = uniq(html, c.re)
  if (got === c.expect) pass.push(`${c.label}: ${got}건`)
  else fail.push(`${c.label}: ${got}건 (기대 ${c.expect}건 — ${c.why})`)
}

// /updates는 개별 URL이 없어(ADR-004) sitemap에서 기대값을 뽑을 수 없다.
// 대신 발행된 릴리즈 MDX 수를 직접 센다.
//
// ⚠️ 여기서 "버전 문자열 개수"를 세면 안 된다. RSC flight payload(__next_f.push)에
// 데이터가 통째로 직렬화돼 있어서, DOM이 비어 있어도 semver가 그대로 잡힌다.
// 실측(회귀 주입 상태): semver 4종 매치 / <article> 0개. 즉 semver 검사는 무용지물이다.
// href="..." 패턴은 payload에서 따옴표가 \"로 이스케이프되므로 매치되지 않아 안전하다.
{
  const html = read(`${APP}/updates.html`, "/updates")
  const dir = "src/content/updates"
  let expectUpdates = 0
  if (existsSync(dir)) {
    for (const f of readdirSync(dir)) {
      if (!f.endsWith(".mdx")) continue
      if (/^published:\s*"?true"?\s*$/m.test(readFileSync(`${dir}/${f}`, "utf8"))) expectUpdates++
    }
  }
  if (html) {
    const got = (html.match(/<article/g) ?? []).length
    if (expectUpdates === 0) fail.push("/updates: 발행된 릴리즈 MDX가 0건 — 기대값을 세울 수 없다")
    else if (got === expectUpdates) pass.push(`/updates 릴리즈 <article>: ${got}개`)
    else fail.push(`/updates 릴리즈 <article>: ${got}개 (기대 ${expectUpdates}개 — 발행된 MDX 수와 일치해야 한다)`)
  }
}

// ── 2) canonical이 자기 URL을 가리키는가 ───────────────────────────
// 루트 layout의 canonical이 하위로 상속되면 전부 홈을 가리키게 된다.
const canonical = [
  ["index.html", ""],
  ["blog.html", "/blog"],
  ["updates.html", "/updates"],
  ["showroom.html", "/showroom"],
]

for (const [file, path] of canonical) {
  const html = read(`${APP}/${file}`, `canonical ${path || "/"}`)
  if (!html) continue
  const m = html.match(/<link rel="canonical" href="([^"]+)"/)
  const want = `${base}${path}`
  if (!m) fail.push(`canonical ${path || "/"}: 태그 없음`)
  else if (m[1].replace(/\/$/, "") === want) pass.push(`canonical ${path || "/"}: ${m[1]}`)
  else fail.push(`canonical ${path || "/"}: ${m[1]} (기대 ${want} — 루트 상속 의심)`)
}

// ── 3) vercel.app → 정식 도메인 308 리디렉트가 살아있는가 ──────────
// yohan-studio.vercel.app 은 Vercel 자동 발급 도메인이다. 리디렉트가 풀리면
// 같은 사이트가 두 주소로 이중 서빙돼 중복 콘텐츠가 된다. GSC 의 해당 속성은
// 알림을 꺼둔 상태라(영구 "리디렉션됨" 노이즈) 이 검사가 유일한 감시자다.
// 라이브 네트워크 호출이므로: 리디렉트 실종(2xx 직접 응답)만 fail,
// 네트워크 오류·타임아웃은 경고로 강등한다(오프라인 로컬 실행 보호).
{
  const legacy = "https://yohan-studio.vercel.app/"
  try {
    const res = await fetch(legacy, { method: "HEAD", redirect: "manual", signal: AbortSignal.timeout(10_000) })
    const loc = res.headers.get("location") ?? ""
    if (res.status >= 300 && res.status < 400 && loc.startsWith(base)) {
      pass.push(`vercel.app 리디렉트: ${res.status} → ${loc}`)
    } else if (res.status >= 200 && res.status < 300) {
      fail.push(`vercel.app 리디렉트 실종: ${res.status} 직접 응답 — 이중 서빙(중복 콘텐츠) 상태`)
    } else {
      console.warn(`  ⚠ vercel.app 리디렉트 판정 불가: ${res.status} Location=${loc || "(없음)"}`)
    }
  } catch (e) {
    console.warn(`  ⚠ vercel.app 리디렉트 검사 생략(네트워크): ${e.message}`)
  }
}

// ── 결과 ────────────────────────────────────────────────────────
for (const p of pass) console.log(`  ✓ ${p}`)
if (fail.length === 0) {
  console.log(`\n초기 HTML 회귀 가드 통과 (${pass.length}개 검사)`)
  process.exit(0)
}
console.error("")
for (const f of fail) console.error(`  ✗ ${f}`)
console.error(
  `\n초기 HTML 회귀 가드 실패 ${fail.length}건.\n` +
    `크롤러는 JS를 실행하지 않는다. 목록이 0건이면 그 페이지는 검색엔진에 백지로 보인다.\n` +
    `Suspense fallback이 null로 되돌아갔는지 먼저 확인할 것 (docs/seo/PROGRAM.md G1).`,
)
process.exit(1)
