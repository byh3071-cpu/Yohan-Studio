# 2026-08-21 · 인스타 레인(L4) 미머지 브랜치 3개 정리

인계 카드 `yohan-brain/docs/handoffs/2026-08-20-codex-rescue/L4-instagram.md` 의 "AI 몫 = 미머지 브랜치 3개 정리" 실행 기록.

## 처리 결과

| 브랜치 | 판정 근거 | 처리 |
|---|---|---|
| `docs/sol-advisor-luna-max-guide` | master 와 파일 차이 **0줄** — 내용이 `9bfebca` 로 이미 발행됨. worktree 미커밋 **0** | 폐기 (worktree 제거 + 브랜치 삭제) |
| `docs/birthday-usagi-campaign` | 충돌 예측 **0** | `ad038dc` 로 머지 |
| `docs/instagram-design-archive` | add/add 충돌 2건 + PAT 채번 중복 | 해소 후 `df1ca68` 로 머지 |

## 판단이 갈렸던 지점

**Luna Max 가이드 — 어느 쪽이 최신인가**

두 브랜치가 같은 파일을 각자 만들어 add/add 충돌이 났다. 커밋 날짜로 판정했다.

| 출처 | 날짜 | 특징 |
|---|---|---|
| master `9bfebca` | 2026-08-14 | 발행본. `Image` 오빗 아트·LUNA 배지 포함 |
| 브랜치 `7d3a684` | 2026-08-13 | 이전 버전 |

→ **master(ours) 채택.** 라이브 발행본을 구버전으로 덮지 않기 위함.

**tests/qa.spec.ts — 자동 머지 결과 검증**

양쪽 다 ROUTES 에 `/guides/luna-max` 를 추가했고, master 만 HTTP 5xx 응답 수집을 추가했다. master 가 상위집합이라 자동 머지가 맞게 동작했는지 사후 확인했다.

- `response.status() >= 500` 수집 코드 잔존: 확인
- `/guides/luna-max` 라우트 잔존: 확인

**PAT 채번 충돌**

master 가 `PAT-007-next-dev-build-output-collision` 을 선점한 상태에서 브랜치가 자체 PAT-007·008 을 들고 왔다. 뒤에서부터 밀어 재채번했다.

| 이전 | 이후 |
|---|---|
| `PAT-007-turbopack-worktree-junction` | `PAT-008-turbopack-worktree-junction` |
| `PAT-008-bun-windows-mcp-child-process` | `PAT-009-bun-windows-mcp-child-process` |

frontmatter `id:` 와 참조 문서 2건(`docs/content/reviews/codex-luna-max-guide-v2/web-preview/validation-report.md`, `docs/devlog/2026-08-12-instagram-design-archive.md`) 동시 갱신. 최종 채번 PAT-001~009 연속.

## 검증 (머지 커밋 전 실행)

| 검사 | 결과 |
|---|---|
| `npm run typecheck` | 통과 (오류 0) |
| `npm run lint` | 0 errors / 12 warnings (기존 10 + 신규 스킬 1 + 기타 1) |
| `npm run build` | 성공 — 전 라우트 프리렌더 |
| `npm run test:archive-design` | 4 pass / 0 fail |

## 되돌리는 법

정리 직전 상태를 태그로 고정해 두었다.

```
backup/master-before-cleanup-20260821          master 정리 전
backup/sol-advisor-luna-max-guide-20260821     폐기한 브랜치 tip
backup/birthday-usagi-campaign-20260821        머지 전 tip
backup/instagram-design-archive-20260821       머지 전 tip
```

브랜치를 되살리려면 `git branch <이름> <태그>` 로 복구한다.

## 남은 것 (사람 몫)

- `git push origin master` — 머지 2건이 로컬에만 있다
- 원격 `origin/docs/instagram-design-archive` 삭제 여부
- 신규 블로그 2편이 `published: false` 초안 상태 — 발행 결정
- `docs/content/exports/birthday-app-for-one-friend/` 미추적 3파일 `.gitignore` 등록
- 릴스 B1 실물 촬영
