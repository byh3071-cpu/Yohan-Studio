import type { CSSProperties } from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { FeaturedBanner } from "@/components/showroom/FeaturedBanner"
import { ProjectGrid } from "@/components/showroom/ProjectGrid"
import { StaticProjectGrid } from "@/components/showroom/StaticProjectGrid"
import { getAllShowroomProjects } from "@/lib/showroom"

export const metadata: Metadata = {
  title: "Showroom — Yohan Studio",
  description:
    "AI 시대 1인 기업가의 실험·운영체계·바이브코딩 결과물 쇼룸. Notion OS, GAS 자동화, AI 워크플로우, 위젯, 빌드로그.",
}

const section: CSSProperties = {
  background: "var(--bg)",
  padding: "96px 24px",
  borderBottom: "var(--border-w) solid var(--line)",
}

const inner: CSSProperties = { maxWidth: "var(--max-w)", margin: "0 auto" }

const head: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  alignItems: "end",
  gap: "20px",
  paddingBottom: "32px",
  marginBottom: "40px",
  borderBottom: "var(--border-w) solid var(--line)",
}

const eyebrow: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "12px",
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--muted)",
  marginBottom: "12px",
}

const title: CSSProperties = {
  fontSize: "clamp(40px, 6vw, 64px)",
  fontWeight: 800,
  lineHeight: 1,
  letterSpacing: "-0.03em",
  color: "var(--ink)",
}

const accentMark: CSSProperties = { color: "var(--accent)" }

const count: CSSProperties = {
  fontFamily: "var(--font-en)",
  fontSize: "13px",
  fontWeight: 500,
  color: "var(--ink)",
  border: "1.5px solid var(--line)",
  padding: "8px 14px",
  background: "var(--bg)",
  letterSpacing: "0.04em",
}

const sectionLabel: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--muted)",
  margin: "48px 0 20px",
}

const lead: CSSProperties = {
  maxWidth: "720px",
  fontSize: "17px",
  lineHeight: 1.7,
  color: "var(--ink-2)",
  marginTop: "20px",
}

export default function ShowroomPage() {
  const projects = getAllShowroomProjects()
  const regularProjects = projects.filter((project) => project.tier !== "flagship")

  return (
    <section style={section}>
      <div style={inner}>
        <div style={head}>
          <div>
            <div style={eyebrow}>{"// SHOWROOM — 만든 것들"}</div>
            <h1 style={title}>
              쇼룸<span style={accentMark}>.</span>
            </h1>
            <p style={lead}>
              무엇을 만들었는지보다 왜 필요했고, 어떤 제약 속에서 검증했으며,
              운영 결과에 어떻게 책임졌는지를 기록합니다.
            </p>
          </div>
          <div style={count}>{projects.length} PROJECTS</div>
        </div>
        <FeaturedBanner projects={projects} />
        <h2 style={sectionLabel}>기존 프로젝트 · 순차적으로 사례 전환 중</h2>
        <Suspense fallback={<StaticProjectGrid projects={regularProjects} />}>
          <ProjectGrid projects={regularProjects} />
        </Suspense>
      </div>
    </section>
  )
}
