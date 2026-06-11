'use client'

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
  return (
    <div style={{ display: 'flex', gap: '32px' }}>
      {OPTIONS.map((opt) => {
        const isSelected = opt.value === selected
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0 0 10px 0',
              textAlign: 'left',
              borderBottom: isSelected ? `2px solid ${accent}` : '2px solid transparent',
              transition: 'border-color 200ms ease',
            }}
          >
            <div
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 500,
                color: isSelected ? 'var(--text-primary)' : 'var(--text-tertiary)',
                transition: 'color 200ms ease',
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
                transition: 'color 200ms ease',
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
