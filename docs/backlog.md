# 백로그

즉시 착수하지 않지만 잊으면 안 되는 항목. 위에서부터 append-only, 처리되면 `상태`만 갱신한다.

| ID | 항목 | 상태 | 메모 |
|---|---|---|---|
| BL-1 | `/updates`·`/blog`·`/showroom` 목록이 초기 HTML에 0건 (CSR 폴백) | **승격됨 → SEO 프로그램 G1** | SEO 최우선 항목이라 백로그에 둘 수 없음. 근거: `docs/ssr-seo-report.html` |
| BL-2 | CLAUDE.md 기술스택 표기 정정 | 대기 | `@vercel/og` → `next/og` 내장(패키지 미설치). `next-sitemap` 미사용 → 네이티브 `src/app/sitemap.ts`. SEO 프로그램 G3-T6과 함께 처리하면 효율적 |
| BL-3 | 네이버 Yeti의 JS 렌더링 지원 여부 재조사 | 대기 | `searchadvisor.naver.com`이 크롤 차단이라 1차 출처 확인 실패. **단 G1 완료 시 실익 소멸** — HTML에 본문이 실리면 Yeti의 JS 지원 여부와 무관해짐 |
| BL-4 | 초기 JS 감량 범위 결정 (성능 vs 기능) | **요한 결정 대기** | 실측 초기 JS **334KB(압축 후)** — Next 기본 대비 3배 이상. 유력 기여자가 AI 챗봇·TTS·Sentry라 감량이 곧 기능 축소일 수 있음. 티켓은 `docs/seo/PROGRAM.md` G5-T6 |
| BL-5 | 콘텐츠 전략·키워드 (G8) 신설 여부 | **해소 (2026-07-28) → G8 신설 확정** | GSC 실측: 3개월 클릭 0 · 검색어 2개 전부 브랜드명 · **비브랜드 0개**. 티켓은 `docs/seo/PROGRAM.md` G8 |
| BL-6 | 네이버 서치어드바이저 RSS·사이트맵 제출 상태 확인 | 대기 | 구글 sitemap은 성공(발견 30) 확인됨. 네이버는 미확인 → G5-T2 |
| BL-7 | CLAUDE.md는 pnpm이라 적혀 있으나 실제 락파일은 `package-lock.json`(npm). CI도 `npm ci` | 대기 | 워크트리·신규 워크플로 작성 시 걸릴 불일치. BL-2(CLAUDE.md 정정)와 함께 처리 |

---

## 기록 규칙
- 새 항목은 표 하단에 append. ID는 `BL-{다음번호}`.
- Goal로 승격되면 지우지 말고 `상태`에 승격 대상을 적는다(추적 끊김 방지).
- 처리 완료 시 `상태` = `완료 (YYYY-MM-DD, PR #N)`.

## 관련 문서
- SEO 프로그램 전체: `docs/seo/PROGRAM.md`
- SSR/SEO 조사 보고서: `docs/ssr-seo-report.html`
