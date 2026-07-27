import type { CSSProperties } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { CheckoutButton } from "@/components/store/CheckoutButton"
import { PriceTag } from "@/components/store/PriceTag"
import { STORE_SALES_ENABLED } from "@/data/storeConfig"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database"

type ProductRow = Database["public"]["Tables"]["studio_products"]["Row"]
type PageProps = { params: Promise<{ id: string }> }

export const revalidate = 60

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function fetchProduct(idOrSlug: string): Promise<ProductRow | null> {
  // [id] route param: slug 우선, UUID 형식일 때만 id 컬럼도 시도.
  const bySlug = await supabase
    .from("studio_products")
    .select("*")
    .eq("slug", idOrSlug)
    .maybeSingle()

  if (bySlug.data) return bySlug.data
  if (bySlug.error) {
    console.error("[store/[id]] fetchProduct(slug) error:", bySlug.error.message)
    return null
  }

  if (!UUID_RE.test(idOrSlug)) return null

  const byId = await supabase
    .from("studio_products")
    .select("*")
    .eq("id", idOrSlug)
    .maybeSingle()

  if (byId.error) {
    console.error("[store/[id]] fetchProduct(id) error:", byId.error.message)
    return null
  }
  return byId.data
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const product = await fetchProduct(id)
  if (!product) {
    return { title: "상품을 찾을 수 없습니다 — Yohan Studio" }
  }
  return {
    title: `${product.name} — Yohan Studio Store`,
    description: product.description ?? undefined,
    // 자체 canonical이 없으면 루트 layout의 "/"를 상속해 홈의 사본으로 선언된다.
    // slug로도 UUID로도 접근되므로 slug를 정규 URL로 고정한다.
    alternates: { canonical: `/store/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      // images 키를 undefined로 넣으면 상위 파일 기반 opengraph-image가 무시된다 (#35와 동일 패턴)
      ...(product.image_url ? { images: [{ url: product.image_url }] } : {}),
    },
  }
}

const section: CSSProperties = {
  background: "var(--bg)",
  padding: "96px 24px",
  borderBottom: "var(--border-w) solid var(--line)",
}

const inner: CSSProperties = { maxWidth: "var(--max-w)", margin: "0 auto" }

const back: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "12px",
  fontWeight: 700,
  color: "var(--accent)",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  textDecoration: "none",
  display: "inline-block",
  marginBottom: "24px",
}

const layout: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
  gap: "48px",
  alignItems: "start",
}

const cover: CSSProperties = {
  background: "var(--surface-2, #e5e0d2)",
  border: "var(--border-w) solid var(--line)",
  boxShadow: "var(--shadow)",
  width: "100%",
  aspectRatio: "4 / 3",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "var(--font-mono)",
  color: "var(--muted)",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  overflow: "hidden",
}

const coverImg: CSSProperties = { width: "100%", height: "100%", objectFit: "cover" }

const right: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
}

const typeBadge: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "11px",
  fontWeight: 700,
  color: "var(--accent)",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
}

const title: CSSProperties = {
  fontSize: "clamp(32px, 4.5vw, 48px)",
  fontWeight: 800,
  letterSpacing: "-0.02em",
  lineHeight: 1.1,
  color: "var(--ink)",
  margin: 0,
}

const desc: CSSProperties = {
  fontSize: "16px",
  lineHeight: 1.65,
  color: "var(--ink-2)",
  margin: 0,
}

const priceBlock: CSSProperties = {
  padding: "20px",
  border: "var(--border-w) solid var(--line)",
  background: "var(--surface, #eeeae0)",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
}

const priceRow: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}

const priceLabel: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "11px",
  fontWeight: 700,
  color: "var(--muted)",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
}

const meta: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  gap: "8px 16px",
  paddingTop: "16px",
  borderTop: "1px dashed var(--muted-2, var(--muted))",
  fontSize: "13px",
  color: "var(--ink-2)",
}

const metaKey: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "11px",
  fontWeight: 700,
  color: "var(--muted)",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  alignSelf: "center",
}

export default async function StoreDetailPage({ params }: PageProps) {
  const { id } = await params
  const product = await fetchProduct(id)
  if (!product) notFound()

  const created = new Date(product.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

  return (
    <section style={section}>
      <div style={inner}>
        <Link href="/store" style={back}>
          ← Store
        </Link>

        <div style={layout} className="store-detail-grid">
          <div style={cover}>
            {product.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.image_url} alt={product.name} style={coverImg} />
            ) : (
              <span>{product.product_type}</span>
            )}
          </div>

          <div style={right}>
            <span style={typeBadge}>{product.product_type}</span>
            <h1 style={title}>{product.name}</h1>
            {product.description && <p style={desc}>{product.description}</p>}

            <div style={priceBlock}>
              <div style={priceRow}>
                <span style={priceLabel}>가격</span>
                <PriceTag
                  priceCents={product.price_cents}
                  currency={product.currency}
                  size="lg"
                  tbd={!STORE_SALES_ENABLED}
                />
              </div>
              <CheckoutButton
                productId={product.id}
                active={product.active}
              />
            </div>

            <div style={meta}>
              <span style={metaKey}>등록일</span>
              <span>{created}</span>
              <span style={metaKey}>유형</span>
              <span>{product.product_type}</span>
              {product.stripe_price_id && (
                <>
                  <span style={metaKey}>결제</span>
                  <span>Stripe</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 880px) {
          .store-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
        }
      `}</style>
    </section>
  )
}
