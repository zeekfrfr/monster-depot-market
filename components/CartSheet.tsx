'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart'
import PaymentSheet from './PaymentSheet'

export default function CartSheet() {
  const { items, removeItem, isOpen, closeCart, total, itemCount } = useCart()
  const [isClosing, setIsClosing] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [orderConfirmed, setOrderConfirmed] = useState<{ orderId: string; email: string } | null>(null)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      closeCart()
      setShowPayment(false)
      setOrderConfirmed(null)
    }, 250)
  }

  const handleOrderSuccess = (orderId: string, email: string) => {
    setOrderConfirmed({ orderId, email })
    setShowPayment(false)
  }

  if (!isOpen && !isClosing) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={isClosing ? 'page-exit' : 'page-enter'}
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.18)',
          zIndex: 40,
        }}
      />

      {/* Sheet */}
      <div
        className={isClosing ? 'sheet-exit' : 'sheet-enter'}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: '#fff',
          borderRadius: '16px 16px 0 0',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {showPayment ? (
          <PaymentSheet
            total={total}
            itemCount={itemCount}
            onBack={() => setShowPayment(false)}
            onSuccess={handleOrderSuccess}
          />
        ) : orderConfirmed ? (
          <OrderConfirmation
            orderId={orderConfirmed.orderId}
            email={orderConfirmed.email}
            onClose={handleClose}
          />
        ) : (
          <CartContents
            items={items}
            removeItem={removeItem}
            total={total}
            onCheckout={() => setShowPayment(true)}
            onClose={handleClose}
          />
        )}
      </div>
    </>
  )
}

function CartContents({
  items,
  removeItem,
  total,
  onCheckout,
  onClose,
}: {
  items: ReturnType<typeof useCart>['items']
  removeItem: (id: string) => void
  total: number
  onCheckout: () => void
  onClose: () => void
}) {
  return (
    <>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px 16px',
          borderBottom: '1px solid var(--mid-gray)',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 500,
            color: 'var(--text-primary)',
          }}
        >
          Cart
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-tertiary)',
            fontSize: '20px',
            lineHeight: 1,
            padding: '4px',
            fontFamily: 'inherit',
          }}
          aria-label="Close cart"
        >
          ✕
        </button>
      </div>

      {/* Items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }}>
        {items.length === 0 ? (
          <p
            style={{
              padding: '40px 0',
              textAlign: 'center',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-tertiary)',
            }}
          >
            Your cart is empty.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                padding: '16px 0',
                borderBottom: '1px solid var(--mid-gray)',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px',
                  }}
                >
                  <span
                    style={{
                      fontSize: 'var(--text-base)',
                      fontWeight: 400,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {item.flavor}
                  </span>
                  <span
                    style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 400,
                      color: 'var(--text-tertiary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {item.modeName}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {item.formatLabel} · {item.sizeLabel}
                  {item.quantity > 1 && (
                    <span style={{ marginLeft: '8px', color: 'var(--text-tertiary)' }}>
                      ×{item.quantity}
                    </span>
                  )}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flexShrink: 0,
                  marginLeft: '16px',
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--text-base)',
                    fontWeight: 500,
                    letterSpacing: '-0.02em',
                    color: 'var(--text-primary)',
                  }}
                >
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-tertiary)',
                    fontSize: '14px',
                    padding: '4px',
                    transition: 'color 150ms ease',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.color = 'var(--text-tertiary)'
                  }}
                  aria-label={`Remove ${item.flavor}`}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div
          style={{
            padding: '16px 24px 32px',
            borderTop: '1px solid var(--mid-gray)',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <span style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>
              Subtotal
            </span>
            <span
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 500,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
              }}
            >
              ${total.toFixed(2)}
            </span>
          </div>
          <button
            onClick={onCheckout}
            style={{
              width: '100%',
              height: '52px',
              backgroundColor: '#1A1A1A',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: 'var(--text-base)',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '-0.01em',
              transition: 'opacity 150ms ease',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.opacity = '0.85'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.opacity = '1'
            }}
          >
            Checkout
          </button>
        </div>
      )}
    </>
  )
}

function OrderConfirmation({
  orderId,
  email,
  onClose,
}: {
  orderId: string
  email: string
  onClose: () => void
}) {
  const router = useRouter()
  const shortId = orderId.slice(-8).toUpperCase()

  const handleClose = () => {
    onClose()
    router.push('/')
  }

  return (
    <div
      style={{
        padding: '56px 32px 48px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 0,
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: 'var(--text-3xl)',
          fontWeight: 300,
          letterSpacing: '0.1em',
          color: 'var(--text-primary)',
          lineHeight: 1.1,
          marginBottom: '28px',
        }}
      >
        Order confirmed.
      </p>

      <p
        style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 400,
          color: 'var(--text-secondary)',
          letterSpacing: '-0.01em',
          marginBottom: '8px',
        }}
      >
        #{shortId}
      </p>

      <p
        style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 300,
          color: 'var(--text-secondary)',
          letterSpacing: '-0.01em',
          marginBottom: '4px',
        }}
      >
        Ships within 3–5 business days.
      </p>

      <p
        style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 300,
          color: 'var(--text-tertiary)',
          letterSpacing: '-0.01em',
          marginBottom: '40px',
        }}
      >
        A confirmation has been sent to {email}.
      </p>

      <button
        onClick={handleClose}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          textDecoration: 'underline',
          textUnderlineOffset: '3px',
          fontFamily: 'inherit',
          letterSpacing: '-0.01em',
        }}
      >
        Close
      </button>
    </div>
  )
}
