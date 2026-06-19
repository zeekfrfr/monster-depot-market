'use client'

import { useState, useEffect, useRef } from 'react'
import { useCart } from '@/lib/cart'
import { initSquare } from '@/lib/square'
import { getSupabase } from '@/lib/supabase'

interface PaymentSheetProps {
  total: number
  count: number
  onBack: () => void
  onSuccess: (orderId: string, email: string) => void
}

interface SquareCard {
  attach: (selector: string) => Promise<void>
  tokenize: () => Promise<{ status: string; token?: string; errors?: unknown[] }>
  destroy: () => Promise<void>
}

const REQUIRED = ['email', 'name', 'address1', 'city', 'state', 'zip'] as const

export default function PaymentSheet({ total, count, onBack, onSuccess }: PaymentSheetProps) {
  const { cart, clearCart } = useCart()
  const cardRef = useRef<SquareCard | null>(null)

  const [shipping, setShipping] = useState({
    email: '', name: '', address1: '', address2: '', city: '', state: '', zip: '',
  })
  const [focused, setFocused] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardReady, setCardReady] = useState(false)
  const [noCredentials, setNoCredentials] = useState(false)

  const set = (field: keyof typeof shipping) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipping((prev) => ({ ...prev, [field]: e.target.value }))
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: '' }))
  }

  // Square setup: attach a hosted card field on mount, destroy on unmount.
  useEffect(() => {
    let mounted = true
    async function setupCard() {
      const payments = await initSquare()
      if (!mounted) return
      if (!payments) {
        setNoCredentials(true)
        return
      }
      try {
        const card = await payments.card({
          style: {
            input: {
              fontSize: '15px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#1A1A1A',
              backgroundColor: 'transparent',
            },
            '.input-container': {
              borderColor: 'transparent',
              borderBottomColor: '#D1D5DB',
              borderRadius: '0',
            },
            '.input-container.is-focus': {
              borderColor: 'transparent',
              borderBottomColor: '#2D1B69',
            },
            '.message-text': { fontSize: '11px', color: '#9CA3AF' },
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
    return () => {
      mounted = false
      cardRef.current?.destroy().catch(() => {})
    }
  }, [])

  const handlePay = async () => {
    const errors: Record<string, string> = {}
    for (const f of REQUIRED) {
      if (!shipping[f].trim()) errors[f] = 'Required'
    }
    if (shipping.email && !shipping.email.includes('@')) errors.email = 'Enter a valid email'
    if (Object.keys(errors).length) {
      setFieldErrors(errors)
      return
    }

    if (!cardRef.current) return
    setLoading(true)
    setError(null)

    const result = await cardRef.current.tokenize()
    if (result.status !== 'OK' || !result.token) {
      setError('Card details invalid. Please check and try again.')
      setLoading(false)
      return
    }

    // Attach user_id when a logged-in user is checking out (guests stay null).
    let userId: string | undefined
    try {
      const { data } = (await getSupabase()?.auth.getUser()) ?? { data: { user: null } }
      userId = data.user?.id
    } catch {
      userId = undefined
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: result.token,
          email: shipping.email,
          userId,
          cartItems: cart,
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
      onSuccess(data.orderId, shipping.email)
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%',
    border: 'none',
    borderBottom: `1px solid ${
      fieldErrors[field] ? '#DC2626' : focused === field ? 'var(--brand-purple-dark)' : 'var(--text-disabled)'
    }`,
    borderRadius: 0,
    padding: '12px 0',
    fontSize: '15px',
    fontFamily: 'var(--font-dm-sans)',
    background: 'transparent',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'border-color var(--dur-fast) var(--ease-out)',
    boxSizing: 'border-box',
  })

  const sectionLabel: React.CSSProperties = {
    fontSize: '11px',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: 600,
    marginBottom: 'var(--space-4)',
  }

  const errText: React.CSSProperties = {
    fontSize: '11px',
    color: '#DC2626',
    marginTop: 'var(--space-1)',
  }

  const fp = (field: string) => ({
    onFocus: () => setFocused(field),
    onBlur: () => setFocused(null),
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface-white)' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          padding: 'var(--space-5) var(--space-6) var(--space-4)',
          borderBottom: '1px solid var(--text-disabled)',
          flexShrink: 0,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            fontSize: '22px',
            lineHeight: 1,
            minWidth: '44px',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 'calc(-1 * var(--space-3))',
            fontFamily: 'inherit',
          }}
          aria-label="Back to cart"
        >
          ←
        </button>
        <span
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 700,
            fontSize: '20px',
            color: 'var(--text-primary)',
          }}
        >
          Checkout
        </span>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-6)' }}>
        {noCredentials ? (
          <p
            style={{
              fontSize: '15px',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              padding: 'var(--space-8) 0',
              textAlign: 'center',
            }}
          >
            Payment is not yet configured.
          </p>
        ) : (
          <>
            {/* Contact */}
            <p style={sectionLabel}>Contact</p>
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <input
                type="email"
                placeholder="Email"
                aria-label="Email"
                value={shipping.email}
                onChange={set('email')}
                style={inputStyle('email')}
                {...fp('email')}
              />
              {fieldErrors.email && <p style={errText}>{fieldErrors.email}</p>}
            </div>

            {/* Shipping */}
            <p style={sectionLabel}>Shipping address</p>
            <div style={{ marginBottom: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 0 }}>
              <div>
                <input
                  placeholder="Full name"
                  aria-label="Full name"
                  value={shipping.name}
                  onChange={set('name')}
                  style={inputStyle('name')}
                  {...fp('name')}
                />
                {fieldErrors.name && <p style={errText}>{fieldErrors.name}</p>}
              </div>
              <div>
                <input
                  placeholder="Address"
                  aria-label="Street address"
                  value={shipping.address1}
                  onChange={set('address1')}
                  style={inputStyle('address1')}
                  {...fp('address1')}
                />
                {fieldErrors.address1 && <p style={errText}>{fieldErrors.address1}</p>}
              </div>
              <div>
                <input
                  placeholder="Apt, suite, unit (optional)"
                  aria-label="Apartment, suite, or unit (optional)"
                  value={shipping.address2}
                  onChange={set('address2')}
                  style={inputStyle('address2')}
                  {...fp('address2')}
                />
              </div>
              <div>
                <input
                  placeholder="City"
                  aria-label="City"
                  value={shipping.city}
                  onChange={set('city')}
                  style={inputStyle('city')}
                  {...fp('city')}
                />
                {fieldErrors.city && <p style={errText}>{fieldErrors.city}</p>}
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <div style={{ flex: 1 }}>
                  <input
                    placeholder="State"
                    aria-label="State"
                    value={shipping.state}
                    onChange={set('state')}
                    style={inputStyle('state')}
                    {...fp('state')}
                    maxLength={2}
                  />
                  {fieldErrors.state && <p style={errText}>{fieldErrors.state}</p>}
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    placeholder="ZIP"
                    aria-label="ZIP code"
                    value={shipping.zip}
                    onChange={set('zip')}
                    style={inputStyle('zip')}
                    {...fp('zip')}
                    maxLength={10}
                  />
                  {fieldErrors.zip && <p style={errText}>{fieldErrors.zip}</p>}
                </div>
              </div>
            </div>

            {/* Card */}
            <p style={sectionLabel}>Card details</p>
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <div id="square-card-container" style={{ minHeight: '90px' }} />
              {!cardReady && (
                <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', marginTop: 'var(--space-3)' }}>
                  Loading payment form…
                </p>
              )}
            </div>

            {/* Order summary */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                padding: 'var(--space-3) 0',
                borderTop: '1px solid var(--text-disabled)',
                marginBottom: 'var(--space-2)',
              }}
            >
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                {count} {count === 1 ? 'item' : 'items'}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 700,
                  fontSize: '18px',
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                }}
              >
                ${total.toFixed(2)}
              </span>
            </div>

            {error && (
              <p
                role="alert"
                style={{ fontSize: '14px', color: '#DC2626', marginTop: 'var(--space-2)', lineHeight: 1.5 }}
              >
                {error}
              </p>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      {!noCredentials && (
        <div
          style={{
            padding: 'var(--space-4) var(--space-6) var(--space-8)',
            borderTop: '1px solid var(--text-disabled)',
            flexShrink: 0,
          }}
        >
          <button
            onClick={handlePay}
            disabled={loading || !cardReady}
            style={{
              width: '100%',
              minHeight: '52px',
              backgroundColor: loading || !cardReady ? 'var(--text-disabled)' : 'var(--brand-purple-light)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-syne)',
              fontWeight: 700,
              fontSize: '16px',
              cursor: loading || !cardReady ? 'default' : 'pointer',
              transition: 'background-color var(--dur-fast) var(--ease-out)',
            }}
          >
            {loading ? 'Processing…' : `Pay $${total.toFixed(2)}`}
          </button>
          <p
            style={{
              fontSize: '11px',
              color: 'var(--text-tertiary)',
              textAlign: 'center',
              marginTop: 'var(--space-3)',
              lineHeight: 1.5,
            }}
          >
            By placing your order you agree to our{' '}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-secondary)', textDecoration: 'underline', textUnderlineOffset: '2px' }}
            >
              Terms
            </a>{' '}
            and{' '}
            <a
              href="/refunds"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-secondary)', textDecoration: 'underline', textUnderlineOffset: '2px' }}
            >
              Refund Policy
            </a>
            .
          </p>
        </div>
      )}
    </div>
  )
}
