import type { CSSProperties } from "react"
import { BlogRowCard } from "@/components/blog/BlogRowCard"
import type { BlogPostMeta } from "@/lib/blog"

type Props = { posts: BlogPostMeta[] }

// TagFilter 가 useSearchParams 를 쓰므로 프리렌더 시 Suspense 경계까지 CSR 로 빠진다
// (Next.js 설계된 동작). 그래서 fallback 이 곧 크롤러가 보는 초기 HTML 이다.
// 여기서 발행 글 전량을 서버 렌더해 /blog/<slug> 내부 링크가 HTML 에 실리게 한다.
// 검색창·태그칩 자리는 동일 규격 스켈레톤으로 확보해 하이드레이션 시 CLS 를 막는다.
export function StaticPostList({ posts }: Props) {
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort()

  const toolbar: CSSProperties = {
    marginBottom: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  }
  const inputStyle: CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    fontSize: "14px",
    fontFamily: "var(--font-sans)",
    background: "var(--bg)",
    border: "var(--border-w) solid var(--line)",
    borderRadius: 0,
    color: "var(--muted)",
    outline: "none",
  }
  const tagRow: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  }
  const list: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  }
  const empty: CSSProperties = {
    border: "var(--border-w) solid var(--line)",
    boxShadow: "var(--shadow-sm)",
    padding: "32px 24px",
    fontFamily: "var(--font-mono)",
    fontSize: "13px",
    color: "var(--muted)",
    background: "var(--surface)",
    textAlign: "center",
  }

  // TagFilter.tagStyle 과 동일 규격(높이 동일 확보용). 하이드레이션 전이라
  // 눌러도 동작하지 않으므로 button 이 아닌 span 으로 두고 AT 에서 숨긴다.
  function tagStyle(active: boolean): CSSProperties {
    return {
      fontSize: "11px",
      fontWeight: 600,
      fontFamily: "var(--font-mono)",
      padding: "5px 12px",
      border: "1px solid var(--line)",
      background: active ? "var(--accent)" : "var(--bg)",
      color: active ? "var(--accent-ink)" : "var(--ink)",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
    }
  }

  return (
    <div>
      <div style={toolbar} aria-hidden="true">
        <div style={inputStyle}>글 검색…</div>
        {allTags.length > 0 && (
          <div style={tagRow}>
            <span style={tagStyle(true)}>전체</span>
            {allTags.map((t) => (
              <span key={t} style={tagStyle(false)}>
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {posts.length === 0 ? (
        <p style={empty}>검색 결과가 없습니다.</p>
      ) : (
        <div style={list}>
          {posts.map((post) => (
            <BlogRowCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
