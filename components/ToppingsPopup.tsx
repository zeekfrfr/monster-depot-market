'use client'

import { useEffect, useState } from 'react'
import type { Flavor, Topping } from '@/lib/products'
import { TOPPINGS, recommendedFor, activeFlavors } from '@/lib/products'
import { useCart, type CartTopping, type CartFormat, type CartMixEntry } from '@/lib/cart'

type ToppingsPopupProps = {
  flavor: Flavor
  onClose: () => void
}

const DIVIDER = '1px solid #F3F4F6'
const MIX_TOTAL = 7

export default function ToppingsPopup({ flavor, onClose }: ToppingsPopupProps) {
  const { addItem } = useCart()
  const [format, setFormat] = useState<CartFormat>('single')
  const [selected, setSelected] = useState<CartTopping[]>([])
  // slug -> quantity, used only when format === 'mixmatch7'.
  const [mix, setMix] = useState<Record<string, number>>({})

  // Escape closes the sheet (backdrop click and the ✕ button also close it).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const isSelected = (name: string): boolean => selected.some((t) => t.name === name)

  const toggle = (topping: { name: string; price: number }): void => {
    setSelected((prev) =>
      prev.some((t) => t.name === topping.name)
        ? prev.filter((t) => t.name !== topping.name)
        : [...prev, { name: topping.name, price: topping.price }]
    )
  }

  const mixCount = Object.values(mix).reduce((s, n) => s + n, 0)
  const mixRemaining = MIX_TOTAL - mixCount

  const bumpMix = (slug: string, delta: number): void => {
    setMix((prev) => {
      const current = prev[slug] ?? 0
      const others = Object.entries(prev).reduce((s, [k, v]) => (k === slug ? s : s + v), 0)
      const next = Math.max(0, Math.min(current + delta, MIX_TOTAL - others))
      return { ...prev, [slug]: next }
    })
  }

  const basePrice =
    format === 'single'
      ? flavor.price
      : format === '7pack'
        ? flavor.sevenPackPrice
        : flavor.mixMatchPrice
  const toppingsTotal = format === 'single' ? selected.reduce((s, t) => s + t.price, 0) : 0
  const subtotal = basePrice + toppingsTotal

  const recommended = recommendedFor(flavor)
  const recommendedNames = new Set(recommended.map((t) => t.name))
  const more = TOPPINGS.filter((t) => !recommendedNames.has(t.name))

  const canAdd = format !== 'mixmatch7' || mixCount === MIX_TOTAL

  const handleAdd = (): void => {
    if (!canAdd) return
    if (format === 'mixmatch7') {
      const entries: CartMixEntry[] = activeFlavors
        .filter((f) => (mix[f.slug] ?? 0) > 0)
        .map((f) => ({ slug: f.slug, name: f.name, qty: mix[f.slug] }))
      addItem({
        id: `mixmatch7-${Date.now()}`,
        slug: 'mixmatch7',
        name: 'Mix & Match 7-pack',
        format: 'mixmatch7',
        price: flavor.mixMatchPrice,
        toppings: [],
        bg: flavor.bg,
        accent: flavor.accent,
        mix: entries,
      })
    } else if (format === '7pack') {
      addItem({
        id: `${flavor.slug}-7pack-${Date.now()}`,
        slug: flavor.slug,
        name: flavor.name,
        format: '7pack',
        price: flavor.sevenPackPrice,
        toppings: [],
        bg: flavor.bg,
        accent: flavor.accent,
      })
    } else {
      addItem({
        id: `${flavor.slug}-single-${Date.now()}`,
        slug: flavor.slug,
        name: flavor.name,
        format: 'single',
        price: flavor.price,
        toppings: selected,
        bg: flavor.bg,
        accent: flavor.accent,
      })
    }
    onClose()
  }

  const addLabel =
    format === 'mixmatch7' && !canAdd
      ? `Pick ${mixRemaining} more`
      : `Add to cart · $${subtotal.toFixed(2)}`

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Add ${flavor.name} to cart`}
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
            margin: '12px auto 12px',
          }}
        />

        {/* Header + close */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-5)',
          }}
        >
          <div>
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
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              flexShrink: 0,
              width: 36,
              height: 36,
              minWidth: 36,
              borderRadius: 'var(--radius-full)',
              background: 'var(--surface-off)',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              fontSize: 16,
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

        {/* Format selector */}
        <SectionLabel>Choose your pack:</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
          <FormatOption
            active={format === 'single'}
            title="Single pouch"
            sub="One pouch of this flavor"
            price={`$${flavor.price.toFixed(2)}`}
            onClick={() => setFormat('single')}
          />
          <FormatOption
            active={format === '7pack'}
            title="7-pack"
            sub={`Seven pouches of ${flavor.name}`}
            price={`$${flavor.sevenPackPrice.toFixed(2)}`}
            onClick={() => setFormat('7pack')}
          />
          <FormatOption
            active={format === 'mixmatch7'}
            title="Mix & Match 7-pack"
            sub="Build your own — any 7 flavors"
            price={`$${flavor.mixMatchPrice.toFixed(2)}`}
            onClick={() => setFormat('mixmatch7')}
          />
        </div>

        {/* Single: toppings menu */}
        {format === 'single' && (
          <>
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
          </>
        )}

        {/* 7-pack: simple note */}
        {format === '7pack' && (
          <p
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 300,
              fontSize: 14,
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              marginTop: 0,
              marginBottom: 'var(--space-6)',
            }}
          >
            Seven pouches of {flavor.name}, ready to make any way you like.
          </p>
        )}

        {/* Mix & Match: flavor picker */}
        {format === 'mixmatch7' && (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <SectionLabel>Pick your 7 pouches:</SectionLabel>
              <span
                style={{
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 700,
                  fontSize: 14,
                  color: mixCount === MIX_TOTAL ? 'var(--brand-purple-light)' : 'var(--text-secondary)',
                }}
              >
                {mixCount}/{MIX_TOTAL}
              </span>
            </div>
            <div
              style={{
                border: DIVIDER,
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                marginBottom: 'var(--space-6)',
              }}
            >
              {activeFlavors.map((f, i) => (
                <MixRow
                  key={f.slug}
                  name={f.name}
                  accent={f.accent}
                  qty={mix[f.slug] ?? 0}
                  onDec={() => bumpMix(f.slug, -1)}
                  onInc={() => bumpMix(f.slug, 1)}
                  incDisabled={mixCount >= MIX_TOTAL}
                  divider={i < activeFlavors.length - 1}
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
          {format === 'single' && selected.length > 0 && (
            <div style={{ marginBottom: 'var(--space-3)' }}>
              {selected.map((t) => (
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
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.name}
                  </span>
                  <span style={{ flexShrink: 0 }}>+${t.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-4)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 400,
                fontSize: 14,
                color: 'var(--text-secondary)',
              }}
            >
              Subtotal
            </span>
            <span
              style={{
                fontFamily: 'var(--font-syne)',
                fontWeight: 700,
                fontSize: 18,
                color: 'var(--text-primary)',
              }}
            >
              ${subtotal.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            style={{
              width: '100%',
              minHeight: 52,
              background: canAdd ? 'var(--brand-purple-light)' : 'var(--text-disabled)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-syne)',
              fontWeight: 700,
              fontSize: 16,
              cursor: canAdd ? 'pointer' : 'default',
              transition: 'background-color var(--dur-fast) var(--ease-out)',
            }}
          >
            {addLabel}
          </button>
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

function FormatOption({
  active,
  title,
  sub,
  price,
  onClick,
}: {
  active: boolean
  title: string
  sub: string
  price: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-3)',
        padding: 'var(--space-4)',
        cursor: 'pointer',
        textAlign: 'left',
        background: active
          ? 'color-mix(in srgb, var(--brand-purple-light) 8%, transparent)'
          : 'transparent',
        border: `1.5px solid ${active ? 'var(--brand-purple-light)' : '#E5E7EB'}`,
        borderRadius: 'var(--radius-md)',
        transition: 'border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minWidth: 0 }}>
        <span
          aria-hidden="true"
          style={{
            width: 20,
            height: 20,
            minWidth: 20,
            borderRadius: '50%',
            border: `2px solid ${active ? 'var(--brand-purple-light)' : '#C7C7CC'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {active && (
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--brand-purple-light)' }} />
          )}
        </span>
        <span style={{ minWidth: 0 }}>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 500,
              fontSize: 15,
              color: 'var(--text-primary)',
            }}
          >
            {title}
          </span>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 300,
              fontSize: 12,
              color: 'var(--text-secondary)',
            }}
          >
            {sub}
          </span>
        </span>
      </span>
      <span
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 700,
          fontSize: 15,
          color: 'var(--text-primary)',
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}
      >
        {price}
      </span>
    </button>
  )
}

function MixRow({
  name,
  accent,
  qty,
  onDec,
  onInc,
  incDisabled,
  divider,
}: {
  name: string
  accent: string
  qty: number
  onDec: () => void
  onInc: () => void
  incDisabled: boolean
  divider?: boolean
}) {
  const stepStyle = (disabled: boolean): React.CSSProperties => ({
    width: 32,
    height: 32,
    minWidth: 32,
    borderRadius: '50%',
    border: '1px solid var(--brand-purple-light)',
    background: 'transparent',
    color: 'var(--brand-purple-light)',
    fontSize: 18,
    lineHeight: 1,
    cursor: disabled ? 'default' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.35 : 1,
    fontFamily: 'inherit',
    padding: 0,
  })

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-3)',
        padding: 'var(--space-3) var(--space-4)',
        borderBottom: divider ? DIVIDER : 'none',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minWidth: 0 }}>
        <span
          aria-hidden="true"
          style={{ width: 10, height: 10, minWidth: 10, borderRadius: '50%', background: accent }}
        />
        <span
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 500,
            fontSize: 15,
            color: 'var(--text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </span>
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexShrink: 0 }}>
        <button
          type="button"
          onClick={onDec}
          disabled={qty === 0}
          aria-label={`Remove one ${name}`}
          style={stepStyle(qty === 0)}
        >
          −
        </button>
        <span
          style={{
            minWidth: 18,
            textAlign: 'center',
            fontFamily: 'var(--font-syne)',
            fontWeight: 700,
            fontSize: 15,
            color: 'var(--text-primary)',
          }}
        >
          {qty}
        </span>
        <button
          type="button"
          onClick={onInc}
          disabled={incDisabled}
          aria-label={`Add one ${name}`}
          style={stepStyle(incDisabled)}
        >
          +
        </button>
      </span>
    </div>
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
