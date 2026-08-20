# Luna MAX 카드뉴스 — 캡션·ManyChat 초안 v5

상태: 작업본. 게시·`Go Live`·실제 DM 발송 전 사용자 승인이 필요합니다.

## 인스타그램 캡션

Codex에서 Luna에 Max 추론을 적용하려면 모델 이름만 바꾸는 것이 아니라, Sol Advisor의 별도 앱 작업 경로를 사용해야 합니다.

Sol이 작업을 설계하고 나눈 뒤 `gpt-5.6-luna`와 `max`를 함께 지정해 Luna 작업을 만들고, 결과를 다시 검토하는 구조입니다.

여기서 Luna는 모델이고 Max는 추론 강도입니다.

다만 Sol Advisor는 OpenAI 공식 기능이 아닌 커뮤니티 플러그인입니다. Bun과 Codex 앱 작업 도구가 필요하며, Luna 작업 경로는 요청할 때마다 명시적으로 승인해야 합니다.

설치 준비사항·플러그인 등록 명령어·복붙 프롬프트가 필요하시면 댓글에 **루나**라고 남겨 주세요. DM으로 보내드리겠습니다. 🌙

#Codex #바이브코딩 #AI에이전트 #개발자동화 #Luna #Max추론

## ManyChat 트리거

- 자동화: `Auto-DM links from comments`
- 게시물: 이 카드뉴스를 인스타그램에 게시한 뒤 `a specific post or reel`로 선택
- 포함 키워드: `루나`
- 첫 검증: 소유자 또는 지정 테스트 계정의 첫 댓글 한 번만 사용
- 게시 전 상태: 초안 유지, `Go Live` 실행 금지

## 공개 댓글 답변 3종

1. 요청하신 설치 준비사항과 복붙 프롬프트를 DM으로 보내드렸습니다. 🌙
2. Luna·Max 가이드를 DM으로 안내해 드렸습니다. 메시지 요청함도 확인해 주세요.
3. 필요한 명령어와 주의사항을 DM으로 보내드렸습니다. 🌙

## Opening DM

요청하신 Luna·Max 가이드입니다. 🌙

아래 **가이드 받기**를 누르면 설치 준비사항과 복붙 프롬프트를 보내드리겠습니다.

- 빠른 답장 버튼: `가이드 받기`
- 웹사이트 열기 버튼으로 만들지 않음
- 첫 private reply는 이 텍스트 블록 하나만 사용

## 빠른 답장 뒤 후속 DM

설치 명령어와 Luna 작업 요청문을 한 페이지에 정리했습니다. 🌙

처음 설치하셔도 아래 순서대로 따라가실 수 있습니다.

- Bun 설치 여부 확인
- Sol Advisor 플러그인 등록
- 첫 설정 인터뷰
- Luna / Max 요청문 복사
- 막힐 때 확인할 항목

버튼: `설치 가이드 열기`

버튼 유형: 웹사이트 열기

배포 후 URL:
https://yohanstudio.co/guides/luna-max

보조 문구:
Sol Advisor는 OpenAI 공식 기능이 아닌 커뮤니티 플러그인입니다. Luna 작업은 Codex 데스크톱 앱의 작업 도구와 Luna·Max 사용 권한이 필요합니다.

## 실제 플랫폼 점검 순서

1. 카드뉴스 게시 후 ManyChat 게시물 선택기에 나타나는지 확인
2. `루나` 키워드와 공개 답글 3종 저장
3. Opening DM을 `Send as a Private Reply`로 설정
4. `가이드 받기`를 빠른 답장 또는 일반 버튼으로 연결
5. 후속 DM에 `설치 가이드 열기` 웹사이트 버튼과 위 URL 입력
6. ManyChat 미리보기와 Instagram 미리보기 모두 확인
7. 테스트 계정의 첫 댓글로 공개 답글·Opening DM·버튼·후속 DM 확인
8. 결과 확인 뒤에만 사용자 승인으로 `Go Live`

## 제한사항

- 같은 사용자가 같은 게시물에 다시 댓글을 달아도 댓글 트리거는 첫 댓글에만 작동할 수 있습니다.
- 첫 private reply만으로는 24시간 메시지 창이 열리지 않습니다. 사용자가 빠른 답장 또는 일반 버튼을 눌러야 후속 대화가 열립니다.
- `Open website` 버튼은 옵트인으로 계산되지 않으므로 첫 버튼에 사용하지 않습니다.
- 협업 게시물은 원 게시자 계정 기준으로 작동합니다.

## 검증 출처

- Sol Advisor v0.5.0 `main` README, 2026-08-12 확인
- 로컬 Codex CLI 0.147.0 `plugin marketplace add --help`, `plugin add --help`, 2026-08-12 확인
- Bun 공식 `Installation` 문서, 2026-08-12 확인
- ManyChat Help `Instagram Post and Reel Comments trigger`, 2026-08-12 확인
- ManyChat Help `Quick Automation: Auto-DM links from comments`, 2026-08-12 확인
