import { NextResponse, type NextRequest } from 'next/server'
import * as Sentry from '@sentry/nextjs'

import { STORE_PAUSED_NOTICE, STORE_SALES_ENABLED } from '@/data/storeConfig'
import { getSiteUrl } from '@/lib/siteUrl'
import { getStripe } from '@/lib/stripe'
import { getSupabaseServer } from '@/lib/supabase-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Body = { productId?: string }

export async function POST(req: NextRequest) {
  // 판매 중지 킬스위치는 서버에서도 강제한다. UI(CheckoutButton 등)에만 두면
  // 이 라우트를 직접 호출하는 것만으로 우회되고, 가격·전달물이 확정되지 않은
  // 상품에 실결제가 성립한다. 모든 외부 호출(Supabase·Stripe)보다 앞에서 끊는다.
  if (!STORE_SALES_ENABLED) {
    return NextResponse.json({ error: STORE_PAUSED_NOTICE }, { status: 409 })
  }

  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const productId = body.productId?.trim()
  if (!productId) {
    return NextResponse.json({ error: 'productId 필요' }, { status: 400 })
  }

  const supabase = getSupabaseServer()
  const { data: product, error } = await supabase
    .from('studio_products')
    .select('id, name, description, price_cents, currency, image_url, stripe_price_id, active')
    .eq('id', productId)
    .maybeSingle()

  if (error) {
    console.error('[/api/checkout] supabase error:', error.message)
    Sentry.captureMessage(`[/api/checkout] supabase error: ${error.message}`, 'error')
    return NextResponse.json(
      { error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 },
    )
  }
  if (!product) {
    return NextResponse.json({ error: '상품을 찾을 수 없습니다' }, { status: 404 })
  }
  if (!product.active) {
    return NextResponse.json({ error: '비활성 상품' }, { status: 409 })
  }

  const stripe = getStripe()
  // 항상 정식 사이트 origin 사용. Origin 헤더 신뢰 시 결제 후 외부 도메인 리다이렉트 위험.
  const origin = getSiteUrl()

  // stripe_price_id가 진짜 Price ID(`price_...`)일 때만 사용.
  // Product ID(`prod_...`)나 빈 값이면 inline price_data로 폴백.
  const hasUsablePriceId =
    typeof product.stripe_price_id === 'string' &&
    product.stripe_price_id.startsWith('price_')

  const lineItem = hasUsablePriceId
    ? { price: product.stripe_price_id!, quantity: 1 }
    : {
        quantity: 1,
        price_data: {
          currency: product.currency.toLowerCase(),
          unit_amount: product.price_cents,
          product_data: {
            name: product.name,
            description: product.description ?? undefined,
            images: product.image_url ? [product.image_url] : undefined,
          },
        },
      }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [lineItem],
      success_url: `${origin}/store/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/store/${productId}`,
      metadata: { studio_product_id: product.id },
      payment_intent_data: {
        metadata: { studio_product_id: product.id },
      },
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (err) {
    console.error('[/api/checkout] stripe error:', err)
    Sentry.captureException(err)
    return NextResponse.json({ error: 'Stripe 세션 생성 실패' }, { status: 502 })
  }
}
