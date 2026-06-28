// Server-side access to the trusted Monster Depot catalog (mdm_* tables).
// Public, anon-readable via RLS; ISR-cached so price/topping edits go live
// within the revalidate window without a redeploy. Mirrors lib/recipes.ts.

export interface CatalogTopping {
  name: string
  price: number
}

export interface CatalogLift {
  slug: string
  name: string
  price: number
  stock: string
}

export interface Catalog {
  // slug -> single-pouch price in dollars (active flavors only)
  flavorPrice: Record<string, number>
  // slug -> 'in_stock' | 'low_stock' | 'sold_out'
  stock: Record<string, string>
  sevenPack: number | null
  mixMatch: number | null
  weeklySub: number | null
  shipping: number | null
  toppings: CatalogTopping[]
  lift: CatalogLift[]
}

// Safe fallback: every consumer falls back to the static lib/products.ts values
// for any field that's missing here, so an empty catalog never breaks the UI.
export const EMPTY_CATALOG: Catalog = {
  flavorPrice: {},
  stock: {},
  sevenPack: null,
  mixMatch: null,
  weeklySub: null,
  shipping: null,
  toppings: [],
  lift: [],
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function restGet<T>(query: string): Promise<T[]> {
  if (!SUPABASE_URL || !ANON_KEY) return []
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${query}`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
      // ISR: edited prices/toppings appear within the hour without a redeploy.
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    return (await res.json()) as T[]
  } catch {
    return []
  }
}

export async function getCatalog(): Promise<Catalog> {
  const [flavors, toppings, pricing, lift] = await Promise.all([
    restGet<{ slug: string; price_cents: number; stock_status: string }>(
      'mdm_flavors?select=slug,price_cents,stock_status&active=eq.true',
    ),
    restGet<{ name: string; price_cents: number }>(
      'mdm_toppings?select=name,price_cents&active=eq.true&order=sort_order.asc',
    ),
    restGet<{ format: string; price_cents: number }>('mdm_pricing?select=format,price_cents'),
    restGet<{ slug: string; name: string; price_cents: number; stock_status: string }>(
      'mdm_lift_flavors?select=slug,name,price_cents,stock_status&active=eq.true&order=sort_order.asc',
    ),
  ])

  const flavorPrice: Record<string, number> = {}
  const stock: Record<string, string> = {}
  for (const f of flavors) {
    flavorPrice[f.slug] = f.price_cents / 100
    stock[f.slug] = f.stock_status ?? 'in_stock'
  }

  const fmt: Record<string, number> = {}
  for (const p of pricing) fmt[p.format] = p.price_cents / 100

  return {
    flavorPrice,
    stock,
    sevenPack: fmt['7pack'] ?? null,
    mixMatch: fmt['mixmatch7'] ?? null,
    weeklySub: fmt['weekly-sub'] ?? null,
    shipping: fmt['shipping'] ?? null,
    toppings: toppings.map((t) => ({ name: t.name, price: t.price_cents / 100 })),
    lift: lift.map((l) => ({ slug: l.slug, name: l.name, price: l.price_cents / 100, stock: l.stock_status ?? 'in_stock' })),
  }
}
