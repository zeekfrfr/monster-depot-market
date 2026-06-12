'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { ModeProduct, Format, AnySize } from '@/lib/products'
import { getPrice, getSizeLabel, getDefaultSize } from '@/lib/products'
import { useCart } from '@/lib/cart'
import FlavorSelector from './FlavorSelector'
import FormatToggle from './FormatToggle'
import SizeSelector from './SizeSelector'
import IngredientAccordion from './IngredientAccordion'

interface ModePageProps {
  mode: ModeProduct
}

export default function ModePage({ mode }: ModePageProps) {
  const router = useRouter()
  const { addItem } = useCart()

  const [flavor, setFlavor] = useState(mode.flavors[0].name)
  const [format, setFormat] = useState<Format>('stick')
  const [size, setSize] = useState<AnySize>('single')
  const [arrowHovered, setArrowHovered] = useState(false)
  const [added, setAdded] = useState(false)
  const [priceKey, setPriceKey] = useState(0)

  const price = getPrice(mode, format, size)

  const handleFormatChange = useCallback((newFormat: Format) => {
    setFormat(newFormat)
    setSize(getDefaultSize(newFormat))
    setPriceKey((k) => k + 1)
  }, [])

  const handleSizeChange = useCallback(
    (newSize: AnySize) => {
      setSize(newSize)
      setPriceKey((k) => k + 1)
    },
    []
  )

  const handleAdd = () => {
    const id = `${mode.slug}-${flavor}-${format}-${size}`
      .toLowerCase()
      .replace(/\s+/g, '-')
    addItem({
      id,
      mode: mode.slug,
      modeName: mode.name,
      modeAccent: mode.accent,
      flavor,
      format,
      formatLabel: format === 'stick' ? 'Stick Pack' : 'Ready-to-Drink',
      size,
      sizeLabel: getSizeLabel(format, size),
      price,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 800)
  }

  return (
    <div
      className="page-enter"
      style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: '40px 24px 96px',
      }}
    >
      {/* Back */}
      <button
        onClick={() => router.push('/')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-tertiary)',
          fontSize: 'var(--text-sm)',
          padding: '0 0 32px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: 'inherit',
          transition: 'color 150ms ease',
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.color = 'var(--text-primary)')
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.color = 'var(--text-tertiary)')
        }
      >
        ← Back
      </button>

      {/* Mode name */}
      <h1
        style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: 'var(--text-3xl)',
          fontWeight: 300,
          letterSpacing: '0.15em',
          color: 'var(--text-primary)',
          marginBottom: '8px',
          lineHeight: 1.1,
        }}
      >
        {mode.name}
      </h1>

      {/* Tagline */}
      <p
        style={{
          fontSize: 'var(--text-base)',
          fontWeight: 300,
          color: 'var(--text-secondary)',
          letterSpacing: '-0.01em',
          marginBottom: '40px',
        }}
      >
        {mode.tagline}
      </p>

      <div
        style={{
          height: '1px',
          backgroundColor: 'var(--mid-gray)',
          marginBottom: '40px',
        }}
      />

      {/* Flavors */}
      <FlavorSelector
        flavors={mode.flavors}
        selected={flavor}
        accent={mode.accent}
        onSelect={setFlavor}
      />

      <div
        style={{
          height: '1px',
          backgroundColor: 'var(--mid-gray)',
          margin: '40px 0',
        }}
      />

      {/* Format */}
      <p
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '20px',
        }}
      >
        How do you want it?
      </p>
      <FormatToggle
        selected={format}
        accent={mode.accent}
        onSelect={handleFormatChange}
      />

      <div
        style={{
          height: '1px',
          backgroundColor: 'var(--mid-gray)',
          margin: '40px 0',
        }}
      />

      {/* Size */}
      <div style={{ marginBottom: '24px' }}>
        <SizeSelector
          format={format}
          selected={size}
          prices={mode.formats}
          accent={mode.accent}
          onSelect={handleSizeChange}
        />
      </div>

      {/* Price + Add row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          key={priceKey}
          style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            animation: 'fadeIn 100ms ease forwards',
          }}
        >
          ${price.toFixed(2)}
        </span>

        <button
          onClick={handleAdd}
          onMouseEnter={() => setArrowHovered(true)}
          onMouseLeave={() => setArrowHovered(false)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 'var(--text-base)',
            fontWeight: 500,
            color: 'var(--text-primary)',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            letterSpacing: '-0.01em',
            minWidth: '72px',
            justifyContent: 'flex-end',
          }}
        >
          {added ? (
            'Added'
          ) : (
            <>
              Add
              <span
                style={{
                  display: 'inline-block',
                  transform: arrowHovered ? 'translateX(3px)' : 'translateX(0)',
                  transition: 'transform 150ms ease',
                }}
              >
                →
              </span>
            </>
          )}
        </button>
      </div>

      {/* Mix it with — stick pack only */}
      {format === 'stick' && (() => {
        const pairings = mode.flavors.find(f => f.name === flavor)?.pairings ?? []
        return (
          <>
            <div style={{ height: '1px', backgroundColor: 'var(--mid-gray)', margin: '40px 0' }} />
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '12px',
              }}
            >
              Mix it with
            </p>
            <p
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 300,
                color: 'var(--text-secondary)',
                letterSpacing: '-0.01em',
                lineHeight: 1.6,
              }}
            >
              {pairings.join(' · ')}
            </p>
          </>
        )
      })()}

      <div
        style={{
          height: '1px',
          backgroundColor: 'var(--mid-gray)',
          margin: '40px 0',
        }}
      />

      {/* Ingredients */}
      <IngredientAccordion actives={mode.actives} />
    </div>
  )
}
