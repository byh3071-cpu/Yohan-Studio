---
id: decision-showroom-vs-portfolio
date: 2026-05-20
tags: [decision, routing, seo]
---

# 결정: /portfolio vs /showroom

## 컨텍스트

- Phase 1: `/portfolio` + 홈 인라인 Portfolio 섹션
- Phase 2 (011): `/showroom` — 프로젝트 카드·카테고리·Featured(무진장 슬롯)
- 헤더 nav: 현재 **쇼룸** + **포트폴리오** 둘 다 존재 가능

## 옵션

| | A (추천) | B |
|---|----------|---|
| nav | 쇼룸만 강조 | 쇼룸만, portfolio 제거 |
| /portfolio | 유지 (레거시) | `/showroom`으로 308 redirect |
| /showroom | 신규 canonical | 동일 |
| SEO | portfolio는 noindex 또는 유지 후 점진 폐기 | 단일 URL |

## 결정

- **상태:** Proposed — 백요한 확인 전
- **추천:** **옵션 A** — `/portfolio` 유지, nav는 쇼룸 우선, 014에서 홈 Portfolio 섹션은 쇼룸 프리뷰로 대체

## 결과 (채울 것)

- 결정일:
- GSC URL 변경 제출 여부:
