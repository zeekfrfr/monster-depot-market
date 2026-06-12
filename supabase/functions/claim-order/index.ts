import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function err(status: number, message: string): Response {
  return new Response(
    JSON.stringify({ error: { message } }),
    { status, headers: { ...CORS, 'Content-Type': 'application/json' } }
  )
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  const jwt = (req.headers.get('Authorization') ?? '').replace('Bearer ', '')
  if (!jwt) return err(401, 'Not signed in.')

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: { user }, error: authErr } = await admin.auth.getUser(jwt)
  if (authErr || !user?.email) return err(401, 'Not signed in.')

  let orderId: string, marketingOptIn: boolean
  try {
    ;({ orderId, marketingOptIn } = await req.json())
  } catch {
    return err(400, 'Invalid body.')
  }
  if (!orderId) return err(400, 'Missing orderId.')

  const { data: order, error: orderErr } = await admin
    .from('orders')
    .select('id, email, user_id, customer_name, shipping_address1, shipping_address2, shipping_city, shipping_state, shipping_zip, shipping_country')
    .eq('id', orderId)
    .single()

  if (orderErr || !order) return err(404, 'Order not found.')

  // Only the buyer can claim — order email must match the authenticated user
  if (order.email?.toLowerCase() !== user.email.toLowerCase()) {
    return err(403, 'This order belongs to a different email address.')
  }
  if (order.user_id && order.user_id !== user.id) {
    return err(409, 'Order already linked to another account.')
  }

  const { error: profileErr } = await admin.from('profiles').upsert({
    id: user.id,
    email: user.email,
    full_name: order.customer_name,
    shipping_address1: order.shipping_address1,
    shipping_address2: order.shipping_address2,
    shipping_city: order.shipping_city,
    shipping_state: order.shipping_state,
    shipping_zip: order.shipping_zip,
    shipping_country: order.shipping_country ?? 'US',
    marketing_opt_in: !!marketingOptIn,
    updated_at: new Date().toISOString(),
  })
  if (profileErr) {
    console.error('Profile upsert failed:', profileErr)
    return err(500, 'Could not save profile.')
  }

  const { error: linkErr } = await admin
    .from('orders')
    .update({ user_id: user.id })
    .eq('id', orderId)
  if (linkErr) {
    console.error('Order link failed:', linkErr)
    return err(500, 'Could not link order.')
  }

  return new Response(JSON.stringify({ claimed: true }), {
    status: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
})
