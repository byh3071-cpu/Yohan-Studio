# 아침 보고 — 무인 결함루프 (yohan-studio, 2026-07-28 밤 run)

엔진 `overnight-autoloop` v0.3.8 · 21 에이전트 · 8시간 20분 · 에러 0
시드: SEO 프로그램 티켓 5건 수동 주입(`docs/seo/PROGRAM.md` 명세 SoT)
관련: `docs/seo/PROGRAM.md` · `docs/seo/baseline-2026-07-28.md`

---

## 결론 먼저

- **PR 5건 전부 머지 권고.** 적대검증 blocker 0, GitHub `MERGEABLE/CLEAN`, build·Vercel pass.
- **머지 순서 지킬 것: #87 → #89 → #90 → #91 → #88.** #88이 나머지 셋과 같은 파일 3개를 건드린다.
- **park 0건 · 동기화 실패 0건 · 밤중 머지 0건**(계약대로).
- **미시도 15건 대기열.** 이 중 결제·보안 계열은 CLAUDE.md 하드 트리거상 사람 게이트(L) 대상이라 무인 처리 부적합 — 루프가 안 건드린 게 규칙상 맞다.

---

## 1. PR별 머지 권고

| PR | 브랜치 | 티켓 | 파일 | 상태 | 권고 |
|---|---|---|---|---|---|
| [#87](https://github.com/byh3071-cpu/yohan-studio/pull/87) | `auto-fix/yoha-1-sitemap-lastmod` | G2-T1 sitemap lastmod | 2 (+33/-15) | MERGEABLE/CLEAN | **머지 (1순위)** |
| [#89](https://github.com/byh3071-cpu/yohan-studio/pull/89) | `auto-fix/yoha-3-updates-html-0-html` | G1-T2 `/updates` CSR | 2 (+81/-1) | MERGEABLE/CLEAN | **머지 (2순위)** |
| [#90](https://github.com/byh3071-cpu/yohan-studio/pull/90) | `auto-fix/yoha-4-blog-html-0` | G1-T3 `/blog` CSR | 2 (+97/-1) | MERGEABLE/CLEAN | **머지 (3순위)** |
| [#91](https://github.com/byh3071-cpu/yohan-studio/pull/91) | `auto-fix/yoha-5-showroom-html-1-8` | G1-T4 `/showroom` CSR | 3 (+65/-2) | MERGEABLE/CLEAN | **머지 (4순위, 주의 1건)** |
| [#88](https://github.com/byh3071-cpu/yohan-studio/pull/88) | `auto-fix/yoha-2-canonical-blog-updates-showr` | G1-T1a canonical 추가 | 7 (+39/-0) | MERGEABLE/CLEAN | **머지 (마지막)** |

배칭 없음 — 5건 모두 `defects=1`, 1브랜치=1결함. **전부 1회 시도로 통과**(`attempts=1`).

### DoD 충족 실측 (엔진 검증 로그 기준)

| PR | 결함 해소 실증 |
|---|---|
| #87 | 빌드 산출 sitemap에 오늘 날짜 lastmod **0건**. `<loc>` 30개 유지, lastmod 21개(글11+쇼룸7+목록3)로 산식 일치. `updated` 주입/원복 양방향 실증 |
| #89 | `updates.html`에 `<article>` 5개 · 버전 문자열 **4종** 실림(수정 전 0). `next start` 실응답에서도 동일 |
| #90 | `blog.html`에 `/blog/<slug>` 고유 링크 **11개**(수정 전 0) |
| #91 | `showroom.html`에 article 8개 · 고유 슬러그 링크 **8개**(수정 전 1). snapcontext 상세가 404→정상 |
| #88 | 빌드 HTML canonical 실측: index=`/`, blog=`/blog`, updates=`/updates`, showroom=`/showroom`. `/store/checkout/success` noindex 유지 확인 |

### 명세 준수 검증 (사람 재확인, 2026-07-28 아침)

시드에 박은 금지 조항이 지켜졌는지 파일 목록으로 대조했다.

| 지시 | 결과 |
|---|---|
| #88은 `layout.tsx` 를 건드리지 말 것 (T1a=순수 가산) | ✅ 변경 파일 7개에 `layout.tsx` **없음** |
| #89는 `UpdatesFeed.tsx` 수정 금지 | ✅ 변경 = `updates/page.tsx` + 신규 `StaticUpdatesList.tsx` |
| #90은 `TagFilter.tsx` 수정 금지 | ✅ 변경 = `blog/page.tsx` + 신규 `StaticPostList.tsx` |
| #91은 `ProjectGrid.tsx` 수정 금지 | ✅ 변경 = `showroom/page.tsx` + 신규 `StaticProjectGrid.tsx` + (범위 밖 1건, 아래) |
| 밤중 머지 0 | ✅ master = `2404d4f` 그대로, 트리 clean |

### 주의 1건 — #91의 범위 밖 파일

`src/content/showroom/snapcontext.mdx` 가 함께 들어갔다. 목록에서 snapcontext 가 파싱 null 로 빠지고 상세가 404 였던 라이브 결함이라 동봉이 정당하다고 검증에서 판단했다. 다만 "1PR=1결함" 원칙에서는 실질 2건이니 인지하고 승인할 것.

---

## 2. 머지 순서 — 파일 충돌 지도

| 파일 | 건드리는 PR |
|---|---|
| `src/app/blog/page.tsx` | **#88**, #90 |
| `src/app/updates/page.tsx` | **#88**, #89 |
| `src/app/showroom/page.tsx` | **#88**, #91 |
| `src/app/sitemap.ts` · `src/lib/blog.ts` | #87 (단독) |

GitHub은 5건 다 `MERGEABLE` 로 보고하지만 그건 **각각 현재 master 대비** 판정이다. 하나를 머지하면 겹치는 쪽은 재평가된다.

#88은 파일 상단 `metadata` export 추가, #89·#90·#91은 JSX 본문 fallback 추가라 자동 병합될 가능성이 높다 [추론]. **#88을 마지막에** 두면 최악의 경우 rebase 1회(39줄 추가, 로직 0)로 끝난다. 먼저 넣으면 3개를 각각 rebase해야 할 수 있다.

**전부 머지 후 확인 1줄**: sitemap `<loc>` 수가 **31**(기존 30 + #91의 snapcontext 1)인지.

---

## 3. park · 동기화

**park 0건.** 5건 전부 첫 시도에 push+PR 도달, `parkReason` 비어 있음.
**동기화 실패 0건.** 단일 레포(yohan-studio) run.

---

## 4. 미시도 발굴목록 (15건 — 손 안 댐)

엔진이 자체 감사로 새로 찾은 것들. 원문 15건 중 3쌍이 중복이라 실질 고유 **12건**.

| # | 결함 | 심각도 | 비고 |
|---|---|---|---|
| 1 | `/api/checkout` 에 `STORE_SALES_ENABLED` 서버 게이트 없음 — 판매 중지인데 실결제 세션 발급 | **high** | #3과 중복 |
| 2 | Stripe 웹훅 upsert의 conflict target 불일치 → unique 위반으로 결제 기록 유실 | **high** | |
| 4 | `DiagnosisForm` 이 useState 초기화에서 localStorage 읽음 → hydration 불일치 | med | |
| 5 | 블로그 frontmatter `date` 형식 미검증 → sitemap RangeError | med | **#87 머지 시 실피해 소멸**(NaN 가드). 입력 검증 자체는 여전히 없음 |
| 6 | 스토어 DB 0행이면 프로덕션에도 가짜 상품 3건(49,000원) 노출 + 링크 404 | med | #11과 중복 |
| 7 | `/api/contact` 레이트리밋 부재 — 무제한 DB 적재 + Resend 발송 | med | chat·tts엔 있는 표준이 여기만 누락 |
| 8 | 레이트리밋 버킷 Map이 만료 엔트리 미정리 → 무한 증가 | med | chat·tts 공통 |
| 9 | 챗봇 스토어 컨텍스트가 에러 삼키고 빈 결과를 10분 캐시 | med | 장애가 관측조차 안 됨 |
| 10 | `naver-to-html`: 해시태그 줄이 문단에 붙으면 본문 출력 + 태그 추출 실패 | low | 실행 출력으로 재현됨 |
| 12 | 스캐폴드 스크립트 날짜가 UTC — KST 00~09시 실행 시 전날 날짜 박힘 | low | |
| 13 | 정렬 비교자가 동률에 0을 안 반환 — 같은 날짜 2건이면 순서 비결정적 | low | `updates.ts` 는 이미 tie-break 구현 |
| 14 | 결제 완료 페이지가 보내지도 않는 "영수증·다운로드 메일 발송" 단정 | low | #15와 중복 |

**미시도 사유**: `capPRs=5` 로 잘랐기 때문. 시드 5건이 severity high + carried-first 로 큐 앞을 차지해 의도대로 동작했다.

⚠️ **#1·#2·#3(결제·킬스위치·웹훅)은 CLAUDE.md 하드 트리거상 "인증/결제/보안 = 무조건 L(사람 게이트)"** 이다. 무인 루프가 손대지 않은 게 규칙상 맞다. 낮에 사람 승인 붙여서 처리할 것.

**낮 우선순위 제안**: ① #1 킬스위치(`route.ts` 4줄 가드 — **판매 중지 상태에서 실결제가 성립하는 게 지금 가장 실피해 큼**) → ② #2 웹훅 upsert → ③ #7·#8 레이트리밋 묶어서 1PR → ④ 나머지 low 묶음.

---

## 5. 이월 상태

- 저장 성공: `yohan-brain/docs/audits/overnight-deferred-studio.json` (`savedAt: 2026-07-28-night`, defects **15건**)
- 시드 5건은 시도됐으므로 대기열에서 제거됨 — 설계대로 동작
- **기존 22건 대기열(yohan-mcp·control-tower)은 별도 파일이라 무사**

---

## 6. 엔진 이슈 2건 (기록용)

| # | 이슈 |
|---|---|
| E1 | **집계 불일치** — 루프 보고 `전체 발굴=23` vs 실제 목록 합 20(해결 5 + 미시도 15). 3건 행방 불명. 카운터 버그 의심 |
| E2 | 이월 JSON이 BOM 없는 UTF-8이라 PowerShell 5.1 기본 읽기로 한글이 깨져 `ConvertFrom-Json` 실패. 다음 run 파서는 `-Encoding utf8` 명시 필요 |

---

## 7. 후속 권고 (머지 후)

| 우선 | 항목 | 근거 |
|---|---|---|
| 1 | **JS 없는 초기 HTML 회귀 가드 1개**(blog·updates·showroom 3라우트 동시 커버) | #89·#90·#91이 전부 같은 원인(CSR 바일아웃). **현 Playwright 스펙은 JS 켜진 상태라 초기 HTML 백지를 못 잡는다** — 재발 시 또 못 잡는다. `PROGRAM.md` G1-T5 |
| 2 | learning-log 상세 canonical의 raw param 정규화(32hex/UUID/대소문자 통합) | #88의 반쪽 수정. `stripHyphens` 한 줄 |
| 3 | `/blog` 목록 lastmod가 `updated` 를 무시 + `ArticleJsonLd` `dateModified` 미배선 | #87 커밋 자체 원칙과 모순. sitemap과 JSON-LD가 서로 다른 수정일을 내보냄 |
| 4 | showroom 파싱 실패의 무음 null 드롭 근본 원인 | #91은 증상(snapcontext 1건)만 고쳤다. 다음 글이 또 조용히 사라질 수 있음 |
| 5 | updates fallback의 스타일 상수 복제 드리프트 정리 | #89 |
| 6 | RSS `alternate` 상속 소실(updates·showroom) | #88 부작용, 비차단 |
| 7 | 발굴 파이프라인 중복 제거(evidence 경로 기준) + 발굴 카운터 검증 | 15건 중 3쌍 중복, 총계 23↔20 불일치 |

---

## 8. 머지 후 즉시 확인 (라이브)

전부 머지 + Vercel 배포 완료 후 실행. `docs/seo/baseline-2026-07-28.md` 의 수치와 대조한다.

```bash
curl -sL https://yohanstudio.co/blog     | grep -o 'href="/blog/[a-z0-9-]*"'      | sort -u | wc -l   # 0  → 11 기대
curl -sL https://yohanstudio.co/updates  | grep -oE '[0-9]+\.[0-9]+\.[0-9]+'      | sort -u | wc -l   # 0  → 4↑ 기대
curl -sL https://yohanstudio.co/showroom | grep -o 'href="/showroom/[a-z0-9-]*"'  | sort -u | wc -l   # 1  → 8↑ 기대
for p in blog updates showroom; do curl -sL "https://yohanstudio.co/$p" | grep -o '<link rel="canonical"[^>]*>'; done  # 전부 홈 → 각자 자기 URL 기대
curl -s https://yohanstudio.co/sitemap.xml | grep -c '<loc>'   # 30 → 31 기대
```

2~4주 뒤 GSC 재측정 지표는 `docs/seo/baseline-2026-07-28.md` §F 참조.
