# Luna × Max 카드뉴스 V2 생성·검증 기록

## 상태

- revision: v2 후보
- 작업본: `output/carousel-v5/`
- 판정: 자동·축소 육안 검사 PASS, Instagram·ManyChat 실플랫폼 확인 필요
- 승인: 미승인

## V1 폐기 사유

- `codex -e max "작업 내용"`에서 `-e`를 추론 강도 옵션으로 잘못 해석했습니다.
- 로컬 Codex CLI 0.147.0 도움말에서 `-e`는 `exec` 명령의 별칭임을 확인했습니다.
- 내용 오류가 있던 V1은 Yohan Studio에서 `superseded`, `golden_candidate: false`로 강등했습니다.

## V2 내용 교정

- Luna는 모델, Max는 추론 강도로 분리했습니다.
- Luna 작업은 Native V2 에이전트가 아니라 사용자가 보는 별도 Codex 앱 작업으로 설명했습니다.
- Luna 작업 생성 시 `gpt-5.6-luna`와 `max`를 함께 지정하도록 수정했습니다.
- 현재 요청마다 `Use the Luna task lane for this feature.`를 명시적으로 승인하는 계약을 반영했습니다.
- Luna 전용 사용자는 `install-agents.sh`가 필요하지 않다는 현재 원문을 반영했습니다.
- Bun·필수 앱 작업 도구·Luna·Max가 없으면 자동 대체하지 않고 중단하는 조건을 넣었습니다.
- 카드 4의 `설치는 두 줄`을 `플러그인 등록은 두 줄`로 좁혀 Bun 선행조건과 구분했습니다.

## V2 시각 교정

- 표지에서 Luna가 Native 작업 에이전트처럼 읽힐 표현을 제거했습니다.
- 패널 본문과 작은 보조문구를 키웠습니다.
- 번호 원을 텍스트 첫 줄이 아닌 전체 텍스트 블록 중심에 맞췄습니다.
- 6번 카드의 달과 텍스트 영역을 분리했습니다.
- 7번 카드는 커뮤니티 플러그인·별도 앱 작업·무대체 중단을 각각 한 패널로 분리했습니다.
- CTA 카드의 불필요한 작은 면책 문구를 제거하고 캡션·DM으로 옮겼습니다.

## 검증 환경

- 날짜: 2026-08-12
- Sol Advisor: v0.5.0 `main` README
- Codex CLI: 0.147.0
- Codex 확인: `plugin marketplace add --help`, `plugin add --help`, 최상위 도움말
- Bun: 공식 `Installation` 문서
- ManyChat: 공식 `Instagram Post and Reel Comments trigger`, `Quick Automation: Auto-DM links from comments`

## 출력 검증

- 8장, 1080×1350, RGB PNG
- 순차 파일명·중복 검사 PASS
- 50% 인스타 축소본 육안 판독 PASS
- 전역 `yohan-instagram-cardnews` 스킬 경로에서 검사 PASS

## 사용자 승인 전 남은 항목

- Instagram 업로드 편집 화면에서 압축·흐림·잘림 확인
- 게시 뒤 ManyChat의 특정 게시물 선택기 노출 확인
- 테스트 계정의 첫 댓글로 공개 답글·Opening DM·버튼·후속 DM 확인
- 사용자 최종 승인 뒤 `codex-luna-max-guide-v2`로 보관
