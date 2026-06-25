import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SQUARE_BASE = {
  sandbox: 'https://connect.squareupsandbox.com',
  production: 'https://connect.squareup.com',
}

// ---- Trusted catalog ----
// The live catalog lives in the DB (mdm_flavors / mdm_toppings / mdm_pricing) so
// prices and toppings can change without redeploying this function. The maps
// below are a FALLBACK only — used if the DB is unreachable or a table is empty,
// so a bad fetch can never take checkout down. Browser-supplied prices are always
// ignored; every line is recomputed here.
const FLAVORS_FALLBACK: Record<string, { name: string; price_cents: number; stock_status: string }> = {
  'peanut-butter-brownie-cookie': { name: 'Peanut Butter Brownie Cookie', price_cents: 899, stock_status: 'in_stock' },
  'cardamom-coffee-cake': { name: 'Cardamom Coffee Cake', price_cents: 899, stock_status: 'in_stock' },
  'volcano-cake': { name: 'Volcano Cake', price_cents: 899, stock_status: 'in_stock' },
  'strawberry-swirl': { name: 'Strawberry Swirl', price_cents: 899, stock_status: 'in_stock' },
  'honey-cinnamon-crumble': { name: 'Honey Cinnamon Crumble', price_cents: 899, stock_status: 'in_stock' },
}

const FORMAT_CENTS_FALLBACK: Record<string, number> = {
  single: 899,
  '7pack': 2999,
  mixmatch7: 3199,
  'weekly-sub': 2799,
}

const TOPPING_CENTS_FALLBACK: Record<string, number> = {
  'Honey Drizzle': 89,
  'Vanilla Glaze': 79,
  'Stroopwafel Crumble': 99,
  'Chocolate Chips': 99,
  'Protein Peanut Butter Drizzle': 249,
  'Strawberry Jam Reserve': 129,
}

const FORMAT_LABELS: Record<string, string> = {
  single: 'Single',
  '7pack': '7-pack',
  mixmatch7: 'Mix & Match 7-pack',
  'weekly-sub': 'Weekly subscription',
}

interface Catalog {
  flavors: Record<string, { name: string; price_cents: number; stock_status: string }>
  toppingCents: Record<string, number>
  formatCents: Record<string, number>
}

// deno-lint-ignore no-explicit-any
async function loadCatalog(supabase: any): Promise<Catalog> {
  try {
    const [f, t, p] = await Promise.all([
      supabase.from('mdm_flavors').select('slug,name,price_cents,stock_status').eq('active', true),
      supabase.from('mdm_toppings').select('name,price_cents').eq('active', true),
      supabase.from('mdm_pricing').select('format,price_cents'),
    ])

    const flavors: Record<string, { name: string; price_cents: number; stock_status: string }> = {}
    for (const r of f.data ?? []) flavors[r.slug] = { name: r.name, price_cents: r.price_cents, stock_status: r.stock_status ?? 'in_stock' }

    const toppingCents: Record<string, number> = {}
    for (const r of t.data ?? []) toppingCents[r.name] = r.price_cents

    const formatCents: Record<string, number> = {}
    for (const r of p.data ?? []) formatCents[r.format] = r.price_cents

    // Fall back per-map if a table came back empty (misconfig / fetch issue).
    return {
      flavors: Object.keys(flavors).length ? flavors : FLAVORS_FALLBACK,
      toppingCents: Object.keys(toppingCents).length ? toppingCents : TOPPING_CENTS_FALLBACK,
      formatCents: Object.keys(formatCents).length ? formatCents : FORMAT_CENTS_FALLBACK,
    }
  } catch (_e) {
    return {
      flavors: FLAVORS_FALLBACK,
      toppingCents: TOPPING_CENTS_FALLBACK,
      formatCents: FORMAT_CENTS_FALLBACK,
    }
  }
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
function priceItem(item: IncomingItem, catalog: Catalog): { line: Record<string, unknown>; cents: number } | { error: string } {
  const format = item.format
  if (!FORMAT_LABELS[format]) return { error: `Unknown format: ${format}` }

  // Subscription is a flat one-time charge for launch (no recurring billing).
  if (format === 'weekly-sub') {
    const cents = catalog.formatCents['weekly-sub'] ?? FORMAT_CENTS_FALLBACK['weekly-sub']
    return {
      cents,
      line: {
        slug: 'weekly-sub',
        name: item.name ?? 'Weekly Subscription',
        format,
        formatLabel: FORMAT_LABELS[format],
        base_cents: cents,
        toppings: [],
        line_cents: cents,
      },
    }
  }

  // Price toppings from the trusted catalog; reject anything unrecognized.
  const toppings: { name: string; price_cents: number }[] = []
  let toppingCents = 0
  for (const t of item.toppings ?? []) {
    const tc = catalog.toppingCents[t?.name]
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
      const flavor = catalog.flavors[m?.slug]
      if (!flavor) return { error: `Unknown flavor in mix: ${m?.slug}` }
      if (flavor.stock_status === 'sold_out') return { error: `${flavor.name} is sold out.` }
      const qty = Number(m?.qty ?? 0)
      if (!Number.isInteger(qty) || qty < 1) return { error: `Invalid mix quantity for ${m?.slug}` }
      mix.push({ slug: m.slug, name: flavor.name, qty })
      count += qty
    }
    if (count !== 7) return { error: 'Mix & Match must total exactly 7 pouches.' }

    const base = catalog.formatCents['mixmatch7'] ?? FORMAT_CENTS_FALLBACK['mixmatch7']
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

  // Single / 7-pack must reference a real, in-stock flavor.
  const flavor = catalog.flavors[item.slug]
  if (!flavor) return { error: `Unknown flavor: ${item.slug}` }
  if (flavor.stock_status === 'sold_out') return { error: `${flavor.name} is sold out.` }

  // Single is priced per-flavor; 7-pack uses the flat pack rate.
  const base = format === 'single'
    ? flavor.price_cents
    : (catalog.formatCents[format] ?? FORMAT_CENTS_FALLBACK[format])
  if (base === undefined) return { error: `Unknown format: ${format}` }

  const lineCents = base + toppingCents
  return {
    cents: lineCents,
    line: {
      slug: item.slug,
      name: flavor.name,
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

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Load the trusted catalog from the DB (falls back to constants on failure).
  const catalog = await loadCatalog(supabase)

  // Recompute every line server-side.
  const orderItems: Record<string, unknown>[] = []
  let totalCents = 0
  for (const item of cartItems) {
    const priced = priceItem(item, catalog)
    if ('error' in priced) return err(400, priced.error)
    orderItems.push(priced.line)
    totalCents += priced.cents
  }

  // Flat shipping on physical pouches, charged once per order. Weekly
  // subscription and the 50c test product ship free. DB-driven amount.
  const shippable = cartItems.some((i) => i.format !== 'weekly-sub' && i.slug !== 'test-product')
  const shippingCents = shippable ? (catalog.formatCents['shipping'] ?? 500) : 0
  totalCents += shippingCents

  if (totalCents <= 0) return err(400, 'Order total must be greater than zero.')

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
      shipping_cents: shippingCents,
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
