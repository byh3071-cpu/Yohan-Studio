import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { compileMDX } from "next-mdx-remote/rsc"
import type { ReactElement } from "react"
import { BlogImage } from "@/components/blog/mdx/BlogImage"
import { CodeBlock } from "@/components/blog/mdx/CodeBlock"
import { EmojiIcon } from "@/components/blog/mdx/EmojiIcon"
import {
  getComponentPostContent,
  getComponentPostMeta,
  getComponentPostSlugs,
  getPublishedComponentPosts,
} from "@/lib/blog-component-posts"
import type { SearchDocument } from "@/lib/search"

const mdxComponents = {
  pre: CodeBlock,
  CodeBlock,
  BlogImage,
  EmojiIcon,
}

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "blog")

export type BlogFrontmatter = {
  title: string
  description: string
  date: string
  /** 발행 후 본문을 고친 날짜(YYYY-MM-DD). 없으면 date를 그대로 쓴다. sitemap lastmod 용. */
  updated?: string
  tags: string[]
  category: string
  thumbnail?: string
  relatedProjects?: string[]
  published: boolean
}

export type BlogPostMeta = BlogFrontmatter & { slug: string }

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  }
  return []
}

// 오타 난 updated가 sitemap에 Invalid Date로 새지 않도록 파싱 시점에 걸러낸다.
function toOptionalDate(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  if (!trimmed || Number.isNaN(Date.parse(trimmed))) return undefined
  return trimmed
}

function toPublished(value: unknown): boolean {
  if (typeof value === "boolean") return value
  if (value === "true") return true
  if (value === "false") return false
  return false
}

export function parseBlogFrontmatter(
  slug: string,
  data: Record<string, unknown>,
): BlogPostMeta | null {
  const title = typeof data.title === "string" ? data.title : ""
  const description = typeof data.description === "string" ? data.description : ""
  const date = typeof data.date === "string" ? data.date : ""
  const category = typeof data.category === "string" ? data.category : ""
  if (!title || !description || !date || !category) return null

  const thumbRaw = typeof data.thumbnail === "string" ? data.thumbnail.trim() : ""
  const thumbnail = thumbRaw.length > 0 ? thumbRaw : undefined
  const relatedProjects = toStringArray(data.relatedProjects)

  return {
    slug,
    title,
    description,
    date,
    updated: toOptionalDate(data.updated),
    tags: toStringArray(data.tags),
    category,
    thumbnail,
    relatedProjects: relatedProjects.length > 0 ? relatedProjects : undefined,
    published: toPublished(data.published),
  }
}

function readFileRaw(slug: string): string | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  return fs.readFileSync(filePath, "utf8")
}

export function getAllSlugs(): string[] {
  const fileSlugs = fs.existsSync(CONTENT_DIR)
    ? fs
        .readdirSync(CONTENT_DIR)
        .filter((f) => f.endsWith(".mdx"))
        .map((f) => f.replace(/\.mdx$/, ""))
    : []
  return [...new Set([...fileSlugs, ...getComponentPostSlugs()])]
}

export function getPostMeta(slug: string): BlogPostMeta | null {
  const componentMeta = getComponentPostMeta(slug)
  if (componentMeta) return componentMeta

  const raw = readFileRaw(slug)
  if (!raw) return null
  const { data } = matter(raw)
  return parseBlogFrontmatter(slug, data as Record<string, unknown>)
}

export function getPublishedPosts(): BlogPostMeta[] {
  const posts = [
    ...getPublishedComponentPosts(),
    ...getAllSlugs()
      .map((slug) => getPostMeta(slug))
      .filter((m): m is BlogPostMeta => m !== null && m.published),
  ]

  const bySlug = new Map<string, BlogPostMeta>()
  for (const post of posts) {
    bySlug.set(post.slug, post)
  }

  return [...bySlug.values()].sort((a, b) => (a.date < b.date ? 1 : -1))
}

export type AdjacentPosts = {
  prev: BlogPostMeta | null
  next: BlogPostMeta | null
}

// 발행일 기준 내림차순 정렬에서 prev = 더 최근 글, next = 더 오래된 글.
// 독자가 한 글을 다 읽고 다음으로 자연스럽게 넘어가는 방향(과거 → 미래)을 따라 next는 더 새 글로 잡는다.
export function getAdjacentPosts(slug: string): AdjacentPosts {
  const posts = getPublishedPosts()
  const idx = posts.findIndex((p) => p.slug === slug)
  if (idx === -1) return { prev: null, next: null }
  return {
    next: idx > 0 ? posts[idx - 1] : null,
    prev: idx < posts.length - 1 ? posts[idx + 1] : null,
  }
}

export async function compileBlogPost(slug: string): Promise<{
  meta: BlogPostMeta
  content: ReactElement
} | null> {
  const componentMeta = getComponentPostMeta(slug)
  const componentContent = getComponentPostContent(slug)
  if (componentMeta && componentContent) {
    return { meta: componentMeta, content: componentContent }
  }

  const raw = readFileRaw(slug)
  if (!raw) return null

  const { content, frontmatter } = await compileMDX({
    source: raw,
    components: mdxComponents,
    options: { parseFrontmatter: true },
  })

  const meta = parseBlogFrontmatter(slug, frontmatter as Record<string, unknown>)
  if (!meta) return null

  return { meta, content }
}

export function blogSearchDocs(): SearchDocument[] {
  return getPublishedPosts().map((post) => ({
    id: `blog:${post.slug}`,
    kind: "blog",
    title: post.title,
    description: post.description,
    url: `/blog/${post.slug}`,
    tags: [...(post.tags ?? []), post.category].filter(Boolean),
    badge: "블로그",
  }))
}
