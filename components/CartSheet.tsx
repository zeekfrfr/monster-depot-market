'use client'

import { useState } from 'react'
import { useCart, FORMAT_LABELS, itemTotal, type CartItem } from '@/lib/cart'
import PaymentSheet from './PaymentSheet'

type View = 'cart' | 'payment' | 'confirmed'

export default function CartSheet() {
  const {
    cart,
    removeItem,
    removeTopping,
    isOpen,
    closeCart,
    total,
    count,
  } = useCart()

  const [view, setView] = useState<View>('cart')
  const [confirm, setConfirm] = useState<{ orderId: string; email: string } | null>(null)

  if (!isOpen) return null

  const handleClose = () => {
    closeCart()
    // Reset for next open after the sheet has left the screen.
    setView('cart')
    setConfirm(null)
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="overlay-enter"
        onClick={handleClose}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 201,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Sheet */}
      <div
        className="sheet-enter"
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 202,
          background: 'var(--surface-white)',
          borderTopLeftRadius: 'var(--radius-xl)',
          borderTopRightRadius: 'var(--radius-xl)',
          maxHeight: '85svh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
        }}
      >
        {view === 'payment' ? (
          <PaymentSheet
            total={total}
            count={count}
            onBack={() => setView('cart')}
            onSuccess={(orderId, email) => {
              setConfirm({ orderId, email })
              setView('confirmed')
            }}
          />
        ) : view === 'confirmed' && confirm ? (
          <Confirmation
            orderId={confirm.orderId}
            email={confirm.email}
            onClose={handleClose}
          />
        ) : (
          <CartView
            cart={cart}
            total={total}
            removeItem={removeItem}
            removeTopping={removeTopping}
            onClose={closeCart}
            onCheckout={() => setView('payment')}
          />
        )}
      </div>
    </>
  )
}

/* ─────────────────────────────  CART VIEW  ───────────────────────────── */

function CartView({
  cart,
  total,
  removeItem,
  removeTopping,
  onClose,
  onCheckout,
}: {
  cart: CartItem[]
  total: number
  removeItem: (id: string) => void
  removeTopping: (id: string, toppingIndex: number) => void
  onClose: () => void
  onCheckout: () => void
}) {
  const empty = cart.length === 0

  const scrollToWorlds = () => {
    onClose()
    // Defer until the overlay unmounts so the target is reachable.
    requestAnimationFrame(() => {
      document.getElementById('flavor-worlds')?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  return (
    <>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-5) var(--space-6) var(--space-4)',
          flexShrink: 0,
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: '22px',
            color: 'var(--text-primary)',
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          Your cart
        </h2>
        <button
          onClick={onClose}
          aria-label="Close cart"
          style={{
            width: '36px',
            height: '36px',
            minWidth: '36px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--surface-off)',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            fontSize: '16px',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'inherit',
          }}
        >
          ✕
        </button>
      </div>

      {/* Items / Empty */}
      <div
        className="no-scrollbar"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: empty ? 0 : '0 var(--space-6)',
        }}
      >
        {empty ? (
          <div
            style={{
              minHeight: '40svh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: 'var(--space-8) var(--space-6)',
              gap: 'var(--space-4)',
            }}
          >
            <span aria-hidden="true" style={{ fontSize: '52px', opacity: 0.16, lineHeight: 1 }}>
              🛒
            </span>
            <p
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 400,
                fontSize: '16px',
                color: 'var(--text-secondary)',
                margin: 0,
              }}
            >
              Nothing here yet.
            </p>
            <button
              onClick={scrollToWorlds}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 500,
                fontSize: '15px',
                color: 'var(--brand-purple-light)',
                padding: 'var(--space-2)',
                minHeight: '44px',
              }}
            >
              Pick your pouch →
            </button>
          </div>
        ) : (
          cart.map((item) => (
            <CartLine
              key={item.id}
              item={item}
              onRemoveItem={() => removeItem(item.id)}
              onRemoveTopping={(idx) => removeTopping(item.id, idx)}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          flexShrink: 0,
          padding: 'var(--space-4) var(--space-6) calc(var(--space-6) + env(safe-area-inset-bottom, 0px))',
          borderTop: '1px solid var(--surface-off)',
          background: 'var(--surface-white)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-3)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 400,
              fontSize: '14px',
              color: 'var(--text-secondary)',
            }}
          >
            Subtotal
          </span>
          <span
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 700,
              fontSize: '20px',
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}
          >
            ${total.toFixed(2)}
          </span>
        </div>
        <button
          onClick={onCheckout}
          disabled={empty}
          style={{
            width: '100%',
            minHeight: '52px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: empty ? 'var(--text-disabled)' : 'var(--brand-purple-light)',
            color: '#FFFFFF',
            fontFamily: 'var(--font-syne)',
            fontWeight: 700,
            fontSize: '16px',
            cursor: empty ? 'default' : 'pointer',
            transition: 'background-color var(--dur-fast) var(--ease-out)',
          }}
        >
          Checkout →
        </button>
        <p
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 300,
            fontSize: '12px',
            color: 'var(--text-tertiary)',
            textAlign: 'center',
            margin: 'var(--space-3) 0 0',
          }}
        >
          Free shipping on all subscriptions
        </p>
      </div>
    </>
  )
}

/* ─────────────────────────────  CART LINE  ───────────────────────────── */

function CartLine({
  item,
  onRemoveItem,
  onRemoveTopping,
}: {
  item: CartItem
  onRemoveItem: () => void
  onRemoveTopping: (toppingIndex: number) => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-3)',
        padding: 'var(--space-4) 0',
        borderBottom: '1px solid var(--surface-off)',
      }}
    >
      {/* Accent dot */}
      <span
        aria-hidden="true"
        style={{
          width: '12px',
          height: '12px',
          minWidth: '12px',
          borderRadius: 'var(--radius-full)',
          background: item.accent,
          marginTop: '5px',
        }}
      />

      {/* Name + format + toppings */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 500,
            fontSize: '15px',
            color: 'var(--text-primary)',
            lineHeight: 1.3,
          }}
        >
          {item.name}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 300,
            fontSize: '13px',
            color: 'var(--text-secondary)',
            marginTop: '2px',
          }}
        >
          {FORMAT_LABELS[item.format]}
        </div>

        {item.toppings.map((topping, idx) => (
          <div
            key={`${topping.name}-${idx}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              marginLeft: '20px',
              marginTop: 'var(--space-2)',
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 300,
              fontSize: '13px',
              color: 'var(--text-secondary)',
            }}
          >
            <span style={{ flex: 1, minWidth: 0 }}>
              + {topping.name}
            </span>
            <span style={{ whiteSpace: 'nowrap' }}>
              ${topping.price.toFixed(2)}
            </span>
            <button
              onClick={() => onRemoveTopping(idx)}
              aria-label={`Remove topping ${topping.name}`}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-tertiary)',
                fontSize: '12px',
                lineHeight: 1,
                minWidth: '24px',
                minHeight: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'inherit',
                padding: 0,
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Price + remove item */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 600,
            fontSize: '14px',
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
          }}
        >
          ${itemTotal(item).toFixed(2)}
        </span>
        <button
          onClick={onRemoveItem}
          aria-label={`Remove ${item.name}`}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-tertiary)',
            fontSize: '14px',
            lineHeight: 1,
            minWidth: '24px',
            minHeight: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'inherit',
            padding: 0,
            transition: 'color var(--dur-fast) var(--ease-out)',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.color = '#EF4444'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.color = 'var(--text-tertiary)'
          }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}

/* ────────────────────────────  CONFIRMATION  ─────────────────────────── */

function Confirmation({
  orderId,
  email,
  onClose,
}: {
  orderId: string
  email: string
  onClose: () => void
}) {
  return (
    <div
      className="no-scrollbar"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--space-12) var(--space-6) calc(var(--space-10) + env(safe-area-inset-bottom, 0px))',
        overflowY: 'auto',
        gap: 'var(--space-3)',
        minHeight: '40svh',
      }}
    >
      <span aria-hidden="true" className="anim-fade-up-sm" style={{ fontSize: '48px', lineHeight: 1, marginBottom: 'var(--space-2)' }}>
        🎉
      </span>

      <h2
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 800,
          fontSize: '26px',
          color: 'var(--text-primary)',
          margin: 0,
          letterSpacing: '-0.02em',
        }}
      >
        Order confirmed.
      </h2>

      <p
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 700,
          fontSize: '15px',
          letterSpacing: '0.08em',
          color: 'var(--brand-purple-light)',
          margin: 0,
        }}
      >
        #{orderId.slice(-8).toUpperCase()}
      </p>

      <p
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontWeight: 400,
          fontSize: '15px',
          color: 'var(--text-secondary)',
          margin: 'var(--space-2) 0 0',
        }}
      >
        Ships within 3–5 business days.
      </p>

      <p
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontWeight: 300,
          fontSize: '14px',
          color: 'var(--text-tertiary)',
          margin: 0,
          lineHeight: 1.5,
          maxWidth: '320px',
        }}
      >
        A confirmation has been sent to {email}.
      </p>

      <button
        onClick={onClose}
        style={{
          marginTop: 'var(--space-6)',
          minHeight: '52px',
          padding: '0 var(--space-8)',
          borderRadius: 'var(--radius-md)',
          border: 'none',
          background: 'var(--brand-purple-light)',
          color: '#FFFFFF',
          fontFamily: 'var(--font-syne)',
          fontWeight: 700,
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        Close
      </button>
    </div>
  )
}
