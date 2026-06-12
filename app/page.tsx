'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MODES, type ModeProduct } from '@/lib/products'

export default function LandingPage() {
  const router = useRouter()
  const handleSelect = (slug: string) => {
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
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: 'var(--text-xl)',
          fontWeight: 300,
          color: 'var(--brand-purple-light)',
          letterSpacing: '0.06em',
          textAlign: 'center',
          lineHeight: 1,
          marginBottom: '48px',
        }}
      >
        Made for the session.
      </p>

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

      <p
        style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: 'var(--text-xl)',
          fontWeight: 300,
          color: 'var(--text-tertiary)',
          letterSpacing: '0.03em',
          lineHeight: 1.6,
          textAlign: 'center',
          maxWidth: '520px',
          marginTop: '96px',
        }}
      >
        The session already has your taste buds paying attention. We just gave them something worth it.
      </p>
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
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') setActive(true) }}
      onPointerDown={() => setActive(true)}
      onPointerUp={(e) => { if (e.pointerType === 'touch') setActive(false) }}
      onPointerLeave={() => setActive(false)}
      onPointerCancel={() => setActive(false)}
      style={{
        position: 'relative',
        background: 'transparent',
        border: 'none',
        borderRadius: '14px',
        cursor: 'pointer',
        fontFamily: 'var(--font-cormorant)',
        fontSize: 'var(--text-3xl)',
        fontWeight: 300,
        letterSpacing: '0.15em',
        color: active ? mode.accent : 'var(--text-primary)',
        transition: 'color 100ms ease',
        lineHeight: 1,
        padding: '14px 44px',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'manipulation',
        willChange: 'transform',
      }}
    >
      {/* Glass layer — always composited, opacity toggles to avoid layer thrash */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '14px',
          backdropFilter: 'blur(12px) saturate(160%)',
          WebkitBackdropFilter: 'blur(12px) saturate(160%)',
          background: `${mode.accent}16`,
          boxShadow: `0 4px 32px ${mode.accent}28, inset 0 1px 0 ${mode.accent}18`,
          opacity: active ? 1 : 0,
          transition: 'opacity 100ms ease',
          pointerEvents: 'none',
        }}
      />
      {mode.name}
    </button>
  )
}
