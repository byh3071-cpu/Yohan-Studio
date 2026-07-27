import type { CSSProperties, ReactNode } from "react"
import { PRODUCTS, type ProductId, type UpdateEntryMeta } from "@/lib/updatesShared"
import { UpdateEntry } from "@/components/updates/UpdateEntry"

type Entry = {
  meta: UpdateEntryMeta
  content: ReactNode
}

type Props = { entries: Entry[] }

const productIds = Object.keys(PRODUCTS) as ProductId[]

// UpdatesFeed 는 useSearchParams 를 쓰므로 프리렌더 시 Suspense 경계까지 CSR 로 빠진다
// (Next.js 설계된 동작). 그래서 fallback 이 곧 크롤러가 보는 초기 HTML 이다.
// 여기서 발행된 릴리즈 전량을 서버 렌더해 릴리즈 본문이 HTML 에 실리게 한다.
// 필터 툴바 자리는 동일 규격 스켈레톤으로 확보해 하이드레이션 시 CLS 를 막는다.
export function StaticUpdatesList({ entries }: Props) {
  const chipRow: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "32px",
  }
  const list: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
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

  // UpdatesFeed.chipStyle 과 동일 규격(높이 동일 확보용). 하이드레이션 전이라
  // 눌러도 동작하지 않으므로 button 이 아닌 span 으로 두고 AT 에서 숨긴다.
  function chipStyle(active: boolean): CSSProperties {
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
      <div style={chipRow} aria-hidden="true">
        <span style={chipStyle(true)}>전체</span>
        {productIds.map((id) => (
          <span key={id} style={chipStyle(false)}>
            {PRODUCTS[id]}
          </span>
        ))}
      </div>

      {entries.length === 0 ? (
        <p style={empty}>해당하는 업데이트가 없습니다.</p>
      ) : (
        <div style={list}>
          {entries.map((e) => (
            <UpdateEntry key={e.meta.slug} meta={e.meta} content={e.content} />
          ))}
        </div>
      )}
    </div>
  )
}
