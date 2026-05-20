"use client"

import type { CSSProperties } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SHOWROOM_CATEGORIES, type ShowroomCategory } from "@/data/showroomProjects"

const ALL = "ALL" as const
type FilterValue = typeof ALL | ShowroomCategory

const row: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  paddingBottom: "24px",
  borderBottom: "1px solid var(--line)",
  marginBottom: "32px",
}

const baseChip: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  padding: "8px 14px",
  border: "var(--border-w) solid var(--line)",
  background: "var(--bg)",
  color: "var(--ink)",
  cursor: "pointer",
  boxShadow: "var(--shadow-sm)",
}

const activeChip: CSSProperties = {
  ...baseChip,
  background: "var(--accent)",
  color: "var(--accent-ink)",
}

export function CategoryFilter({ active }: { active: FilterValue }) {
  const router = useRouter()
  const params = useSearchParams()

  const setCat = (next: FilterValue) => {
    const sp = new URLSearchParams(params?.toString() ?? "")
    if (next === ALL) sp.delete("cat")
    else sp.set("cat", next)
    const qs = sp.toString()
    router.replace(qs ? `/showroom?${qs}` : "/showroom", { scroll: false })
  }

  const options: FilterValue[] = [ALL, ...SHOWROOM_CATEGORIES]

  return (
    <div style={row} role="group" aria-label="카테고리 필터">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          aria-pressed={active === opt}
          style={active === opt ? activeChip : baseChip}
          onClick={() => setCat(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export { ALL }
export type { FilterValue }
