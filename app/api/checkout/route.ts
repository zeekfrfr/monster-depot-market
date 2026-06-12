import { NextRequest, NextResponse } from 'next/server'

const EDGE_FN = 'https://vmoqfnkwswwbewzsbyqb.supabase.co/functions/v1/create-payment'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const res = await fetch(EDGE_FN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.ok ? 200 : res.status })
}
