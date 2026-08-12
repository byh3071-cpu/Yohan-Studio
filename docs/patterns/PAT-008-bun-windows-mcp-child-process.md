---
id: PAT-008
패턴명: Codex Windows MCP에서 Bun의 Node 호환 자식 프로세스가 타임아웃
카테고리: mcp
증상: 일반 PowerShell에서는 빠르게 끝나는 ACL 확인 명령이 Codex Desktop이 실행한 Bun MCP에서 `execFileSync` 사용 시 자식 PowerShell을 만들지 못하고 `ETIMEDOUT`으로 실패.
원인: Codex Windows MCP 샌드박스 경계에서 Bun의 Node 호환 `node:child_process` 실행 경로와 중첩된 PowerShell 프로세스 생성이 안정적으로 연결되지 않음.
해결: Windows 시스템 PowerShell의 절대경로와 고정 인수를 유지한 채 `Bun.spawnSync`로 실행하고 stdout·stderr를 pipe 처리. timeout·signal·비정상 종료를 모두 fail-closed 오류로 변환한 뒤 실제 MCP 호출과 회귀 테스트를 함께 수행.
적용조건: Bun 기반 MCP가 Windows Codex Desktop 안에서 PowerShell 등 자식 프로세스를 실행하며, 같은 명령이 일반 터미널에서는 정상인데 MCP에서만 타임아웃될 때.
출처프로젝트: yohan-studio
태그: [bun, mcp, windows, powershell, child-process, codex-desktop]
발견일: 2026-08-13
출처DevLog: docs/devlog/2026-08-12-instagram-design-archive.md
---

# PAT-008 — Bun MCP의 Windows 자식 프로세스 경계

## 판정

- ACL 검사 내용이나 대상 폴더가 아니라 MCP 호스트 안의 자식 프로세스 실행 방식이 원인이었습니다.
- 일반 터미널 성공만으로 Codex가 실행한 MCP의 성공을 대신할 수 없습니다.

## 검증 순서

1. 동일한 절대 실행 파일·인수·환경변수로 일반 터미널 기준 시간을 측정합니다.
2. Codex MCP 안에서 실제 자식 프로세스 생성 여부와 종료 코드를 확인합니다.
3. Node 호환 실행 경로를 런타임 네이티브 실행 경로로 교체합니다.
4. timeout·signal·exit code를 구분하되 보안검사 실패는 모두 fail-closed로 처리합니다.
5. 단위 테스트와 실제 MCP 도구 호출을 모두 통과시킵니다.

## 남은 위험

여러 ACL 확인을 동시에 호출한 실험에서 일시적인 타임아웃이 한 번 관측됐습니다. 순차 호출은 3회 모두 성공했지만, 동시 자식 프로세스 실행의 안정성은 별도 회귀 테스트가 필요합니다.
