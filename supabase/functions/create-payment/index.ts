const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SQUARE_BASE = {
  sandbox: 'https://connect.squareupsandbox.com',
  production: 'https://connect.squareup.com',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS })
  }

  const env = (Deno.env.get('SQUARE_ENVIRONMENT') ?? 'sandbox') as 'sandbox' | 'production'
  const isProd = env === 'production'

  const accessToken = Deno.env.get(
    isProd ? 'SQUARE_PROD_ACCESS_TOKEN' : 'SQUARE_SANDBOX_ACCESS_TOKEN'
  )
  const locationId = Deno.env.get(
    isProd ? 'SQUARE_PROD_LOCATION_ID' : 'SQUARE_SANDBOX_LOCATION_ID'
  )

  if (!accessToken || !locationId) {
    return new Response(
      JSON.stringify({ error: { message: 'Payment credentials not configured.' } }),
      { status: 503, headers: { ...CORS, 'Content-Type': 'application/json' } }
    )
  }

  let sourceId: string, amount: number, lineItems: unknown
  try {
    ;({ sourceId, amount, lineItems } = await req.json())
  } catch {
    return new Response(
      JSON.stringify({ error: { message: 'Invalid request body.' } }),
      { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } }
    )
  }

  if (!sourceId || !amount) {
    return new Response(
      JSON.stringify({ error: { message: 'Missing sourceId or amount.' } }),
      { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } }
    )
  }

  const squareRes = await fetch(`${SQUARE_BASE[env]}/v2/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'Square-Version': '2024-01-17',
    },
    body: JSON.stringify({
      source_id: sourceId,
      idempotency_key: crypto.randomUUID(),
      amount_money: { amount, currency: 'USD' },
      location_id: locationId,
    }),
  })

  const data = await squareRes.json()

  if (!squareRes.ok) {
    const msg = (data as { errors?: { detail?: string }[] }).errors?.[0]?.detail ?? 'Payment failed.'
    return new Response(
      JSON.stringify({ error: { message: msg } }),
      { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } }
    )
  }

  const payment = (data as { payment: { id: string } }).payment
  return new Response(
    JSON.stringify({ orderId: payment.id, status: 'SUCCESS' }),
    { status: 200, headers: { ...CORS, 'Content-Type': 'application/json' } }
  )
})
