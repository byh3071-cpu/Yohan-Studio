# Sol Advisor Luna / Max 카드뉴스 v6 문안

상태: **기술 검증 대기 — 게시하지 않음**

검증 기준: Sol Advisor v0.5.0 공식 문서·오케스트레이션 계약, 공개 이슈 #20·PR #22, Codex CLI 0.147.0 실측.

## 카드 1 — 표지

Codex에서 Luna에
MAX 추론을
적용하는 방법

Sol이 지휘하고 Luna가 구현합니다.

## 카드 2 — 역할 구분

Luna는 모델,
Max는 추론 강도입니다

- SOL: 설계·분해·검증
- LUNA: MAX 추론으로 구현

## 카드 3 — 작업 흐름

SOL 설계·작업 분해 → LUNA MAX 추론 구현 → SOL 검토·수정

## 카드 4 — 플러그인 등록

```text
codex plugin marketplace add DannyMac180/sol-advisor --ref main
codex plugin add sol-advisor@sol-advisor
```

Luna 작업 경로만 사용한다면 `install-agents.sh`를 별도로 실행하지 않아도 됩니다.

## 카드 5 — 명시적 승인

```text
Use the Luna task lane for this feature.
```

Luna 작업 경로는 현재 요청마다 명시적으로 승인해야 합니다.

## 카드 6 — Luna + Max 지정

- 첫 실행: Sol Advisor 설정 인터뷰를 완료합니다.
- Luna 작업 생성: `gpt-5.6-luna`와 `max`를 함께 지정합니다.
- Luna / Max를 사용할 수 없으면 다른 모델로 자동 대체하지 않습니다.

## 카드 7 — 게시 전 확인

1. Sol Advisor는 OpenAI 공식 기능이 아닌 커뮤니티 플러그인입니다.
2. Luna 경로에는 Codex 앱 작업 도구 여섯 개가 모두 필요합니다.
3. 공식 v0.5.0은 현재 Windows 설정 이슈 #20이 열려 있습니다.

## 카드 8 — CTA

검증이 끝난 뒤 사용합니다.

댓글에 **루나**를 남기면 설치 명령어와 복붙 프롬프트를 DM으로 안내합니다.

## 캡션·DM 링크

- 공식 저장소: https://github.com/DannyMac180/sol-advisor
- Windows 이슈: https://github.com/DannyMac180/sol-advisor/issues/20
- 카드 안에는 긴 URL을 넣지 않습니다.
