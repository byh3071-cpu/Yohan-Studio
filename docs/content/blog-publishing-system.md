# Yohan Studio 블로그 이중 발행 시스템

## 기준

웹 MDX가 사실, 수치, 링크, 이미지 경로의 기준 원본이다. 네이버 글은 같은 내용을 독립된 평문으로 다시 편집한다.

| 채널 | 파일 | 역할 |
|---|---|---|
| Yohan Studio | `src/content/blog/<slug>.mdx` | 검색, 내부 링크, 코드, 구조화된 이미지가 포함된 원본 |
| 네이버 블로그 | `docs/content/naver/<slug>.txt` | 노뚝이가 네이버 편집기에 복사하고 이미지를 배치하는 원고 |
| 작성 규칙 | `skills/yohan-dual-blog/SKILL.md` | 두 원고를 함께 작성·검수하는 절차 |

## 새 글 작성

1. `skills/yohan-dual-blog/assets/web-post.mdx`로 웹 초안을 만든다.
2. 수치, 명령어, 실제 이미지와 내부 링크를 검증한다.
3. `skills/yohan-dual-blog/assets/naver-post.txt` 구조로 네이버 원고를 만든다.
4. 두 글의 버전, 테스트 개수, 날짜, 링크가 일치하는지 확인한다.
5. 웹은 `pnpm build`, 네이버는 평문 미리보기로 문단과 이미지 위치를 확인한다.

## 네이버 발행 — 요한 표준 워크플로 v2 (2026-07-20 인터뷰 확정)

절차 SoT = naver-convert 스킬(yohan-cc-skills). 요약:

1. **자동 선제**: 웹 글 라이브 검증 통과 → 그 세션에서 즉시 시작 (허브 중복 조회 후). 자동 대상은 네이버만 — 나머지 채널 export는 수동.
2. 원고 자동 변환(격식·이미지 URL 포함) + **진솔 슬롯은 채팅으로 질문해 반영**.
3. `pnpm naver -- <slug> --step preview` → 미리보기 브라우저 승인.
4. `--step inject` (게이트: 슬롯 잔존·이미지 HEAD 200) → 실브라우저 주입(제목+본문+이미지). 기존 본문이 내 주입본과 다르면 **묻는다**.
5. 발행 패널 열기 + 태그 자동 입력 + 설정창 스크린샷 보고.
6. **최종 발행 클릭만 사람** (2차 버튼 자동 클릭 금지).
7. URL 회신 → 풀 검증 + 콘텐츠 허브·Dev Log 기록.
8. 실패 시 2회 재시도 → 대안 보고. 우회 발견 시 파이프라인 역전파.

- 이미지: `.md` 마커에 라이브 URL(`[이미지 삽입: 설명 | https://yohanstudio.co/...]`) → **붙여넣기만으로 SE 이미지 컴포넌트 자동 삽입** (에디터 실측). 수동 삽입 불필요.
- 격식(구분선·19px 섹션 제목·여백 리듬·해시태그 분리)은 변환기가 자동 — SoT는 실발행 글.

## 기존 MDX에서 네이버 초안 만들기

```powershell
pnpm blog:naver -- vhk-npm-cli-launch
```

생성 파일:

```text
docs/content/naver/vhk-npm-cli-launch.txt
```

자동 변환기는 frontmatter와 MDX 문법을 제거하고 이미지 위치를 표시한다. 자동 생성된 문장은 발행본이 아니다. 짧은 문단, 기술 용어 설명, 링크 중복, 이미지 앞 설명을 사람이 다시 다듬어야 한다.

## 노뚝이 발행 순서

1. `docs/content/naver/<slug>.txt`에서 제목을 네이버 제목 칸에 붙인다.
2. `본문` 아래 내용을 붙인다.
3. `[이미지 삽입: ...]` 위치에 실제 이미지를 넣고 표시자는 지운다.
4. 원문·npm·GitHub 링크가 실제로 열리는지 확인한다.
5. 마지막 해시태그 5~8개를 등록한다.
6. 발행 후 네이버 URL을 웹 글이나 Dev Log에 기록한다.

## 색인 자동 제출 (2026-07-28 가동 — ADR-005)

**사람이 할 일: 0개.** 콘텐츠(.mdx)가 master 에 머지되면 GitHub Actions(`seo-indexnow.yml`)가:

1. 변경 URL 산출 (git diff → blog/updates/showroom 매핑)
2. 라이브 sitemap 폴링(최대 10분)으로 배포 반영 확인 — `published: true` 전환도 여기서 자동 감지
3. IndexNow 배치 제출 → **Bing·네이버·Yandex 등 전 참여 엔진에 공유**

구글은 IndexNow 미참여 — sitemap `lastmod`(발행일/`updated` 필드)가 담당한다. 글을 **수정**했으면 frontmatter 에 `updated: "YYYY-MM-DD"` 를 넣어야 구글이 재크롤 신호를 받는다.

실패 시(Actions 빨간 X) 수동 복구:

```
npm run seo:ping -- --urls https://yohanstudio.co/blog/<slug>
```

제출 확인 창구: **Bing Webmaster Tools → IndexNow 로그** (네이버는 받기만 하고 로그를 안 보여줌).

## 품질 기준

- 결과가 첫 5줄 안에 나온다.
- 성공뿐 아니라 실제 실패, 원인, 해결이 있다.
- 이미지는 앞 문장의 증거이며 핵심 글자가 선명하다.
- 같은 수치와 링크가 채널마다 달라지지 않는다.
- 반복 CTA와 과도한 감정 표현을 줄인다.
- 질문형 제목 바로 아래에 답부터 쓴다.

## 커버 이미지 (2026-07-19 도입)

```powershell
pnpm blog:cover -- <slug> "<영문 컨셉 1~3문장>"
```

- `public/images/blog/<slug>/cover.png` 생성 → frontmatter `thumbnail`에 연결.
- 시리즈 톤(다크 차콜+오렌지 소프트 브루탈리즘, 텍스트 없음)은 `scripts/gen-cover.mjs`에 고정 — 컨셉 문장만 글마다 바꾼다.
- 모델 기본 `gpt-image-2` (API 실조회로 확인, `OPENAI_IMAGE_MODEL`로 재정의). `OPENAI_API_KEY` 필요.
- 이미지 자산 원칙: 스크린샷·로그·다이어그램은 **실제 데이터만** — 실호출 응답, 검증 보고서 원문, 배포 로그에서 가져온다. 연출 재구성 시 캡션에 "실제 데이터로 재구성" 명시.

## 업데이트 섹션과의 이원화 (ADR-004)

릴리즈 소식은 두 층으로 나뉜다.

1. **모든 버전** → `pnpm new:update -- <product> <version> "요약"` 으로 `src/content/updates/` 항목(불릿 3~10줄, 5분). /updates 타임라인에 쌓인다.
2. **큰 릴리즈만** → 블로그 글 승격(이 문서의 절차) 후, 업데이트 항목 frontmatter `blogSlug`로 상호 연결.

블로그 글을 쓴 릴리즈도 업데이트 항목은 반드시 남긴다(전수 기록 원칙). 제품 추가는 `src/lib/updatesShared.ts`의 `PRODUCTS`에 1줄.
