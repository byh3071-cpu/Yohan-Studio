---
id: home-featured-brief
date: 2026-05-20
tags: [content, home, featured]
---

# Home Featured 섹션 브리프 (014-P2)

> Track A가 `Featured.tsx` 또는 신규 섹션 조립 시 참고. **기존 스토어 카드 UI는 유지할지 / 3하이라이트로 교체할지** Track A 판단.

## 섹션 목표

랜딩에서 **쇼룸 · 블로그 · Lab 진단**으로 보내는 3하이라이트. 린치핀: 신뢰 → 문제 발견 → 전환.

## 블록 3개

### 1. Showroom

- **제목:** 쇼룸 — 만든 것들
- **한 줄:** 바이브코딩·Notion OS·자동화 빌드로그
- **CTA:** 쇼룸 보기 → `/showroom`
- **데이터:** `showroomProjects` featured 1~2 slug (yohan-os, yohan-studio)

### 2. Blog

- **제목:** 빌드로그
- **한 줄:** AI 1인 기업 OS를 만들며 쓰는 기록
- **CTA:** 글 읽기 → `/blog`
- **데이터:** `getPublishedPosts()` 최신 2~3 slug

### 3. Lab

- **제목:** Lab — 바이브코딩 레벨 진단
- **한 줄:** 7영역 21문항, 5분이면 약한 고리가 보인다
- **CTA:** 진단 시작 → `/lab` (또는 Track A 확정 URL)
- **보조 CTA:** 서비스 보기 → `/services`

## Hero 연동 (같은 티켓 또는 직전)

- **헤드라인:** AI 시대의 1인 기업 운영체계
- **서브:** 좋은 시스템은 나를 복제한다. 좋은 AI는 나를 확장한다.
- **Primary CTA:** Lab 진단 → `/lab`
- **Secondary CTA:** 쇼룸 → `/showroom`

## 제거·축소 후보 (014 시)

| 섹션 | 권장 |
|------|------|
| Portfolio (홈 인라인) | 쇼룸으로 대체 후 축소 또는 제거 |
| Featured (스토어 상품) | Phase 3 전까지 하단 이동 또는 3하이라이트로 교체 |
| About / Faq / Contact | 유지 |

## Claude 핸드오프

```
docs/content/home-featured-brief.md 기준으로 014 Featured 섹션 구현.
showroom·blog 데이터는 import만, 홈 page.tsx 조립.
```
