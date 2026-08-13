import type { SearchDocument } from "@/lib/search"

// 검색에서 직접 도달해야 하는 코어 페이지들.
// 블로그/쇼룸/서비스/오픈소스는 각 데이터 모듈의 매퍼가 커버하므로 여기엔 넣지 않는다.
const corePages: Omit<SearchDocument, "kind" | "badge">[] = [
  {
    id: "page-diagnosis",
    title: "A'Im Scan — 1인 기업 자가진단",
    description: "7개 영역·21문항으로 운영 체계의 빈 곳을 찾는 무료 자가진단.",
    url: "/diagnosis",
    tags: ["진단", "자가진단", "A'Im Scan", "1인 기업"],
  },
  {
    id: "page-store",
    title: "스토어",
    description: "템플릿·도구·강의 — 바이브코딩 결과물을 바로 쓸 수 있는 형태로.",
    url: "/store",
    tags: ["스토어", "템플릿", "상품"],
  },
  {
    id: "page-vhk",
    title: "VHK — Vibe Harness Kit",
    description: "바이브코딩 CLI — AI 코딩 컨텍스트 하네스. RULES.md · cursorrules · vhk gate.",
    url: "/vhk",
    tags: ["VHK", "CLI", "바이브코딩", "npm"],
  },
  {
    id: "page-guide-luna-max",
    title: "Luna · Max 설치 가이드",
    description: "Codex에서 Sol Advisor를 설치하고 Luna 작업 경로에 Max 추론을 적용하는 단계별 가이드.",
    url: "/guides/luna-max",
    tags: ["Luna", "Max", "Sol Advisor", "Codex", "설치가이드"],
  },
  {
    id: "page-open-source",
    title: "오픈소스",
    description: "노션 위젯 10종 · VHK CLI · 노션 미니 템플릿 — 공개 리소스 모음.",
    url: "/open-source",
    tags: ["오픈소스", "무료", "위젯"],
  },
  {
    id: "page-contact",
    title: "문의하기",
    description: "협업 · 견적 · 강연 · 피드백 — 영업일 기준 48시간 안에 회신.",
    url: "/contact",
    tags: ["문의", "연락", "협업", "견적"],
  },
  {
    id: "page-design",
    title: "디자인 히스토리",
    description: "v1 → v2 진화, AI 도구 분업, 디자인 시스템 로드맵.",
    url: "/design",
    tags: ["디자인", "디자인 시스템", "브루탈리즘"],
  },
  {
    id: "page-learning-log",
    title: "러닝 로그",
    description: "특강·강연에서 배운 것의 현장 기록. 노션 세컨드브레인에서 쓰고 사이트에서 바로 읽는다.",
    url: "/learning-log",
    tags: ["러닝 로그", "특강", "배움", "노션"],
  },
  {
    id: "page-updates",
    title: "업데이트 — 제품 릴리즈 노트",
    description: "SnapContext·VHK 모든 버전의 변경 사항을 버전 단위로 기록한다.",
    url: "/updates",
    tags: ["업데이트", "릴리즈", "SnapContext", "VHK"],
  },
]

export function corePagesSearchDocs(): SearchDocument[] {
  return corePages.map((p) => ({ ...p, kind: "page", badge: "페이지" }))
}
