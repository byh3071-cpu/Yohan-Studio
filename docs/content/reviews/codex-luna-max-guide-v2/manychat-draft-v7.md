# Luna · Max 카드뉴스 — 게시·ManyChat 문안 v7

상태: **게시 차단**. 공식 Windows 수정과 Luna 필수 앱 작업 도구 6/6 검증 전에는 Instagram 게시 및 ManyChat `Go Live`를 실행하지 않습니다.

아래 문안은 검증 완료 뒤 입력할 초안입니다.

## Instagram 캡션

Codex에서 Luna에 Max 추론을 적용하려면 모델 이름만 바꾸는 것이 아니라 별도 작업 경로를 사용해야 합니다.

- Sol — 설계·분해·검토
- Luna — 구현
- Max — Luna 작업의 추론 강도

Sol Advisor는 OpenAI 공식 기능이 아닌 커뮤니티 플러그인입니다.

설치는 터미널에서 진행하지만 설치 목록에 보이는 것만으로 실제 작동이 확인되지는 않습니다. 첫 설정과 필수 앱 작업 도구 여섯 개를 확인한 뒤 읽기 전용 스모크 테스트까지 통과해야 합니다.

현재 공식 v0.5.0의 Windows 설정 이슈와 Yohan Studio 실측 호스트의 `wait_threads` 미노출이 남아 있어 이 문안은 아직 게시하지 않습니다.

#Codex #바이브코딩 #AI에이전트 #Luna #Max추론 #개발자동화

## ManyChat 트리거

- 자동화: `Auto-DM links from comments`
- 게시물: Instagram 게시 뒤 `a specific post or reel`에서 해당 카드뉴스 선택
- 포함 키워드: `루나`
- 공개 답글: 아래 3개 순환
- Opening DM: 활성화
- 첫 버튼: 빠른 답장 `가이드 받기`
- 후속 버튼: 웹사이트 열기 `설치 가이드 열기`
- 후속 URL: `https://yohanstudio.co/guides/luna-max`

## 공개 답글 3종

1. 요청하신 Luna·Max 설치 가이드를 DM으로 보내드렸습니다. 🌙
2. OS별 설치 방법과 복사해서 쓸 요청문을 DM으로 안내해 드렸습니다.
3. 가이드를 보내드렸습니다. 메시지 요청함도 확인해 주세요. 🌙

## Opening DM

요청하신 Luna·Max 설치 가이드입니다. 🌙

아래 **가이드 받기**를 누르면 OS별 설치 방법과 복사해서 쓸 요청문을 보내드리겠습니다.

- 버튼 유형: 빠른 답장
- 버튼 문구: `가이드 받기`
- 첫 private reply는 이 텍스트 블록 하나만 사용

## 빠른 답장 뒤 후속 DM

설치는 터미널에서, Luna 작업은 Codex 데스크톱 앱에서 진행합니다.

Bun 준비부터 플러그인 설치, 첫 설정, Luna 작업 요청문과 호환성 점검까지 한 페이지에 정리했습니다.

- 버튼 유형: 웹사이트 열기
- 버튼 문구: `설치 가이드 열기`
- URL: `https://yohanstudio.co/guides/luna-max`

Sol Advisor는 OpenAI 공식 기능이 아닌 커뮤니티 플러그인입니다. 계정에서 Luna·Max와 필수 앱 작업 도구를 사용할 수 있어야 하며, 스모크 테스트가 `BLOCKED`로 끝나면 다른 모델로 대체하지 말고 사용을 중단해 주세요.

## 운영자 점검

- 무료 플랜 제한은 게시 직전 ManyChat 화면에서 다시 확인
- 같은 사용자의 같은 게시물 첫 댓글에만 트리거될 수 있음
- `Open website`는 첫 버튼으로 사용하지 않음
- 연결 계정이 아닌 별도 Instagram 계정으로 첫 댓글 테스트
- 테스트 통과 전 `Go Live` 금지
