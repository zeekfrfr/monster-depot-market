'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import { useCart } from '@/lib/cart'

// Hidden, admin-only utility: drops a $0.50 item in the cart so you can run a
// real Production card charge cheaply to confirm Square works end to end.
export default function TestPage() {
  const router = useRouter()
  const supabase = getSupabase()
  const { addItem, openCart } = useCart()
  const [phase, setPhase] = useState<'loading' | 'denied' | 'ready'>('loading')

  useEffect(() => {
    if (!supabase) {
      router.replace('/login')
      return
    }
    let cancelled = false
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) {
        router.replace('/login')
        return
      }
      const { data } = await supabase
        .from('admin_users')
        .select('email')
        .eq('email', user.email)
        .eq('status', 'active')
        .maybeSingle()
      if (!cancelled) setPhase(data ? 'ready' : 'denied')
    })()
    return () => {
      cancelled = true
    }
  }, [supabase, router])

  const addTest = () => {
    addItem({
      id: `test-product-${Date.now()}`,
      slug: 'test-product',
      name: 'Test Product',
      format: 'single',
      price: 0.5,
      toppings: [],
      bg: 'var(--brand-purple-dark)',
      accent: 'var(--brand-purple-light)',
    })
    openCart()
  }

  const wrap: React.CSSProperties = {
    minHeight: '100svh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 'var(--space-6)',
    textAlign: 'center',
  }

  if (phase === 'loading') {
    return (
      <div style={wrap}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-purple-light)', animation: 'acctPulse 1s ease-in-out infinite' }} />
        <style>{`@keyframes acctPulse { 0%,100% { opacity:.3; transform:scale(1); } 50% { opacity:1; transform:scale(1.4); } }`}</style>
      </div>
    )
  }

  if (phase === 'denied') {
    return (
      <main style={wrap}>
        <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 24, color: 'var(--text-primary)', margin: 0 }}>Not authorized</h1>
        <p style={{ fontFamily: 'var(--font-dm-sans)', color: 'var(--text-secondary)', margin: 0 }}>This utility is for store admins only.</p>
      </main>
    )
  }

  return (
    <main style={wrap}>
      <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 24, color: 'var(--text-primary)', margin: 0 }}>Production test</h1>
      <p style={{ fontFamily: 'var(--font-dm-sans)', color: 'var(--text-secondary)', maxWidth: 360, margin: 0, lineHeight: 1.5 }}>
        Adds a $0.50 test item to your cart so you can run a real card charge and confirm Square works. Ships free — total is exactly 50¢.
      </p>
      <button
        type="button"
        onClick={addTest}
        style={{ minHeight: 52, padding: '0 28px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--brand-purple-light)', color: '#fff', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
      >
        Add $0.50 test item →
      </button>
    </main>
  )
}
