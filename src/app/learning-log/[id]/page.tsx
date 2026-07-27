import type { CSSProperties } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { NotionBlocks } from "@/components/learning-log/NotionBlocks"
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd"
import { getLearningLogPage } from "@/lib/notion"

type PageProps = { params: Promise<{ id: string }> }

export const revalidate = 3600

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const page = await getLearningLogPage(id)
  if (!page) {
    return { title: "러닝 로그 — Yohan Studio" }
  }
  const description = `${page.title} — 특강·강연에서 배운 것의 현장 기록. 요한 스튜디오 러닝 로그.`
  return {
    title: `${page.title} — 러닝 로그`,
    description,
    // 자체 canonical이 없으면 루트 layout의 "/"를 상속해 홈의 사본으로 선언된다.
    alternates: { canonical: `/learning-log/${id}` },
    openGraph: {
      type: "article",
      title: page.title,
      description,
      siteName: "Yohan Studio",
      locale: "ko_KR",
    },
  }
}

const section: CSSProperties = {
  background: "var(--bg)",
  padding: "96px 24px",
  borderBottom: "var(--border-w) solid var(--line)",
}

const inner: CSSProperties = { maxWidth: "720px", margin: "0 auto" }

const back: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "12px",
  fontWeight: 700,
  color: "var(--accent)",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  textDecoration: "none",
  display: "inline-block",
  marginBottom: "24px",
}

const title: CSSProperties = {
  fontSize: "clamp(28px, 4.5vw, 44px)",
  fontWeight: 800,
  letterSpacing: "-0.02em",
  lineHeight: 1.15,
  color: "var(--ink)",
  margin: "0 0 12px",
}

const dateRow: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "12px",
  color: "var(--muted)",
  letterSpacing: "0.04em",
  marginBottom: "40px",
  paddingBottom: "24px",
  borderBottom: "var(--border-w) solid var(--line)",
}

export default async function LearningLogDetailPage({ params }: PageProps) {
  const { id } = await params
  const page = await getLearningLogPage(id)
  if (!page) notFound()

  const edited = new Date(page.lastEdited).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

  return (
    <section style={section}>
      <div style={inner}>
        <BreadcrumbJsonLd
          items={[
            { name: "홈", path: "/" },
            { name: "러닝 로그", path: "/learning-log" },
            { name: page.title, path: `/learning-log/${id}` },
          ]}
        />
        <Link href="/learning-log" style={back}>
          ← LEARNING LOG
        </Link>
        <h1 style={title}>{page.title}</h1>
        <div style={dateRow}>최종 수정 {edited}</div>
        <div className="mdx-content">
          <NotionBlocks blocks={page.blocks} />
        </div>
      </div>
    </section>
  )
}
