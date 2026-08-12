# Sol Advisor Luna · Max 스모크 테스트 보고서 v8

점검일: 2026-08-13
판정: **설정 계층 PASS · 공식 Windows 배포 BLOCKED · Luna 작업 경로 BLOCKED**

## 확인 결과

| 항목 | 결과 | 증거 |
| --- | --- | --- |
| Codex CLI | PASS | `codex.cmd --version` → `0.147.0` |
| Bun | PASS | 사용자 PATH 등록, Bun `1.3.14` |
| Sol Advisor 설치 | PASS | `sol-advisor@sol-advisor` v0.5.0, enabled |
| 공식 v0.5.0 Windows 설정 | BLOCKED | 공개 이슈 #20이 열려 있으며 공식 `main`은 POSIX 모드 검사 사용 |
| PR #22 기반 로컬 수정본 테스트 | PASS | MCP 테스트 35개 PASS, 0 FAIL, 184 assertions |
| 로컬 수정본 설정 상태 | PASS | `get_setup_status` → `ready` |
| 로컬 수정본 설정 저장·읽기 | PASS | 전역 논리 설정 저장, 순차 읽기 3회 성공 |
| 로컬 수정본 구성 검증 | PASS | `validate_configuration` → `valid: true`, warnings 0 |
| Codex 앱 프로젝트 조회 | PASS | `list_projects` 0.9초 |
| Luna 필수 앱 도구 | BLOCKED | 6개 중 5개 노출, `wait_threads` 없음 |
| Sol Advisor Luna · Max E2E | BLOCKED | 계약상 필수 도구 누락 시 대체 없이 중단 |

## 공식판과 로컬 검증본의 차이

공식 Sol Advisor v0.5.0은 Windows에서 Bun이 제한된 폴더도 POSIX 모드 `0666`으로 투영하는 문제 때문에 설정을 시작하지 못합니다.

- 공개 이슈: https://github.com/DannyMac180/sol-advisor/issues/20
- Windows ACL 수정 PR: https://github.com/DannyMac180/sol-advisor/pull/22

2026-08-13 현재 이슈와 PR은 모두 열려 있습니다. 따라서 공식 설치 명령이 Windows에서 정상 작동한다고 안내할 수 없습니다.

Yohan 로컬 브랜치는 PR #22의 `c95f6da`를 기반으로 Codex Desktop의 플러그인 데이터 ACL 계약과 Windows MCP 자식 프로세스 실행을 보완했습니다.

- 호스트 ACL 경계 수정: `4f412b6`
- Bun `spawnSync` 전환: `e116ecc`
- 로컬 MCP 테스트: 35 PASS, 0 FAIL, 184 assertions

이 수정본에서는 전역 논리 설정이 다음 값으로 유지됐습니다.

- routine: `gpt-5.6-terra` / `medium`
- high: `gpt-5.6-terra` / `high`
- advisor: `gpt-5.6-sol` / `high` / read-only
- app task lane: `gpt-5.6-luna` / `max`
- fallback: fail-closed

## 재시작 뒤 실제 호출

`get_setup_status`는 `ready`, `validate_configuration`은 `valid: true`를 반환했습니다. `get_preferences` 순차 호출도 3회 모두 성공했습니다.

세 설정 도구를 동시에 호출한 실험에서는 한 번 `PLUGIN_DATA ACL could not be verified (ETIMEDOUT)`이 발생했습니다. 순차 재검증은 모두 통과했으므로 설정 데이터 손상은 아니며, Windows MCP의 동시 PowerShell 자식 프로세스 경합 가능성을 남은 안정성 위험으로 기록합니다. [확신 중간]

## Luna 작업 경로 차단 원인

Sol Advisor v0.5 계약은 다음 앱 도구 여섯 개를 모두 요구합니다.

1. `list_projects`
2. `list_threads`
3. `create_thread`
4. `wait_threads`
5. `read_thread`
6. `send_message_to_thread`

현재 Codex 호스트에는 `wait_threads`만 노출되지 않았습니다. 계약은 필수 도구가 하나라도 없으면 Luna 대신 다른 모델이나 Native 경로로 자동 대체하지 않고 중단하도록 규정합니다.

따라서 별도 Luna 작업을 생성하지 않았고, `gpt-5.6-luna`와 `max`가 실제 반환 메타데이터에 기록됐다고 주장하지 않습니다.

## 배포 판정

- Windows 공식 설치 가이드 공개: BLOCKED
- 카드뉴스 게시: BLOCKED
- ManyChat 특정 게시물 연결: BLOCKED
- 별도 계정 실발송: BLOCKED
- ManyChat `Go Live`: BLOCKED

해제 조건은 공식 Windows 수정본 확정, 앱 필수 도구 6/6 노출, 읽기 전용 Luna · Max 작업의 생성·대기·읽기 성공, 저장소 무변경 확인입니다.
