# Sol Advisor Luna / Max 카드뉴스 v6 문안

검증 기준: Sol Advisor v0.5.0 `main` README·오케스트레이션 계약, 로컬 Codex CLI 0.147.0 도움말, Windows 이슈 #20·수정 PR #22, 로컬 Luna/Max 스모크 테스트.

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
- `codex -e`의 `e`는 Max 설정이 아니라 `exec` 명령의 별칭입니다.

## 카드 7 — 실행 조건과 Windows 안내

1. 다른 사용자도 사용할 수 있습니다. 특정 계정 전용이 아닌 커뮤니티 플러그인입니다.
2. Luna·Max와 Codex 앱 작업 도구가 필요합니다. 없으면 다른 설정으로 대체하지 않고 중단합니다.
3. Windows는 저장 폴더 권한(`PLUGIN_DATA`) 호환 수정 PR #22의 병합 여부를 확인해야 합니다. 병합 전에는 원본 `main`의 설정 단계가 막힐 수 있습니다.

오래 이어온 기존 채팅에서 `wait_threads`만 보이지 않는 경우에는 플러그인 설치 실패로 단정하지 않고, 앱 재시작 뒤 새 채팅에서 다시 확인합니다. 이 내용은 카드가 아니라 DM 문제 해결 절차에 둡니다.

## 카드 8 — CTA

댓글에 **루나**를 남기면 설치 명령어와 복붙 프롬프트를 DM으로 안내합니다.

## 캡션·DM에 둘 링크

- 공식 저장소: https://github.com/DannyMac180/sol-advisor
- Windows 이슈 #20: https://github.com/DannyMac180/sol-advisor/issues/20
- Windows 수정 PR #22: https://github.com/DannyMac180/sol-advisor/pull/22
- 카드 안에는 긴 URL을 넣지 않습니다.
