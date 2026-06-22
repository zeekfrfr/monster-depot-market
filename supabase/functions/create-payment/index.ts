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
  // Active launch lineup
  'peanut-butter-brownie-cookie': 'Peanut Butter Brownie Cookie',
  'cardamom-coffee-cake': 'Cardamom Coffee Cake',
  'volcano-cake': 'Volcano Cake',
  'strawberry-swirl': 'Strawberry Swirl',
  'honey-cinnamon-crumble': 'Honey Cinnamon Crumble',
  // Hidden (Phase 2) — data preserved, not publicly purchasable
  'vanilla-honey-crumble': 'Vanilla Honey Crumble',
  'apple-fritter': 'Apple Fritter',
  'strawberry-shortcake': 'Strawberry Shortcake',
  'blueberry-cake-donut': 'Blueberry Cake Donut',
  'monster-cookie': 'Monster Cookie',
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

// Every purchasable topping and its price in cents (mirrors TOPPINGS in lib/products.ts).
const TOPPING_CENTS: Record<string, number> = {
  'Honey Drizzle': 89,
  'Vanilla Glaze': 79,
  'Stroopwafel Crumble': 99,
  'Chocolate Chips': 99,
  'Protein Peanut Butter Drizzle': 249,
  'Strawberry Jam Reserve': 129,
}

interface IncomingTopping {
  name: string
  price?: number
}

interface IncomingMixEntry {
  slug: string
  qty?: number
}

interface IncomingItem {
  slug: string
  name?: string
  format: string
  toppings?: IncomingTopping[]
  mix?: IncomingMixEntry[]
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

  // Price toppings from the trusted map; reject anything unrecognized.
  const toppings: { name: string; price_cents: number }[] = []
  let toppingCents = 0
  for (const t of item.toppings ?? []) {
    const tc = TOPPING_CENTS[t?.name]
    if (tc === undefined) return { error: `Unknown topping: ${t?.name}` }
    toppings.push({ name: t.name, price_cents: tc })
    toppingCents += tc
  }

  // Mix & Match 7-pack: any blend of real flavors totaling exactly 7 pouches.
  // Priced at the flat mixmatch7 rate regardless of which flavors are chosen.
  if (format === 'mixmatch7') {
    const mix: { slug: string; name: string; qty: number }[] = []
    let count = 0
    for (const m of item.mix ?? []) {
      const mixName = FLAVORS[m?.slug]
      if (!mixName) return { error: `Unknown flavor in mix: ${m?.slug}` }
      const qty = Number(m?.qty ?? 0)
      if (!Number.isInteger(qty) || qty < 1) return { error: `Invalid mix quantity for ${m?.slug}` }
      mix.push({ slug: m.slug, name: mixName, qty })
      count += qty
    }
    if (count !== 7) return { error: 'Mix & Match must total exactly 7 pouches.' }

    const base = FORMAT_CENTS.mixmatch7
    const lineCents = base + toppingCents
    return {
      cents: lineCents,
      line: {
        slug: 'mixmatch7',
        name: 'Mix & Match 7-pack',
        format,
        formatLabel: FORMAT_LABELS[format],
        base_cents: base,
        mix,
        toppings,
        line_cents: lineCents,
      },
    }
  }

  // Single / 7-pack must reference a real flavor.
  const flavorName = FLAVORS[item.slug]
  if (!flavorName) return { error: `Unknown flavor: ${item.slug}` }

  const base = FORMAT_CENTS[format]
  if (base === undefined) return { error: `Unknown format: ${format}` }

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
