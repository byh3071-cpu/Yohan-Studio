declare module "*.mdx" {
  import type { ReactElement } from "react"

  export const post: {
    slug: string
    category: string
    title: string
    subtitle: string
    date: string
    author: string
    tags: string[]
    seoKeywords: string
    ogDescription: string
    published: boolean
  }

  export default function MDXContent(): ReactElement
}
