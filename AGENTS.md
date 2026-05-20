<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know
This version has breaking changes — APIs, conventions, and file structure
may all differ from your training data. Read the relevant guide in
`node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Yohan Studio — 프로젝트 공통 규칙

## 프로젝트 정체성
Yohan Studio는 AI 시대의 1인 기업가를 위한 First Platform이다.
포지셔닝: "생각을 시스템으로, 시스템을 사업으로 바꾸는 AI 운영체계."

## 삼중 패널 분업 (Antigravity IDE)
- **Claude Code CLI** = 메인 구현. 파일 생성/삭제, 구조 변경, 로직 구현, subagent 패턴.
- **Cursor Composer** = 스타일 튜닝, 콘텐츠/카피, 소규모 리팩터, GEO 갭 체크.
- **Codex** = 빌드/테스트/리뷰 (읽기 전용, 수정 X).
- **동시 수정 금지**: 한 도구가 파일 작업 중이면 다른 도구는 그 파일 터치 X.
- 작업 순서: CLI가 뼈대 → Cursor가 살 붙이기 → Codex가 검증.
- 병렬 필요 시 `git stash` / `git worktree`로 작업 분리.

## Phase 경계
- 현재 Phase 2. Supabase/Stripe/API Routes(OG 제외)/n8n 사용 금지.
- Phase 2 범위: ①~⑬ (블로그+SEO, 완료) + ⑭~⑰ (AI'm OS 확장, 진행 중)

## 007~010 보호
- 기존 블로그(/blog), SEO, GA/GSC, 다크모드 관련 파일은 수정 최소.
- 신규 라우트(/showroom, /diagnosis, /services)만 작업.
- 예외: sitemap 경로 추가, Header/Footer 네비 링크.

## 실행 순서 (AI'm OS 확장)
011(⑭) /showroom → 012(⑮) /diagnosis → 013(⑯) /services → 014(⑰) Home

## 파일 분업
- CLAUDE.md: Claude Code CLI 전용 (운영 규칙 + 현재 상태 + 기록 자동화)
- .cursorrules: Cursor Composer 전용 (코딩 규칙 + 디자인 + 허용/금지)
- AGENTS.md (이 파일): 모든 도구 공통 (프로젝트 정체성 + 분업 + 경계)

## 기록 규칙 (공통)
- 모든 도구는 docs/ 폴더의 기록 체계를 인지하고 훼손하지 않는다.
- 세션 작업은 docs/log/YYYY-MM-DD.md로 기록한다.
- 기술 결정은 docs/adr/, 에러 해결은 docs/troubleshooting/에 기록한다.
- Notion Dev Log DB 주입 상세 규칙은 CLAUDE.md 참조.