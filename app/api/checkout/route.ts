import { NextRequest, NextResponse } from 'next/server'

const SQUARE_BASE =
  process.env.NODE_ENV === 'production'
    ? 'https://connect.squareup.com'
    : 'https://connect.squareupsandbox.com'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { sourceId, amount } = body

  if (!process.env.SQUARE_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: { message: 'Payment not configured. Add SQUARE_ACCESS_TOKEN to environment variables.' } },
      { status: 503 }
    )
  }

  if (!sourceId || !amount) {
    return NextResponse.json(
      { error: { message: 'Missing sourceId or amount.' } },
      { status: 400 }
    )
  }

  const response = await fetch(`${SQUARE_BASE}/v2/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
      'Square-Version': '2024-01-17',
    },
    body: JSON.stringify({
      source_id: sourceId,
      idempotency_key: crypto.randomUUID(),
      amount_money: {
        amount,
        currency: 'USD',
      },
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    const errMsg = data.errors?.[0]?.detail ?? 'Payment failed.'
    return NextResponse.json({ error: { message: errMsg } }, { status: 400 })
  }

  return NextResponse.json({ orderId: data.payment.id, status: 'SUCCESS' })
}
