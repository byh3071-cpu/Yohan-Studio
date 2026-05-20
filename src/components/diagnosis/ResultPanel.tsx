import type { CSSProperties } from "react"
import Link from "next/link"
import type { ScanResult } from "@/lib/aimScan"
import { AREA_LABELS_KO, AREA_DESC } from "@/data/aimScanQuestions"
import { LevelBadge } from "./LevelBadge"
import { ScoreRadar } from "./ScoreRadar"

const wrap: CSSProperties = {
  display: "grid",
  gap: "32px",
  padding: "32px",
  border: "var(--border-w) solid var(--line)",
  background: "var(--surface)",
  boxShadow: "var(--shadow-lg)",
}

const head: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  gap: "24px",
  alignItems: "start",
}

const totalBlock: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
}

const totalLabel: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--muted)",
}

const totalValue: CSSProperties = {
  fontFamily: "var(--font-en)",
  fontSize: "48px",
  fontWeight: 800,
  lineHeight: 1,
  color: "var(--ink)",
}

const grid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(280px, 1fr) minmax(260px, 1fr)",
  gap: "32px",
  alignItems: "start",
}

const section: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
}

const sectionTitle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--accent)",
  paddingBottom: "8px",
  borderBottom: "1px solid var(--line)",
}

const itemRow: CSSProperties = {
  display: "flex",
  gap: "12px",
  alignItems: "baseline",
  padding: "8px 0",
  borderBottom: "1px dashed var(--muted-2)",
}

const itemNum: CSSProperties = {
  fontFamily: "var(--font-en)",
  fontSize: "13px",
  fontWeight: 600,
  color: "var(--accent)",
  width: "20px",
  flexShrink: 0,
}

const itemName: CSSProperties = {
  fontSize: "14px",
  fontWeight: 700,
  color: "var(--ink)",
}

const itemDesc: CSSProperties = {
  fontSize: "12px",
  lineHeight: 1.55,
  color: "var(--ink-2)",
  marginTop: "2px",
}

const ctaRow: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  paddingTop: "16px",
  borderTop: "var(--border-w) solid var(--line)",
}

const btnPrimary: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "14px 22px",
  fontSize: "14px",
  fontWeight: 700,
  background: "var(--accent)",
  color: "var(--accent-ink)",
  border: "var(--border-w) solid var(--line)",
  boxShadow: "var(--shadow)",
  textDecoration: "none",
  whiteSpace: "nowrap",
}

const btnGhost: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "14px 22px",
  fontSize: "14px",
  fontWeight: 700,
  background: "var(--bg)",
  color: "var(--ink)",
  border: "var(--border-w) solid var(--line)",
  boxShadow: "var(--shadow-sm)",
  textDecoration: "none",
  whiteSpace: "nowrap",
}

export function ResultPanel({ result }: { result: ScanResult }) {
  return (
    <div style={wrap}>
      <div style={head}>
        <div style={totalBlock}>
          <span style={totalLabel}>총점</span>
          <span style={totalValue}>{result.percent}%</span>
        </div>
        <LevelBadge level={result.level} />
      </div>

      <div style={grid}>
        <ScoreRadar byAreaPercent={result.byAreaPercent} />

        <div style={section}>
          <h3 style={sectionTitle}>핵심 문제 TOP 3</h3>
          {result.top3Problems.map((a, i) => (
            <div key={a} style={itemRow}>
              <span style={itemNum}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <div style={itemName}>{AREA_LABELS_KO[a]} · {result.byAreaPercent[a]}%</div>
                <p style={itemDesc}>{AREA_DESC[a]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={section}>
        <h3 style={sectionTitle}>추천 실행 순서</h3>
        {result.recommendedOrder.map((a, i) => (
          <div key={a} style={itemRow}>
            <span style={itemNum}>{String(i + 1).padStart(2, "0")}</span>
            <div>
              <div style={itemName}>{AREA_LABELS_KO[a]} · {result.byAreaPercent[a]}%</div>
            </div>
          </div>
        ))}
      </div>

      <div style={ctaRow}>
        <Link href="/services" style={btnPrimary}>
          맞춤 추천 서비스 보기 →
        </Link>
        <Link href="/showroom" style={btnGhost}>
          쇼룸 둘러보기
        </Link>
      </div>
    </div>
  )
}
