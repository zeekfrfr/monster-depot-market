'use client'

import { useState, useEffect, useRef } from 'react'
import { useCart } from '@/lib/cart'
import { initSquare } from '@/lib/square'

interface PaymentSheetProps {
  total: number
  itemCount: number
  onBack: () => void
  onSuccess: (orderId: string) => void
}

interface SquareCard {
  attach: (selector: string) => Promise<void>
  tokenize: () => Promise<{ status: string; token?: string; errors?: unknown[] }>
  destroy: () => Promise<void>
}

const REQUIRED = ['name', 'email', 'address1', 'city', 'state', 'zip'] as const

export default function PaymentSheet({ total, itemCount, onBack, onSuccess }: PaymentSheetProps) {
  const { items, clearCart } = useCart()
  const cardRef = useRef<SquareCard | null>(null)

  const [shipping, setShipping] = useState({
    name: '', email: '', address1: '', address2: '', city: '', state: '', zip: '',
  })
  const [focused, setFocused] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardReady, setCardReady] = useState(false)
  const [noCredentials, setNoCredentials] = useState(false)

  const set = (field: keyof typeof shipping) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipping(prev => ({ ...prev, [field]: e.target.value }))
    if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: '' }))
  }

  useEffect(() => {
    let mounted = true
    async function setupCard() {
      const payments = await initSquare()
      if (!mounted) return
      if (!payments) { setNoCredentials(true); return }
      try {
        const card = await payments.card({
          style: {
            '.input-container': { borderColor: 'transparent', borderBottomColor: '#E0DED8', borderRadius: '0' },
            '.input-container.is-focus': { borderColor: 'transparent', borderBottomColor: '#1A1A1A' },
            input: { fontSize: '15px', fontFamily: "'DM Sans', sans-serif", color: '#1A1A1A', backgroundColor: 'transparent' },
            '.message-text': { fontSize: '11px', color: '#8A8A8A' },
          },
        })
        await card.attach('#square-card-container')
        if (!mounted) return
        cardRef.current = card
        setCardReady(true)
      } catch {
        if (mounted) setError('Could not load payment form. Please try again.')
      }
    }
    setupCard()
    return () => { mounted = false; cardRef.current?.destroy().catch(() => {}) }
  }, [])

  const handlePay = async () => {
    const errors: Record<string, string> = {}
    for (const f of REQUIRED) {
      if (!shipping[f].trim()) errors[f] = 'Required'
    }
    if (shipping.email && !shipping.email.includes('@')) errors.email = 'Enter a valid email'
    if (Object.keys(errors).length) { setFieldErrors(errors); return }

    if (!cardRef.current) return
    setLoading(true)
    setError(null)

    const result = await cardRef.current.tokenize()
    if (result.status !== 'OK' || !result.token) {
      setError('Card details invalid. Please check and try again.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: result.token,
          email: shipping.email,
          cartItems: items,
          shipping: {
            name: shipping.name,
            address1: shipping.address1,
            address2: shipping.address2 || undefined,
            city: shipping.city,
            state: shipping.state,
            zip: shipping.zip,
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error?.message ?? 'Payment failed. Please try again.')
        setLoading(false)
        return
      }
      clearCart()
      onSuccess(data.orderId)
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%',
    border: 'none',
    borderBottom: `1px solid ${fieldErrors[field] ? '#c0392b' : focused === field ? '#1A1A1A' : 'var(--mid-gray)'}`,
    borderRadius: 0,
    padding: '12px 0',
    fontSize: '15px',
    fontFamily: 'inherit',
    background: 'transparent',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'border-color 150ms ease',
    boxSizing: 'border-box',
  })

  const sectionLabel: React.CSSProperties = {
    fontSize: 'var(--text-xs)',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '16px',
  }

  const errText: React.CSSProperties = {
    fontSize: '11px',
    color: '#c0392b',
    marginTop: '3px',
  }

  const fp = (field: string) => ({
    onFocus: () => setFocused(field),
    onBlur: () => setFocused(null),
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 24px 16px', borderBottom: '1px solid var(--mid-gray)', flexShrink: 0 }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '18px', lineHeight: 1, padding: '4px', fontFamily: 'inherit' }}
          aria-label="Back to cart"
        >←</button>
        <span style={{ fontSize: 'var(--text-base)', fontWeight: 500, color: 'var(--text-primary)' }}>
          Checkout
        </span>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {noCredentials ? (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6, padding: '32px 0', textAlign: 'center' }}>
            Payment is not yet configured.
          </p>
        ) : (
          <>
            {/* Contact */}
            <p style={sectionLabel}>Contact</p>
            <div style={{ marginBottom: '32px' }}>
              <input
                type="email"
                placeholder="Email"
                value={shipping.email}
                onChange={set('email')}
                style={inputStyle('email')}
                {...fp('email')}
              />
              {fieldErrors.email && <p style={errText}>{fieldErrors.email}</p>}
            </div>

            {/* Shipping */}
            <p style={sectionLabel}>Shipping address</p>
            <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '0' }}>
              <div>
                <input placeholder="Full name" value={shipping.name} onChange={set('name')} style={inputStyle('name')} {...fp('name')} />
                {fieldErrors.name && <p style={errText}>{fieldErrors.name}</p>}
              </div>
              <div>
                <input placeholder="Address" value={shipping.address1} onChange={set('address1')} style={inputStyle('address1')} {...fp('address1')} />
                {fieldErrors.address1 && <p style={errText}>{fieldErrors.address1}</p>}
              </div>
              <div>
                <input placeholder="Apt, suite, unit (optional)" value={shipping.address2} onChange={set('address2')} style={inputStyle('address2')} {...fp('address2')} />
              </div>
              <div>
                <input placeholder="City" value={shipping.city} onChange={set('city')} style={inputStyle('city')} {...fp('city')} />
                {fieldErrors.city && <p style={errText}>{fieldErrors.city}</p>}
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <input placeholder="State" value={shipping.state} onChange={set('state')} style={inputStyle('state')} {...fp('state')} maxLength={2} />
                  {fieldErrors.state && <p style={errText}>{fieldErrors.state}</p>}
                </div>
                <div style={{ flex: 1 }}>
                  <input placeholder="ZIP" value={shipping.zip} onChange={set('zip')} style={inputStyle('zip')} {...fp('zip')} maxLength={10} />
                  {fieldErrors.zip && <p style={errText}>{fieldErrors.zip}</p>}
                </div>
              </div>
            </div>

            {/* Card */}
            <p style={sectionLabel}>Card details</p>
            <div style={{ marginBottom: '24px' }}>
              <div id="square-card-container" style={{ minHeight: '90px' }} />
              {!cardReady && (
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: '12px' }}>
                  Loading payment form…
                </p>
              )}
            </div>

            {/* Order summary */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid var(--mid-gray)', marginBottom: '8px' }}>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
              <span style={{ fontSize: 'var(--text-base)', fontWeight: 500, letterSpacing: '-0.02em' }}>
                ${total.toFixed(2)}
              </span>
            </div>

            {error && (
              <p style={{ fontSize: 'var(--text-sm)', color: '#c0392b', marginTop: '8px', lineHeight: 1.5 }}>
                {error}
              </p>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      {!noCredentials && (
        <div style={{ padding: '16px 24px 32px', borderTop: '1px solid var(--mid-gray)', flexShrink: 0 }}>
          <button
            onClick={handlePay}
            disabled={loading || !cardReady}
            style={{
              width: '100%',
              height: '52px',
              backgroundColor: loading || !cardReady ? 'var(--mid-gray)' : '#1A1A1A',
              color: loading || !cardReady ? 'var(--text-secondary)' : '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: 'var(--text-base)',
              fontWeight: 500,
              cursor: loading || !cardReady ? 'default' : 'pointer',
              fontFamily: 'inherit',
              transition: 'background-color 150ms ease',
            }}
          >
            {loading ? 'Processing…' : `Pay $${total.toFixed(2)}`}
          </button>
          <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: '12px', lineHeight: 1.5 }}>
            By placing your order you agree to our{' '}
            <a href="/terms" target="_blank" style={{ color: 'var(--text-secondary)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>Terms</a>
            {' '}and{' '}
            <a href="/refund-policy" target="_blank" style={{ color: 'var(--text-secondary)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>Refund Policy</a>.
          </p>
        </div>
      )}
    </div>
  )
}
