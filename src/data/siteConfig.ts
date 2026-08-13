// 사이트 메타 단일 소스(SSOT). chatContext, SEO, JSON-LD 등에서 참조.
// 추가 페이지/오픈소스 항목이 생기면 여기만 갱신한다.

export type SitePage = { path: string; desc: string }
export type OpenSourceItem = { name: string; desc: string }

export const SITE_CONFIG = {
  name: "요한 스튜디오",
  englishName: "Yohan Studio",
  tagline: "AI 시대 1인 기업가를 위한 First Platform",
  owner: {
    name: "백요한",
    bio: "바리스타 출신 바이브코더, AI 코드 에이전트와 자동화 워크플로로 콘텐츠와 제품을 만드는 1인 기업가",
  },
  url: "https://yohanstudio.co",
  pages: [
    { path: "/blog", desc: "바이브코딩, AI 자동화, 1인 기업 운영 인사이트 (MDX)" },
    { path: "/updates", desc: "제품 릴리즈 노트 — SnapContext·VHK 모든 버전의 변경 사항 (MDX 타임라인)" },
    { path: "/learning-log", desc: "노션 세컨드브레인 러닝 로그 — 특강·강연 배움 기록 (Notion API 렌더)" },
    { path: "/showroom", desc: "프로젝트 쇼룸 (작업물 카드 + 카테고리 필터)" },
    { path: "/store", desc: "디지털 상품 스토어 (Stripe 결제)" },
    { path: "/open-source", desc: "오픈소스 프로젝트 모음" },
    { path: "/diagnosis", desc: "AI'm Scan — AI 시대 1인 기업 진단 (7영역 21문항)" },
    { path: "/services", desc: "서비스 (컨설팅, 구축, 자동화)" },
    { path: "/vhk", desc: "VHK CLI 랜딩 (v1.3.0)" },
    { path: "/guides/luna-max", desc: "Sol Advisor 설치와 Codex Luna · Max 작업 경로 단계별 가이드" },
  ] satisfies SitePage[],
  openSource: [
    { name: "NotionUIUX 위젯", desc: "무료 임베드 위젯 모음" },
    { name: "VHK CLI", desc: "npm @byh3071/vhk (Notion 친화 마크다운 변환 CLI)" },
  ] satisfies OpenSourceItem[],
  stack: [
    "프레임워크: Next.js 16 App Router, TypeScript strict",
    "스타일: Tailwind CSS v4 (CSS-first) + Editorial × Soft Brutalism 디자인 시스템",
    "DB: Supabase (PostgreSQL)",
    "결제: Stripe",
    "호스팅: Vercel",
    "콘텐츠: MDX",
  ],
} as const
