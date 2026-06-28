import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(status: number, data: object): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

// Statuses the admin can set, in fulfillment order.
const VALID_STATUSES = ['pending', 'paid', 'packed', 'shipped', 'delivered', 'cancelled']

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  // The caller's Supabase access token (from their logged-in session).
  const token = (req.headers.get('Authorization') ?? '').replace('Bearer ', '').trim()
  if (!token) return json(401, { error: 'Not signed in.' })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  // Validate the token and resolve the caller's email.
  const { data: userData, error: userErr } = await supabase.auth.getUser(token)
  const email = userData?.user?.email
  if (userErr || !email) return json(401, { error: 'Not signed in.' })

  // Must be an active admin.
  const { data: adminRow } = await supabase
    .from('admin_users')
    .select('email, status')
    .eq('email', email)
    .eq('status', 'active')
    .maybeSingle()
  if (!adminRow) return json(403, { error: 'Not authorized.' })

  let body: { action?: string; orderId?: string; status?: string; tracking_number?: string; slug?: string; stock_status?: string; kind?: string; active?: boolean } = {}
  try {
    body = await req.json()
  } catch {
    return json(400, { error: 'Invalid request body.' })
  }

  if (body.action === 'list') {
    const { data, error } = await supabase
      .from('orders')
      .select(
        'id, created_at, status, total, email, customer_name, shipping_address1, shipping_address2, shipping_city, shipping_state, shipping_zip, tracking_number, carrier, items, square_payment_id',
      )
      .order('created_at', { ascending: false })
      .limit(500)
    if (error) return json(500, { error: error.message })
    return json(200, { orders: data ?? [] })
  }

  if (body.action === 'updateStatus') {
    if (!body.orderId) return json(400, { error: 'Missing orderId.' })
    if (!body.status || !VALID_STATUSES.includes(body.status)) {
      return json(400, { error: 'Invalid status.' })
    }
    const patch: Record<string, unknown> = { status: body.status }
    if (typeof body.tracking_number === 'string') {
      patch.tracking_number = body.tracking_number.trim() || null
    }
    const { error } = await supabase.from('orders').update(patch).eq('id', body.orderId)
    if (error) return json(500, { error: error.message })
    return json(200, { ok: true })
  }

  if (body.action === 'listFlavors') {
    const { data, error } = await supabase
      .from('mdm_flavors')
      .select('slug, name, stock_status, active')
      .order('sort_order')
    if (error) return json(500, { error: error.message })
    return json(200, { flavors: data ?? [] })
  }

  if (body.action === 'setStock') {
    const STOCK = ['in_stock', 'low_stock', 'sold_out']
    const table = body.kind === 'lift' ? 'mdm_lift_flavors' : 'mdm_flavors'
    if (!body.slug) return json(400, { error: 'Missing slug.' })
    if (!body.stock_status || !STOCK.includes(body.stock_status)) {
      return json(400, { error: 'Invalid stock status.' })
    }
    const { error } = await supabase
      .from(table)
      .update({ stock_status: body.stock_status })
      .eq('slug', body.slug)
    if (error) return json(500, { error: error.message })
    return json(200, { ok: true })
  }

  if (body.action === 'listLiftFlavors') {
    const { data, error } = await supabase
      .from('mdm_lift_flavors')
      .select('slug, name, stock_status, active')
      .order('sort_order')
    if (error) return json(500, { error: error.message })
    return json(200, { lift: data ?? [] })
  }

  if (body.action === 'setActive') {
    const table = body.kind === 'lift' ? 'mdm_lift_flavors' : 'mdm_flavors'
    if (!body.slug) return json(400, { error: 'Missing slug.' })
    if (typeof body.active !== 'boolean') return json(400, { error: 'Missing active flag.' })
    const { error } = await supabase.from(table).update({ active: body.active }).eq('slug', body.slug)
    if (error) return json(500, { error: error.message })
    return json(200, { ok: true })
  }

  if (body.action === 'listProfiles') {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, marketing_opt_in, created_at')
      .order('created_at', { ascending: false })
      .limit(1000)
    if (error) return json(500, { error: error.message })
    return json(200, { profiles: data ?? [] })
  }

  return json(400, { error: 'Unknown action.' })
})
