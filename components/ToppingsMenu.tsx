'use client'

import { useState } from 'react'
import type { Flavor, Topping } from '@/lib/products'
import { allToppings } from '@/lib/products'

type CuratedRow = { category: string; topping: Topping }

function AddedButton({ added, onAdd }: { added: boolean; onAdd: () => void }) {
  return (
    <button
      type="button"
      onClick={onAdd}
      aria-label={added ? 'Added' : 'Add topping'}
      aria-pressed={added}
      style={{
        flexShrink: 0,
        minWidth: '88px',
        minHeight: '44px',
        padding: '0 var(--space-4)',
        borderRadius: 'var(--radius-full)',
        border: added ? '1px solid var(--brand-purple-light)' : '1px solid #E5E5E5',
        background: added ? 'var(--brand-purple-light)' : 'var(--surface-white)',
        color: added ? '#FFFFFF' : 'var(--text-primary)',
        fontFamily: 'var(--font-dm-sans)',
        fontWeight: 600,
        fontSize: '14px',
        lineHeight: 1,
        cursor: 'pointer',
        transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
        whiteSpace: 'nowrap',
      }}
    >
      {added ? '✓ Added' : '+ Add'}
    </button>
  )
}

function CuratedToppingRow({
  category,
  topping,
  added,
  onAdd,
  isLast,
}: {
  category: string
  topping: Topping
  added: boolean
  onAdd: () => void
  isLast: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        padding: 'var(--space-4) 0',
        borderBottom: isLast ? 'none' : '1px solid #F3F4F6',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 400,
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--text-tertiary)',
            marginBottom: 'var(--space-1)',
          }}
        >
          {category}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 500,
              fontSize: '15px',
              color: 'var(--text-primary)',
            }}
          >
            {topping.name}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 700,
              fontSize: '15px',
              color: 'var(--brand-purple-light)',
            }}
          >
            — +${topping.price.toFixed(2)}
          </span>
        </div>
      </div>
      <AddedButton added={added} onAdd={onAdd} />
    </div>
  )
}

function GridToppingCard({
  topping,
  added,
  onAdd,
}: {
  topping: Topping
  added: boolean
  onAdd: () => void
}) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 'var(--space-3)',
        minHeight: '88px',
        padding: 'var(--space-4)',
        background: 'var(--surface-white)',
        border: hover
          ? '1px solid rgba(124, 58, 237, 0.4)'
          : '1px solid #E5E5E5',
        borderRadius: 'var(--radius-md)',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'border-color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
      }}
    >
      <div>
        {topping.category ? (
          <div
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 400,
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--text-tertiary)',
              marginBottom: 'var(--space-1)',
            }}
          >
            {topping.category}
          </div>
        ) : null}
        <div
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 500,
            fontSize: '14px',
            color: 'var(--text-primary)',
            lineHeight: 1.3,
          }}
        >
          {topping.name}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
        <span
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 700,
            fontSize: '16px',
            color: 'var(--brand-purple-light)',
          }}
        >
          +${topping.price.toFixed(2)}
        </span>
        <AddedButton added={added} onAdd={onAdd} />
      </div>
    </div>
  )
}

export default function ToppingsMenu({ flavor }: { flavor: Flavor }) {
  // Track which visual-only "+ Add" buttons are showing their confirmed state.
  const [addedKeys, setAddedKeys] = useState<Record<string, boolean>>({})

  const flashAdded = (key: string) => {
    setAddedKeys((prev) => {
      if (prev[key]) return prev
      return { ...prev, [key]: true }
    })
    window.setTimeout(() => {
      setAddedKeys((prev) => {
        if (!prev[key]) return prev
        const next = { ...prev }
        delete next[key]
        return next
      })
    }, 1200)
  }

  const curated: CuratedRow[] = [
    { category: 'DRIZZLE', topping: flavor.toppings.drizzle },
    { category: 'CRUNCH', topping: flavor.toppings.crunch },
    { category: 'ELEVATE', topping: flavor.toppings.elevate },
  ]

  const extras = flavor.toppings.extraIncluded

  return (
    <div className="anim-fade-up" style={{ width: '100%' }}>
      {/* Header */}
      <h2
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 800,
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          color: 'var(--text-primary)',
          margin: 0,
          lineHeight: 1.1,
        }}
      >
        Choose your toppings.
      </h2>
      <p
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontWeight: 300,
          fontSize: '15px',
          color: 'var(--text-secondary)',
          marginTop: 'var(--space-2)',
          marginBottom: 0,
        }}
      >
        These hit different with {flavor.name}:
      </p>

      {/* Curated three rows */}
      <div style={{ marginTop: 'var(--space-6)' }}>
        {curated.map((row, i) => {
          const key = `curated-${i}`
          return (
            <CuratedToppingRow
              key={key}
              category={row.category}
              topping={row.topping}
              added={!!addedKeys[key]}
              onAdd={() => flashAdded(key)}
              isLast={i === curated.length - 1}
            />
          )
        })}
      </div>

      {/* Want more of what's inside */}
      {extras.length > 0 && (
        <>
          <h3
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 400,
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-tertiary)',
              marginTop: 'var(--space-8)',
              marginBottom: 0,
            }}
          >
            Want more of what&apos;s inside:
          </h3>
          <div style={{ marginTop: 'var(--space-3)' }}>
            {extras.map((topping, i) => {
              const key = `extra-${i}`
              return (
                <CuratedToppingRow
                  key={key}
                  category="INCLUDED"
                  topping={topping}
                  added={!!addedKeys[key]}
                  onAdd={() => flashAdded(key)}
                  isLast={i === extras.length - 1}
                />
              )
            })}
          </div>
        </>
      )}

      {/* Or add anything */}
      <h3
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontWeight: 400,
          fontSize: '13px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-tertiary)',
          marginTop: 'var(--space-8)',
          marginBottom: 'var(--space-4)',
        }}
      >
        Or add anything:
      </h3>
      <style>{`
        @media (min-width: 768px) {
          .mdm-toppings-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
      <div
        className="mdm-toppings-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 'var(--space-3)',
        }}
      >
        {allToppings.map((topping, i) => {
          const key = `grid-${i}`
          return (
            <GridToppingCard
              key={key}
              topping={topping}
              added={!!addedKeys[key]}
              onAdd={() => flashAdded(key)}
            />
          )
        })}
      </div>
    </div>
  )
}
