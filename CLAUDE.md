# CLAUDE.md — yohan-studio

> 먼저 루트의 `AGENTS.md`를 공통 프로젝트 규칙으로 따른다.
> 이 파일은 Claude Code 전용 운영 규칙 + 현재 상태를 담는다.

## 프로젝트 개요
요한 스튜디오: AI 시대의 1인 기업가를 위한 First Platform.
바이브코딩으로 구축하는 AI 운영체계 웹 플랫폼.
배포: https://yohan-studio.vercel.app

## 운영 체제: Antigravity IDE 듀얼 패널
- **Claude Code (좌)**: 메인 구현, 큰 리팩터링, UI/상태 흐름 수정
- **Codex (우)**: 코드 리뷰, 역검증, 빌드/테스트 확인, 버그 탐색
- 같은 파일 동시 수정 금지. 병렬 작업 필요 시 `git worktree` 사용.
- Codex 컨텍스트 20~30% 유지. 90% 근접 시 `/compact` 또는 `/fork`로 분리.

## MCP 개발 인프라
| MCP | 전송 | 용도 |
|---|---|---|
| playwright | stdio | 격리 Chromium UI 검증 |
| playwright-extension | stdio | 로그인 세션 필요 화면 |
| context7 | HTTP | 최신 라이브러리 API 문서 실시간 조회 |
| notion-mcp | stdio | Notion Dev Log DB 직접 주입 |
| lazyweb | stdio | 디자인 레퍼런스 검색 |

⚠️ MCP "Connected" ≠ "Authenticated". 첫 API 호출로 검증 필수.
⚠️ CLI 인자에 시크릿 금지. env-var 상속 패턴 사용.

## 권장 검증 루프
1. Claude Code 구현 → 2. `npm run build` → 3. `npm test` → 4. Codex 리뷰/역검증 → 5. playwright UI 검증 → 6. 최종 build 통과 → 7. notion-mcp로 Dev Log 기록

---

## 현재 Phase: 3 (Supabase + Stripe + 스토어 + 진단 결과 저장)
Phase 1 완료 (4/25): 랜딩 + 포트폴리오 Vercel 배포 완료.

### Phase 2 작업 큐
| # | 작업 | 상태 |
|---|---|---|
| ① | v2 디자인 마이그레이션 (Slate→Editorial) | ✅ 완료 |
| ② | MDX 블로그 시스템 — /blog, /blog/[slug] | ✅ 완료 |
| ③ | BlogCard + TagFilter + 검색 | ✅ 완료 |
| ④ | SEO — sitemap, robots, OG, JSON-LD, @vercel/og | ✅ 완료 |
| ⑤ | GA + Search Console | ✅ 완료 |
| ⑥ | Inter 폰트 적용 지점 | ✅ 완료 |
| ⑦ | /blog/[slug] 본문 디자인 | ✅ 완료 |
| ⑧ | 다크모드 시스템 (ThemeProvider + spec 토큰 정합) | ✅ 완료 |
| ⑨ | /blog 목록 BlogRowCard + URL 쿼리 + hover | ✅ 완료 |
| ⑩ | /design 라우트 (진화 + AI 분업 + 로드맵) | ✅ 완료 |
| ⑪ | Hero 에디토리얼 보강 | ✅ 완료 |
| ⑫ | 모바일 헤더 햄버거 토글 | ✅ 완료 |
| ⑬ | AEO/GEO 인프라 (llms.txt + JSON-LD + FAQPage) | ✅ 완료 |
| --- | --- AI'm OS 확장 (011~014) --- | --- |
| ⑭ | /showroom (프로젝트 카드 5+ , Featured, 카테고리 필터) | ✅ 코드완료 (미배포 검증 대기) |
| ⑮ | /diagnosis — AI'm Scan v0.1 (7영역×3문항, 점수, 레벨) | ✅ 코드완료 |
| ⑯ | /services (서비스 3개 + 문의 CTA) | ✅ 코드완료 |
| ⑰ | Home 리뉴얼 (AI 1인 기업 OS 포지셔닝 + Featured) | ✅ 완료 (Hero 포지셔닝 + Featured·퍼널 섹션) |

### ⚠️ 007~010 보호 규칙
- ①~⑬ 에서 생성된 파일은 **수정 최소**. 신규 경로만 작업.
- 기존 /blog, /design, SEO 파이프라인, 다크모드 시스템은 건드리지 않는다.
- 예외: sitemap에 새 경로 추가, Header/Footer 네비 링크 추가는 허용.

### /portfolio → /showroom 마이그레이션
- `/showroom`은 신규 라우트로 생성.
- `/portfolio`는 `/showroom`으로 301 redirect 설정.
- `src/data/portfolioProjects.ts` → `src/data/projects.ts`로 마이그레이션/확장.

### 네비게이션 구조
- **헤더 (Phase 2)**: Blog | Showroom | Diagnosis | Services | [☰] [🌙]
- **헤더 (Phase 3)**: + Store 추가
- **햄버거**: 퍼널 페이지 상단 + 구분선 아래 보조(Design)
- **Footer 3컬럼**: 콘텐츠(Blog,Design) | 서비스(Showroom,Diagnosis,Services,Store) | 연결(GitHub,Email,LinkedIn)
- Design은 햄버거 안 보조 페이지. 퍼널 동선 우선.

---

## 기술 스택
| 레이어 | 도구 | Phase |
|---|---|---|
| 프레임워크 | Next.js 16 (App Router) | 1 |
| 언어 | TypeScript (strict) | 1 |
| 스타일링 | Tailwind CSS + CSS Variables | 1 |
| 블로그 | MDX (next-mdx-remote/rsc) | 2 |
| SEO | next-sitemap + @vercel/og + JSON-LD | 2 |
| 호스팅 | Vercel | 1 |
| DB | Supabase (PostgreSQL) | 3 |
| 결제 | Stripe | 3 |
| 자동화 | n8n | 4 |

## 디자인 시스템 — v2 (Editorial × Soft Brutalism)
- **라이트 (기본)**: bg #F4F1EA, text #0A0A0A, primary #FF5C28
- **다크모드**: bg #0A0A0A, text #F1F5F9, primary #FF5C28
- **모서리**: rounded-none
- **보더**: 1.5px solid #000
- **그림자**: 4px 0 0 #000 (hard shadow)
- **그라디언트**: 없음
- **모바일 퍼스트**: 375px → sm → md → lg

### 컬러 토큰
> 정합 기준: src/app/globals.css `@theme` 블록.

| 토큰 | 라이트 | 다크 |
|---|---|---|
| bg | #F4F1EA | #0A0A0A |
| surface | #EEEAE0 | #141414 |
| surface-2 | #E5E0D2 | #1F1F1F |
| ink (text) | #0A0A0A | #F4F1EA |
| ink-2 | #2B2723 | #DCD7CB |
| muted | #6B6357 | #968D7E |
| muted-2 | #968D7E | #6B6357 |
| accent (primary) | #FF5C28 | #FF5C28 |
| accent-ink | #0A0A0A | #0A0A0A |
| border | #0A0A0A | #F4F1EA |

> 그림자: `--shadow-brutal-sm` = `2px 2px 0 ink`, `--shadow-brutal` = `4px 4px 0 ink`, `--shadow-brutal-lg` = `6px 6px 0 ink`.

### 타이포그래피
| 용도 | 폰트 | 로딩 |
|---|---|---|
| 한글 본문/제목 | Pretendard | next/font/local (woff2, src/styles/fonts/) |
| 영문 강조 | Inter | next/font/google |
| 코드 | JetBrains Mono | next/font/google |

## 코딩 규칙
- TypeScript strict mode, no `any`
- Server Component 우선, `"use client"` 최소한
- 컴포넌트: PascalCase.tsx, 유틸: camelCase.ts
- 경로: `src/components/{ui,layout,sections,blog,portfolio,showroom,diagnosis,services}/`
- 정적 데이터: `src/data/` (projects.ts, diagnosisQuestions.ts, services.ts)
- MDX 콘텐츠: `src/content/blog/*.mdx`

## Phase 3 허용
✅ MDX 블로그 | next-sitemap, robots.txt | @vercel/og | JSON-LD (Article/FAQ/HowTo) | GA gtag, GSC | 다크모드 | 블로그 클라이언트 카운터 | 정적 데이터 (src/data/) | 클라이언트 사이드 진단 로직 | 외부 폼 URL (env var) | Supabase/DB 연결 | Stripe/결제 | API Routes | 진단 결과 서버 저장 | 스토어/예약/결제 기능

## Phase 3 금지
❌ n8n 웹훅 | RAG/Qdrant

## Phase 3 DB 규약 (Supabase 공유)
- 기존 **Focus Feed** Supabase 프로젝트를 공유 사용 (신규 프로젝트 생성 금지).
- 모든 Yohan Studio 테이블은 `studio_` prefix 필수. 예: `studio_diagnosis_results`, `studio_orders`, `studio_subscriptions`.
- RLS 정책도 `studio_` 테이블 단위로 격리. Focus Feed 테이블 접근 금지.
- env var: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` 등 Focus Feed와 동일 값 사용.
- 마이그레이션 파일은 `supabase/migrations/`에 prefix 포함한 이름으로 작성.

---

## 📁 폴더 구조 (Phase 2 확장)

src/

├── app/

│   ├── layout.tsx

│   ├── page.tsx              # Home (⑰에서 리뉴얼)

│   ├── globals.css

│   ├── blog/                 # ②~⑨ 완료

│   ├── portfolio/page.tsx    # → /showroom redirect

│   ├── design/page.tsx       # ⑩ 완료

│   ├── showroom/page.tsx     # ⑭ 신규

│   ├── diagnosis/page.tsx    # ⑮ 신규

│   └── services/page.tsx     # ⑯ 신규

├── components/

│   ├── layout/               # Header, Footer

│   ├── sections/             # Hero, About, Featured, Contact, Philosophy, etc.

│   ├── blog/                 # BlogCard, BlogContent, TagFilter, etc.

│   ├── portfolio/            # 기존 유지

│   ├── showroom/             # ⑭ ProjectCard, ProjectGrid, FeaturedBanner, CategoryFilter

│   ├── diagnosis/            # ⑮ DiagnosisForm, DiagnosisQuestion, DiagnosisResult, ScoreRadar, LevelBadge

│   ├── services/             # ⑯ ServiceCard, PricingSection

│   └── seo/                  # JsonLd, OgImage (기존 확장)

├── data/

│   ├── portfolioProjects.ts  # 기존 → projects.ts로 마이그레이션

│   ├── projects.ts           # ⑭ 신규 (ShowroomProject 타입)

│   ├── diagnosisQuestions.ts # ⑮ 신규 (7영역×3=21문항)

│   └── services.ts           # ⑯ 신규 (서비스 3개)

├── types/

│   ├── project.ts            # ShowroomProject 타입

│   ├── diagnosis.ts          # Area, ScanResult 타입

│   └── service.ts            # Service 타입

└── content/

└── blog/                 # MDX 블로그 글

```jsx

---

## 📁 docs/ 폴더 구조
```

docs/

├── [SSOT.md](http://SSOT.md)              # 프로젝트 전체 맥락 + 로드맵

├── [ARCHITECTURE.md](http://ARCHITECTURE.md)      # 풀스택 구조도 + 컴포넌트 트리 + DB 스키마

├── adr/                 # 아키텍처 결정 기록

│   └── [ADR-001-제목.md](http://ADR-001-제목.md)  # 포맷: 맥락 → 결정 → 대안 → 결과

├── log/                 # 세션별 작업 로그

│   └── [YYYY-MM-DD.md](http://YYYY-MM-DD.md)    # 날짜 / 작업 내용 / 변경 파일 / 이슈

├── troubleshooting/     # 에러 해결 기록

│   └── [001-증상.md](http://001-증상.md)      # 증상 → 원인 → 해결 → 교훈

├── [changelog.md](http://changelog.md)          # 스키마/API 변경 이력

└── [til.md](http://til.md)       


---

## 🔄 기록 자동화 규칙

### 작업 로그 (docs/log/)
- 세션 종료 또는 주요 기능 완성 시 `docs/log/YYYY-MM-DD.md` 생성
- 포맷: 날짜 / 작업 내용 / 변경 파일 / 이슈 메모

### ADR (docs/adr/)
- 새 기술/라이브러리/API/DB 선택 시 `docs/adr/ADR-{번호}-{제목}.md` 생성
- 포맷: 맥락 → 결정 → 대안 → 결과
- 상태: Proposed → Accepted → Deprecated → Superseded

### 트러블슈팅 (docs/troubleshooting/)
- 에러 해결 완료 시 `docs/troubleshooting/{번호}-{증상}.md` 생성
- 포맷: 증상 → 원인 → 해결 → 교훈

### Dev Log DB (Notion — notion-mcp)
- DB: 바이브코딩 Dev Log
- 프로젝트: "Yohan Studio"

#### ⚠️ 주입 전 필수 속성 체크리스트 (하나라도 ❌이면 주입 금지)
| # | 속성 | 규칙 |
|---|---|---|
| 1 | 이름 | `[YYYY-MM-DD] [유형] 한 줄 요약` |
| 2 | 유형 | 세션로그/ADR/에러/TIL/패턴/상태요약/핸드오프/결정/마일스톤 중 택1 |
| 3 | 프로젝트 | "Yohan Studio" |
| 4 | 실행일 | YYYY-MM-DD (is_datetime: 0) |
| 5 | 결과 | 성공/실패/부분성공 |
| 6 | 태그 | multi_select 최소 1개 (React/TypeScript/MCP/배포/UX/error-handling/CSS) |
| 7 | 메모 | 본문 내용 요약 (비우지 말 것) |
| 8 | 관련 파일 | docs/patterns/*.md 등 소스 경로 |
| 9 | 역전파 상태 | 기본값 "미처리" |

#### ❌ 금지
- 이름에 날짜 prefix 없이 올리지 말 것
- 태그 속성 비워두지 말 것 (최소 1개)
- 메모(본문) 비워두지 말 것
- 실행일 속성 생략 금지
- 유형/프로젝트/결과 select 미설정 금지

#### 트리거
| 상황 | 유형 |
|---|---|
| 세션 종료 또는 `/done` | 세션로그 |
| docs/adr/ 파일 생성 | ADR |
| docs/troubleshooting/ 파일 생성 | 에러 |
| docs/patterns/ 파일 생성 | 패턴 |
| docs/til.md 추가 | TIL |
| Phase 종료 / 분기 / 주간 상태 캡처 | 상태요약 |
| 세션 종료 후 다음 세션 1순위 액션 + 잔여 블로커 + 재진입 지점 | 핸드오프 |
| ADR보다 작은 반복 가능 의사결정 (워크플로우/툴/접근 선택) | 결정 |
| Phase 완료 / 라우트 출시 / 배포 분기점 | 마일스톤 |

#### 마일스톤 결과 승격 룰
- **부분성공**: 코드 단계만 완료 (build/lint/tsc pass, 미배포)
- **성공**: PR merge + Vercel 배포 + 브라우저 손검증 3박자 완성
- 코드 출시 시점에 "부분성공"으로 적재 → 손검증 통과 후 "성공"으로 update

### 준수율 보완
AI 자동 기록 (80~90%) + 세션 끝 "빠진 거 없어?" 확인 (10~20%) = 거의 100%

---

## 🔮 Phase 3~4 미리보기
| Phase | 내용 |
|---|---|
| 3 | Supabase + Stripe 결제 + 스토어 + 진단 결과 저장 |
| 4 | n8n 멀티채널 자동 배포 + 콘텐츠 발행 |

---

## /done 커맨드
세션 종료 요청 시:
### 📋 세션 요약
- **날짜**: YYYY-MM-DD
- **작업**: (한 줄 요약)
- **변경 파일**: (`git status --short` 기준)
- **커밋**: (`git log --oneline -1`)
- **다음 액션**: (1~3개)
- **이슈/블로커**: (있으면)

---

## 현재 상태 (마지막 갱신: 2026-07-22, 요한 승인)
- **Phase**: 3 라이브 안정화 **완료** — 배포 + 라이브 재검증 체크리스트 전 항목 통과
- **완료**: ①~⑬ / showroom·diagnosis·services / AI 챗봇·TTS / Fuse 검색(코어페이지 포함) / og:image 전 라우트 / 브랜드 404 / RSS / sitemap(store·contact) / `/portfolio`→`/showroom` 308 / 문의 폼 라이브 정상(201 확인) / Supabase RLS 보안 폐쇄(ADR-003) / 쇼룸 케이스 스터디 체계 + 대표 사례 1호(플렉시블) 라이브 — 원본 익명판 데모·실사용 영상 히어로 / 과거 실명 노출 차단(Vercel 삭제·레포 private) / **러닝 로그(B v1) 라이브 — `/learning-log` Notion Headless CMS, 특강 후기 3편 렌더(#61). 읽기전용 통합(`yohanstudio-web`) + 상세 부모검증(URL 조작 차단). 특강 후기 MDX 노션링크→내부링크 교체** / **업데이트 소식 시스템 출시(#65·#66·#67)** — `/updates` 릴리즈 노트(이원화 운영, ADR-004, 백필 5건: SnapContext 3·VHK 2) + 홈 "Now" 활동 피드(4소스 자동 집계, revalidate 60 유지) + SnapContext 0.3.0 글 발행(실측 자산·gpt-image-2 커버)
- **스토어**: 코드 완성이지만 **판매 일시 중지** (`src/data/storeConfig.ts`의 `STORE_SALES_ENABLED=false`) — 기능 실습이었고 실상품·가격 미정. 재개 조건: 실상품·가격·전달물(download_url) 확정 + `stripe_price_id`를 실제 `price_` ID로 정리 + Stripe E2E. 상품 데이터는 `studio_products`(DB)가 단일 소스 — 하드코딩 금지
- **러닝 로그**: `/learning-log` = 노션 "러닝 로그" 부모 페이지(`39b9740a...275c`) 하위 child_page 동적 조회. 새 글을 노션에 쓰면 사이트 자동 반영(ISR 1h). 서버 키 `NOTION_API_KEY`(읽기전용 `yohanstudio-web` 통합, Vercel env). v1=텍스트·리스트·코드 렌더, **이미지는 v2(ISR/프록시) 백로그**. 코드: `src/lib/notion.ts`·`src/components/learning-log/`·`src/app/learning-log/`
- **콘텐츠 파이프라인**: 릴리즈마다 `pnpm new:update -- <제품> <버전> "요약"`(5분), 큰 릴리즈만 블로그 승격+`blogSlug` 연결(ADR-004). 커버는 `pnpm blog:cover -- <slug> "영문 컨셉"` (gpt-image-2, 시리즈 톤 고정). **블로그 글 라이브 검증 통과 = naver-convert 자동 선제 시작** (요한 확정 2026-07-20 — 네이버만, 최종 발행 클릭은 사람). 절차 SoT: `docs/content/blog-publishing-system.md`
- **네이버 발행 워크플로 v2 가동(2026-07-20 완주)**: SnapContext 0.3.0 네이버 실발행 완료 — https://blog.naver.com/yohan3071/224351482750 (라이브 검증 7/7). 도구 `pnpm naver -- <slug> --step preview|inject`. 확정 실측: ①`inject`는 항상 md에서 재변환(stale fragment 주입 사고 방지) ②SE ONE은 `text-align:center`+`color` paste 생존 — 고정멘트 가운데+회색#c2c2c2·이모지 변환기 자동 ③태그 자동 입력 확정(발행 패널 combobox fill+Enter). 최종 발행 클릭만 사람(불변). 취향 SoT: `skills/yohan-dual-blog/references/naver-structure.md`
- **브랜드 이모지 세트 완료(2026-07-22, #74~82)**: 유니코드 "짜침" 대체 — **18개 확정**. 17개 = Fluent Emoji High Contrast(MIT, 유니코드 이모지의 단색 실루엣판이라 팔레트와 1:1), AI 1개 = **자체 제작**(기성 로봇 40여 종에 눈높이 맞는 게 없어 gpt-image-2 생성 → potrace 벡터화). 색은 웹·네이버 **모두 오렌지 고정**. **SoT = `src/data/emojiSet.json` 단일** — 웹(`EmojiIcon`)·PNG생성기(`gen-emoji.mjs`)·네이버 변환기(`naver-to-html.mjs`) 셋이 같은 파일을 읽는다(PNG 재생성 시 바이트 일치로 실증). 원고(.md)엔 계속 유니코드로 쓰면 fragment 생성 시 자동 치환(줄 맨 앞 전용·본문16px·소제목22px·`&nbsp;`). **원고 규칙 2가지**: 선두 이모지는 1개만, 이모지를 서식(`**`·`[]()`)으로 감싸지 말 것 — 어기면 변환 시 경고가 뜬다. chip(오렌지 원)은 폐기
- **마지막 커밋**: `#82 선두 이모지 소실 버그 수정 + 문서 자기모순 정정`
- **다음 작업**: visualize 스킬에 브랜드 이모지 배선(내 HTML 보고서 톤 통일) / 러닝 로그 v2(이미지 ISR/프록시) / GAS 매출·재고 사례 완성 (Phase 6 평가 선정작, clasp 코드 회수부터, 요한 계정 필요) / 실상품 기획→스토어 재개 / 진단 결과 저장 + 결과 시점 이메일 캡처 / Phase 4(n8n 멀티채널)
- **블로커**: 없음
- **관찰 대기**: auto-trader n8n WF1의 `daily_price` 익일 적재 확인 (RLS 적용 후 첫 실행) / **러닝 로그 페이지가 A키 실험 때 `Claude MCP` 통합에도 공유됨 — 최소권한 위해 해제 검토(서버는 `yohanstudio-web`만 쓰면 됨)**

> 자동 패치 금지 — 사람 확인 후 갱신.

<!-- YOHAN-ROSTER-CARD:BEGIN (managed by yohan-brain ops/propagation — SoT를 고쳐라, 직접수정 금지) -->
## 상시 지휘자 — 라우팅 카드 (yohan ecosystem)

> SoT: yohan-brain `memory/core/agent-roster.yaml` `conductor_always_on` (v0.4+, status=active면 obey).
> 이 레포 자체 규칙(RULES/CLAUDE LIVE)이 있으면 그게 우선(precedence).

- 모든 태스크: 해법 구상 **전에** 크기 판정 → `라우팅: S|M|L — 계획 1줄 (근거: 파일수/신규설계/리스크)` 선언 후 진행. 키워드("풀개발") 불필요, 항상.
- **판정법(감 금지)**: ①하드 트리거 먼저 → 해당 시 즉시 확정 · ②없으면 예상 수정 파일 수를 먼저 세고 구간 매핑(≤2=S·3~6=M·≥7/다레포=L). LLM 자유분류는 불안정(실측 33~56%) — 파일수 결정론이 정답.
- **S**(≤2파일·신규설계 없음·≤15분): 지휘자 단독. 서브에이전트·orca 금지(오버헤드).
- **M**(3~6파일·부분 신규): 서브에이전트 티어링 — 탐색 haiku → 계획 opus(승인) → 구현 sonnet → 적대검증 opus/fable 루프.
- **L**(≥7파일·신규 모듈·다레포·릴리즈급): /goal orca 풀파이프라인 — Scout→Plan승인★→worktree fanout→타벤더 적대검증→머지게이트★. "풀개발"=L 강제.
- 하드 트리거(분류 생략): 스키마 마이그레이션·인증/결제/보안·크로스레포·릴리즈 = 무조건 **L** · 오타·문서/주석만 = **S**.
- 애매하면 작은 쪽 시작 → 검증 실패(테스트/tsc/critic) 시 **재선언 후 승급**(몰래 계속 금지).
- 동시 작업 = worktree만. 같은 레포·같은 브랜치 2에이전트 금지.
- Antigravity(agy) = 보조·초안 전용(메인 지휘 금지) — 산출물은 상위 티어 검증 필수.
- 배포·시크릿·npm publish·main 직push = 사람 게이트(불변).
<!-- YOHAN-ROSTER-CARD:END -->
