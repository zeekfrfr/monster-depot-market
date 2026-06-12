import { NextRequest, NextResponse } from 'next/server'

const EDGE_FN = 'https://vmoqfnkwswwbewzsbyqb.supabase.co/functions/v1/create-payment'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { sourceId, amount, lineItems } = body

  if (!sourceId || !amount) {
    return NextResponse.json(
      { error: { message: 'Missing sourceId or amount.' } },
      { status: 400 }
    )
  }

  const res = await fetch(EDGE_FN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sourceId, amount, lineItems }),
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.ok ? 200 : res.status })
}
