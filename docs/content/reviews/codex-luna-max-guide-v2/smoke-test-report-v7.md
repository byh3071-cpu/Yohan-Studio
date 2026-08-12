# Sol Advisor Luna · Max 스모크 테스트 보고서 v7

점검일: 2026-08-13
판정: **플러그인 전체 경로 BLOCKED**

## 확인된 항목

| 항목 | 결과 | 증거 |
| --- | --- | --- |
| Codex CLI | PASS | `codex.cmd --version` → `0.147.0` |
| Bun | PASS | 사용자 PATH 영구 등록 및 `%USERPROFILE%\.bun\bin\bun.exe --version` → `1.3.14` |
| Sol Advisor 설치 | PASS | `sol-advisor@sol-advisor` v0.5.0, installed, enabled |
| 직접 Luna · Max 요청 작업 | PASS | 별도 작업이 `SMOKE_LUNA_MAX_OK` 반환 |
| 공식 v0.5.0 설정 MCP | BLOCKED | Windows의 Bun 모드 투영 때문에 `PLUGIN_DATA must be private` 발생 |
| PR #22 격리 테스트 | PASS | 고정 커밋 `c95f6da`, MCP 테스트 34개 PASS / 0 FAIL |
| PR #22 실제 Codex 데이터 폴더 연결 | BLOCKED | `get_setup_status`가 소유자 검사에서 거부됨 |
| Sol Advisor Luna task lane E2E | BLOCKED | 설정 MCP가 준비되지 않아 fail-closed 계약 적용 |

## 1차 근본 원인: Bun의 Windows 모드 투영

공식 v0.5.0은 `PLUGIN_DATA`의 POSIX 권한 비트를 검사합니다. Bun 1.3.14는 Windows의 제한된 폴더도 `0666`으로 투영해 정상 폴더를 거부합니다.

- 공개 이슈: https://github.com/DannyMac180/sol-advisor/issues/20
- Windows ACL 수정 PR: https://github.com/DannyMac180/sol-advisor/pull/22

## PR #22 재검증

PR #22의 헤드 커밋 `c95f6da66f3c3d71dd807a2e1e92c0896da13477`을 임시 폴더에 고정해 검증했습니다.

- 변경 파일: 5개, 273줄 추가·39줄 삭제
- 정적 검토: 경로는 PowerShell 코드 문자열에 삽입하지 않고 프로세스 환경변수로 전달
- 권한 정책: 정확한 로컬 `CodexSandboxUsers` SID만 조회하고 읽기·실행 범위를 넘으면 차단
- 로컬 Windows MCP 테스트: 34 PASS, 0 FAIL, 177 assertions

자체 테스트만 보면 기존 `0666` 오판은 해결됩니다. 그러나 실제 Codex Desktop 데이터 폴더에 연결하면 새로운 호스트 호환성 충돌이 발생합니다.

## 실제 Codex Desktop 반례

현재 Codex Desktop의 실행·데이터 경계는 다음과 같습니다.

| 관측값 | 실제 값 |
| --- | --- |
| MCP 실행 계정 | `CodexSandboxOnline` |
| 플러그인 데이터 폴더 소유자 | Windows 로그인 사용자 |
| `CodexSandboxUsers` 권한 | `Modify, Synchronize` |
| PR #22의 소유자 전제 | 현재 실행 계정, SYSTEM 또는 Administrators |
| PR #22의 Sandbox 그룹 전제 | 읽기·실행만 허용 |

따라서 PR #22 서버를 실제 `PLUGIN_DATA`에 연결한 `get_setup_status` 호출은 `owner is outside the approved Windows principals`로 실패합니다. 소유자 허용 목록을 넓혀도 실제 Sandbox 그룹에 필요한 `Modify` 권한이 다음 검사에서 다시 거부됩니다.

이는 권한 검사를 단순 제거해서 해결할 문제가 아닙니다. Sol Advisor의 개인정보 보호 경계와 Codex Desktop의 쓰기 가능한 플러그인 데이터 계약을 함께 정의한 upstream 수정이 필요합니다.

## 결론

PR #22는 보안검사를 우회하는 패치가 아니며 자체 테스트 품질도 확인됐습니다. 그러나 현재 Yohan Studio Windows 호스트의 실제 플러그인 데이터 계약과 호환되지 않으므로 전역 적용하지 않습니다. [확신 높음]

## 재점검 순서

1. 이슈 #20과 PR #22에서 Codex Desktop 실행 계정·`Modify` ACL 호환성 반영 여부 확인
2. maintainer가 승인한 수정 릴리스 또는 고정 커밋 확인
3. 실제 `PLUGIN_DATA`로 `get_setup_status=ready` 확인
4. 새 작업에서 설정 인터뷰와 `validate_configuration` 통과
5. 필수 앱 작업 도구 여섯 개 확인
6. 읽기 전용 Luna · Max 표식 작업 생성·대기·읽기
7. 저장소 무변경과 실제 모델·추론 강도 확인

## 배포 게이트

이 보고서가 BLOCKED인 동안에는 가이드 라이브 배포, Instagram 게시, ManyChat 특정 게시물 연결, 별도 계정 실발송 테스트, `Go Live`를 진행하지 않습니다.
