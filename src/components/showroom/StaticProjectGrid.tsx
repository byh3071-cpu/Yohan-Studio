import type { CSSProperties } from "react"
import { SHOWROOM_CATEGORIES, type ShowroomProject } from "@/data/showroomProjects"
import { ProjectCard } from "./ProjectCard"

// ProjectGrid(클라이언트)가 useSearchParams 로 CSR 폴백되는 동안 초기 HTML을
// 채우는 서버 컴포넌트. 크롤러는 JS를 실행하지 않으므로 이 출력이 곧 색인 대상이다.
// 필터 칩 줄은 하이드레이션 시 CLS가 없도록 CategoryFilter 와 동일한 치수의
// 스켈레톤으로 자리를 잡아둔다(값은 CategoryFilter.tsx 와 1:1 대응).

const grid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
  gap: "24px",
}

const filterRow: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  paddingBottom: "24px",
  borderBottom: "1px solid var(--line)",
  marginBottom: "32px",
}

const chip: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  padding: "8px 14px",
  border: "var(--border-w) solid var(--line)",
  background: "var(--bg)",
  color: "var(--ink)",
  boxShadow: "var(--shadow-sm)",
  display: "inline-block",
}

const activeChipStyle: CSSProperties = {
  ...chip,
  background: "var(--accent)",
  color: "var(--accent-ink)",
}

export function StaticProjectGrid({ projects }: { projects: ShowroomProject[] }) {
  return (
    <>
      <div style={filterRow} aria-hidden="true">
        {(["ALL", ...SHOWROOM_CATEGORIES] as const).map((opt) => (
          <span key={opt} style={opt === "ALL" ? activeChipStyle : chip}>
            {opt}
          </span>
        ))}
      </div>
      <div style={grid}>
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} priority={i < 3} />
        ))}
      </div>
    </>
  )
}
