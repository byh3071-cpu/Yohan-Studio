# Instagram 디자인 산출물 보관 체계

- 날짜: 2026-08-12
- 프로젝트: Yohan Studio
- 상태: 브랜치 원격 푸시 완료, PR 생성은 GitHub CLI 인증 필요

## 결과

- 임시 Codex 작업 폴더에 있던 Luna × Max 카드뉴스 최종본을 `docs/content/exports/codex-luna-max-guide/`로 편입했습니다.
- 최종 PNG·미리보기, 생성 이미지 원본, 게시 문구, 디자인 철학, 생성 프롬프트, 승인·재사용 메타데이터를 한 보관 단위로 묶었습니다.
- `npm run content:archive-design` 명령으로 이후 디자인 산출물도 같은 계약에 따라 보관할 수 있게 했습니다.
- `C:\Users\user\.codex\AGENTS.md`에 Yohan Studio 디자인의 기본 소유 저장소와 임시 작업 폴더 금지 규칙을 추가했습니다.

## 교훈

생성 도구의 기본 출력 위치와 Codex 세션 작업 폴더는 제작 공간이지 장기 정본이 아닙니다. 실제 파일은 발행 프로젝트 Git이 소유하고, 디자인 인텔리전스는 상대경로·해시·승인 이유만 색인해야 이중 정본과 경로 유실을 피할 수 있습니다.

## 산출물 포인터

- 핸드오프 진입점: `docs/content/DESIGN-ARCHIVE.md`
- 실제 보관물: `docs/content/exports/codex-luna-max-guide/`
- 자동화: `scripts/archive-design-output.mjs`

## 카드뉴스 제작 스킬 초안

- 요한 생태계 계약을 대조한 결과, 계정 전용 카드뉴스 스킬의 정본 위치를 범용 `yohan-cc-skills`가 아니라 콘텐츠 소유 저장소인 `skills/yohan-instagram-cardnews/`로 결정했습니다.
- 제작·실제 댓글 DM 자동화·승인본 보관을 분리하고, 사용자 승인 전 `Go Live`와 실제 발송을 금지했습니다.
- 1080×1350 RGB, 순차 파일명, 50% 인스타 축소본을 자동 검사하는 `validate-carousel.mjs`를 추가했습니다.
- 한 번 승인된 시각 스타일을 전역 취향으로 일반화하지 않고, 서로 다른 게시물의 반복 성공과 사용자 승인을 거쳐 승격하도록 정리했습니다.

### 교훈

콘텐츠 계정에 강하게 결합된 스킬은 멀티벤더 범용 스킬 저장소보다 발행 프로젝트에 두는 편이 소유권과 디자인 자산 경계를 보존합니다. 전역 설치본을 먼저 만들면 Git 정본 없이 캐시만 남을 수 있으므로, 프로젝트 원본→실사용 검증→필요 시 범용 승격 순서를 지켜야 합니다.

### 추가 산출물 포인터

- 스킬 진입점: `skills/yohan-instagram-cardnews/SKILL.md`
- 검수 기준: `skills/yohan-instagram-cardnews/references/review-rubric.md`
- 규격 검사: `skills/yohan-instagram-cardnews/scripts/validate-carousel.mjs`

## 전역 발견 경로 실사용 검증

- 프로젝트 작업트리에서는 통과하던 규격 검사기가 다른 작업 폴더의 전역 스킬 경로에서 `sharp`를 찾지 못하는 결함을 재현했습니다.
- 현재 작업 폴더가 아니라 스킬 파일 위치에서 저장소 루트와 주 작업트리를 찾도록 수정했습니다.
- 교훈: 프로젝트 로컬 스킬의 실행 스크립트는 호출자의 `cwd`를 소유 저장소로 가정하면 안 됩니다. 전역 발견 경로와 외부 작업 폴더에서 반드시 한 번 더 실행해야 합니다.

## 첫 독푸딩 — 내용 정확성 결함

- 기존 카드의 `codex -e max "작업 내용"`을 로컬 Codex CLI 0.147.0과 Sol Advisor v0.5.0 원문으로 교차검증했습니다.
- `-e`는 Max 추론 옵션이 아니라 `exec` 명령의 별칭이므로 해당 안내를 삭제했습니다.
- Luna 경로는 앱 작업 생성 시 `gpt-5.6-luna`와 `max`를 함께 지정하며, Luna·Max·필수 앱 작업 도구가 없으면 다른 모델로 대체하지 않고 중단하는 계약으로 수정했습니다.
- 교훈: 소셜 카드의 짧은 CLI 토큰은 그럴듯해 보여도 오독 비용이 큽니다. 이전 원고가 아니라 현재 `--help`와 원본 저장소를 제작 전 게이트로 사용해야 합니다.

## 승인 뒤 결함 처리 계약

- 내용 오류가 있는 기존 보관본을 `approved / golden_candidate` 상태로 둘 경우 디자인 인텔리전스가 잘못된 산출물을 재사용할 수 있어 `superseded / false`로 강등했습니다.
- 기존 PNG는 Git 이력과 감사 가능성을 위해 보존하고, 교정본은 사용자 재승인 뒤 새 revision slug로 보관하도록 계약과 스킬을 보강했습니다.
- 교훈: 시각 승인은 사실 정확성 승인을 대신하지 않습니다. 게시 산출물은 내용 게이트와 시각 게이트를 모두 통과해야 승인 상태를 유지할 수 있습니다.

## 보관 하드게이트

- 문서상 승인 규칙만 있고 보관 스크립트에는 승인 상태 검사가 없어 작업본 매니페스트도 보관될 수 있는 결함을 발견했습니다.
- `status: approved`, 승인자, `YYYY-MM-DD` 승인일을 코드에서 강제하고, `pending-approval` 매니페스트가 파일 복사 전에 거부되는 실패 테스트를 추가했습니다.
- 교훈: 사람 승인 규칙은 문구만으로는 게이트가 아닙니다. 변경 경로의 실행 코드가 승인 증거를 검사해야 합니다.

## 장기 검토본 위치

- 승인 전 교정본이 다시 날짜별 Codex 작업 폴더에만 남지 않도록 `docs/content/reviews/<revision-slug>/` 계약을 추가했습니다.
- 다음 세션에서 재현할 수 있도록 렌더 코드·생성 원본·PNG·문안·검증 보고·승인 대기 매니페스트를 한 폴더에 묶습니다.
- `reviews/`는 승인본·사이트 콘텐츠·디자인 인텔리전스 학습 대상이 아니며, 사용자 승인 뒤 새 revision을 `exports/`에 보관합니다.

## Luna · Max 공개 설치가이드

- 카드뉴스 댓글 자동화가 실제로 전달할 공개 설치가이드를 `/guides/luna-max`에 추가했습니다.
- Bun 확인 → Sol Advisor 설치 → 첫 설정 → 현재 요청별 Luna 승인 순서로 재구성하고, 모든 명령과 요청문에 복사 버튼을 제공했습니다.
- `install-agents.sh`는 Luna 전용 경로에 필요하지 않음을 분리해 표시하고, VS Code의 모델·추론 강도 제약과 Codex 데스크톱 앱 경로를 구분했습니다.
- 사이트맵과 내부 검색 문서에 가이드를 등록하고, ManyChat 후속 DM 초안의 목적지를 `https://yohanstudio.co/guides/luna-max`로 연결했습니다.

### 교훈

소셜 콘텐츠의 “DM으로 가이드를 보낸다”는 약속은 긴 명령어를 DM 본문에 모두 넣는 것보다, 검증 날짜·원문·오류 해결까지 유지할 수 있는 공개 정본 페이지로 연결해야 업데이트 비용과 오독 위험이 낮아집니다.

### 추가 산출물 포인터

- 공개 페이지: `src/app/guides/luna-max/page.tsx`
- ManyChat 초안: `docs/content/reviews/codex-luna-max-guide-v2/manychat-draft-v5.md`

## Windows 작업트리 빌드 검증

- 주 체크아웃의 `node_modules`를 junction으로 재사용한 상태에서 lint와 typecheck는 통과했지만, Turbopack은 프로젝트 루트 밖 링크를 거부했습니다.
- 같은 Next.js 16.2.4 소스를 `next build --webpack`으로 다시 빌드해 `/guides/luna-max`의 정적 생성을 확인했습니다.
- 교훈: 작업트리 의존성 재사용은 빌드 엔진의 파일시스템 경계 정책과 별개입니다. 우회 검증을 사용했다면 어떤 엔진이 통과했는지 구분해 기록해야 합니다.
- 패턴: `docs/patterns/PAT-007-turbopack-worktree-junction.md`

## Sol Advisor Windows ACL 수정안 재검증

- 공개 PR #22의 헤드 `c95f6da`를 격리 복제해 정적 검토와 Windows MCP 테스트를 수행했고 34 PASS / 0 FAIL을 확인했습니다.
- 실제 Codex Desktop의 플러그인 데이터 폴더에서는 MCP 실행 계정이 `CodexSandboxOnline`, 폴더 소유자가 로그인 사용자이며 `CodexSandboxUsers`에 `Modify`가 부여돼 PR의 소유자·읽기 전용 전제와 충돌했습니다.
- 검사를 우회하거나 ACL을 바꾸지 않고 전역 적용을 중단했으며, 세부 증거는 `docs/content/reviews/codex-luna-max-guide-v2/smoke-test-report-v7.md`에 기록했습니다.
- 교훈: 보안 패치의 자체 테스트가 통과해도 호스트가 실제로 제공하는 실행 계정과 데이터 디렉터리 ACL 계약을 연결한 통합 테스트가 없으면 호환성을 주장할 수 없습니다.
