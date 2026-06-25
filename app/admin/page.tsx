'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'

interface OrderItem {
  name: string
  formatLabel: string
  line_cents: number
  toppings?: { name: string }[]
}

interface AdminOrder {
  id: string
  created_at: string
  status: string
  total: number
  email: string
  customer_name: string | null
  shipping_address1: string | null
  shipping_address2: string | null
  shipping_city: string | null
  shipping_state: string | null
  shipping_zip: string | null
  tracking_number: string | null
  items: OrderItem[]
}

interface AdminFlavor {
  slug: string
  name: string
  stock_status: string
  active: boolean
}

const STATUSES = ['pending', 'paid', 'packed', 'shipped', 'delivered', 'cancelled']
const FN_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/admin-orders`

export default function AdminPage() {
  const router = useRouter()
  const supabase = getSupabase()

  const [phase, setPhase] = useState<'loading' | 'denied' | 'ready'>('loading')
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [token, setToken] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [savingId, setSavingId] = useState<string | null>(null)
  const [flavors, setFlavors] = useState<AdminFlavor[]>([])
  const [stockSavingSlug, setStockSavingSlug] = useState<string | null>(null)

  const callFn = useCallback(async (accessToken: string, body: object) => {
    const res = await fetch(FN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    return { ok: res.ok, status: res.status, data }
  }, [])

  useEffect(() => {
    if (!supabase) {
      router.replace('/login')
      return
    }
    let cancelled = false
    ;(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token
      if (!accessToken) {
        router.replace('/login')
        return
      }
      const [r, fr] = await Promise.all([
        callFn(accessToken, { action: 'list' }),
        callFn(accessToken, { action: 'listFlavors' }),
      ])
      if (cancelled) return
      if (!r.ok) {
        setPhase('denied')
        return
      }
      setToken(accessToken)
      setOrders((r.data.orders as AdminOrder[]) ?? [])
      setFlavors((fr.data?.flavors as AdminFlavor[]) ?? [])
      setDrafts(
        Object.fromEntries(
          ((r.data.orders as AdminOrder[]) ?? []).map((o) => [o.id, o.tracking_number ?? '']),
        ),
      )
      setPhase('ready')
    })()
    return () => {
      cancelled = true
    }
  }, [supabase, router, callFn])

  const save = async (order: AdminOrder, status: string, tracking: string) => {
    if (!token) return
    setSavingId(order.id)
    const r = await callFn(token, {
      action: 'updateStatus',
      orderId: order.id,
      status,
      tracking_number: tracking,
    })
    if (r.ok) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, status, tracking_number: tracking.trim() || null } : o,
        ),
      )
    }
    setSavingId(null)
  }

  const setStock = async (slug: string, stock_status: string) => {
    if (!token) return
    setStockSavingSlug(slug)
    const r = await callFn(token, { action: 'setStock', slug, stock_status })
    if (r.ok) {
      setFlavors((prev) => prev.map((f) => (f.slug === slug ? { ...f, stock_status } : f)))
    }
    setStockSavingSlug(null)
  }

  if (phase === 'loading') {
    return (
      <div style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-purple-light)', animation: 'acctPulse 1s ease-in-out infinite' }} />
        <style>{`@keyframes acctPulse { 0%,100% { opacity: .3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.4); } }`}</style>
      </div>
    )
  }

  if (phase === 'denied') {
    return (
      <main style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 'var(--space-6)', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 24, color: 'var(--text-primary)', margin: 0 }}>Not authorized</h1>
        <p style={{ fontFamily: 'var(--font-dm-sans)', color: 'var(--text-secondary)', margin: 0 }}>This area is for store admins only.</p>
        <Link href="/" style={{ color: 'var(--brand-purple-light)', fontFamily: 'var(--font-dm-sans)', fontWeight: 500, textDecoration: 'none' }}>← Back to home</Link>
      </main>
    )
  }

  const revenueCents = orders
    .filter((o) => o.status !== 'cancelled' && o.status !== 'pending')
    .reduce((s, o) => s + (o.total ?? 0), 0)
  const toFulfill = orders.filter((o) => o.status === 'paid' || o.status === 'packed').length

  return (
    <main style={{ minHeight: '100svh', background: 'var(--surface-white)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '120px var(--space-6) 96px' }}>
        <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: '0 0 24px' }}>
          Orders
        </h1>

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 40 }}>
          <SummaryCard label="Orders" value={String(orders.length)} />
          <SummaryCard label="Revenue" value={`$${(revenueCents / 100).toFixed(2)}`} />
          <SummaryCard label="To fulfill" value={String(toFulfill)} />
        </div>

        {flavors.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 18, color: 'var(--text-primary)', margin: '0 0 12px' }}>Stock</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {flavors.map((f) => (
                <div key={f.slug} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8, border: '1px solid #E5E5E5', borderRadius: 'var(--radius-md)', padding: '10px 14px' }}>
                  <span style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 500, fontSize: 14, color: 'var(--text-primary)' }}>{f.name}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {([['in_stock', 'In stock'], ['low_stock', 'Low'], ['sold_out', 'Sold out']] as const).map(([val, label]) => {
                      const on = f.stock_status === val
                      return (
                        <button
                          key={val}
                          type="button"
                          disabled={stockSavingSlug === f.slug}
                          onClick={() => setStock(f.slug, val)}
                          style={{
                            fontFamily: 'var(--font-dm-sans)',
                            fontSize: 12,
                            fontWeight: 500,
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-full)',
                            cursor: 'pointer',
                            border: on ? '1px solid var(--brand-purple-light)' : '1px solid #E5E5E5',
                            background: on ? 'var(--brand-purple-light)' : 'transparent',
                            color: on ? '#fff' : 'var(--text-secondary)',
                          }}
                        >
                          {label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-dm-sans)', color: 'var(--text-secondary)' }}>No orders yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map((o) => {
              const addr = [
                o.shipping_address1,
                o.shipping_address2,
                [o.shipping_city, o.shipping_state, o.shipping_zip].filter(Boolean).join(', '),
              ]
                .filter(Boolean)
                .join(' · ')
              return (
                <div key={o.id} style={{ border: '1px solid #E5E5E5', borderRadius: 'var(--radius-lg)', padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
                      #{o.id.slice(-8).toUpperCase()}
                    </span>
                    <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 12, color: 'var(--text-tertiary)' }}>
                      {new Date(o.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </span>
                  </div>

                  <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 13, color: 'var(--text-primary)', margin: '0 0 2px', fontWeight: 500 }}>
                    {o.customer_name ?? '—'} · <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>{o.email}</span>
                  </p>
                  {addr && (
                    <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 12, color: 'var(--text-secondary)', margin: '0 0 8px' }}>{addr}</p>
                  )}

                  <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 12px' }}>
                    {(o.items ?? []).map((it, i) => (
                      <span key={i}>
                        {it.name} · {it.formatLabel}
                        {it.toppings?.length ? ` (+${it.toppings.length})` : ''}
                        {i < (o.items?.length ?? 0) - 1 ? ' • ' : ''}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>
                      ${(o.total / 100).toFixed(2)}
                    </span>

                    <select
                      value={o.status}
                      onChange={(e) => save(o, e.target.value, drafts[o.id] ?? '')}
                      disabled={savingId === o.id}
                      style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 13, padding: '8px 10px', borderRadius: 'var(--radius-md)', border: '1px solid #E5E5E5', background: 'var(--surface-white)', color: 'var(--text-primary)', cursor: 'pointer' }}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>

                    <input
                      placeholder="Tracking #"
                      value={drafts[o.id] ?? ''}
                      onChange={(e) => setDrafts((d) => ({ ...d, [o.id]: e.target.value }))}
                      style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 13, padding: '8px 10px', borderRadius: 'var(--radius-md)', border: '1px solid #E5E5E5', background: 'var(--surface-white)', color: 'var(--text-primary)', minWidth: 140 }}
                    />
                    <button
                      type="button"
                      onClick={() => save(o, o.status, drafts[o.id] ?? '')}
                      disabled={savingId === o.id}
                      style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 500, fontSize: 13, padding: '8px 14px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--brand-purple-light)', color: '#fff', cursor: 'pointer' }}
                    >
                      {savingId === o.id ? 'Saving…' : 'Save'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: 'var(--surface-off)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
      <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 12, color: 'var(--text-tertiary)', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
      <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 24, color: 'var(--text-primary)', margin: 0 }}>{value}</p>
    </div>
  )
}
