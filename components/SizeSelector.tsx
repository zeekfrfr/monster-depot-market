'use client'

import { useState } from 'react'
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
  { size: '7pack', label: '7-Pack' },
  { size: '14pack', label: '14-Pack' },
  { size: '28pack', label: '28-Pack' },
]

const RTD_OPTIONS: { size: RTDSize; label: string }[] = [
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
  const [activeItem, setActiveItem] = useState<AnySize | null>(null)

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
        const isActive = activeItem === opt.size
        return (
          <button
            key={opt.size}
            onClick={() => onSelect(opt.size)}
            onPointerEnter={(e) => { if (e.pointerType === 'mouse') setActiveItem(opt.size) }}
            onPointerDown={() => setActiveItem(opt.size)}
            onPointerUp={(e) => { if (e.pointerType === 'touch') setActiveItem(null) }}
            onPointerLeave={() => setActiveItem(null)}
            onPointerCancel={() => setActiveItem(null)}
            style={{
              background: isActive ? `${accent}14` : 'none',
              backdropFilter: isActive ? 'blur(16px) saturate(180%)' : 'none',
              WebkitBackdropFilter: isActive ? 'blur(16px) saturate(180%)' : 'none',
              boxShadow: isActive ? `0 4px 24px ${accent}20, inset 0 1px 0 ${accent}18` : 'none',
              border: 'none',
              borderBottom: isSelected ? `2px solid ${accent}` : '2px solid transparent',
              borderRadius: '10px 10px 0 0',
              cursor: 'pointer',
              padding: '6px 10px 6px',
              margin: '0 -10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              textAlign: 'left',
              transition: 'border-color 200ms ease, background 180ms ease, box-shadow 180ms ease',
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
