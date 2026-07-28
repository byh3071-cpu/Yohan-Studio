import type { Metadata } from "next"
import type { CSSProperties } from "react"
import { Suspense } from "react"
import Link from "next/link"
import { UpdatesFeed } from "@/components/updates/UpdatesFeed"
import { StaticUpdatesList } from "@/components/updates/StaticUpdatesList"
import { getCompiledUpdates } from "@/lib/updates"
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd"

export const metadata: Metadata = {
  title: "업데이트",
  description: "SnapContext·VHK 제품 릴리즈 노트 — 모든 버전의 변경 사항을 기록합니다.",
  // 자체 canonical이 없으면 루트 layout의 "/"를 상속해 홈의 사본으로 선언된다.
  // alternates는 병합이 아니라 통째로 덮어써지므로 RSS alternate도 여기서 다시 명시한다.
  alternates: {
    canonical: "/updates",
    types: { "application/rss+xml": "/rss.xml" },
  },
}

export default async function UpdatesPage() {
  const entries = await getCompiledUpdates()

  const section: CSSProperties = {
    background: "var(--bg)",
    padding: "48px 24px 96px",
    borderBottom: "var(--border-w) solid var(--line)",
  }
  const inner: CSSProperties = { maxWidth: "var(--max-w)", margin: "0 auto" }
  const head: CSSProperties = {
    paddingBottom: "28px",
    marginBottom: "36px",
    borderBottom: "var(--border-w) solid var(--line)",
  }
  const eyebrow: CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--muted)",
    marginBottom: "10px",
  }
  const title: CSSProperties = {
    fontSize: "clamp(32px, 4.5vw, 52px)",
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: "-0.03em",
    color: "var(--ink)",
  }
  const accent: CSSProperties = { color: "var(--accent)" }
  const sub: CSSProperties = {
    marginTop: "16px",
    fontSize: "15px",
    color: "var(--ink-2)",
    maxWidth: "520px",
    lineHeight: 1.6,
  }
  const back: CSSProperties = {
    display: "inline-block",
    marginBottom: "24px",
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.06em",
    color: "var(--accent)",
  }

  return (
    <section style={section}>
      <BreadcrumbJsonLd
        items={[
          { name: "홈", path: "/" },
          { name: "업데이트", path: "/updates" },
        ]}
      />
      <div style={inner}>
        <Link href="/" style={back}>
          ← HOME
        </Link>
        <header style={head}>
          <div style={eyebrow}>{"// UPDATES"}</div>
          <h1 style={title}>
            업데이트<span style={accent}>.</span>
          </h1>
          <p style={sub}>
            제품이 살아있다는 증거. 모든 릴리즈의 변경 사항을 버전 단위로 기록합니다.
          </p>
        </header>
        <Suspense fallback={<StaticUpdatesList entries={entries} />}>
          <UpdatesFeed entries={entries} />
        </Suspense>
      </div>
    </section>
  )
}
