# Instagram 디자인 산출물 보관 체계

- 날짜: 2026-08-12
- 프로젝트: Yohan Studio
- 상태: 로컬 구현·검증 완료, PR 전

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
