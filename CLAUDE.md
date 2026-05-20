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

## 현재 Phase: 2 (블로그 + SEO + AI'm OS 확장)
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
| ⑭ | /showroom (프로젝트 카드 5+ , Featured, 카테고리 필터) | 🔲 미착수 |
| ⑮ | /diagnosis — AI'm Scan v0.1 (7영역×3문항, 점수, 레벨) | 🔲 미착수 |
| ⑯ | /services (서비스 3개 + 문의 CTA) | 🔲 미착수 |
| ⑰ | Home 리뉴얼 (AI 1인 기업 OS 포지셔닝 + Featured) | 🔲 미착수 |

### ⚠️ 007~010 보호 규칙
- ①~⑬ 에서 생성된 파일은 **수정 최소**. 신규 경로만 작업.
- 기존 /blog, /design, SEO 파이프라인, 다크모드 시스템은 건드리지 않는다.
- 예외: sitemap에 새 경로 추가, Header/Footer 네비 링크 추가는 허용.

### /portfolio → /showroom 마이그레이션
- `/showroom`은 신규 라우트로 생성.
- `/portfolio`는 `/showroom`으로 301 redirect 설정.
- `src/data/portfolioProjects.ts` → `src/data/projects.ts`로 마이그레이션/확장.

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

## Phase 2 허용
✅ MDX 블로그 | next-sitemap, robots.txt | @vercel/og | JSON-LD (Article/FAQ/HowTo) | GA gtag, GSC | 다크모드 | 블로그 클라이언트 카운터 | 정적 데이터 (src/data/) | 클라이언트 사이드 진단 로직 | 외부 폼 URL (env var)

## Phase 2 금지
❌ Supabase/DB 연결 | Stripe/결제 | API Routes (OG route 제외) | n8n 웹훅 | 진단 결과 서버 저장 | 예약/결제 기능 | RAG/Qdrant

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

│   ├── services/page.tsx     # ⑯ 신규

│   └── about/page.tsx        # 신규

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
| 2 | 유형 | 세션로그/ADR/에러/TIL/패턴 중 택1 |
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

## 현재 상태 (마지막 갱신: 2026-05-20)
- **Phase**: 2 (블로그+SEO ①~⑬ 완료 + AI'm OS 확장 ⑭~⑰ 진행 중)
- **완료**: v2 디자인 / MDX 블로그 / SEO / GA·GSC / 다크모드 / /design / Hero / 모바일 햄버거 / AEO 인프라
- **진행 중**: ⑭ /showroom → ⑮ /diagnosis → ⑯ /services → ⑰ Home 리뉴얼
- **마지막 커밋**: `e3126e4 feat(seo): /llms.txt 추가`
- **다음 작업**: ⑭ /showroom 구현 (Subagent Plan A)
- **블로커**: 없음

> 자동 패치 금지 — 사람 확인 후 갱신.


  