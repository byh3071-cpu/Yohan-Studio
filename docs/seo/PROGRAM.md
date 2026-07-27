# 검색 노출 프로그램 — Goal 7개 / 티켓 30개

작성 2026-07-27 · 개정 2026-07-27(계획 재감사) · 개정 2026-07-28(**필드 데이터 반영 — 우선순위 재조정**) · 상태: 계획 확정, 코드 미착수
관련: `docs/ssr-seo-report.html` (조사 근거) · `docs/seo/baseline-2026-07-28.md` (**GSC 실측**) · `docs/backlog.md`

**열린 결정 1건** — `G5-T6` (초기 JS 334KB 감량 범위, 성능 vs 기능)

> **2026-07-28 필드 데이터가 우선순위를 바꿨다.** GSC 실측 결과 D1(canonical 오염)은 **현재 피해가 없고**(구글이 선언을 안 따르는 중), 확인된 실제 손실은 D2(백지 목록 → `/blog`·`/updates` 노출 0)다. 그리고 **비브랜드 검색어가 0개**라 진짜 병목은 콘텐츠(G8 신설)로 드러났다. 상세는 하단 개정 이력.

각 Goal은 **독립 머지 가능**하다. 의존이 있는 경우만 명시했다.

---

## 결론 3줄

1. `/blog`·`/updates`·`/showroom` 은 ⓐ 목록이 HTML에 0건이고 ⓑ canonical이 홈을 가리킨다 → 구글에 "이 3장은 홈 복제본"이라 선언 중. **G1 최우선.**
2. 색인 요청은 **네이버 포함 대부분 완전 자동화 가능**(IndexNow). 자동화 후 사람 수동 작업 = 0. 구글만 공식 자동 제출 수단이 없다(sitemap이 대체).
3. llms.txt는 효과 근거가 없다(구글 공식 부정 + Ahrefs 13.7만 사이트 97% 유입 0). 유지하되 자동생성으로 돌려 유지비만 0으로 만든다.

---

## 검증된 외부 사실 (1차 출처 — 구현 시 재조사 불필요)

| 주장 | 출처 | 인용/수치 |
|---|---|---|
| Google Indexing API는 채용공고·라이브 전용 | Google 공식 Indexing API Quickstart | "can only be used to crawl pages with either `JobPosting` or `BroadcastEvent` embedded in a `VideoObject`" |
| sitemap ping 엔드포인트 폐기 | Google Search Central Blog 2023-06-26 | 6개월 후 404. 대신 **`lastmod`가 재크롤 스케줄링 신호** |
| 구글은 IndexNow 미지원 | 2026-02 기준 | sitemap + GSC가 유일 경로 |
| IndexNow 참여 엔진 | `indexnow.org/searchengines.json` **1차 확인** | bing, yandex, seznam, **naver(`searchadvisor.naver.com`)**, yep, internetarchive, amazonbot. 한 곳 제출 → 전 엔진 공유 |
| IndexNow 규격 | indexnow.org/documentation | 키 8~128자, `https://host/<key>.txt` 평문 호스팅, 배치 POST `{host,key,keyLocation,urlList}` 최대 10,000건, 429=too many. **키는 공개값 = 시크릿 아님** |
| sitemap은 색인 명령이 아님 | John Mueller | "발견·우선순위 신호". 색인 요청 버튼도 보장 없음 |
| AI 크롤러는 JS 미실행 | Vercel, nextjs.org 수개월 실측(2024-12) | "none of the major AI crawlers currently render JavaScript" — GPTBot/ClaudeBot/PerplexityBot. Claude는 JS 23.84% fetch, 실행 0 |
| AI 노출에 특수 파일 불필요 | Google 공식 "AI features and your website" | "You don't need to create new machine readable files, AI text files, or markup" / "no special schema.org structured data that you need to add" / "best practices for SEO remain relevant for AI features" |
| llms.txt 무효 | Google(Gary Illyes·John Mueller) + Ahrefs 137k 사이트 | 구글 미지원·미계획. 97%가 유입 0. Mueller: keywords meta tag에 비유 |
| AdSense 자격 | Google 공식 애드센스 가입 자격 | 만 19세 이상 / 독창적 콘텐츠 / HTML 소스 접근권 / 정책 준수. **공식 최소 글 수 기준 없음**(항간의 "10~15편"은 2차 속설) |

---

## 결함 목록 (빌드 산출물 + 라이브 실측 확정)

| # | 결함 | 근거 | 심각도 | 담당 |
|---|---|---|---|---|
| D1 | **canonical 전역 오염** — 루트 `alternates.canonical: "/"` 가 하위 상속 → 3장이 `href="https://yohanstudio.co"` 로 자기정규화 상실 | `src/app/layout.tsx:138`, `.next/server/app/{blog,updates,showroom}.html` | **상** ↓ | G1-T1a·T1b |
| D2 | 목록 3장이 초기 HTML에 0건 (CSR 폴백) | `blog/page.tsx:74-76`→`TagFilter.tsx:23` / `updates/page.tsx:83-85`→`UpdatesFeed.tsx:29` / `showroom/page.tsx:103-105`→`ProjectGrid.tsx:36`. 라이브 curl 0/0/1 | **높음** ↑ | G1-T2~T4 |
| **D13** | **비브랜드 검색어 0개.** 3개월 클릭 0 · 노출 39 · 검색어 2개가 전부 브랜드명 | GSC 실데이터 (`docs/seo/baseline-2026-07-28.md`) | **최상** | **G8 (신설)** |
| D14 | 404 3건 — `/blog/[slug]`(발생원 특정) · `/&` · `/$` | GSC + `src/content/blog/vibe-coding-2hr-deploy.mdx:79` | 낮 | G3-T7 |
| D15 | OG 이미지 라우트 10개 + favicon 이 "크롤링됨-미색인"으로 리포트 오염 | GSC 미색인 11건 전수 확인 | 낮 | G3-T8 |
| D3 | sitemap `lastmod` 신뢰도 파괴 — 정적 라우트 **12곳이 `new Date()`(빌드시각)**, 글은 `post.date` 고정 | `src/app/sitemap.ts:12`, `:27,33,39,45,51,57,63,69,75,81,87,93` | 높음 | G2-T1 |
| D4 | verification 토큰 하드코딩 fallback이 **죽은 값** — 빌드 실제값과 불일치. env 없는 환경에서 오토큰 노출 | `layout.tsx:50-56` vs `.next/server/app/index.html` | 중 | G3-T1 |
| D5 | naver-site-verification meta **2번 출력** | `layout.tsx:160-162` + `:144` | 낮 | G3-T1 |
| D6 | sitemap 누락: `/learning-log/[id]`, `/store/[id]` 0건 | `src/app/sitemap.ts` | 중 | G3-T2 |
| D7 | canonical 미선언: `/learning-log/[id]`, `/store/[id]` | 각 page.tsx | 중 | G1-T1 |
| D8 | `public/llms.txt` stale — 블로그 3건 기재(실제 12), 쇼룸 4건(실제 8) | `public/llms.txt` (수기) | 낮 | G6-T1 |
| D9 | JSON-LD 없는 라우트 8개 | `/blog`,`/showroom`,`/store`,`/store/[id]`,`/diagnosis`,`/design`,`/contact`,404 | 중 | G4-T1 |
| D10 | OG `alt` 누락 2건 | `blog/[slug]`·`showroom/[slug]` opengraph-image | 낮 | G3-T4 |
| D11 | 주제 기반 관련글 없음 (블로그끼리는 prev/next뿐) | `src/components/seo/RelatedContent.tsx` | 중 | G4-T2 |
| D12 | `icon.tsx`/`apple-icon.tsx`/`manifest.json`/`ads.txt` 없음, `images.remotePatterns` 없음 | `public/`, `next.config.ts` | 낮 | G3-T4·T5 |

---

## 재사용할 자산 (신규 작성 금지)

| 자산 | 위치 | 용도 |
|---|---|---|
| `getPublishedPosts()` | `src/lib/blog.ts:110` | 블로그 URL 단일 소스 (sitemap·RSS·SSG가 전부 파생) |
| `getPublishedUpdates()` | `src/lib/updates.ts:104` | 릴리즈 URL 소스 |
| `getAllShowroomProjects()` | `src/lib/showroom.ts` | 쇼룸 URL 소스 |
| `gate()` + HEAD 200 + `--force` 강등 | `scripts/naver-publish.mjs:53-76` | 발행 전 게이트 패턴 원본 |
| env 가드 → `fetch(POST)` → `!res.ok` 시 status+본문 300자 후 exit 1 | `scripts/gen-cover.mjs:13-40` | 외부 POST 스크립트 패턴 원본 |
| `brandOgCard()` / `OG_SIZE` | `src/components/seo/ogCard.tsx:5,7` | OG 카드 공용 |
| `BreadcrumbJsonLd`·`ArticleJsonLd`·`ShowroomJsonLd` | `src/components/seo/` | JSON-LD 확장 시 재사용 |
| `RelatedShowroomProjects`·`RelatedBlogPosts` | `src/components/seo/RelatedContent.tsx:65,100` | 관련글 확장 기반 |
| CI | `.github/workflows/ci.yml` (push:master + PR, `npm ci`→lint→build, 테스트 미실행) | 신규 워크플로는 **별도 파일**. ci.yml 무수정 |
| 테스트 | `pnpm qa:test` = playwright, `tests/qa.spec.ts` (ROUTES 7개 루프, 9케이스). **`npm test` 스크립트 없음** | 회귀 테스트 확장 지점 |
| 문서 SoT | `docs/content/blog-publishing-system.md`(절차) · `docs/state/vercel-env-keys.md`(env) · `docs/adr/`(다음 **ADR-005**) | 갱신 대상 |

---

# G0 — 계획 자산화

| 티켓 | 내용 | 상태 |
|---|---|---|
| G0-T1 | `docs/backlog.md` 생성 | ✅ 완료 |
| G0-T2 | `docs/seo/PROGRAM.md` 생성 (이 문서) | ✅ 완료 |
| G0-T3 | `docs/ssr-seo-report.html` + 위 2개 커밋 | ⬜ **사람 게이트** |

---

# G1 — 크롤 가능성 복구 ★최우선

> 색인을 아무리 빨리 알려도 알린 페이지가 백지면 의미 없다. 다만 **아래 순서는 2026-07-28 필드 데이터로 한 번 재조정됐다** — 실제 피해가 D1이 아니라 D2에 있는 것으로 확인됐다.

### 순서 재조정 근거 (2026-07-28)

GSC 미색인 17건을 전수 확인한 결과:

| 확인 | 결과 |
|---|---|
| `/blog`·`/updates`·`/showroom` 이 색인에서 빠졌나 | **아니오.** 미색인 목록 어디에도 없음 = 색인 28건 안에 정상 존재 |
| 그럼 D1(canonical 오염)의 현재 피해는 | **없음.** 구글이 우리 canonical 선언을 따르지 않고 self-canonical 처리 중 |
| D2(백지 목록)의 현재 피해는 | **있음.** `/blog` 노출 **0**, `/updates` 노출 **0**. 색인은 됐는데 HTML에 매칭될 내용이 없어 어떤 검색어에도 안 걸림 |

→ **D1은 "잠재 위험"(구글이 언제든 선언을 따를 수 있고, 네이버·빙은 다르게 반응할 수 있음), D2가 "확인된 실제 손실".** 따라서 D2 먼저 고친다.

또한 원래의 `T1`(루트 canonical 삭제 + 전 라우트 보강)은 **원자성 요구**가 있다 — 루트를 지우는 순간 자체 선언이 없는 라우트는 canonical을 통째로 잃는다. 그래서 **추가(T1a)와 삭제(T1b)로 분리**한다. T1a만으로도 D1의 실질 문제는 해소된다(자식 canonical이 부모를 덮어쓰므로).

| 티켓 | 내용 | 의존 | DoD |
|---|---|---|---|
| **G1-T1a** | **canonical 추가 (순수 가산, 삭제 없음).** 자체 canonical이 없는 전 라우트에 추가 — `/blog`, `/updates`, `/showroom`, `/learning-log/[id]`, `/store/[id]`, 404, 홈(metadata export 자체가 없으므로 신규 생성). **`layout.tsx` 는 건드리지 않는다** | 없음 | ① 빌드 후 `.next/server/app/{index,blog,updates,showroom}.html` canonical이 **각자 자기 URL** ② 전 페이지 라우트에 canonical 존재를 스크립트로 전수 확인 ③ `/store/checkout/success` 의 `noindex` 유지 ④ **회귀 위험 0** — 자식이 부모를 덮어쓸 뿐 아무것도 잃지 않음 |
| **G1-T2** | **`/updates` CSR 결함 수정** ★ **D2 중 피해 최대** — 상세 라우트가 없어 릴리즈 본문이 크롤 가능 HTML 어디에도 없다. GSC 노출 0 | T1a | ① 빌드 산출 `updates.html` 에 버전 문자열 5건 전부 존재 ② 필터 UI 하이드레이션 후 정상 ③ `?type=NEW` 등 기존 URL 파라미터 동작 유지 ④ `pnpm qa:test` 통과 |
| **G1-T3** | **`/blog` CSR 결함 수정** — 동일 패턴. GSC 노출 0 | T2 | 빌드 산출 `blog.html` 에 `href="/blog/<slug>"` 가 발행 글 수만큼. 태그 필터 정상 |
| **G1-T4** | **`/showroom` CSR 결함 수정** — 동일 패턴. GSC 노출 2 | T2 | 빌드 산출 `showroom.html` 에 프로젝트 링크 9건 전부 |
| **G1-T1b** | **루트 canonical 제거 (정리).** `layout.tsx:138` 의 `alternates.canonical: "/"` 삭제. **`alternates.types`(RSS)는 유지할 것** — 같은 객체 안에 있으니 통째로 지우지 말 것 | T1a | ① `layout.tsx` 에 canonical 없음, RSS `alternates.types` 는 살아있음 ② 빌드 후 canonical 누락 라우트 0 (T1a 스크립트 재실행) |
| **G1-T5** | **회귀 방지 스모크 테스트.** "빌드된 HTML에 목록이 실려 있는가" + "canonical이 자기 URL인가" 검사. ⚠️ **반드시 프로덕션 빌드 대상** — 아래 P1 참조 | T1b | ① **dev 서버가 아닌 `next build && next start` 대상**으로 실행 ② 3장 각각 최소 링크 수 assert + canonical 자기참조 assert ③ 일부러 되돌리면 **빨간불** 확인(필수 — 이 검증을 안 하면 테스트가 무용지물인지 알 수 없다) ④ CI 편입은 별도 판단(현재 ci.yml은 테스트 미실행) |

> **P1 — 이 티켓의 함정 (실측 확인)**
> `playwright.config.ts:16` 이 `command: "npm run dev"` 다. 그런데 Next.js 공식 문서: *"In development, routes are rendered on-demand, so `useSearchParams` doesn't suspend and things may appear to work without `Suspense`."*
> **즉 dev 서버로 테스트하면 결함이 재현되지 않아 테스트가 항상 통과한다.** 회귀를 전혀 못 막는다.
> 조치: 이 케이스 전용으로 `webServer.command` 를 프로덕션 빌드로 바꾼 별도 playwright config를 두거나(`scripts/record-flexible.config.mjs` 선례 있음), 빌드 산출 HTML을 직접 검사한다.

### 구현 패턴 (T2~T4 공통) — A안 채택

**원인 (공식 문서)**: Next.js `useSearchParams` — *"If a route is prerendered, calling `useSearchParams` will cause the Client Component tree up to the closest Suspense boundary to be client-side rendered."* + *"This component passed as a fallback to the Suspense boundary **will be rendered in place of** the search bar in the initial HTML."*

즉 **버그가 아니라 설계된 동작**이고, 우리가 `fallback`을 `null`로 둔 게 원인이다. 문서가 의도한 사용법은 fallback에 실물을 넣는 것이다.

### 확정 방식 (2026-07-27, 실제 코드 확인 후)

```tsx
// src/app/blog/page.tsx:74  — 3개 라우트 동일 패턴
<Suspense fallback={null}>              →  <Suspense fallback={<StaticPostList posts={posts} />}>
  <TagFilter posts={posts} />                <TagFilter posts={posts} />
</Suspense>                                </Suspense>
```

**핵심 근거**: `TagFilter`는 **이미 `posts`를 서버에서 prop으로 받고 있다**(`TagFilter.tsx:9,20`). 데이터를 클라이언트로 어떻게 넘길지는 애초에 문제가 아니었다. CSR로 빠지는 원인은 오직 `useSearchParams()` 하나다.

| 이 방식이 이긴 이유 | |
|---|---|
| `TagFilter.tsx` **무변경** | 회귀 위험 0. URL 동기화·뒤로가기·검색어 동작 전부 그대로 |
| 신규 파일 | 서버 컴포넌트 1개(`StaticPostList` 등)만. 기존 `BlogRowCard`·`ProjectCard` 재사용 |
| 변경량 | 각 page.tsx 1줄 |

**⚠️ fallback에 툴바 스켈레톤도 포함할 것.** 목록만 넣으면 하이드레이션 시 검색창·태그칩이 위에서 삽입되며 CLS가 발생한다. 동일 높이의 자리를 fallback에도 확보한다.

**기각한 대안**

| 안 | 기각 사유 |
|---|---|
| page의 `searchParams` prop을 서버에서 읽어 필터링 | 라우트가 동적 SSR로 전환돼 정적 캐시 상실 |
| `useSearchParams` 제거 → `useState` + `popstate` 동기화 | `TagFilter` 내부를 뜯어야 함. 위 방식이 같은 결과를 무변경으로 달성 |
| `/blog/tag/[tag]` 정적 라우트 신설 | 기각 아님 — 색인 표면 확대 효과가 별도로 있어 **G4-T3으로 분리** |

### 알려진 트레이드오프 — 필터 플래시 (수용)

`?tag=x` 상태에서 **새로고침하거나 URL을 붙여넣으면** 전체 목록이 잠깐 보였다가 필터링된다. 서버는 쿼리를 모르므로 원리상 회피 불가.

**수용 근거**: 태그 칩이 `<a>`가 아니라 `<button>` + `router.replace`다(`TagFilter.tsx:130-146`). 즉 `?tag=x` URL은 **내부 SPA 전환으로만 생성**되며, 그 시점엔 JS가 이미 로드돼 있어 플래시가 없다. 외부로 링크가 샐 일도, 검색엔진이 그 URL을 알 일도 없다.

회피하려면 `theme-init`(`layout.tsx:164`)처럼 `beforeInteractive` 인라인 스크립트로 페인트 전에 클래스를 심는 패턴이 있으나 **과잉**으로 판단해 채택하지 않는다.

---

# G2 — 색인 자동화 ★최대 통증

> 자동화 후 사람 수동 작업 = 0. 네이버·Bing·Yandex·Yep·Archive·Amazon은 IndexNow로 발행 즉시 자동 통보. 구글은 sitemap이 자동 발견.

### 아키텍처 결정

| 항목 | 결정 | 근거 |
|---|---|---|
| 프로토콜 | IndexNow 배치 POST `https://api.indexnow.org/indexnow` 1회 | 전 참여 엔진 자동 공유 |
| 트리거 | **GitHub Actions** (`push: master` + `paths` + `workflow_dispatch`) | "까먹음"을 실제로 해결. **Vercel 웹훅 기각** — `deployment.succeeded`도 프로덕션 alias 전환을 보장 못 해 어차피 라이브 프로브 필요한데, 웹훅엔 diff가 없어 상태 저장소를 강요(과잉) + 공개 엔드포인트·시크릿 증가 |
| URL 판별 | git diff로 **후보** → **라이브 `/sitemap.xml` 교차검증이 최종 게이트** | `published:false→true` 전환도 자동으로 잡힘(sitemap 존재 = 발행 증명). 비공개 전환·삭제는 sitemap 부재로 자동 제외 |
| URL SoT | 배포된 `/sitemap.xml` 파싱 | `getPublishedPosts()` 직접 재사용 **불가** — `src/lib/blog.ts:13`→`blog-component-posts.tsx`가 `.mdx`를 import해 tsx 로드 실패. gray-matter 재파싱은 컴포넌트 포스트 1건을 놓쳐 두 번째 SoT가 됨. sitemap 파싱은 중복 0 + 배포 라이브 여부를 동시 증명 |
| 의존성 | **npm 의존성 0** (`node:crypto`, `node:child_process`, 내장 fetch) | 워크플로에서 `npm ci` 생략 |
| 키 보관 | GitHub **Variables** (`vars.INDEXNOW_KEY`), Secrets 아님 | 키는 `/{key}.txt` 로 공개되는 값 |

### 티켓

| 티켓 | 내용 | 의존 | DoD |
|---|---|---|---|
| **G2-T1** | **sitemap `lastmod` 정확도 개선** (D3). `BlogFrontmatter`에 `updated?: string` 선택 필드 → `/blog/<slug>` lastmod = `updated ?? date`. `/blog`·`/updates`·`/showroom` = 각 최신 항목 날짜. **나머지 9개 정적 라우트는 `lastModified` 필드 자체 제거**(빌드시각 = 거짓 신호, 무신호가 낫다). git commit time 기각 — Vercel 얕은 클론에서 비결정적 | 없음 | ① `src/lib/blog.ts` `updated?` 파싱 ② `src/app/sitemap.ts` 재설계 ③ 빌드 산출 `sitemap.xml`에 **빌드 시각 0건** ④ 기존 12개 글 무수정 동작(하위호환) ⑤ lint·build 통과 |
| **G2-T2** | **IndexNow 키 발급 + 배포.** `--init-key` 로 32자 hex 생성 → `public/<key>.txt` → 커밋·배포(**사람 게이트**) → GH Variables 등록 | 없음 | ① `https://yohanstudio.co/<key>.txt` 200 + 본문 == 키 정확 일치 ② GH Variables `INDEXNOW_KEY` 등록 ③ 로컬 `$env:INDEXNOW_KEY` 확인 |
| **G2-T3** | **`scripts/seo-indexnow.mjs` 엔진 + `pnpm seo:ping`.** 옵션 `--init-key`/`--dry-run`/`--all`/`--urls`/`--base --head`/`--no-wait`/`--force`. 라이브 sitemap 폴링 **15초 × 40회 = 상한 10분**, 초과 시 **제출 없이 exit 1**. 키 파일 게이트 선행. 429/5xx는 `Retry-After` 존중 백오프 2회, 400/403 즉시 중단. URL 정규화 + `Set` dedup | T2 + **G5-T3** | ① npm 의존성 0 ② `--dry-run` 후보 URL 정확 ③ **`published:false→true` 커밋 범위로 실증** ④ 틀린 키면 제출 전 exit 1 ⑤ 폴링 초과 시 수동 복구 명령 출력 ⑥ 실제 1건 제출 → **Bing WMT 제출 로그 등장** ⑦ `package.json` 스크립트 추가 |
| **G2-T4** | **GitHub Actions** `.github/workflows/seo-indexnow.yml`. `ci.yml` **무수정**. `paths`: `src/content/{blog,updates,showroom}/**`, `src/blog/posts/**`. `concurrency: cancel-in-progress: false` | T3 | ① **`actions/checkout` `fetch-depth: 0`** — 없으면 `github.event.before` 커밋이 로컬에 없어 diff가 **조용히 전부 실패** ② `before == 0000…` 폴백 존재 ③ `paths` 필터 스킵 실증 ④ 첫 실행은 `workflow_dispatch` + `dry_run: true` ⑤ 실제 글 1건으로 end-to-end 성공 ⑥ 의도적 실패 → 빨간 X + 알림 도달 |
| **G2-T5** | **(절충) GSC URL 검사 딥링크 오프너** `pnpm seo:gsc -- <slug>` → `https://search.google.com/search-console/inspect?resource_id=<property>&id=<url>` 브라우저 open. **자동 클릭 없음** | T3 | ① 딥링크가 실제로 해당 URL 검사 화면을 여는지 **수동 실측**(형식 추정이므로 필수) ② 안 열리면 티켓 폐기 + 문서에 "구글은 GSC 수동" 명시 |
| **G2-T6** | **문서·ADR.** `docs/adr/ADR-005-indexnow-auto-submission.md` / `docs/content/blog-publishing-system.md` "색인 자동 제출" 절 / `docs/state/vercel-env-keys.md` `INDEXNOW_KEY` 행 | T1~T5 | 3개 문서 갱신 |

**의존 순서**: `G5-T3(Bing 등록)` ∥ `T1` ∥ `T2` → `T3` → `T4` → `T5 ∥ T6`

**주의 2건**
- **P4 (의존 누락 수정)**: T3의 DoD⑥ 이 Bing Webmaster Tools 제출 로그를 요구하는데, Bing 등록은 G5-T3다. **G5-T3를 G2-T3보다 먼저** 끝내야 한다. 등록은 무료·10분이며 G5의 나머지와 달리 G1 완료를 기다릴 필요가 없다.
- **P3 (파일 충돌)**: T1이 `src/app/sitemap.ts` 를 거의 전 줄 고친다. **G3-T2(sitemap 라우트 추가)와 같은 파일이라 병렬 불가** — T1을 먼저 머지하고 G3-T2가 그 위에 얹혀야 한다.
- T1은 IndexNow와 무관하게 단독 가치가 크고(구글 대응의 전부) 회귀 위험이 가장 낮다 → 프로그램 전체에서 **가장 먼저 머지** 권장.

**로컬 실행 편의**: 스크립트는 셸 env(`$env:INDEXNOW_KEY`)를 읽는다. 매번 설정이 번거로우면 `scripts/seed.ts:6` 의 선례(*".env.local 자동 로드 — 수동 파싱, dotenv 의존 없음"*)를 그대로 재사용한다. 또는 `public/*.txt` 키 파일을 스캔해 자동 발견하게 해도 된다(키가 공개값이므로 안전).

### 엣지 케이스 처리표

| 상황 | git diff | 라이브 sitemap | 동작 |
|---|---|---|---|
| 새 글 `published:true` | A | 존재 | **제출** |
| `published:false → true` | M | 존재 | **제출** (sitemap 존재가 발행 증명) |
| `published:true → false` | M | 부재 | 제외 + 로그 |
| 초안 수정 (`false→false`) | M | 부재 | 제외 |
| 파일 삭제 | D | 부재 | 제외 + 경고 로그 |

**삭제·비공개 URL 자동 통보 안 함** — IndexNow로 404/410을 알려 색인 제거를 앞당기는 관행이 있으나 규격 문언을 1차 출처로 확인 못 했다. 검증 안 된 동작에 자동화를 태우지 않는다. 필요 시 `--urls` 수동.

### 경로 → URL 매핑

| 변경 경로 | 제출 URL |
|---|---|
| `src/content/blog/<slug>.mdx` | `/blog/<slug>`, `/blog` |
| `src/blog/posts/*.mdx` | 해당 slug, `/blog` — 파일명≠slug 가능성 있어 라이브 sitemap 대조로 확정 (현재 1건) |
| `src/content/updates/*.mdx` | `/updates` **만** (ADR-004: 개별 URL 없음, 여러 파일이 바뀌어도 1개로 dedup) |
| `src/content/showroom/<slug>.mdx` | `/showroom/<slug>`, `/showroom` |

### 검증 7단계

| # | 단계 | 판정 기준 | 주기 |
|---|---|---|---|
| 1 | 스크립트 로그 | HTTP 200/202 + 제출 URL 전체 출력 | 매 실행 |
| 2 | 키 파일 | `curl https://yohanstudio.co/<key>.txt` 본문 == 키 | 최초 + 교체 시 |
| 3 | **Bing WMT → URL Submission/IndexNow** | 제출 URL 등장 — **1차 증거** | 최초 필수, 이후 분기 |
| 4 | 네이버 서치어드바이저 수집 로그 | Yeti 방문 기록에 해당 URL | 최초 |
| 5 | `site:yohanstudio.co/blog/<slug>` (Bing) | 수 시간~수일 내 노출 | 최초 |
| 6 | GSC → 크롤링 통계 | lastmod 개선 후 재크롤 빈도 변화 | T1 배포 후 2~4주 |
| 7 | `pnpm seo:ping -- --dry-run` | 후보 URL 육안 확인 | 로직 수정 시 |

---

# G3 — 기술 SEO 정비

> ⚠️ **P2 — G1·G2와 병렬 불가 (실측 확인).** 앞서 "G1과 병렬 가능"이라 적었던 건 틀렸다.
> - `layout.tsx` 의 canonical(`:139`)과 verification(`:142`) 이 **4줄 차이 = 같은 git hunk** → **G3-T1은 G1-T1b 머지 후**에 착수한다.
> - `sitemap.ts` 를 **G2-T1(lastmod 전면 재설계)** 과 **G3-T2(라우트 추가)** 가 함께 만진다 → **G3-T2는 G2-T1 머지 후**.
> - 나머지 티켓(T3~T6)은 파일이 겹치지 않아 자유.

| 티켓 | 내용 | 선행 | DoD |
|---|---|---|---|
| G3-T1 | **verification 토큰 정리** (D4·D5). 죽은 하드코딩 fallback 제거 → env 없으면 태그 미렌더. naver 중복 출력 제거 | **G1-T1b** | 빌드 HTML에 각 verification 태그 **정확히 1개**. env 미주입 시 0개. ※ 소유확인은 `public/google*.html`·`public/naver*.html` 파일 방식이 2중으로 걸려 있어 env 누락 시에도 소유권은 유지된다 |
| G3-T2 | **sitemap 누락 라우트 추가** (D6). `/learning-log/[id]`(Notion 인덱스), `/store/[id]`(Supabase `studio_products`) | **G2-T1** | sitemap URL 수가 실제 페이지 수와 일치. 각 URL 200 |
| G3-T3 | **metadata 보강.** 404 metadata export, `/learning-log/[id]` description, `/store/[id]` canonical·twitter | 없음 | 전 라우트 title·description 존재를 스크립트로 전수 확인 |
| G3-T4 | **OG alt 보강** 2건 + `icon.tsx`/`apple-icon.tsx`/`manifest.json` 추가 | 없음 | OG 라우트 14개 전부 `alt` export. 모바일 홈 화면 아이콘 정상 |
| G3-T5 | **`images.remotePatterns` 설정** — 현재 원격 썸네일이 `next/image` 우회 중(`BlogPostCard.tsx:131-132`) | 없음 | 원격 이미지가 최적화 경로 탐. LCP로 개선 확인 |
| G3-T6 | **BL-2 처리** — CLAUDE.md 기술스택 표기 정정 | 없음 | `@vercel/og`→`next/og`, `next-sitemap` 항목 제거 |
| G3-T7 | **404 정리** (D14, **저우선**). `src/content/blog/vibe-coding-2hr-deploy.mdx:79` 의 본문 텍스트 `` `/blog/[slug]` `` 가 구글에 URL로 인식돼 크롤됨 → 선행 슬래시 제거 등으로 문구만 조정. `/&`·`/$` 는 라이브 30페이지 전수 스캔에서 발생원 0건 → **조치 불필요** | 없음 | GSC 404가 3 → 1~2로 감소(2~4주 후). ※ **404는 구글 공식상 순위에 무해** — 리포트 청소 목적일 뿐이니 우선순위를 올리지 말 것 |
| G3-T8 | **OG 라우트 색인 노이즈 제거** (D15, **저우선·선택**). `opengraph-image` 라우트 10개 + `favicon.ico` 가 "크롤링됨-미색인" 11건으로 잡혀 GSC 리포트를 채우고 있다. `next.config.ts` `headers()` 로 `**/opengraph-image` 에 `X-Robots-Tag: noindex` | 없음 | GSC 크롤링됨-미색인 11 → 0 (2~4주 후). **기능상 문제는 전혀 없으므로 리포트 가독성만이 이득** |

---

# G4 — 구조화 데이터 · 내부링크

| 티켓 | 내용 | DoD |
|---|---|---|
| G4-T1 | **JSON-LD 공백 메우기** (D9). `/blog`·`/showroom` 에 `CollectionPage`+`ItemList`(기존 `/open-source` 패턴), `/store/[id]` 에 `Product`+`Offer`, `/contact` 에 `ContactPage`. 기존 `src/components/seo/` 확장 | Rich Results Test 전 라우트 통과, 에러 0 |
| G4-T2 | **주제 기반 관련글** (D11). `tags` 교집합 기반 3건을 `/blog/[slug]` 하단에. 기존 `RelatedBlogPosts` 재사용 | 각 글 하단 3건(태그 겹침 순), 자기 제외, 발행 글만 |
| G4-T3 | **(선택) 태그 허브** `/blog/tag/[tag]` 정적 생성 + sitemap 편입 | 태그 수만큼 정적 페이지, 각각 canonical·metadata 자체 선언, `/blog` 태그 칩이 진짜 링크로 |

---

# G5 — 검색엔진 등록·계측 (사람 작업 중심)

> 코드 변경 거의 없음. **단 T1·T3은 G1보다 먼저** 해야 한다 — 아래 P5 참조.

| 티켓 | 내용 | 시점 | DoD |
|---|---|---|---|
| ~~**G5-T1**~~ | ~~**GSC 베이스라인**~~ | ~~G1 착수 전~~ | **✅ 완료 2026-07-28 → `docs/seo/baseline-2026-07-28.md`**<br>속성=URL 접두어 · sitemap 성공/발견 30 · 색인 28/미색인 17(전수 확인, 결함 0) · 3개월 클릭 0/노출 39/검색어 2개(전부 브랜드) |
| **G5-T3** | **Bing Webmaster Tools 등록** — 무료·10분. IndexNow 제출 로그 확인 창구 | **G2-T3 전 ★** | 등록 + 소유확인 + IndexNow 로그 화면 접근 확인 |
| G5-T2 | **네이버 서치어드바이저 점검.** 등록·소유확인 상태, **RSS(`/rss.xml`) 제출**, 사이트맵 제출, 사이트 최적화 진단 실행 | G1 후 | 진단 통과/실패 목록 기록. 실패 항목은 G3에 티켓 추가 |
| **G5-T5** | **Vercel Speed Insights 설치** (H2). `@vercel/speed-insights` 현재 **미설치** — 실사용자 CWV(LCP/INP/CLS) 필드 데이터가 하나도 없다 | 아무 때나 | 패키지 설치 + `layout.tsx` 마운트. 2주 후 대시보드에 필드 데이터 존재 확인 |
| **G5-T6** | **초기 JS 감량** (H2). 실측 **334 KB(압축 후)** — Next.js 기본 90~100KB 대비 3배 이상. 번들 분석 후 감량 | **⚠️ 요한 결정 대기** | ① `@next/bundle-analyzer` 로 상위 기여자 특정 ② 감량 목표치 합의 ③ 목표 달성 · Lighthouse 성능 점수 개선 확인 |
| G5-T4 | **(선택) 주간 계측 자동화.** GSC Search Analytics API(`webmasters.readonly`) 로 노출·클릭·평균순위 주간 스냅샷 | G5-T1 후 | 4주 연속 수집 성공 |

> **P5 — 순서 수정 (계획 결함)**
> 원안은 G5 전체를 G1 뒤에 뒀는데, 그러면 **개선 후에 베이스라인을 재는 셈**이라 before/after 비교가 불가능해진다. `G5-T1`은 **G1 착수 전**에 떠야 한다. `G5-T3`(Bing)도 G2-T3의 검증 전제라 앞으로 당긴다. 나머지(T2)만 G1 뒤가 맞다.

> **G5-T6 — 요한 결정 대기 (착수 금지)**
> 초기 JS 334KB의 유력 기여자가 **AI 챗봇·TTS·Sentry**인데, 셋 다 이미 출시된 기능이다. 감량은 곧 이들을 더 늦게 로드하거나 축소한다는 뜻이라 **"성능 vs 기능" 트레이드오프**다. 어디까지 깎을지는 사람이 정한다.
> 참고 실측(2026-07-27, 라이브): 홈 `초기 JS 334KB / script 11개 / HTML 189KB`, 블로그 글 `332KB / 11개 / 54KB`. PageSpeed Insights API는 공유 IP 쿼터 초과(429)로 측정 실패 → **G5-T5 설치 후 필드 데이터로 대체 측정**.

> **H1 — 결정 완료 (2026-07-28): G8 신설**
> G5-T1 데이터가 나왔고, 답이 명확하다. 3개월 **클릭 0 · 노출 39 · 검색어 2개(`요한스튜디오`, `요한 스튜디오` — 둘 다 브랜드명)**. **비브랜드 검색어 0개.**
> 지금 이 사이트를 찾는 사람은 이미 이름을 아는 사람뿐이다. 그리고 브랜드명으로는 이미 게재순위 1.88~2.33위라 **기술 SEO로 올릴 여지가 없다** — 순위 문제가 아니라 **노릴 검색어가 없는 문제**다.
> → **G8(콘텐츠 전략) 신설 확정.** 다만 착수 순서는 여전히 마지막이다 — 목록이 백지이고 canonical이 틀린 상태에서 글을 더 써봐야 그 글로 가는 길이 막혀 있다.

---

# G6 — AEO / GEO

> **전략 정정.** 현재 AEO 축이 llms.txt인데 근거상 무효다. 구글 공식: "AI용 특수 파일·마크업 불필요, SEO 기본이 곧 AI 대응". 진짜 지렛대는 **raw HTML에 본문이 실리는 것(= G1)** — AI 크롤러는 JS를 실행하지 않으므로.

| 티켓 | 내용 | DoD |
|---|---|---|
| G6-T1 | **llms.txt 자동생성 전환** (D8). `public/llms.txt` 수기 파일 → `src/app/llms.txt/route.ts` (`dynamic="force-static"`, 기존 `llms-full.txt/route.ts:8` 패턴). 소스 = `src/data/siteConfig.ts` + `getPublishedPosts()` + 쇼룸 | ① `public/llms.txt` 삭제, 라우트가 대체 ② 실제 글 수와 일치(블로그 12, 쇼룸 8) ③ `/updates`·`/open-source` 포함 ④ `A'Im Scan` 표기 통일 |
| G6-T2 | **AI 크롤러 실유입 계측.** Vercel 로그에서 UA별 집계(GPTBot/ClaudeBot/PerplexityBot/OAI-SearchBot/Applebot). **효과 측정이 목적** — G1 전후 비교로 실증 | 주간 UA별 요청 수 표. G1 전/후 2주씩 비교 |
| G6-T3 | **인용 가능한 콘텐츠 포맷 규율.** 정의문·표·Q&A 블록을 본문에 포함하도록 저작 규율 갱신(`skills/yohan-dual-blog/references/` + `docs/content/blog-publishing-system.md`) | 규율 문서 갱신 + 다음 글 1편에 적용해 검증 |

**하지 않을 것**: AI 전용 마크업, llms.txt에 전문 인라인, AI 크롤러용 별도 렌더 경로(dynamic rendering) — 전부 구글 공식이 불필요하다고 명시했거나 폐기된 기법.

---

# G7 — 수익화 (AdSense) ⚠️ 게이트

> **네이버 검색광고는 수익이 아니라 지출(광고비)이다.** 오디언스 0 상태에서 유료 광고는 비용만 나가므로 이번 프로그램 제외 — 필요해지면 별도 Goal.

| 티켓 | 내용 | DoD |
|---|---|---|
| G7-T1 | **사전 확인 (사람, 코드 0).** 관할 주민센터 또는 지역자활센터에 "온라인 광고 수입 발생 시 신고 기준·소득인정액 반영 방식" 문의 | 답변 요지를 **로컬 메모**에 기록(공개 레포 금지). 진행/보류 결정 |
| G7-T2 | **법적 필수 페이지.** `/privacy` + `/terms` 라우트 신설. AdSense 심사 요건이자, 이미 문의 폼(Resend)·GA·Sentry로 데이터를 다루고 있어 **AdSense와 무관하게 필요** | 2개 라우트 + Footer 링크 + sitemap 편입. GA·Sentry·Resend·Supabase 수집 항목 명시 |
| G7-T3 | **AdSense 신청 + `ads.txt`** | `https://yohanstudio.co/ads.txt` 200. 심사 결과 기록 |
| G7-T4 | **광고 슬롯 배치.** 브랜드(Editorial × Soft Brutalism) 훼손 최소. 본문 중간 1 + 하단 1 수준 | CLS 악화 0(영역 사전 확보), Lighthouse 성능 하락 5점 이내 |

**의존**: `T1` → (진행 결정 시) `T2` → `T3` → `T4`. **T2는 결정과 무관하게 단독 착수 가치 있음.**

---

# G8 — 콘텐츠 전략 (신설 2026-07-28) ★진짜 병목

> **근거는 추측이 아니라 실측이다.** 3개월 클릭 0 · 노출 39 · 검색어 2개가 전부 브랜드명(`요한스튜디오`, `요한 스튜디오`). 비브랜드 검색어 **0개**.
> SEO는 `기술(발견 가능성) × 콘텐츠(검색 수요)` 인데 G1~G7이 전부 왼쪽 항이다. **오른쪽 항이 0이면 곱은 0이다.**
> 브랜드명 게재순위가 이미 1.88~2.33위이므로 **기술로 올릴 여지는 사실상 없다.**

| 티켓 | 내용 | DoD |
|---|---|---|
| G8-T1 | **현 자산 진단.** 발행 글 12편 각각이 어떤 검색어를 노리는지(또는 노리는 게 없는지) 매핑. GSC 인기 페이지 데이터와 대조 | 글 12편 × `의도한 검색어 / 실제 노출 검색어 / 갭` 표 |
| G8-T2 | **검색 수요 조사.** 요한이 쓸 수 있고 검색 수요가 실재하는 주제군 도출. 키워드 도구는 무료 범위(구글 트렌드·GSC 검색어·네이버 키워드도구)로 충분 | 주제군 5~10개 × `월 검색량 추정 / 경쟁도 / 요한 작성 가능성` 표 |
| G8-T3 | **콘텐츠 캘린더.** 주 10~20h 가용 시간을 전제로 현실적 발행 리듬 확정 | 다음 3개월치 글 목록 + 각 글의 타깃 검색어 |
| G8-T4 | **효과 측정.** 발행 후 4~8주 GSC 검색어 리포트 재확인 | **비브랜드 검색어 수 0 → N.** 이 프로그램 전체의 최종 성공 지표 |

**착수 시점**: G1 완료 후. 목록이 백지이고 canonical이 틀린 상태에서 글을 더 써봐야 그 글로 가는 길이 막혀 있다. 순서는 `G1 → G2 → G8`.

**⚠️ 성격 주의** — G8은 코드 Goal이 아니다. 기획·저작이고, 요한이 주체다. 에이전트는 조사·표 만들기·초안까지만.

---

# 의존 그래프 · 권장 순서

```
[0] 선행 측정·등록 — 코드 0
     G5-T1 GSC 베이스라인          ✅ 완료 2026-07-28
     G5-T3 Bing 등록               ⬜ ← G2-T3 전에 반드시 (10분, 사람)
        │
[1] ├─ G1 크롤가능성 ★
    │    T1a canonical 추가(가산) → T2 updates → T3 blog → T4 showroom
    │      → T1b 루트 canonical 제거(정리) → T5 회귀테스트
    │       │
    │       ├─→ G3-T1 verification   (T1b와 layout.tsx 같은 hunk — 병렬 불가)
    │       ├─→ G5-T2 네이버 점검
    │       ├─→ G6 AEO               (G1이 실질 AEO 본체)
    │       └─→ G4 구조화데이터·내부링크
    │
[1] ├─ G2 색인자동화 ★   (G1과 병렬 가능)
    │    T1 lastmod ─→ G3-T2 sitemap 라우트 추가 (sitemap.ts 같은 파일 — 병렬 불가)
    │    T2 키 → T3 엔진 → T4 워크플로 → T5·T6
    │
[2] ├─ G3 나머지(T3~T8)  (파일 안 겹침, 자유. T7·T8은 저우선)
    ├─ G5-T5 Speed Insights (아무 때나)
    │
[3] └─ G8 콘텐츠 전략 ★  ← 진짜 병목. G1 후 착수
    │
[?] ├─ G5-T6 JS 감량      ⚠️ 요한 결정 대기
    └─ G7 수익화          (T1 확인 게이트 → 나머지)
```

| 순위 | Goal | 이유 |
|---|---|---|
| ~~0~~ | ~~G5-T1~~ | ✅ **완료** — `docs/seo/baseline-2026-07-28.md` |
| 0 | **G5-T3** | 코드 0, 10분. G2 검증의 전제 |
| 1 | **G1** | **T2(updates) 부터.** 확인된 실제 손실이 D2에 있다 — `/blog`·`/updates` 노출 0. T1a는 회귀 위험 0이라 먼저 얹어도 무해 |
| 2 | **G2** | 최대 통증(수동·망각) 해결. G1과 병렬 가능. **T1(lastmod)이 전 프로그램에서 가장 먼저 머지할 후보** — 단독 가치 크고 회귀 위험 최저 |
| 3 | **G8** | **진짜 병목.** 비브랜드 검색어 0. 다만 G1이 끝나야 새 글이 제대로 색인된다 |
| 4 | **G3** | 저비용·확실. 죽은 토큰 등 실사고 위험 제거. 단 T1·T2는 선행 대기, T7·T8은 저우선 |
| 5 | **G5 나머지** | 네이버 진단·Speed Insights |
| 6 | **G4** | 색인 표면·내부링크 확대 |
| 7 | **G6** | G1이 사실상 AEO 본체. 나머지는 계측·규율 |
| 8 | **G7** | 확인 게이트 + 콘텐츠 볼륨 필요 |

---

# 공통 검증 게이트 (Goal 머지 전)

1. `npm run lint` + `npm run build` 통과
2. `pnpm qa:test` (playwright 9케이스 + G1-T5 신규) 통과
3. 배포 후 **라이브 curl 실측** — 조사 때 쓴 명령 그대로 재실행해 수치 개선 대조
   ```
   curl -sL https://yohanstudio.co/blog | grep -o 'href="/blog/[a-z0-9-]*"' | sort -u | wc -l
   curl -sL https://yohanstudio.co/blog | grep -o '<link rel="canonical"[^>]*>'
   ```
4. **sitemap 전 URL 200 감사** — 라우트를 건드린 Goal에서 필수
   ```
   for u in $(curl -s https://yohanstudio.co/sitemap.xml | grep -o '<loc>[^<]*</loc>' | sed 's/<[^>]*>//g'); do
     printf "%s %s\n" "$(curl -s -o /dev/null -w '%{http_code}' -L "$u")" "$u"
   done | grep -v '^200' || echo "전부 정상"
   ```
   기준선: **2026-07-27 실측 30/30 전부 200, 비정상 0건** (H3 — 상시 티켓 불필요로 종결)
5. `docs/ssr-seo-report.html` 수치 갱신 (문서 자기모순 방지 — #82 재발 방지)
6. Notion Dev Log 적재 (유형: 마일스톤 / 결과: 코드단계=부분성공 → 라이브 손검증 후 성공)

---

# 범위 밖 (명시적으로 안 함)

| 항목 | 이유 |
|---|---|
| GSC 색인 요청 버튼 브라우저 자동화 | 공식 API 없음. sitemap `lastmod`가 구글 공식 재크롤 신호라 실익 낮음. 봇 탐지·ToS 리스크. 대신 G2-T5 딥링크로 마찰만 제거 |
| Google Indexing API 연동 | 공식 문언상 `JobPosting`/`BroadcastEvent` 전용. 블로그 부적격 |
| sitemap ping 엔드포인트 | 2023-06 폐기, 현재 404 |
| Dynamic Rendering (크롤러용 별도 렌더) | 구글이 폐기한 우회책. G1으로 근본 해결이 정답 |
| 네이버 검색광고(파워링크) | 수익이 아니라 지출. 오디언스 0에서 비용만 발생 |
| IndexNow 삭제 URL 자동 통보 | 규격 문언 1차 확인 실패 → 검증 안 된 동작 자동화 금지 |
| 상태 저장소(제출 이력 DB) | 월 수 건 규모에 과잉. git diff로 자연 dedup |

---

# 확인했고 문제없던 것 (재조사 금지)

| 항목 | 실측 | 결론 |
|---|---|---|
| `yohan-studio.vercel.app` 중복 색인 위험 | `HTTP/1.1 308` → `Location: https://yohanstudio.co/...`, canonical도 정상 | 리다이렉트로 정리돼 있음. 조치 불필요 |
| sitemap 링크 무결성 | 30개 URL 전부 `200` | 현시점 깨진 링크 0 |
| `next/image` alt 누락 | `<Image>` 8개 전부 `alt` 존재 | 접근성·SEO 이상 없음 (`BlogPostCard.tsx:125` 의 `alt=""` 는 장식용 의도) |

---

# 개정 이력

## 2026-07-28 필드 데이터 반영 — 우선순위 재조정 · G8 신설

G5-T1(GSC 베이스라인)을 실행해 **미색인 17건을 전수 확인**한 결과, 코드만 보고 세운 판단 하나가 뒤집혔다.

### 정정: D1(canonical 오염)의 성격

코드 검토 단계에서 "루트 canonical이 하위로 상속돼 3장이 홈의 사본으로 선언된다"를 확인하고, GSC에 "적절한 표준 태그가 포함된 대체 페이지 3건"이 있는 걸 보고 **"이미 그 3장이 색인에서 빠졌다"** 고 판단했다. **틀렸다.**

| 확인 | 실제 |
|---|---|
| 대체 페이지 3건의 정체 | `/contact?service=os-template` · `scan-report` · `os-build` — `/contact` canonical이 **정상 작동한 결과**. 3=3은 우연 |
| `/blog`·`/updates`·`/showroom` 위치 | 미색인 17건 **어디에도 없음** → 색인 28건 안에 정상 존재 |
| 결론 | 구글이 우리 canonical 선언을 **따르지 않고** self-canonical 처리 중 |

→ D1 심각도 **최상 → 상**, 성격을 "진행 중 사고" → **"잠재 위험"** 으로 정정. 여전히 고쳐야 하지만(구글이 언제든 따를 수 있고 네이버·빙은 다르게 반응할 수 있다) 긴급하지 않다.

### 승격: D2가 확인된 유일한 실제 손실

`/blog` **노출 0**, `/updates` **노출 0**. 둘 다 색인은 돼 있다. 색인이 돼도 HTML에 매칭될 내용이 없으면 어떤 검색어에도 안 걸린다 — 그게 백지 목록의 실제 비용이다.

→ **G1 내부 순서를 `T2(updates) → T3 → T4` 우선으로 재배치.**

### G1-T1 분할 (T1a / T1b)

원래 T1은 "루트 canonical 삭제 + 전 라우트 보강"이었는데 **원자성 요구**가 있었다 — 루트를 지우는 순간 자체 선언이 없는 라우트는 canonical을 통째로 잃는다.

| 티켓 | 성격 | 위험 |
|---|---|---|
| **T1a** 전 라우트에 canonical **추가** | 순수 가산 | **0** — 자식이 부모를 덮어쓸 뿐, 잃는 게 없다. 이것만으로 D1의 실질 문제 해소 |
| **T1b** 루트 canonical **삭제** | 정리 | 낮음. 단 `alternates.types`(RSS)를 같이 지우지 않도록 주의 |

### 신설: G8 콘텐츠 전략

3개월 **클릭 0 · 노출 39 · 검색어 2개**(`요한스튜디오`, `요한 스튜디오` — 둘 다 브랜드명). **비브랜드 검색어 0개.**

브랜드명 게재순위가 이미 1.88~2.33위다. 기술 SEO로 올릴 여지가 없다 — 순위 문제가 아니라 **노릴 검색어가 없는 문제**다. BL-5(보류)를 **G8 신설로 확정**.

### 신규 결함 2건 (둘 다 저우선)

| ID | 내용 | 티켓 |
|---|---|---|
| D14 | 404 3건. `/blog/[slug]` 는 발생원 특정 — `src/content/blog/vibe-coding-2hr-deploy.mdx:79` 본문의 인라인 코드를 구글이 URL로 인식. `/&`·`/$` 는 라이브 30페이지 전수 스캔에서 발생원 0건 | G3-T7 |
| D15 | OG 이미지 라우트 10 + favicon 이 "크롤링됨-미색인" 11건으로 리포트 오염. 색인 45 vs sitemap 30 차이의 정체 | G3-T8 |

### 교훈

> **코드에서 결함을 찾는 것과, 그 결함이 실제 피해를 내고 있는지는 별개다.** D1은 코드상 명백한 오류였지만 구글이 무시하고 있었다. 필드 데이터를 안 봤으면 "가장 급한 불"을 잘못 짚은 채로 구현에 들어갔을 것이다. **고치기 전에 재라.**

---

## 2026-07-27 계획 자체 검토 — 결함 5건 수정, 공백 3건 처리, 미확정 2건 확정

계획 승인 직후 **구현 전에 계획을 재감사**해서 아래를 반영했다. 구현 중에 터졌으면 훨씬 비쌌을 것들이다.

### 수정한 계획 결함 (P)

| ID | 결함 | 조치 |
|---|---|---|
| P1 | G1-T5 회귀 테스트가 dev 서버 대상 → **결함이 재현 안 돼 항상 통과**. `playwright.config.ts:16` 이 `npm run dev` 이고, Next 공식 문서상 dev에서는 `useSearchParams` 가 suspend하지 않음 | G1-T5 DoD에 "프로덕션 빌드 대상" + "일부러 되돌려 빨간불 확인" 명시 |
| P2 | "G3는 G1과 병렬 가능"이 틀림 — `layout.tsx` canonical(`:139`)과 verification(`:142`) 이 **같은 git hunk** | G3-T1 선행 = G1-T1 |
| P3 | G2-T1 vs G3-T2 가 `sitemap.ts` 전면 충돌 | G3-T2 선행 = G2-T1 |
| P4 | G2-T3의 DoD가 Bing WMT를 요구하는데 등록은 G5-T3 (의존 누락) | G5-T3를 G2-T3 앞으로 |
| P5 | 베이스라인(G5-T1)이 G1 뒤 → **개선 후에 측정**하는 셈 | G5-T1을 G1 착수 전으로 |

### 처리한 공백 (H)

| ID | 공백 | 결론 |
|---|---|---|
| H1 | 콘텐츠 전략·키워드 리서치 0 | **보류.** 추측으로 짜지 않고 G5-T1의 GSC 검색어 리포트를 본 뒤 G8 신설 여부 결정 |
| H2 | Core Web Vitals 계측 없음 | 티켓 2개 신설 — G5-T5(Speed Insights 설치) / G5-T6(JS 감량, **요한 결정 대기**). 실측 근거: 초기 JS **334KB** |
| H3 | 링크 감사 없음 | **종결.** 30/30 정상. 상시 티켓 대신 공통 검증 게이트 4번으로 흡수 |

### 확정한 미확정 (S)

| ID | 항목 | 결론 |
|---|---|---|
| S1 | G1 구현 방식 3갈래 | **1줄로 확정** — `Suspense fallback` 에 실물 목록 + 툴바 스켈레톤. 스파이크 불필요. `TagFilter` 가 이미 `posts` 를 prop으로 받고 있어(`TagFilter.tsx:9,20`) 고민의 전제 자체가 없었음 |
| S2 | 필터 플래시 | **수용.** 태그 칩이 `<button>` + `router.replace` 라 `?tag=` URL이 내부 SPA 전환으로만 생기고 외부로 새지 않음. 새로고침·URL 붙여넣기에서만 발생 |

### 교훈

> 계획 단계에서 **실제 코드를 읽지 않고 추상적으로 설계**하면 존재하지 않는 문제를 풀게 된다. S1이 3갈래 → 1줄로 줄어든 원인이 정확히 그것이다. 다음부터 구현 방식을 못 박기 전에 대상 컴포넌트를 먼저 읽는다.
