import type { MetadataRoute } from "next"
import { getPublishedPosts } from "@/lib/blog"
import { getAllShowroomProjects } from "@/lib/showroom"
import { getPublishedUpdates } from "@/lib/updates"
import { getSiteUrl } from "@/lib/siteUrl"

const BASE_URL = getSiteUrl()

// lastmod는 구글이 재크롤 스케줄링에 쓰는 신호다(sitemap ping 폐기 2023-06).
// 빌드 시각을 넣으면 내용이 안 바뀐 배포에도 전 URL이 갱신된 것처럼 보여
// 구글이 부정확하다고 판단해 신호 자체를 무시한다.
// → 콘텐츠 날짜를 아는 URL만 lastmod를 붙이고, 모르는 URL은 아예 생략한다(거짓 신호보다 무신호).
function lastMod(date: string | undefined): { lastModified?: Date } {
  if (!date) return {}
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? {} : { lastModified: parsed }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublishedPosts()
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    // 글을 고쳤으면 updated, 아니면 발행일. 기존 글은 updated가 없어 동작이 그대로다.
    ...lastMod(post.updated ?? post.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const showroomProjects = getAllShowroomProjects()
  const showroomEntries: MetadataRoute.Sitemap = showroomProjects.map((p) => ({
    url: `${BASE_URL}/showroom/${p.slug}`,
    ...lastMod(p.dateCreated),
    changeFrequency: "monthly",
    priority: 0.85,
  }))

  const updates = getPublishedUpdates()

  return [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      // 목록 페이지는 최신 항목이 들어온 시점이 곧 마지막 변경 시점.
      url: `${BASE_URL}/blog`,
      ...lastMod(posts[0]?.date),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/updates`,
      ...lastMod(updates[0]?.date),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/learning-log`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/design`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/showroom`,
      ...lastMod(showroomProjects[0]?.dateCreated),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/diagnosis`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/services`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/vhk`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/guides/luna-max`,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/open-source`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/store`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...showroomEntries,
    ...postEntries,
  ]
}
