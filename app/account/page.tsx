'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import { useCart } from '@/lib/cart'
import { getModeBySlug } from '@/lib/products'

interface OrderItem {
  mode: string
  modeName: string
  flavor: string
  format: 'stick' | 'rtd'
  formatLabel: string
  size: string
  sizeLabel: string
  quantity: number
  unit_price_cents: number
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

const STATUS_LABELS: Record<string, string> = {
  paid: 'Processing',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
}

const sectionLabel: React.CSSProperties = {
  fontSize: 'var(--text-xs)',
  color: 'var(--text-tertiary)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: '20px',
}

const linkButton: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: 'var(--text-sm)',
  color: 'var(--text-secondary)',
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
  fontFamily: 'inherit',
  padding: 0,
}

export default function AccountPage() {
  const router = useRouter()
  const { addItem, openCart } = useCart()
  const supabase = getSupabase()

  const [loaded, setLoaded] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)

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
      const [{ data: orderRows }, { data: profileRow }] = await Promise.all([
        supabase!.from('orders').select('id, created_at, status, total, items').order('created_at', { ascending: false }),
        supabase!.from('profiles').select('*').eq('id', user.id).maybeSingle(),
      ])
      if (cancelled) return
      setOrders((orderRows as Order[]) ?? [])
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
    for (const item of order.items) {
      const accent = getModeBySlug(item.mode)?.accent ?? '#1A1A1A'
      const id = `${item.mode}-${item.flavor}-${item.format}-${item.size}`
        .toLowerCase()
        .replace(/\s+/g, '-')
      for (let i = 0; i < item.quantity; i++) {
        addItem({
          id,
          mode: item.mode,
          modeName: item.modeName,
          modeAccent: accent,
          flavor: item.flavor,
          format: item.format,
          formatLabel: item.formatLabel,
          size: item.size,
          sizeLabel: item.sizeLabel,
          price: item.unit_price_cents / 100,
        })
      }
    }
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
    borderBottom: '1px solid var(--mid-gray)',
    borderRadius: 0,
    padding: '10px 0',
    fontSize: '15px',
    fontFamily: 'inherit',
    background: 'transparent',
    color: 'var(--text-primary)',
    outline: 'none',
    boxSizing: 'border-box',
  }

  if (!loaded) {
    return (
      <div style={{ minHeight: 'calc(100vh - 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-tertiary)', animation: 'pulse 1s ease-in-out infinite' }} />
      </div>
    )
  }

  return (
    <main className="page-enter" style={{ maxWidth: '640px', margin: '0 auto', padding: '64px 24px 96px' }}>
      <h1
        style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 300,
          letterSpacing: '0.02em',
          color: 'var(--text-primary)',
          marginBottom: '56px',
        }}
      >
        Your account.
      </h1>

      {/* Orders */}
      <section style={{ marginBottom: '64px' }}>
        <p style={sectionLabel}>Your Orders</p>
        {orders.length === 0 ? (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            No orders yet.
          </p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              style={{ padding: '20px 0', borderBottom: '1px solid var(--mid-gray)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 500 }}>
                  #{order.id.slice(-8).toUpperCase()}
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                  {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  {'  ·  '}
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
              </div>
              {order.items.map((item, i) => (
                <p key={i} style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {item.flavor} {item.modeName} · {item.sizeLabel}
                  {item.quantity > 1 ? ` ×${item.quantity}` : ''}
                </p>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <span style={{ fontSize: 'var(--text-base)', fontWeight: 500, letterSpacing: '-0.02em' }}>
                  ${(order.total / 100).toFixed(2)}
                </span>
                <button onClick={() => reorder(order)} style={linkButton}>
                  Reorder →
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Address */}
      <section style={{ marginBottom: '64px' }}>
        <p style={sectionLabel}>Shipping Address</p>
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
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
                <p style={{ color: 'var(--text-primary)' }}>{profile.full_name}</p>
                <p>{profile.shipping_address1}{profile.shipping_address2 ? `, ${profile.shipping_address2}` : ''}</p>
                <p>{profile.shipping_city}, {profile.shipping_state} {profile.shipping_zip}</p>
              </div>
            ) : (
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                No saved address.
              </p>
            )}
            <button onClick={() => setEditing(true)} style={linkButton}>Edit →</button>
          </>
        )}
      </section>

      {/* Email preferences */}
      <section style={{ marginBottom: '80px' }}>
        <p style={sectionLabel}>Email Preferences</p>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', cursor: 'pointer', marginBottom: '20px' }}>
          <input
            type="checkbox"
            checked={optIn}
            onChange={(e) => setOptIn(e.target.checked)}
            style={{ accentColor: '#1A1A1A', width: '15px', height: '15px' }}
          />
          New flavors and session drops
        </label>
        <button onClick={savePrefs} style={{ ...linkButton, color: 'var(--text-primary)' }}>Save</button>
      </section>

      {savedNote && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          {savedNote}
        </p>
      )}

      <button onClick={signOut} style={{ ...linkButton, color: 'var(--text-tertiary)' }}>
        Sign out
      </button>
    </main>
  )
}
