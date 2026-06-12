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
  const [active, setActive] = useState(false)

  return (
    <button
      onClick={onClick}
      onPointerDown={() => setActive(true)}
      onPointerUp={() => setActive(false)}
      onPointerLeave={() => setActive(false)}
      onPointerCancel={() => setActive(false)}
      style={{
        background: active ? `${mode.accent}18` : 'transparent',
        backdropFilter: active ? 'blur(16px) saturate(180%)' : 'none',
        WebkitBackdropFilter: active ? 'blur(16px) saturate(180%)' : 'none',
        border: `1px solid ${active ? mode.accent + '50' : 'transparent'}`,
        borderRadius: '14px',
        boxShadow: active
          ? `0 4px 32px ${mode.accent}28, 0 0 0 1px ${mode.accent}18, inset 0 1px 0 ${mode.accent}30`
          : 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-cormorant)',
        fontSize: 'var(--text-3xl)',
        fontWeight: 300,
        letterSpacing: '0.15em',
        color: active ? mode.accent : 'var(--text-primary)',
        transition: 'color 180ms ease, background 180ms ease, border-color 180ms ease, box-shadow 180ms ease',
        lineHeight: 1,
        padding: '14px 44px',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'manipulation',
      }}
    >
      {mode.name}
    </button>
  )
}
