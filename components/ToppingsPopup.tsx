'use client'

import { useState } from 'react'
import type { Flavor, Topping } from '@/lib/products'
import { TOPPINGS, recommendedFor } from '@/lib/products'
import { useCart, type CartTopping } from '@/lib/cart'

type ToppingsPopupProps = {
  flavor: Flavor
  onClose: () => void
}

const DIVIDER = '1px solid #F3F4F6'

export default function ToppingsPopup({ flavor, onClose }: ToppingsPopupProps) {
  const { addItem } = useCart()
  const [selected, setSelected] = useState<CartTopping[]>([])

  const isSelected = (name: string): boolean =>
    selected.some((t) => t.name === name)

  const toggle = (topping: { name: string; price: number }): void => {
    setSelected((prev) =>
      prev.some((t) => t.name === topping.name)
        ? prev.filter((t) => t.name !== topping.name)
        : [...prev, { name: topping.name, price: topping.price }]
    )
  }

  const toppingsTotal = selected.reduce((s, t) => s + t.price, 0)

  const recommended = recommendedFor(flavor)
  const recommendedNames = new Set(recommended.map((t) => t.name))
  const more = TOPPINGS.filter((t) => !recommendedNames.has(t.name))

  const buildItem = (toppings: CartTopping[]) => ({
    id: `${flavor.slug}-single-${Date.now()}`,
    slug: flavor.slug,
    name: flavor.name,
    format: 'single' as const,
    price: flavor.price,
    toppings,
    bg: flavor.bg,
    accent: flavor.accent,
  })

  const handleSkip = (): void => {
    addItem(buildItem([]))
    onClose()
  }

  const handleAdd = (): void => {
    addItem(buildItem(selected))
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Add toppings to ${flavor.name}`}
      className="overlay-enter"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
    >
      <div
        className="sheet-enter no-scrollbar"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 201,
          background: 'var(--surface-white)',
          borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
          maxHeight: '85svh',
          overflowY: 'auto',
          padding: '0 var(--space-6) 40px',
        }}
      >
        {/* Drag handle */}
        <div
          aria-hidden="true"
          style={{
            width: 32,
            height: 4,
            background: 'var(--text-disabled)',
            borderRadius: 'var(--radius-full)',
            margin: '12px auto 20px',
          }}
        />

        {/* Header */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h2
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 800,
              fontSize: 24,
              lineHeight: 1.1,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            Make it yours.
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 300,
              fontSize: 14,
              color: 'var(--text-secondary)',
              marginTop: 4,
              marginBottom: 0,
            }}
          >
            {flavor.name}
          </p>
        </div>

        {/* Recommended for this flavor */}
        {recommended.length > 0 && (
          <>
            <SectionLabel>These hit different with {flavor.name}:</SectionLabel>
            <div
              style={{
                border: DIVIDER,
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                marginBottom: 'var(--space-6)',
              }}
            >
              {recommended.map((t, i) => (
                <ToppingRow
                  key={t.name}
                  topping={t}
                  added={isSelected(t.name)}
                  onToggle={() => toggle(t)}
                  divider={i < recommended.length - 1}
                />
              ))}
            </div>
          </>
        )}

        {/* The rest of the menu */}
        {more.length > 0 && (
          <>
            <SectionLabel>More toppings:</SectionLabel>
            <div
              style={{
                border: DIVIDER,
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                marginBottom: 'var(--space-6)',
              }}
            >
              {more.map((t, i) => (
                <ToppingRow
                  key={t.name}
                  topping={t}
                  added={isSelected(t.name)}
                  onToggle={() => toggle(t)}
                  divider={i < more.length - 1}
                />
              ))}
            </div>
          </>
        )}

        {/* Sticky bottom bar */}
        <div
          style={{
            position: 'sticky',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'var(--surface-white)',
            borderTop: '1px solid #F3F4F6',
            margin: '0 calc(-1 * var(--space-6))',
            padding: 'var(--space-4) var(--space-6) 0',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-4)',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              {selected.length > 0 &&
                selected.map((t) => (
                  <div
                    key={t.name}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 'var(--space-3)',
                      fontFamily: 'var(--font-dm-sans)',
                      fontWeight: 300,
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {t.name}
                    </span>
                    <span style={{ flexShrink: 0 }}>+${t.price.toFixed(2)}</span>
                  </div>
                ))}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-syne)',
                fontWeight: 700,
                fontSize: 16,
                color: 'var(--text-primary)',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
            >
              Subtotal: ${toppingsTotal.toFixed(2)}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <button
              type="button"
              onClick={handleAdd}
              style={{
                width: '100%',
                minHeight: 52,
                background: 'var(--brand-purple-light)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-syne)',
                fontWeight: 700,
                fontSize: 16,
                cursor: 'pointer',
              }}
            >
              Add to cart →
            </button>
            <button
              type="button"
              onClick={handleSkip}
              style={{
                width: '100%',
                minHeight: 44,
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 400,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-dm-sans)',
        fontWeight: 400,
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--text-tertiary)',
        marginBottom: 12,
        marginTop: 0,
      }}
    >
      {children}
    </p>
  )
}

function ToppingRow({
  topping,
  added,
  onToggle,
  divider,
}: {
  topping: Topping
  added: boolean
  onToggle: () => void
  divider?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-3)',
        padding: 'var(--space-4)',
        borderBottom: divider ? DIVIDER : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', flexWrap: 'wrap', minWidth: 0 }}>
        <span
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 500,
            fontSize: 15,
            color: 'var(--text-primary)',
          }}
        >
          {topping.name}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 700,
            fontSize: 14,
            color: 'var(--brand-purple-light)',
          }}
        >
          +${topping.price.toFixed(2)}
        </span>
      </div>
      <ToggleButton added={added} onToggle={onToggle} label={topping.name} />
    </div>
  )
}

function ToggleButton({
  added,
  onToggle,
  label,
}: {
  added: boolean
  onToggle: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={added}
      aria-label={added ? `Remove ${label}` : `Add ${label}`}
      style={{
        flexShrink: 0,
        minHeight: 44,
        padding: '0 var(--space-4)',
        background: added ? 'var(--brand-purple-light)' : 'transparent',
        border: '1px solid var(--brand-purple-light)',
        borderRadius: 'var(--radius-full)',
        color: added ? '#FFFFFF' : 'var(--brand-purple-light)',
        fontFamily: 'var(--font-dm-sans)',
        fontWeight: 600,
        fontSize: 14,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
      }}
    >
      {added ? '✓ Added' : '+ Add'}
    </button>
  )
}
