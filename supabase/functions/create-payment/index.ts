import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SQUARE_BASE = {
  sandbox: 'https://connect.squareupsandbox.com',
  production: 'https://connect.squareup.com',
}

interface CartItem {
  mode: string
  modeName: string
  flavor: string
  format: string
  formatLabel: string
  size: string
  sizeLabel: string
  quantity: number
}

interface Shipping {
  name: string
  address1: string
  address2?: string
  city: string
  state: string
  zip: string
}

function err(status: number, message: string): Response {
  return new Response(
    JSON.stringify({ error: { message } }),
    { status, headers: { ...CORS, 'Content-Type': 'application/json' } }
  )
}

function ok(data: object): Response {
  return new Response(
    JSON.stringify(data),
    { status: 200, headers: { ...CORS, 'Content-Type': 'application/json' } }
  )
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  // Parse body
  let token: string, cartItems: CartItem[], shipping: Shipping, email: string, userId: string | undefined
  try {
    ;({ token, cartItems, shipping, email, userId } = await req.json())
  } catch {
    return err(400, 'Invalid request body.')
  }

  // userId is optional (guest checkout leaves it undefined); reject junk values
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (userId !== undefined && (typeof userId !== 'string' || !UUID_RE.test(userId))) {
    userId = undefined
  }

  // Validate inputs
  if (!token) return err(400, 'Missing card token.')
  if (!email || !email.includes('@')) return err(400, 'Valid email required.')
  if (!cartItems?.length) return err(400, 'Cart is empty.')
  if (!shipping?.name || !shipping?.address1 || !shipping?.city || !shipping?.state || !shipping?.zip) {
    return err(400, 'Incomplete shipping details.')
  }

  // Supabase client with service-role key (bypasses RLS)
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Recompute total server-side from products table
  const catalogKeys = [...new Set(cartItems.map(i => `${i.mode}-${i.format}-${i.size}`))]
  const { data: products, error: dbErr } = await supabase
    .from('products')
    .select('catalog_key, price_cents')
    .in('catalog_key', catalogKeys)
    .eq('status', 'active')

  if (dbErr || !products?.length) {
    console.error('Products lookup failed:', dbErr)
    return err(500, 'Could not load product catalog.')
  }

  const priceMap = new Map(products.map(p => [p.catalog_key as string, p.price_cents as number]))

  // Verify every cart item exists in catalog
  for (const item of cartItems) {
    const key = `${item.mode}-${item.format}-${item.size}`
    if (!priceMap.has(key)) return err(400, `Unknown product: ${key}`)
    if ((item.quantity ?? 0) < 1) return err(400, `Invalid quantity for ${key}`)
  }

  // Server-computed total — browser total is ignored
  const totalCents = cartItems.reduce((sum, item) => {
    return sum + priceMap.get(`${item.mode}-${item.format}-${item.size}`)! * item.quantity
  }, 0)

  if (totalCents <= 0) return err(400, 'Order total must be greater than zero.')

  // Select Square credentials by environment
  const env = (Deno.env.get('SQUARE_ENVIRONMENT') ?? 'sandbox') as 'sandbox' | 'production'
  const isProd = env === 'production'
  const accessToken = Deno.env.get(isProd ? 'SQUARE_PROD_ACCESS_TOKEN' : 'SQUARE_SANDBOX_ACCESS_TOKEN')
  const locationId = Deno.env.get(isProd ? 'SQUARE_PROD_LOCATION_ID' : 'SQUARE_SANDBOX_LOCATION_ID')

  if (!accessToken || !locationId) return err(503, 'Payment not configured.')

  // Charge Square
  const squareRes = await fetch(`${SQUARE_BASE[env]}/v2/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'Square-Version': '2024-01-17',
    },
    body: JSON.stringify({
      source_id: token,
      idempotency_key: crypto.randomUUID(),
      amount_money: { amount: totalCents, currency: 'USD' },
      location_id: locationId,
    }),
  })

  const squareData = await squareRes.json() as {
    payment?: { id: string }
    errors?: { detail?: string }[]
  }

  if (!squareRes.ok) {
    const msg = squareData.errors?.[0]?.detail ?? 'Payment failed.'
    return err(400, msg)
  }

  const squarePaymentId = squareData.payment!.id

  // Build enriched line items for the order record
  const orderItems = cartItems.map(item => ({
    mode: item.mode,
    modeName: item.modeName,
    flavor: item.flavor,
    format: item.format,
    formatLabel: item.formatLabel,
    size: item.size,
    sizeLabel: item.sizeLabel,
    quantity: item.quantity,
    unit_price_cents: priceMap.get(`${item.mode}-${item.format}-${item.size}`)!,
  }))

  // Write order — service-role key bypasses RLS.
  // user_id only included when a logged-in user checked out, so guest
  // inserts keep working even before the user_id column migration runs.
  const { data: order, error: insertErr } = await supabase
    .from('orders')
    .insert({
      ...(userId ? { user_id: userId } : {}),
      email,
      items: orderItems,
      total: totalCents,
      status: 'paid',
      square_payment_id: squarePaymentId,
      customer_name: shipping.name,
      shipping_address1: shipping.address1,
      shipping_address2: shipping.address2 ?? null,
      shipping_city: shipping.city,
      shipping_state: shipping.state,
      shipping_zip: shipping.zip,
      shipping_country: 'US',
    })
    .select('id')
    .single()

  if (insertErr || !order) {
    // Payment succeeded — log and return Square payment ID so the order can be manually recovered
    console.error('Order DB write failed after successful charge:', insertErr, 'square_payment_id:', squarePaymentId)
    return ok({ orderId: squarePaymentId, status: 'SUCCESS', _warn: 'db_write_failed' })
  }

  // Fire-and-forget: send confirmation + admin alert
  const notifyUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-order-notification`
  fetch(notifyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
    },
    body: JSON.stringify({ orderId: order.id, email, items: orderItems, totalCents, shipping }),
  }).catch(e => console.error('Notification dispatch error:', e))

  return ok({ orderId: order.id, status: 'SUCCESS' })
})
