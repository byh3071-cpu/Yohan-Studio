# 검색 노출 프로그램 — Goal 7개 / 티켓 30개

작성 2026-07-27 · 상태: 계획 승인, 미착수
관련: `docs/ssr-seo-report.html` (조사 근거) · `docs/backlog.md`

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
| D1 | **canonical 전역 오염** — 루트 `alternates.canonical: "/"` 가 하위 상속 → 3장이 `href="https://yohanstudio.co"` 로 자기정규화 상실 | `src/app/layout.tsx:138`, `.next/server/app/{blog,updates,showroom}.html` | **최상** | G1-T1 |
| D2 | 목록 3장이 초기 HTML에 0건 (CSR 폴백) | `blog/page.tsx:74-76`→`TagFilter.tsx:23` / `updates/page.tsx:83-85`→`UpdatesFeed.tsx:29` / `showroom/page.tsx:103-105`→`ProjectGrid.tsx:36`. 라이브 curl 0/0/1 | 높음(updates) | G1-T2~T4 |
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

> 이걸 안 하면 나머지 6개 Goal이 전부 헛수고다. 색인을 아무리 빨리 알려도 알린 페이지가 백지면 의미 없다.

| 티켓 | 내용 | 의존 | DoD |
|---|---|---|---|
| **G1-T1** | **canonical 전역 오염 제거.** `layout.tsx:138` 의 `alternates.canonical: "/"` **삭제** → 각 라우트가 자체 선언. 홈은 metadata export 자체가 없으므로 신규 추가하며 canonical `/` 명시. 미선언 라우트 전수 보강: `/blog`, `/updates`, `/showroom`, `/learning-log/[id]`, `/store/[id]`, 404 | 없음 | ① `layout.tsx`에 canonical 없음 ② 빌드 후 `.next/server/app/{index,blog,updates,showroom}.html` canonical이 **각자 자기 URL** ③ 전 라우트 canonical 존재를 스크립트로 전수 확인 ④ `/store/checkout/success` 의 `noindex` 유지 |
| **G1-T2** | **`/updates` CSR 결함 수정** (최상 — 상세 라우트가 없어 릴리즈 본문이 크롤 가능 HTML 어디에도 없음) | G1-T1 | ① 빌드 산출 `updates.html` 에 버전 문자열 5건 전부 존재 ② 필터 UI 하이드레이션 후 정상 ③ `?type=NEW` 등 기존 URL 파라미터 동작 유지 ④ `pnpm qa:test` 통과 |
| **G1-T3** | **`/blog` CSR 결함 수정** — 동일 패턴 | G1-T2 | 빌드 산출 `blog.html` 에 `href="/blog/<slug>"` 가 발행 글 수만큼. 태그 필터 정상 |
| **G1-T4** | **`/showroom` CSR 결함 수정** — 동일 패턴 | G1-T2 | 빌드 산출 `showroom.html` 에 프로젝트 링크 9건 전부 |
| **G1-T5** | **회귀 방지 스모크 테스트.** "빌드된 HTML에 목록이 실려 있는가" 검사. 기존 `tests/qa.spec.ts` 의 `ROUTES` 루프 옆에 배치 | T2~T4 | ① 3장 각각 최소 링크 수 assert ② 일부러 되돌리면 **빨간불** ③ `pnpm qa:test` 로 실행 ④ CI 편입은 별도 판단(현재 ci.yml은 테스트 미실행) |

### 구현 패턴 (T2~T4 공통) — A안 채택

| 안 | 내용 | 판정 |
|---|---|---|
| **A** | 목록 전체를 서버 컴포넌트에서 렌더 → HTML에 전 항목. 클라이언트 필터는 서버 렌더 노드를 `children`으로 받아 표시/숨김만 | **채택** — SSG 유지, 변경 최소 |
| B | page의 `searchParams` prop을 서버에서 읽어 필터링 | 기각 — 라우트가 동적 SSR로 전환돼 정적 캐시 상실 |
| C | `/blog/tag/[tag]` 정적 라우트 신설 | 분리 — 색인 표면 확대 효과는 있으나 신규 설계 필요 → **G4-T3** |

**원인 (공식 문서)**: Next.js `useSearchParams` — "If a route is prerendered, calling `useSearchParams` will cause the Client Component tree up to the closest Suspense boundary to be client-side rendered." + fallback이 초기 HTML에 대신 들어감. 즉 버그가 아니라 설계된 동작이고, fallback을 `null`로 둔 게 원인.

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
| **G2-T3** | **`scripts/seo-indexnow.mjs` 엔진 + `pnpm seo:ping`.** 옵션 `--init-key`/`--dry-run`/`--all`/`--urls`/`--base --head`/`--no-wait`/`--force`. 라이브 sitemap 폴링 **15초 × 40회 = 상한 10분**, 초과 시 **제출 없이 exit 1**. 키 파일 게이트 선행. 429/5xx는 `Retry-After` 존중 백오프 2회, 400/403 즉시 중단. URL 정규화 + `Set` dedup | T2 | ① npm 의존성 0 ② `--dry-run` 후보 URL 정확 ③ **`published:false→true` 커밋 범위로 실증** ④ 틀린 키면 제출 전 exit 1 ⑤ 폴링 초과 시 수동 복구 명령 출력 ⑥ 실제 1건 제출 → **Bing WMT 제출 로그 등장** ⑦ `package.json` 스크립트 추가 |
| **G2-T4** | **GitHub Actions** `.github/workflows/seo-indexnow.yml`. `ci.yml` **무수정**. `paths`: `src/content/{blog,updates,showroom}/**`, `src/blog/posts/**`. `concurrency: cancel-in-progress: false` | T3 | ① **`actions/checkout` `fetch-depth: 0`** — 없으면 `github.event.before` 커밋이 로컬에 없어 diff가 **조용히 전부 실패** ② `before == 0000…` 폴백 존재 ③ `paths` 필터 스킵 실증 ④ 첫 실행은 `workflow_dispatch` + `dry_run: true` ⑤ 실제 글 1건으로 end-to-end 성공 ⑥ 의도적 실패 → 빨간 X + 알림 도달 |
| **G2-T5** | **(절충) GSC URL 검사 딥링크 오프너** `pnpm seo:gsc -- <slug>` → `https://search.google.com/search-console/inspect?resource_id=<property>&id=<url>` 브라우저 open. **자동 클릭 없음** | T3 | ① 딥링크가 실제로 해당 URL 검사 화면을 여는지 **수동 실측**(형식 추정이므로 필수) ② 안 열리면 티켓 폐기 + 문서에 "구글은 GSC 수동" 명시 |
| **G2-T6** | **문서·ADR.** `docs/adr/ADR-005-indexnow-auto-submission.md` / `docs/content/blog-publishing-system.md` "색인 자동 제출" 절 / `docs/state/vercel-env-keys.md` `INDEXNOW_KEY` 행 | T1~T5 | 3개 문서 갱신 |

**의존 순서**: `T1 ∥ T2` → `T3` → `T4` → `T5 ∥ T6`
**주의**: T1은 IndexNow와 무관하게 단독 가치가 크고(구글 대응의 전부) 회귀 위험이 가장 낮다 → 먼저 머지 권장.

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

| 티켓 | 내용 | DoD |
|---|---|---|
| G3-T1 | **verification 토큰 정리** (D4·D5). 죽은 하드코딩 fallback 제거 → env 없으면 태그 미렌더. naver 중복 출력 제거 | 빌드 HTML에 각 verification 태그 **정확히 1개**. env 미주입 시 0개 |
| G3-T2 | **sitemap 누락 라우트 추가** (D6). `/learning-log/[id]`(Notion 인덱스), `/store/[id]`(Supabase `studio_products`) | sitemap URL 수가 실제 페이지 수와 일치. 각 URL 200 |
| G3-T3 | **metadata 보강.** 404 metadata export, `/learning-log/[id]` description, `/store/[id]` canonical·twitter | 전 라우트 title·description 존재를 스크립트로 전수 확인 |
| G3-T4 | **OG alt 보강** 2건 + `icon.tsx`/`apple-icon.tsx`/`manifest.json` 추가 | OG 라우트 14개 전부 `alt` export. 모바일 홈 화면 아이콘 정상 |
| G3-T5 | **`images.remotePatterns` 설정** — 현재 원격 썸네일이 `next/image` 우회 중(`BlogPostCard.tsx:131-132`) | 원격 이미지가 최적화 경로 탐. LCP로 개선 확인 |
| G3-T6 | **BL-2 처리** — CLAUDE.md 기술스택 표기 정정 | `@vercel/og`→`next/og`, `next-sitemap` 항목 제거 |

---

# G4 — 구조화 데이터 · 내부링크

| 티켓 | 내용 | DoD |
|---|---|---|
| G4-T1 | **JSON-LD 공백 메우기** (D9). `/blog`·`/showroom` 에 `CollectionPage`+`ItemList`(기존 `/open-source` 패턴), `/store/[id]` 에 `Product`+`Offer`, `/contact` 에 `ContactPage`. 기존 `src/components/seo/` 확장 | Rich Results Test 전 라우트 통과, 에러 0 |
| G4-T2 | **주제 기반 관련글** (D11). `tags` 교집합 기반 3건을 `/blog/[slug]` 하단에. 기존 `RelatedBlogPosts` 재사용 | 각 글 하단 3건(태그 겹침 순), 자기 제외, 발행 글만 |
| G4-T3 | **(선택) 태그 허브** `/blog/tag/[tag]` 정적 생성 + sitemap 편입 | 태그 수만큼 정적 페이지, 각각 canonical·metadata 자체 선언, `/blog` 태그 칩이 진짜 링크로 |

---

# G5 — 검색엔진 등록·계측 (사람 작업 중심)

> 코드 변경 거의 없음. **G1 완료 후** 실행해야 의미가 있다(백지 페이지를 등록해봐야 소용없음).

| 티켓 | 내용 | DoD |
|---|---|---|
| G5-T1 | **GSC 점검.** 속성 유형(도메인 vs URL 접두어), sitemap 제출 상태, 색인 커버리지에서 3장 상태 — G1 전후 비교용 베이스라인 | `docs/seo/baseline-YYYY-MM-DD.md` 에 수치 기록 |
| G5-T2 | **네이버 서치어드바이저 점검.** 등록·소유확인 상태, **RSS(`/rss.xml`) 제출**, 사이트맵 제출, 사이트 최적화 진단 실행 | 진단 통과/실패 목록 기록. 실패 항목은 G3에 티켓 추가 |
| G5-T3 | **Bing Webmaster Tools 등록** — 무료, IndexNow 제출 로그 확인 창구(G2 검증에 필수). GSC에서 임포트 가능 | 등록 + 소유확인 + IndexNow 로그 화면 접근 확인 |
| G5-T4 | **(선택) 주간 계측.** GSC Search Analytics API(`webmasters.readonly`) 로 노출·클릭·평균순위 주간 스냅샷 | 4주 연속 수집 성공 |

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

# 의존 그래프 · 권장 순서

```
G0 자산화 (완료)
 ├─ G1 크롤가능성 ★ ──┬─→ G5 등록·계측   (G1 후에 해야 의미)
 │   T1 canonical      ├─→ G6 AEO        (G1이 실질 AEO 본체)
 │   → T2 updates      └─→ G4 구조화데이터·내부링크
 │   → T3 blog
 │   → T4 showroom
 │   → T5 회귀테스트
 ├─ G2 색인자동화 ★   (G1과 병렬 가능. T1 lastmod는 지금 착수해도 무해)
 ├─ G3 기술SEO정비     (G1과 병렬 가능)
 └─ G7 수익화          (T1 확인 게이트 → 나머지)
```

| 순위 | Goal | 이유 |
|---|---|---|
| 1 | **G1** | canonical 오염 + 백지 목록. 나머지 전부의 전제 |
| 2 | **G2** | 최대 통증(수동·망각) 해결. T1은 G1과 병렬 착수 가능 |
| 3 | **G3** | 저비용·확실. 죽은 토큰 등 실사고 위험 제거 |
| 4 | **G5** | G1 후 베이스라인 측정. 여기서 문제가 더 드러날 수 있음 |
| 5 | **G4** | 색인 표면·내부링크 확대 |
| 6 | **G6** | G1이 사실상 AEO 본체. 나머지는 계측·규율 |
| 7 | **G7** | 확인 게이트 + 콘텐츠 볼륨 필요 |

---

# 공통 검증 게이트 (Goal 머지 전)

1. `npm run lint` + `npm run build` 통과
2. `pnpm qa:test` (playwright 9케이스 + G1-T5 신규) 통과
3. 배포 후 **라이브 curl 실측** — 조사 때 쓴 명령 그대로 재실행해 수치 개선 대조
   ```
   curl -sL https://yohanstudio.co/blog | grep -o 'href="/blog/[a-z0-9-]*"' | sort -u | wc -l
   curl -sL https://yohanstudio.co/blog | grep -o '<link rel="canonical"[^>]*>'
   ```
4. `docs/ssr-seo-report.html` 수치 갱신 (문서 자기모순 방지 — #82 재발 방지)
5. Notion Dev Log 적재 (유형: 마일스톤 / 결과: 코드단계=부분성공 → 라이브 손검증 후 성공)

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
