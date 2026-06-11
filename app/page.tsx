'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MODES, type ModeProduct } from '@/lib/products'

export default function LandingPage() {
  const router = useRouter()
  const [fading, setFading] = useState(false)

  const handleSelect = async (slug: string) => {
    setFading(true)
    await new Promise((r) => setTimeout(r, 200))
    router.push(`/${slug}`)
  }

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 56px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        opacity: fading ? 0 : 1,
        transition: 'opacity 200ms ease',
      }}
    >
      <p
        style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 300,
          color: 'var(--text-secondary)',
          letterSpacing: '-0.01em',
          marginBottom: '48px',
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >
        What are you looking for today?
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        {MODES.map((mode) => (
          <ModeButton
            key={mode.slug}
            mode={mode}
            onClick={() => handleSelect(mode.slug)}
          />
        ))}
      </div>
    </div>
  )
}

function ModeButton({
  mode,
  onClick,
}: {
  mode: ModeProduct
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-cormorant)',
        fontSize: 'var(--text-3xl)',
        fontWeight: 300,
        letterSpacing: '0.15em',
        color: hovered ? mode.accent : 'var(--text-primary)',
        transition: 'color 150ms ease',
        lineHeight: 1,
        padding: '0',
      }}
    >
      {mode.name}
    </button>
  )
}
