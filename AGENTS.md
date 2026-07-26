<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Ecosystem (cross-repo)

> Contract SoT: yohan-brain `memory/core/ecosystem-contract.yaml` (obey when status=active).
> Roster: yohan-brain `memory/core/agent-roster.yaml` (CLI·모델·effort; obey when active).
> Tier: yohan-brain `memory/core/inheritance-registry.yaml`.

- 같은 레포·같은 브랜치에 에이전트 2명 금지 → worktree만.
- 배포·시크릿·npm publish = 사람 Gate. 교리 본문 복제 금지(포인터만).

## Git 워크플로우 (모든 에이전트 공통 — 2026-07-12부터 강제)

- **master 직푸시 금지.** 브랜치 보호가 걸려 있어 직푸시는 GitHub이 거부한다(`protected branch hook declined`). 관리자 토큰도 예외 없음.
- 모든 변경은 **브랜치 → PR → CI `build` 체크 green → squash 머지**. 브랜치명은 `feat/…`, `fix/…`, `docs/…`, `ci/…`.
- 오토머지 사용 가능: `gh pr merge <n> --squash --auto` — build green이면 자동 머지되고 브랜치는 자동 삭제된다.
- 커밋·PR에 AI 흔적 금지: `Co-Authored-By: Claude/Codex`, `🤖 Generated` 등 트레일러·문구 넣지 않는다. 메시지는 한국어 명사형 한 줄 + 필요할 때만 "왜" 1~3줄.
- 작업 시작 전 `git fetch` + master 최신화 필수 — 같은 디렉토리에서 복수 세션이 작업하므로 로컬 master가 낡았을 수 있다.
- 독립 서브프로젝트를 추가하면 즉시 `tsconfig.json` exclude에 등록한다 (standalone/ 타입에러로 배포 3연속 실패했던 사례).

## 블로그 발행

- 웹 블로그의 기준 원본은 `src/content/blog/*.mdx`다.
- 네이버 블로그용 평문은 `docs/content/naver/<slug>.txt`에 함께 만든다.
- 새 글 작성, 노션 초안 변환, 네이버 원고 생성 시 `skills/yohan-dual-blog/SKILL.md`를 따른다.
- 네이버 원고는 MDX 자동 변환본을 그대로 발행하지 말고 문단, 이미지 위치, 링크 중복을 다시 편집한다.

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
