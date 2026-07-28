# ADR-005 — IndexNow 색인 자동 제출

상태: Accepted (2026-07-28)
관련: `docs/seo/PROGRAM.md` G2 · `scripts/seo-indexnow.mjs` · `.github/workflows/seo-indexnow.yml` · PR #87 #97

## 맥락

글을 발행해도 검색엔진이 자체 크롤로 발견할 때까지 며칠~몇 주 걸린다. 색인 요청을 손으로 하자니 번거롭고 까먹는다(발단이 된 통증). 자동화하려고 보니 구글 쪽 공식 수단이 전부 막혀 있었다:

| 수단 | 판정 | 근거 (1차 출처) |
|---|---|---|
| Google Indexing API | **부적격** | 공식 문언: "can only be used to crawl pages with either `JobPosting` or `BroadcastEvent` embedded in a `VideoObject`" — 블로그 글 대상 아님 |
| sitemap ping 엔드포인트 | **폐기** | Search Central Blog 2023-06-26, 현재 404. 대신 `lastmod` 가 재크롤 스케줄링 신호 |
| GSC 색인 요청 버튼 자동화 | **기각** | 공식 API 없음, 봇 탐지·ToS 리스크. 버튼도 색인 보장 없음(John Mueller) |
| **IndexNow** | **채택** | `indexnow.org/searchengines.json` 1차 확인 — bing·yandex·seznam·**naver**·yep 등 참여. 한 곳 제출 → 전 엔진 공유. 구글만 미참여 |

## 결정

1. **비구글 = IndexNow 배치 POST** (`api.indexnow.org` 1회 → 전 참여 엔진). **구글 = sitemap `lastmod` 정확도**(#87)가 전부.
2. **트리거 = GitHub Actions** (master push + 콘텐츠 paths 필터). Vercel `deployment.succeeded` 웹훅은 기각 — 그 이벤트도 프로덕션 alias 전환을 보장하지 않아 어차피 라이브 프로브가 필요한데, 웹훅엔 "무엇이 바뀌었나" diff 가 없어 상태 저장소를 강요한다(1인·월 수 건 규모에 과잉).
3. **URL 소스 = 배포된 `/sitemap.xml`**. `getPublishedPosts()` 직접 재사용은 불가 — `blog-component-posts.tsx` 가 `.mdx` 를 import 해 플레인 Node 로 로드되지 않는다. gray-matter 재파싱은 컴포넌트 포스트를 놓쳐 두 번째 SoT 가 된다. sitemap 은 그 함수의 산출물이라 중복 없는 단일 소스이고, 동시에 배포가 라이브인지 증명한다.
4. **git diff 후보 → 라이브 sitemap 교차검증 게이트.** `published:false→true` 는 sitemap 등장이 발행 증명. 비공개 전환·오타 slug 는 sitemap 부재로 자동 제외. 미반영이면 제출 없이 실패 — 없는 페이지를 검색엔진에 통보하지 않는다.
5. **삭제 URL 자동 통보 안 함.** 404/410 통보 규격을 1차 출처로 확인하지 못했다 — 검증 안 된 동작에 자동화를 태우지 않는다. 필요 시 `--urls` 수동.
6. **키는 GitHub Variables** (Secrets 아님) — `/<key>.txt` 로 공개 호스팅되는 값이라 시크릿이 아니다. 레포 커밋이 정상이다.

## 대안

- **로컬 CLI 수동 실행만**: "까먹는다"는 원래 문제를 해결하지 못함. 단 엔진(`npm run seo:ping`)은 수동 복구 경로로 겸용.
- **상태 저장소(제출 이력 DB)**: git diff 로 자연 dedup 되므로 과잉.
- **tsx 경유 lib 재사용 / gray-matter 재파싱**: 위 3번 사유로 기각.

## 결과

- 발행 → 색인 통보까지 **사람 수동 작업 0**. 실측: 첫 제출 HTTP 202, 라이브 검증·키 게이트 통과(2026-07-28).
- 검증 창구 = Bing Webmaster Tools IndexNow 로그 (G5-T3 에서 등록). 네이버는 IndexNow 를 받지만 로그를 안 보여줌.
- 함정 기록: ①`actions/checkout` 기본 depth 1 이면 `event.before` 가 없어 diff 가 조용히 전부 실패 → `fetch-depth: 0` 필수 ②fetch 소켓 열린 채 `process.exit()` 시 Windows libuv assertion 크래시 → `process.exitCode` 로만 종료 ③`gh pr create --title "/blog…"` 는 Git Bash MSYS 가 경로로 치환 → `/` 시작 인자 주의.
