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

