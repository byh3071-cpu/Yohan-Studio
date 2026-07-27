import type { Metadata } from "next"
import type { CSSProperties } from "react"
import { Suspense } from "react"
import Link from "next/link"
import { TagFilter } from "@/components/blog/TagFilter"
import { StaticPostList } from "@/components/blog/StaticPostList"
import { getPublishedPosts } from "@/lib/blog"

export const metadata: Metadata = {
  title: "블로그",
  description: "개발·프로덕트·1인 기업에 관한 글",
}

export default function BlogIndexPage() {
  const posts = getPublishedPosts()

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
      <div style={inner}>
        <Link href="/" style={back}>
          ← HOME
        </Link>
        <header style={head}>
          <div style={eyebrow}>{"// BLOG"}</div>
          <h1 style={title}>
            글<span style={accent}>.</span>
          </h1>
          <p style={sub}>MDX · next-mdx-remote/rsc · 프론트매터 기반 정적 콘텐츠</p>
        </header>
        <Suspense fallback={<StaticPostList posts={posts} />}>
          <TagFilter posts={posts} />
        </Suspense>
      </div>
    </section>
  )
}
