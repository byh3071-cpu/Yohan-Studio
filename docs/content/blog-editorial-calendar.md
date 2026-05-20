---
id: blog-editorial-calendar
date: 2026-05-20
tags: [content, blog, editorial]
---

# 블로그 에디토리얼 캘린더 (초안)

> Track B `content/blog-*` 브랜치에서 MDX 작성 시 제목·태그 참고.

| 주차 | slug (안) | title | tags | category |
|------|-----------|-------|------|----------|
| W1 | `aim-os-intro` | AI'm OS란 무엇인가 — 1인 기업 운영체계 | vibe-coding, aim-os | Build Log |
| W2 | `showroom-launch` | 쇼룸을 열었다 — 프로젝트를 신뢰 자산으로 | showroom, nextjs | Build Log |
| W3 | `lab-diagnosis-v0` | Lab 진단룸 v0 — 21문항으로 약한 고리 찾기 | lab, product | AI Workflow |
| W4 | `vibe-coding-levels` | 바이브코딩 5레벨 — Explorer에서 OS Owner까지 | vibe-coding | Vibe Coding |
| W5 | `services-pricing-why` | 서비스 가격을 이렇게 잡은 이유 | services, solo | Monetize |

## MDX frontmatter 템플릿

```yaml
title: ""
description: ""
date: 2026-05-XX
tags: []
category: Build Log
thumbnail: ""
published: false
```

## GEO (007 갭 — aim-os 머지 후 별도 티켓)

- 상단 TL;DR 40~70단어 (`tldr` frontmatter 또는 TldrBlock)
- 하단 FAQ 3~5개 (`faq` frontmatter)
- H2를 질문형으로 (`## 왜 쇼룸인가?`)
