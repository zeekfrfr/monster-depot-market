'use client'

import Link from 'next/link'
import { useCart, FORMAT_LABELS, itemTotal } from '../../lib/cart'

export default function CartPage() {
  const { cart, removeItem, removeTopping, total, openCart } = useCart()

  return (
    <main style={page}>
      <h1 style={h1}>Your cart</h1>

      {cart.length === 0 ? (
        <div style={emptyWrap}>
          <p style={emptyText}>Nothing here yet.</p>
          <Link href="/#flavor-worlds" style={emptyLink}>
            Pick your pouch →
          </Link>
        </div>
      ) : (
        <>
          <ul style={list}>
            {cart.map((item) => (
              <li key={item.id} style={itemRow}>
                <span
                  aria-hidden="true"
                  style={{ ...accentDot, background: item.accent }}
                />

                <div style={itemBody}>
                  <div style={itemHead}>
                    <div style={itemNameCol}>
                      <span style={itemName}>{item.name}</span>
                      <span style={itemFormat}>{FORMAT_LABELS[item.format]}</span>
                    </div>

                    <div style={itemPriceCol}>
                      <span style={itemPrice}>${itemTotal(item).toFixed(2)}</span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                        style={removeBtn}
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {item.toppings.length > 0 && (
                    <ul style={toppingList}>
                      {item.toppings.map((topping, idx) => (
                        <li key={`${item.id}-top-${idx}`} style={toppingRow}>
                          <button
                            type="button"
                            onClick={() => removeTopping(item.id, idx)}
                            aria-label={`Remove ${topping.name} from ${item.name}`}
                            style={toppingRemoveBtn}
                          >
                            ✕
                          </button>
                          <span style={toppingName}>{topping.name}</span>
                          <span style={toppingPrice}>
                            +${topping.price.toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div style={footer}>
            <div style={subtotalRow}>
              <span style={subtotalLabel}>Subtotal</span>
              <span style={subtotalValue}>${total.toFixed(2)}</span>
            </div>

            <button type="button" onClick={openCart} style={checkoutBtn}>
              Checkout →
            </button>

            <p style={shippingNote}>Free shipping on all subscriptions</p>
          </div>
        </>
      )}
    </main>
  )
}

const page: React.CSSProperties = {
  maxWidth: '680px',
  margin: '0 auto',
  minHeight: '100svh',
  padding: '96px var(--space-6) 80px',
  background: 'var(--surface-white)',
  fontFamily: 'var(--font-dm-sans)',
}

const h1: React.CSSProperties = {
  fontFamily: 'var(--font-syne)',
  fontWeight: 800,
  fontSize: '22px',
  lineHeight: 1.2,
  color: 'var(--text-primary)',
  margin: '0 0 var(--space-6)',
}

const emptyWrap: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-3)',
  paddingTop: 'var(--space-2)',
}

const emptyText: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans)',
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: 1.5,
  color: 'var(--text-secondary)',
  margin: 0,
}

const emptyLink: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans)',
  fontWeight: 600,
  fontSize: '16px',
  color: 'var(--brand-purple-light)',
  textDecoration: 'none',
  alignSelf: 'flex-start',
  minHeight: '44px',
  display: 'inline-flex',
  alignItems: 'center',
}

const list: React.CSSProperties = {
  listStyle: 'none',
  margin: '0 0 var(--space-8)',
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-5)',
}

const itemRow: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--space-3)',
  alignItems: 'flex-start',
  paddingBottom: 'var(--space-5)',
  borderBottom: '1px solid rgba(0, 0, 0, 0.07)',
}

const accentDot: React.CSSProperties = {
  flex: '0 0 auto',
  width: '12px',
  height: '12px',
  borderRadius: 'var(--radius-full)',
  marginTop: '5px',
}

const itemBody: React.CSSProperties = {
  flex: '1 1 auto',
  minWidth: 0,
}

const itemHead: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 'var(--space-3)',
}

const itemNameCol: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  minWidth: 0,
}

const itemName: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans)',
  fontWeight: 500,
  fontSize: '15px',
  lineHeight: 1.3,
  color: 'var(--text-primary)',
}

const itemFormat: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans)',
  fontWeight: 300,
  fontSize: '13px',
  lineHeight: 1.3,
  color: 'var(--text-secondary)',
}

const itemPriceCol: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-2)',
  flex: '0 0 auto',
}

const itemPrice: React.CSSProperties = {
  fontFamily: 'var(--font-syne)',
  fontWeight: 600,
  fontSize: '15px',
  color: 'var(--text-primary)',
  whiteSpace: 'nowrap',
}

const removeBtn: React.CSSProperties = {
  appearance: 'none',
  border: 'none',
  background: 'transparent',
  color: 'var(--text-tertiary)',
  fontSize: '14px',
  lineHeight: 1,
  cursor: 'pointer',
  minWidth: '44px',
  minHeight: '44px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '-12px -10px -12px 0',
  padding: 0,
}

const toppingList: React.CSSProperties = {
  listStyle: 'none',
  margin: 'var(--space-2) 0 0',
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
}

const toppingRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-2)',
}

const toppingRemoveBtn: React.CSSProperties = {
  appearance: 'none',
  border: 'none',
  background: 'transparent',
  color: 'var(--text-tertiary)',
  fontSize: '11px',
  lineHeight: 1,
  cursor: 'pointer',
  minWidth: '44px',
  minHeight: '44px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  margin: '-12px 0',
  padding: 0,
}

const toppingName: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans)',
  fontWeight: 400,
  fontSize: '13px',
  lineHeight: 1.3,
  color: 'var(--text-secondary)',
  flex: '1 1 auto',
  minWidth: 0,
}

const toppingPrice: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans)',
  fontWeight: 400,
  fontSize: '13px',
  color: 'var(--text-tertiary)',
  whiteSpace: 'nowrap',
}

const footer: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-4)',
}

const subtotalRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
}

const subtotalLabel: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans)',
  fontWeight: 500,
  fontSize: '15px',
  color: 'var(--text-primary)',
}

const subtotalValue: React.CSSProperties = {
  fontFamily: 'var(--font-syne)',
  fontWeight: 700,
  fontSize: '20px',
  color: 'var(--text-primary)',
}

const checkoutBtn: React.CSSProperties = {
  appearance: 'none',
  border: 'none',
  width: '100%',
  minHeight: '52px',
  background: 'var(--brand-purple-light)',
  color: '#FFFFFF',
  fontFamily: 'var(--font-syne)',
  fontWeight: 700,
  fontSize: '16px',
  borderRadius: 'var(--radius-md)',
  cursor: 'pointer',
  transition: 'transform var(--dur-fast) var(--ease-out)',
}

const shippingNote: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans)',
  fontWeight: 300,
  fontSize: '12px',
  color: 'var(--text-tertiary)',
  textAlign: 'center',
  margin: 0,
}
