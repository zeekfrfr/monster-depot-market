'use client'

import { useState } from 'react'

interface FlavorSelectorProps {
  flavors: string[]
  selected: string
  accent: string
  onSelect: (flavor: string) => void
}

export default function FlavorSelector({
  flavors,
  selected,
  accent,
  onSelect,
}: FlavorSelectorProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {flavors.map((flavor) => {
        const isSelected = flavor === selected
        const isActive = activeItem === flavor
        return (
          <button
            key={flavor}
            onClick={() => onSelect(flavor)}
            onPointerEnter={(e) => { if (e.pointerType === 'mouse') setActiveItem(flavor) }}
            onPointerDown={() => setActiveItem(flavor)}
            onPointerUp={(e) => { if (e.pointerType === 'touch') setActiveItem(null) }}
            onPointerLeave={() => setActiveItem(null)}
            onPointerCancel={() => setActiveItem(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: isActive ? `${accent}14` : 'none',
              backdropFilter: isActive ? 'blur(16px) saturate(180%)' : 'none',
              WebkitBackdropFilter: isActive ? 'blur(16px) saturate(180%)' : 'none',
              boxShadow: isActive ? `0 4px 24px ${accent}20, inset 0 1px 0 ${accent}18` : 'none',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              padding: '10px 12px',
              margin: '0 -12px',
              fontSize: 'var(--text-lg)',
              fontWeight: isSelected ? 500 : 400,
              color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
              transition: 'color 150ms ease, background 180ms ease, box-shadow 180ms ease',
              textAlign: 'left',
              fontFamily: 'inherit',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: accent,
                flexShrink: 0,
                opacity: isSelected ? 1 : 0,
                transition: 'opacity 150ms ease',
              }}
            />
            {flavor}
          </button>
        )
      })}
    </div>
  )
}
