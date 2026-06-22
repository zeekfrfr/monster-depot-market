'use client'

import { useState } from 'react'
import type { Flavor } from '@/lib/products'

type RowKey = 'ingredients' | 'how' | 'nutrition'

function contentText(color: string): React.CSSProperties {
  return {
    fontFamily: 'var(--font-dm-sans)',
    fontWeight: 300,
    fontSize: 14,
    lineHeight: 1.6,
    color,
    margin: 0,
  }
}

function AccordionRow({
  label,
  isOpen,
  onToggle,
  accent,
  divider,
  children,
}: {
  label: string
  isOpen: boolean
  onToggle: () => void
  accent: string
  divider: string
  children: React.ReactNode
}) {
  return (
    <div style={{ borderTop: `1px solid ${divider}` }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: '100%',
          minHeight: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: '18px 0',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 500,
            fontSize: 16,
            color: accent,
          }}
        >
          {label}
        </span>
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            fontSize: 24,
            lineHeight: 1,
            color: accent,
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 200ms ease',
          }}
        >
          +
        </span>
      </button>
      {/* grid-rows 0fr -> 1fr gives a smooth height animation */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          transition: 'grid-template-rows 200ms ease',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div style={{ paddingBottom: 20 }}>{children}</div>
        </div>
      </div>
    </div>
  )
}

export default function IngredientsAccordion({ flavor }: { flavor: Flavor }) {
  const [open, setOpen] = useState<Record<RowKey, boolean>>({
    ingredients: false,
    how: false,
    nutrition: false,
  })

  const toggle = (key: RowKey) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }))

  const divider = `color-mix(in srgb, ${flavor.text} 15%, transparent)`
  const content = `color-mix(in srgb, ${flavor.text} 80%, transparent)`
  const ing = flavor.ingredients

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 680,
        margin: '0 auto',
        borderBottom: `1px solid ${divider}`,
      }}
    >
      {ing && (
        <AccordionRow
          label="Ingredients"
          isOpen={open.ingredients}
          onToggle={() => toggle('ingredients')}
          accent={flavor.accent}
          divider={divider}
        >
          <p style={contentText(content)}>{ing.mix}</p>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 500,
              fontSize: 13,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: flavor.accent,
              margin: '16px 0 4px',
            }}
          >
            Toppings
          </p>
          <p style={contentText(content)}>{ing.toppings}</p>
          <p style={{ ...contentText(content), fontWeight: 700, marginTop: 14 }}>
            Contains: {ing.contains}
          </p>
        </AccordionRow>
      )}

      <AccordionRow
        label="How to Munch"
        isOpen={open.how}
        onToggle={() => toggle('how')}
        accent={flavor.accent}
        divider={divider}
      >
        <p style={{ ...contentText(content), fontWeight: 500 }}>
          Pour. Add liquid. Heat and eat.
        </p>
        <ol
          style={{
            margin: '12px 0 0',
            paddingLeft: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          {flavor.cookingMethods.map((m) => (
            <li key={m.method} style={contentText(content)}>
              <span style={{ fontWeight: 500 }}>{m.method}</span> — {m.time}. {m.result}.
            </li>
          ))}
        </ol>
      </AccordionRow>

      <AccordionRow
        label="Nutrition"
        isOpen={open.nutrition}
        onToggle={() => toggle('nutrition')}
        accent={flavor.accent}
        divider={divider}
      >
        <p style={contentText(content)}>
          Nutrition facts coming soon — currently in lab testing.
        </p>
      </AccordionRow>
    </div>
  )
}
