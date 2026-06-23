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

  let body: { action?: string; orderId?: string; status?: string; tracking_number?: string } = {}
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

  return json(400, { error: 'Unknown action.' })
})
