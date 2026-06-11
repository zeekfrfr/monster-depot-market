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

export default function PaymentSheet({
  total,
  itemCount,
  onBack,
  onSuccess,
}: PaymentSheetProps) {
  const { items, clearCart } = useCart()
  const cardRef = useRef<SquareCard | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardReady, setCardReady] = useState(false)
  const [noCredentials, setNoCredentials] = useState(false)

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
            '.input-container': {
              borderColor: 'transparent',
              borderBottomColor: '#E0DED8',
              borderRadius: '0',
            },
            '.input-container.is-focus': {
              borderColor: 'transparent',
              borderBottomColor: '#1A1A1A',
            },
            input: {
              fontSize: '15px',
              fontFamily: "'DM Sans', sans-serif",
              color: '#1A1A1A',
              backgroundColor: 'transparent',
            },
            '.message-text': {
              fontSize: '11px',
              color: '#8A8A8A',
            },
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
    if (!cardRef.current) return
    setLoading(true)
    setError(null)

    try {
      const result = await cardRef.current.tokenize()

      if (result.status !== 'OK' || !result.token) {
        setError('Card tokenization failed. Please check your card details.')
        setLoading(false)
        return
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: result.token,
          amount: Math.round(total * 100),
          lineItems: items.map((i) => ({
            name: `${i.flavor} — ${i.modeName}`,
            quantity: i.quantity,
            amount: Math.round(i.price * 100),
          })),
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '20px 24px 16px',
          borderBottom: '1px solid var(--mid-gray)',
          flexShrink: 0,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            fontSize: '18px',
            lineHeight: 1,
            padding: '4px',
            fontFamily: 'inherit',
          }}
          aria-label="Back to cart"
        >
          ←
        </button>
        <span
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 500,
            color: 'var(--text-primary)',
          }}
        >
          Payment
        </span>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {noCredentials ? (
          <div
            style={{
              padding: '32px 0',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}
            >
              Payment is not yet configured.
              <br />
              Add your Square credentials to{' '}
              <code
                style={{
                  fontSize: 'var(--text-xs)',
                  backgroundColor: 'var(--light-gray)',
                  padding: '2px 6px',
                  borderRadius: '2px',
                }}
              >
                .env.local
              </code>{' '}
              to enable checkout.
            </p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '24px' }}>
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '16px',
                }}
              >
                Card details
              </p>
              <div id="square-card-container" style={{ minHeight: '90px' }} />
              {!cardReady && !noCredentials && (
                <p
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-tertiary)',
                    marginTop: '12px',
                  }}
                >
                  Loading payment form…
                </p>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderTop: '1px solid var(--mid-gray)',
                marginBottom: '8px',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                }}
              >
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
              <span
                style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: 500,
                  letterSpacing: '-0.02em',
                }}
              >
                ${total.toFixed(2)}
              </span>
            </div>

            {error && (
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: '#c0392b',
                  marginBottom: '12px',
                }}
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
            padding: '16px 24px 32px',
            borderTop: '1px solid var(--mid-gray)',
            flexShrink: 0,
          }}
        >
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
        </div>
      )}
    </div>
  )
}
