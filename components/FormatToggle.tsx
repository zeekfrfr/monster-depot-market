'use client'

import { useState } from 'react'
import type { Format } from '@/lib/products'

interface FormatToggleProps {
  selected: Format
  accent: string
  onSelect: (format: Format) => void
}

const OPTIONS: { value: Format; label: string; description: string }[] = [
  { value: 'stick', label: 'Stick Pack', description: 'Mix into anything.' },
  { value: 'rtd', label: 'Ready-to-Drink', description: 'Grab and go.' },
]

export default function FormatToggle({
  selected,
  accent,
  onSelect,
}: FormatToggleProps) {
  const [activeItem, setActiveItem] = useState<Format | null>(null)

  return (
    <div style={{ display: 'flex', gap: '32px' }}>
      {OPTIONS.map((opt) => {
        const isSelected = opt.value === selected
        const isActive = activeItem === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            onPointerEnter={(e) => { if (e.pointerType === 'mouse') setActiveItem(opt.value) }}
            onPointerDown={() => setActiveItem(opt.value)}
            onPointerUp={(e) => { if (e.pointerType === 'touch') setActiveItem(null) }}
            onPointerLeave={() => setActiveItem(null)}
            onPointerCancel={() => setActiveItem(null)}
            style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              borderBottom: isSelected ? `2px solid ${accent}` : '2px solid transparent',
              borderRadius: '10px 10px 0 0',
              cursor: 'pointer',
              padding: '8px 12px 10px',
              margin: '0 -12px',
              textAlign: 'left',
              transition: 'border-color 100ms ease',
              willChange: 'transform',
            }}
          >
            <span
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '10px 10px 0 0',
                background: `${accent}14`,
                boxShadow: `0 4px 20px ${accent}20`,
                opacity: isActive ? 1 : 0,
                transition: 'opacity 100ms ease',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 500,
                color: isSelected ? 'var(--text-primary)' : 'var(--text-tertiary)',
                transition: 'color 100ms ease',
                fontFamily: 'inherit',
                marginBottom: '3px',
              }}
            >
              {opt.label}
            </div>
            <div
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 300,
                color: isSelected ? 'var(--text-secondary)' : 'var(--text-tertiary)',
                transition: 'color 100ms ease',
                fontFamily: 'inherit',
              }}
            >
              {opt.description}
            </div>
          </button>
        )
      })}
    </div>
  )
}
