'use client'

import { useState } from 'react'
import type { Flavor } from '@/lib/products'
import ToppingsPopup from './ToppingsPopup'

interface AddToCartButtonProps {
  flavor: Flavor
  label: string
  className?: string
  style?: React.CSSProperties
}

export default function AddToCartButton({
  flavor,
  label,
  className,
  style,
}: AddToCartButtonProps) {
  const [open, setOpen] = useState(false)

  const baseStyle: React.CSSProperties = {
    fontFamily: 'var(--font-syne)',
    fontWeight: 700,
    borderRadius: 'var(--radius-full)',
    minHeight: 52,
    padding: '14px 32px',
    border: 'none',
    cursor: 'pointer',
    lineHeight: 1.1,
    transition:
      'transform var(--dur-fast) var(--ease-spring), filter var(--dur-fast) var(--ease-spring)',
    ...style,
  }

  return (
    <>
      <button
        type="button"
        className={className}
        style={baseStyle}
        onClick={() => setOpen(true)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)'
          e.currentTarget.style.filter = 'brightness(1.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.filter = 'none'
        }}
      >
        {label}
      </button>
      {open && <ToppingsPopup flavor={flavor} onClose={() => setOpen(false)} />}
    </>
  )
}
