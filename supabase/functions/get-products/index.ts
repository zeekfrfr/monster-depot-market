import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!
  )

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      format,
      catalog_key,
      price_cents,
      sort_order,
      product_flavors ( id, name, sort_order )
    `)
    .eq('status', 'active')
    .eq('category', 'mdm')
    .order('sort_order')

  if (error) {
    console.error('get-products error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to load products.' }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ products }),
    { status: 200, headers: { ...CORS, 'Content-Type': 'application/json' } }
  )
})
