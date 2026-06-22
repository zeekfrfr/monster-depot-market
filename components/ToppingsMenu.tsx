'use client'

import { useState } from 'react'
import type { Flavor, Topping } from '@/lib/products'
import { TOPPINGS, recommendedFor } from '@/lib/products'

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

function ToppingRow({
  topping,
  added,
  onAdd,
  isLast,
}: {
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
      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
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
          +${topping.price.toFixed(2)}
        </span>
      </div>
      <AddedButton added={added} onAdd={onAdd} />
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

  const recommended = recommendedFor(flavor)
  const recommendedNames = new Set(recommended.map((t) => t.name))
  const more = TOPPINGS.filter((t) => !recommendedNames.has(t.name))

  return (
    <div className="anim-fade-up" style={{ width: '100%' }}>
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
        Make it yours.
      </h2>

      {recommended.length > 0 && (
        <>
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
          <div style={{ marginTop: 'var(--space-4)' }}>
            {recommended.map((t, i) => {
              const key = `rec-${i}`
              return (
                <ToppingRow
                  key={key}
                  topping={t}
                  added={!!addedKeys[key]}
                  onAdd={() => flashAdded(key)}
                  isLast={i === recommended.length - 1}
                />
              )
            })}
          </div>
        </>
      )}

      {more.length > 0 && (
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
            More toppings:
          </h3>
          <div style={{ marginTop: 'var(--space-3)' }}>
            {more.map((t, i) => {
              const key = `more-${i}`
              return (
                <ToppingRow
                  key={key}
                  topping={t}
                  added={!!addedKeys[key]}
                  onAdd={() => flashAdded(key)}
                  isLast={i === more.length - 1}
                />
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
