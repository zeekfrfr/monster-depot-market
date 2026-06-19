import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SQUARE_BASE = {
  sandbox: 'https://connect.squareupsandbox.com',
  production: 'https://connect.squareup.com',
}

// ---- Trusted server-side catalog (mirrors lib/products.ts). ----
// Browser-supplied prices are IGNORED; every line is recomputed here so totals
// cannot be tampered with from the client.
const FLAVORS: Record<string, string> = {
  'blueberry-cake-donut': 'Blueberry Cake Donut',
  'monster-cake': 'Monster Cake',
  'vanilla-honey-crumble': 'Vanilla Honey Crumble',
  'apple-fritter': 'Apple Fritter',
  'strawberry-shortcake': 'Strawberry Shortcake',
}

// Base price in cents by pouch format.
const FORMAT_CENTS: Record<string, number> = {
  single: 899,
  '7pack': 2999,
  mixmatch7: 3199,
}

const WEEKLY_SUB_CENTS = 2799

const FORMAT_LABELS: Record<string, string> = {
  single: 'Single',
  '7pack': '7-pack',
  mixmatch7: 'Mix & Match 7-pack',
  'weekly-sub': 'Weekly subscription',
}

// Every purchasable topping and its price in cents.
const TOPPING_CENTS: Record<string, number> = {
  'Vanilla cream drizzle': 99,
  'Caramel drizzle': 89,
  'Honey drizzle': 89,
  'Strawberry jam reserve': 129,
  'Blueberry jam reserve': 129,
  'Almond crumble': 99,
  'Walnut crumble': 99,
  'Pecan crumble': 99,
  'Vanilla crumble': 79,
  'Cinnamon sugar packet': 79,
  'Freeze dried blueberries': 99,
  'Freeze dried strawberries': 99,
  'Extra freeze dried blueberries': 99,
  'Extra freeze dried strawberries': 99,
  'Extra honey packet': 89,
  'Extra crumble packet': 79,
  'Extra cinnamon sugar': 79,
}

interface IncomingTopping {
  name: string
  price?: number
}

interface IncomingItem {
  slug: string
  name?: string
  format: string
  toppings?: IncomingTopping[]
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

// Returns the priced line item, or an error string if the item is invalid.
function priceItem(item: IncomingItem): { line: Record<string, unknown>; cents: number } | { error: string } {
  const format = item.format
  if (!FORMAT_LABELS[format]) return { error: `Unknown format: ${format}` }

  // Subscription is a flat one-time charge for launch (no recurring billing).
  if (format === 'weekly-sub') {
    return {
      cents: WEEKLY_SUB_CENTS,
      line: {
        slug: 'weekly-sub',
        name: item.name ?? 'Weekly Subscription',
        format,
        formatLabel: FORMAT_LABELS[format],
        base_cents: WEEKLY_SUB_CENTS,
        toppings: [],
        line_cents: WEEKLY_SUB_CENTS,
      },
    }
  }

  // Pouch formats must reference a real flavor.
  const flavorName = FLAVORS[item.slug]
  if (!flavorName) return { error: `Unknown flavor: ${item.slug}` }

  const base = FORMAT_CENTS[format]
  if (base === undefined) return { error: `Unknown format: ${format}` }

  // Price toppings from the trusted map; reject anything unrecognized.
  const toppings: { name: string; price_cents: number }[] = []
  let toppingCents = 0
  for (const t of item.toppings ?? []) {
    const tc = TOPPING_CENTS[t?.name]
    if (tc === undefined) return { error: `Unknown topping: ${t?.name}` }
    toppings.push({ name: t.name, price_cents: tc })
    toppingCents += tc
  }

  const lineCents = base + toppingCents
  return {
    cents: lineCents,
    line: {
      slug: item.slug,
      name: flavorName,
      format,
      formatLabel: FORMAT_LABELS[format],
      base_cents: base,
      toppings,
      line_cents: lineCents,
    },
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  let token: string, cartItems: IncomingItem[], shipping: Shipping, email: string, userId: string | undefined
  try {
    ;({ token, cartItems, shipping, email, userId } = await req.json())
  } catch {
    return err(400, 'Invalid request body.')
  }

  // userId is optional (guest checkout leaves it undefined); reject junk values.
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (userId !== undefined && (typeof userId !== 'string' || !UUID_RE.test(userId))) {
    userId = undefined
  }

  if (!token) return err(400, 'Missing card token.')
  if (!email || !email.includes('@')) return err(400, 'Valid email required.')
  if (!Array.isArray(cartItems) || cartItems.length === 0) return err(400, 'Cart is empty.')
  if (!shipping?.name || !shipping?.address1 || !shipping?.city || !shipping?.state || !shipping?.zip) {
    return err(400, 'Incomplete shipping details.')
  }

  // Recompute every line server-side.
  const orderItems: Record<string, unknown>[] = []
  let totalCents = 0
  for (const item of cartItems) {
    const priced = priceItem(item)
    if ('error' in priced) return err(400, priced.error)
    orderItems.push(priced.line)
    totalCents += priced.cents
  }

  if (totalCents <= 0) return err(400, 'Order total must be greater than zero.')

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Select Square credentials by environment.
  const env = (Deno.env.get('SQUARE_ENVIRONMENT') ?? 'sandbox') as 'sandbox' | 'production'
  const isProd = env === 'production'
  const accessToken = Deno.env.get(isProd ? 'SQUARE_PROD_ACCESS_TOKEN' : 'SQUARE_SANDBOX_ACCESS_TOKEN')
  const locationId = Deno.env.get(isProd ? 'SQUARE_PROD_LOCATION_ID' : 'SQUARE_SANDBOX_LOCATION_ID')

  if (!accessToken || !locationId) return err(503, 'Payment not configured.')

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

  // Write order — service-role key bypasses RLS. user_id only included when a
  // logged-in user checked out, so guest inserts keep working.
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
    console.error('Order DB write failed after successful charge:', insertErr, 'square_payment_id:', squarePaymentId)
    return ok({ orderId: squarePaymentId, status: 'SUCCESS', _warn: 'db_write_failed' })
  }

  // Fire-and-forget: confirmation + admin alert.
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
