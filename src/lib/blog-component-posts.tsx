import type { ReactElement } from "react"
import SnapContextPost, { post as snapcontextPost } from "@/app/blog/posts/snapcontext-v013-store-journey.mdx"

type ComponentPostMeta = {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  category: string
  thumbnail?: string
  published: boolean
}

export const SNAPCONTEXT_SLUG = "snapcontext-v013-store-journey"

const SNAPCONTEXT_THUMBNAIL = "/blog/snapcontext-v013/01-capture-controls.png"

function toSnapcontextMeta(): ComponentPostMeta {
  return {
    slug: snapcontextPost.slug,
    title: snapcontextPost.title,
    description: snapcontextPost.ogDescription,
    date: snapcontextPost.date,
    tags: snapcontextPost.tags,
    category: snapcontextPost.category,
    thumbnail: SNAPCONTEXT_THUMBNAIL,
    published: snapcontextPost.published,
  }
}

const COMPONENT_POSTS: Record<
  string,
  { meta: ComponentPostMeta; Content: () => ReactElement }
> = {
  [SNAPCONTEXT_SLUG]: {
    meta: toSnapcontextMeta(),
    Content: SnapContextPost,
  },
}

export function getComponentPostSlugs(): string[] {
  return Object.keys(COMPONENT_POSTS)
}

export function getComponentPostMeta(slug: string): ComponentPostMeta | null {
  return COMPONENT_POSTS[slug]?.meta ?? null
}

export function getPublishedComponentPosts(): ComponentPostMeta[] {
  return Object.values(COMPONENT_POSTS)
    .map(({ meta }) => meta)
    .filter((meta) => meta.published)
}

export function getComponentPostContent(slug: string): ReactElement | null {
  const entry = COMPONENT_POSTS[slug]
  if (!entry) return null
  return <entry.Content />
}
