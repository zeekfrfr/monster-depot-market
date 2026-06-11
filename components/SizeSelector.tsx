'use client'

import type { Format, AnySize, StickSize, RTDSize } from '@/lib/products'

interface SizeSelectorProps {
  format: Format
  selected: AnySize
  prices: {
    stick: Record<StickSize, number>
    rtd: Record<RTDSize, number>
  }
  accent: string
  onSelect: (size: AnySize) => void
}

const STICK_OPTIONS: { size: StickSize; label: string }[] = [
  { size: 'single', label: 'Single Stick' },
  { size: '7pack', label: '7-Pack' },
]

const RTD_OPTIONS: { size: RTDSize; label: string }[] = [
  { size: 'single', label: 'Single Can' },
  { size: '4pack', label: '4-Pack' },
  { size: '12pack', label: '12-Pack' },
]

export default function SizeSelector({
  format,
  selected,
  prices,
  accent,
  onSelect,
}: SizeSelectorProps) {
  const options =
    format === 'stick'
      ? STICK_OPTIONS.map((o) => ({
          size: o.size as AnySize,
          label: o.label,
          price: prices.stick[o.size],
        }))
      : RTD_OPTIONS.map((o) => ({
          size: o.size as AnySize,
          label: o.label,
          price: prices.rtd[o.size],
        }))

  return (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      {options.map((opt) => {
        const isSelected = opt.size === selected
        return (
          <button
            key={opt.size}
            onClick={() => onSelect(opt.size)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0 0 6px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              borderBottom: isSelected
                ? `2px solid ${accent}`
                : '2px solid transparent',
              transition: 'border-color 200ms ease',
              textAlign: 'left',
            }}
          >
            <span
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: isSelected ? 500 : 400,
                color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontFamily: 'inherit',
                transition: 'color 150ms ease',
              }}
            >
              {opt.label}
            </span>
            <span
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 400,
                color: 'var(--text-tertiary)',
                fontFamily: 'inherit',
              }}
            >
              ${opt.price.toFixed(2)}
            </span>
          </button>
        )
      })}
    </div>
  )
}
