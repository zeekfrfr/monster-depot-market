'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSupabase } from '@/lib/supabase'
import { useCart, type CartFormat } from '@/lib/cart'
import { getFlavor } from '@/lib/products'
import type { Recipe } from '@/lib/recipes'
import RecipeCard from '@/components/RecipeCard'

interface OrderTopping {
  name: string
  price_cents: number
}

interface OrderItem {
  slug: string
  name: string
  format: CartFormat
  formatLabel: string
  base_cents: number
  toppings: OrderTopping[]
  line_cents: number
}

interface Order {
  id: string
  created_at: string
  status: string
  total: number
  items: OrderItem[]
}

interface Profile {
  id: string
  full_name: string | null
  shipping_address1: string | null
  shipping_address2: string | null
  shipping_city: string | null
  shipping_state: string | null
  shipping_zip: string | null
  marketing_opt_in: boolean
}

type Tab = 'orders' | 'recipes' | 'settings'

const STATUS_LABELS: Record<string, string> = {
  paid: 'Processing',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
}

const sectionLabel: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--text-tertiary)',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: '20px',
}

const linkButton: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '13px',
  color: 'var(--text-secondary)',
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
  fontFamily: 'inherit',
  minHeight: '44px',
  padding: '11px 0',
  display: 'inline-flex',
  alignItems: 'center',
}

export default function AccountPage() {
  const router = useRouter()
  const { addItem, openCart } = useCart()
  const supabase = getSupabase()

  const [loaded, setLoaded] = useState(false)
  const [tab, setTab] = useState<Tab>('orders')
  const [orders, setOrders] = useState<Order[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([])

  const [editing, setEditing] = useState(false)
  const [addr, setAddr] = useState({ full_name: '', shipping_address1: '', shipping_address2: '', shipping_city: '', shipping_state: '', shipping_zip: '' })
  const [optIn, setOptIn] = useState(false)
  const [savedNote, setSavedNote] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) {
      router.replace('/login')
      return
    }
    let cancelled = false
    async function load() {
      const { data: { user } } = await supabase!.auth.getUser()
      if (!user) {
        router.replace('/login')
        return
      }
      const [{ data: orderRows }, { data: profileRow }, { data: savedRows }] = await Promise.all([
        supabase!.from('orders').select('id, created_at, status, total, items').order('created_at', { ascending: false }),
        supabase!.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase!.from('saved_recipes').select('saved_at, recipes(*)').order('saved_at', { ascending: false }),
      ])
      if (cancelled) return
      setOrders((orderRows as Order[]) ?? [])
      const saved = ((savedRows as unknown as { recipes: Recipe | Recipe[] }[]) ?? [])
        .map((row) => (Array.isArray(row.recipes) ? row.recipes[0] : row.recipes))
        .filter(Boolean) as Recipe[]
      setSavedRecipes(saved)
      if (profileRow) {
        const p = profileRow as Profile
        setProfile(p)
        setAddr({
          full_name: p.full_name ?? '',
          shipping_address1: p.shipping_address1 ?? '',
          shipping_address2: p.shipping_address2 ?? '',
          shipping_city: p.shipping_city ?? '',
          shipping_state: p.shipping_state ?? '',
          shipping_zip: p.shipping_zip ?? '',
        })
        setOptIn(p.marketing_opt_in)
      }
      setLoaded(true)
    }
    load()
    return () => { cancelled = true }
  }, [supabase, router])

  const reorder = useCallback((order: Order) => {
    order.items.forEach((item, i) => {
      const flavor = getFlavor(item.slug)
      addItem({
        id: `${item.slug}-${item.format}-${Date.now()}-${i}`,
        slug: item.slug,
        name: item.name,
        format: item.format,
        price: item.base_cents / 100,
        toppings: (item.toppings ?? []).map((t) => ({ name: t.name, price: t.price_cents / 100 })),
        bg: flavor?.bg ?? 'var(--brand-purple-dark)',
        accent: flavor?.accent ?? 'var(--brand-purple-light)',
      })
    })
    openCart()
  }, [addItem, openCart])

  const saveAddress = async () => {
    if (!supabase) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('profiles').upsert({ id: user.id, email: user.email, ...addr })
    setProfile((p) => p ? { ...p, ...addr } : p)
    setEditing(false)
    setSavedNote('Address saved.')
    setTimeout(() => setSavedNote(null), 2000)
  }

  const savePrefs = async () => {
    if (!supabase) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('profiles').upsert({ id: user.id, email: user.email, marketing_opt_in: optIn })
    setSavedNote('Preferences saved.')
    setTimeout(() => setSavedNote(null), 2000)
  }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    router.push('/')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: 'none',
    borderBottom: '1px solid #E5E5E5',
    borderRadius: 0,
    padding: '10px 0',
    fontSize: '16px', // >=16px so iOS Safari doesn't zoom on focus
    fontFamily: 'inherit',
    background: 'transparent',
    color: 'var(--text-primary)',
    outline: 'none',
    boxSizing: 'border-box',
  }

  if (!loaded) {
    return (
      <div style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--brand-purple-light)', animation: 'acctPulse 1s ease-in-out infinite' }} />
        <style>{`@keyframes acctPulse { 0%,100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.4); } }`}</style>
      </div>
    )
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'orders', label: 'Orders' },
    { key: 'recipes', label: 'Recipes' },
    { key: 'settings', label: 'Settings' },
  ]

  return (
    <main style={{ minHeight: '100svh', background: 'var(--surface-white)' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '120px var(--space-6) 0' }}>
        <h1
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: '28px',
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            marginBottom: '24px',
          }}
        >
          Your account.
        </h1>
      </div>

      {/* Tab bar — sticky below the nav */}
      <div
        style={{
          position: 'sticky',
          top: 56,
          zIndex: 30,
          background: 'var(--surface-white)',
          borderBottom: '1px solid #E5E5E5',
        }}
      >
        <div role="tablist" aria-label="Account sections" style={{ maxWidth: '760px', margin: '0 auto', padding: '0 var(--space-6)', display: 'flex', gap: 'var(--space-6)' }}>
          {tabs.map((t) => {
            const active = tab === t.key
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.key)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '14px 0',
                  minHeight: '48px',
                  fontFamily: active ? 'var(--font-syne)' : 'var(--font-dm-sans)',
                  fontWeight: active ? 700 : 400,
                  fontSize: '15px',
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderBottom: active ? '2px solid var(--brand-purple-light)' : '2px solid transparent',
                  marginBottom: '-1px',
                }}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px var(--space-6) 96px' }}>
        {/* Orders tab */}
        {tab === 'orders' && (
          <section>
            <p style={sectionLabel}>Your orders</p>
            {orders.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>No orders yet.</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} style={{ padding: '20px 0', borderBottom: '1px solid #E5E5E5' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                      {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {'  ·  '}
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </div>
                  {order.items.map((item, i) => (
                    <p key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {item.name} · {item.formatLabel}
                      {item.toppings?.length ? ` (+${item.toppings.length})` : ''}
                    </p>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 500, letterSpacing: '-0.01em' }}>
                      ${(order.total / 100).toFixed(2)}
                    </span>
                    <button onClick={() => reorder(order)} style={{ ...linkButton, color: 'var(--brand-purple-light)' }}>
                      Reorder →
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>
        )}

        {/* Recipes tab */}
        {tab === 'recipes' && (
          <section>
            <p style={sectionLabel}>Saved recipes</p>
            {savedRecipes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '32px', opacity: 0.3, marginBottom: '12px' }}>🔖</div>
                <p style={{ fontSize: '16px', margin: 0 }}>No saved recipes yet.</p>
                <Link href="/recipes" style={{ display: 'inline-block', marginTop: '12px', color: 'var(--brand-purple-light)', fontSize: '14px', textDecoration: 'none' }}>
                  Browse recipes →
                </Link>
              </div>
            ) : (
              <div className="recipe-grid">
                {savedRecipes.map((r) => (
                  <RecipeCard
                    key={r.id}
                    recipe={r}
                    variant="account"
                    onRemoved={(id) => setSavedRecipes((prev) => prev.filter((x) => x.id !== id))}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Settings tab */}
        {tab === 'settings' && (
          <>
            <section style={{ marginBottom: '64px' }}>
              <p style={sectionLabel}>Shipping address</p>
              {editing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '400px' }}>
                  <input placeholder="Full name" value={addr.full_name} onChange={(e) => setAddr({ ...addr, full_name: e.target.value })} style={inputStyle} />
                  <input placeholder="Address" value={addr.shipping_address1} onChange={(e) => setAddr({ ...addr, shipping_address1: e.target.value })} style={inputStyle} />
                  <input placeholder="Apt, suite, unit (optional)" value={addr.shipping_address2} onChange={(e) => setAddr({ ...addr, shipping_address2: e.target.value })} style={inputStyle} />
                  <input placeholder="City" value={addr.shipping_city} onChange={(e) => setAddr({ ...addr, shipping_city: e.target.value })} style={inputStyle} />
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <input placeholder="State" maxLength={2} value={addr.shipping_state} onChange={(e) => setAddr({ ...addr, shipping_state: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                    <input placeholder="ZIP" maxLength={10} value={addr.shipping_zip} onChange={(e) => setAddr({ ...addr, shipping_zip: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                  </div>
                  <div style={{ display: 'flex', gap: '24px', marginTop: '20px' }}>
                    <button onClick={saveAddress} style={{ ...linkButton, color: 'var(--text-primary)' }}>Save</button>
                    <button onClick={() => setEditing(false)} style={linkButton}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  {profile?.shipping_address1 ? (
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
                      <p style={{ color: 'var(--text-primary)' }}>{profile.full_name}</p>
                      <p>{profile.shipping_address1}{profile.shipping_address2 ? `, ${profile.shipping_address2}` : ''}</p>
                      <p>{profile.shipping_city}, {profile.shipping_state} {profile.shipping_zip}</p>
                    </div>
                  ) : (
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>No saved address.</p>
                  )}
                  <button onClick={() => setEditing(true)} style={linkButton}>Edit →</button>
                </>
              )}
            </section>

            <section style={{ marginBottom: '40px' }}>
              <p style={sectionLabel}>Email preferences</p>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-primary)', cursor: 'pointer', marginBottom: '20px' }}>
                <input type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} style={{ accentColor: 'var(--brand-purple-light)', width: '15px', height: '15px' }} />
                New flavors and session drops
              </label>
              <button onClick={savePrefs} style={{ ...linkButton, color: 'var(--text-primary)' }}>Save</button>
            </section>
          </>
        )}

        {savedNote && (
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '24px' }}>{savedNote}</p>
        )}

        <div style={{ marginTop: '48px', borderTop: '1px solid #E5E5E5', paddingTop: '24px' }}>
          <button onClick={signOut} style={{ ...linkButton, color: 'var(--text-tertiary)' }}>Sign out</button>
        </div>
      </div>
    </main>
  )
}
