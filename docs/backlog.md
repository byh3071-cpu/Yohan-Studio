# 백로그

즉시 착수하지 않지만 잊으면 안 되는 항목. 위에서부터 append-only, 처리되면 `상태`만 갱신한다.

| ID | 항목 | 상태 | 메모 |
|---|---|---|---|
| BL-1 | `/updates`·`/blog`·`/showroom` 목록이 초기 HTML에 0건 (CSR 폴백) | **승격됨 → SEO 프로그램 G1** | SEO 최우선 항목이라 백로그에 둘 수 없음. 근거: `docs/ssr-seo-report.html` |
| BL-2 | CLAUDE.md 기술스택 표기 정정 | 대기 | `@vercel/og` → `next/og` 내장(패키지 미설치). `next-sitemap` 미사용 → 네이티브 `src/app/sitemap.ts`. SEO 프로그램 G3-T6과 함께 처리하면 효율적 |
| BL-3 | 네이버 Yeti의 JS 렌더링 지원 여부 재조사 | 대기 | `searchadvisor.naver.com`이 크롤 차단이라 1차 출처 확인 실패. **단 G1 완료 시 실익 소멸** — HTML에 본문이 실리면 Yeti의 JS 지원 여부와 무관해짐 |

---

## 기록 규칙
- 새 항목은 표 하단에 append. ID는 `BL-{다음번호}`.
- Goal로 승격되면 지우지 말고 `상태`에 승격 대상을 적는다(추적 끊김 방지).
- 처리 완료 시 `상태` = `완료 (YYYY-MM-DD, PR #N)`.

## 관련 문서
- SEO 프로그램 전체: `docs/seo/PROGRAM.md`
- SSR/SEO 조사 보고서: `docs/ssr-seo-report.html`
