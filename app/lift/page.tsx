'use client'

import { useMemo, useState } from 'react'
import { useCart, type CartMixEntry } from '@/lib/cart'
import { useCatalog } from '@/lib/catalogContext'
import { LIFT_FLAVORS, LIFT_PRICE, LIFT_MIN_CANS, LIFT_INGREDIENTS_DISCLAIMER } from '@/lib/lift'

export default function LiftPage() {
  const { addItem, openCart } = useCart()
  const catalog = useCatalog()
  const [qty, setQty] = useState<Record<string, number>>({})
  const [openIng, setOpenIng] = useState<Record<string, boolean>>({})

  // Active flavors from the DB catalog (respects admin active toggle); colors
  // from lib/lift. Falls back to the full static list if catalog is empty.
  const cards = useMemo(() => {
    const base =
      catalog?.lift && catalog.lift.length > 0
        ? catalog.lift
        : LIFT_FLAVORS.map((f) => ({ slug: f.slug, name: f.name, price: LIFT_PRICE, stock: 'in_stock' }))
    return base.map((l) => {
      const pres = LIFT_FLAVORS.find((f) => f.slug === l.slug)
      return { ...l, bg: pres?.bg ?? '#F1EFE8', accent: pres?.accent ?? '#7C3AED', ingredients: pres?.ingredients ?? [] }
    })
  }, [catalog])

  const totalCans = Object.values(qty).reduce((s, n) => s + n, 0)
  const subtotal = cards.reduce((s, c) => s + (qty[c.slug] ?? 0) * c.price, 0)
  const canAdd = totalCans >= LIFT_MIN_CANS

  const bump = (slug: string, delta: number) =>
    setQty((prev) => ({ ...prev, [slug]: Math.max(0, (prev[slug] ?? 0) + delta) }))

  const handleAdd = () => {
    if (!canAdd) return
    const mix: CartMixEntry[] = cards
      .filter((c) => (qty[c.slug] ?? 0) > 0)
      .map((c) => ({ slug: c.slug, name: c.name, qty: qty[c.slug] }))
    addItem({
      id: `lift-${Date.now()}`,
      slug: 'lift',
      name: 'LIFT',
      format: 'lift',
      price: subtotal,
      toppings: [],
      bg: '#2D1B69',
      accent: '#FF6B2C',
      mix,
    })
    setQty({})
    openCart()
  }

  const scrollToBuild = () => document.getElementById('build')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <main style={{ minHeight: '100svh', background: 'var(--surface-white)', paddingBottom: 'calc(84px + env(safe-area-inset-bottom, 0px))' }}>
      {/* HERO — vibrant, compact, readable */}
      <section
        style={{
          background: 'linear-gradient(160deg, #E63950 0%, #FF6B2C 58%, #FF9A3D 100%)',
          color: '#fff',
          padding: '128px var(--space-6) 64px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p className="anim-fade-up-sm" style={{ fontFamily: 'var(--font-dm-sans)', fontStyle: 'italic', fontWeight: 300, fontSize: '15px', opacity: 0.85, margin: 0 }}>
            Some things just go together.
          </p>
          <h1
            className="anim-fade-up-sm"
            style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(2.6rem, 8vw, 4.5rem)', lineHeight: 0.98, letterSpacing: '-0.03em', margin: '14px 0 0', animationDelay: '60ms' }}
          >
            Right before<br />the moment.
          </h1>
          <p
            className="anim-fade-up-sm"
            style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 400, fontSize: 'clamp(16px, 2.4vw, 19px)', lineHeight: 1.6, opacity: 0.95, maxWidth: 520, margin: '20px 0 0', animationDelay: '110ms' }}
          >
            LIFT is what you reach for before the main event. Crack it open, let it work, and by the time
            you&apos;re ready — you&apos;re ready. Five fruit-forward flavors. No crash. No junk. Just the
            right energy at the right time.
          </p>
          <p className="anim-fade-up-sm" style={{ fontFamily: 'var(--font-dm-sans)', fontStyle: 'italic', fontWeight: 400, fontSize: '17px', margin: '18px 0 0', animationDelay: '150ms' }}>
            You know what this is for.
          </p>

          <button
            type="button"
            onClick={scrollToBuild}
            className="anim-fade-up-sm"
            style={{
              marginTop: 'var(--space-8)',
              minHeight: 52,
              padding: '0 36px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: '#fff',
              color: '#E63950',
              fontFamily: 'var(--font-syne)',
              fontWeight: 800,
              fontSize: '16px',
              cursor: 'pointer',
              animationDelay: '200ms',
            }}
          >
            Build your pack ↓
          </button>
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 400, fontSize: '13px', opacity: 0.85, margin: '14px 0 0' }}>
            16oz cans · ${LIFT_PRICE.toFixed(0)} each · 3-can minimum
          </p>
        </div>
      </section>

      {/* FLAVORS — the colorful centerpiece + buy mechanic */}
      <section id="build" style={{ maxWidth: 920, margin: '0 auto', padding: '56px var(--space-6) 32px' }}>
        <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: '0 0 4px' }}>
          Pick your flavors.
        </h2>
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: '15px', color: 'var(--text-secondary)', margin: '0 0 var(--space-6)' }}>
          Mix and match — minimum 3 cans.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, alignItems: 'start' }}>
          {cards.map((c) => {
            const soldOut = c.stock === 'sold_out'
            const n = qty[c.slug] ?? 0
            return (
              <div
                key={c.slug}
                style={{
                  position: 'relative',
                  background: c.bg,
                  borderRadius: 'var(--radius-xl)',
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  opacity: soldOut ? 0.55 : 1,
                  outline: n > 0 ? `2px solid ${c.accent}` : '2px solid transparent',
                  transition: 'outline-color var(--dur-fast) var(--ease-out)',
                }}
              >
                <div>
                  <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '24px', lineHeight: 1.05, letterSpacing: '-0.02em', color: c.accent, margin: 0 }}>{c.name}</p>
                  <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 500, fontSize: '13px', color: c.accent, opacity: 0.8, margin: '6px 0 0' }}>16oz · ${c.price.toFixed(2)}</p>
                </div>

                {soldOut ? (
                  <span style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: c.accent, marginTop: 16 }}>Sold out</span>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 18 }}>
                    <StepBtn accent={c.accent} disabled={n === 0} onClick={() => bump(c.slug, -1)} label={`Remove one ${c.name}`}>−</StepBtn>
                    <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '22px', color: c.accent, minWidth: 24, textAlign: 'center' }}>{n}</span>
                    <StepBtn accent={c.accent} disabled={false} onClick={() => bump(c.slug, 1)} label={`Add one ${c.name}`}>+</StepBtn>
                  </div>
                )}

                <div style={{ marginTop: 16, borderTop: `1px solid ${c.accent}22` }}>
                  <button
                    type="button"
                    onClick={() => setOpenIng((o) => ({ ...o, [c.slug]: !o[c.slug] }))}
                    aria-expanded={!!openIng[c.slug]}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-dm-sans)', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: c.accent }}
                  >
                    Ingredients
                    <span aria-hidden="true" style={{ fontSize: 16, transform: openIng[c.slug] ? 'rotate(45deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out)' }}>+</span>
                  </button>
                  {openIng[c.slug] && (
                    <div style={{ marginTop: 8 }}>
                      <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: 12, lineHeight: 1.55, color: '#2A2A2A', margin: 0 }}>
                        {c.ingredients.join(', ')}.
                      </p>
                      <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: 11, lineHeight: 1.5, color: '#2A2A2A', opacity: 0.6, margin: '8px 0 0' }}>
                        {LIFT_INGREDIENTS_DISCLAIMER}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Sticky buy bar — always a thumb away */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 90,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid #ECECEC',
          padding: 'var(--space-3) var(--space-6) calc(var(--space-3) + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <div style={{ maxWidth: 920, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '15px', color: 'var(--text-secondary)' }}>
            {totalCans} {totalCans === 1 ? 'can' : 'cans'}
            {totalCans > 0 && <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}> · ${subtotal.toFixed(2)}</span>}
          </span>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            style={{
              minHeight: 50,
              padding: '0 28px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: canAdd ? '#E63950' : 'var(--text-disabled)',
              color: '#fff',
              fontFamily: 'var(--font-syne)',
              fontWeight: 800,
              fontSize: '16px',
              cursor: canAdd ? 'pointer' : 'default',
              transition: 'background-color var(--dur-fast) var(--ease-out)',
            }}
          >
            {canAdd ? 'Add to cart →' : `Add ${Math.max(0, LIFT_MIN_CANS - totalCans)} more`}
          </button>
        </div>
      </div>
    </main>
  )
}

function StepBtn({ accent, disabled, onClick, label, children }: { accent: string; disabled: boolean; onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{
        width: 40,
        height: 40,
        minWidth: 40,
        borderRadius: '50%',
        border: 'none',
        background: '#fff',
        color: accent,
        fontSize: 22,
        lineHeight: 1,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'inherit',
        padding: 0,
        boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
      }}
    >
      {children}
    </button>
  )
}
