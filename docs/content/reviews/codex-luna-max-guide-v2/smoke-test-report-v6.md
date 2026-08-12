# Sol Advisor Luna · Max 스모크 테스트 보고서 v6

점검일: 2026-08-12
판정: **플러그인 전체 경로 BLOCKED**

## 확인된 항목

| 항목 | 결과 | 증거 |
| --- | --- | --- |
| Codex CLI | PASS | `codex.cmd --version` → `0.147.0` |
| Bun | PASS | `%USERPROFILE%\.bun\bin\bun.exe --version` → `1.3.14` |
| Sol Advisor 설치 | PASS | `sol-advisor@sol-advisor`, manifest `0.5.0`, enabled |
| 직접 Luna · Max 요청 작업 | PASS | Luna / Max로 요청한 별도 작업이 10.575초 후 `SMOKE_LUNA_MAX_OK` 반환. 결과 도구는 런타임 모델 메타데이터를 별도로 반환하지 않음 |
| Sol Advisor 설정 도구 | BLOCKED | 재시작 후 새 작업에서도 설정 MCP 4개 미노출 |
| 필수 앱 작업 도구 | UNVERIFIED | 새 작업은 누락을 보고하지 않았지만 여섯 도구를 모두 실제 호출한 증거는 없음 |
| Sol Advisor Luna task lane E2E | BLOCKED | 필수 설정 MCP 누락 시 대체 금지 계약 적용 |

## 확정된 Windows 근본 원인

Sol Advisor v0.5.0은 `PLUGIN_DATA` 디렉터리의 `st.mode & 0o077`이 0인지 검사합니다. Windows의 Bun 1.3.14에서는 제한된 폴더도 `0666`으로 보고되어 `get_setup_status`와 `save_preferences`가 `PLUGIN_DATA must be private` 오류로 거부됩니다.

로컬 재현:

- Bun으로 디렉터리를 `0700` 생성하고 `chmod 0700` 적용
- 같은 Bun의 `statSync(...).mode & 0o777` 결과: `0666`
- Sol Advisor MCP 직접 초기화와 `tools/list`: 성공
- `get_setup_status`: `PLUGIN_DATA must be private (no group/world permission bits)`로 실패

원본 저장소에도 동일한 공개 이슈가 열려 있습니다.

- https://github.com/DannyMac180/sol-advisor/issues/20
- 상태: Open, 담당자 없음, 수정 PR 없음 — 2026-08-12 확인

## 해석

직접 Luna · Max 작업 성공은 Codex 앱의 모델·추론 조합이 동작한다는 증거입니다. Sol Advisor가 그 작업을 설정하고 생성하고 기다리고 읽는 전체 오케스트레이션 경로가 동작한다는 증거는 아닙니다.

Codex 앱 완전 종료와 재실행, 새 작업 생성까지 수행했지만 결과는 동일했습니다. 따라서 재시작 누락이나 기존 작업 캐시 문제가 아니라 Windows에서 v0.5.0 권한 검사가 성립하지 않는 호환성 결함으로 판정합니다.

## 재점검 순서

1. upstream 이슈 #20의 Windows ACL 인식 수정 확인
2. 수정 릴리스 또는 고정된 commit으로 플러그인 재설치
3. Codex 앱 완전 종료 후 재실행
4. 새 주 작업에서 `$sol-advisor:setup` 설정 인터뷰 완료
5. `get_setup_status=ready`와 설정 검증 확인
6. 필수 앱 작업 도구 여섯 개 확인
7. 읽기 전용 Luna · Max 표식 작업 생성·대기·읽기
8. 실제 모델·추론 강도와 저장소 무변경 확인

## 배포 게이트

이 보고서가 BLOCKED인 동안에는 가이드 라이브 배포, Instagram 게시, ManyChat 특정 게시물 연결, 별도 계정 실발송 테스트, `Go Live`를 진행하지 않습니다.
