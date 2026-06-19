'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'mdm_age_confirmed'

export default function AgeGate() {
  const [confirmed, setConfirmed] = useState<boolean | null>(null)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    try {
      setConfirmed(sessionStorage.getItem(STORAGE_KEY) === 'true')
    } catch {
      setConfirmed(false)
    }
  }, [])

  // Render nothing until we've read sessionStorage (avoids flash), and once confirmed.
  if (confirmed === null || confirmed === true) return null

  const handleConfirm = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      /* sessionStorage may be unavailable; still allow entry */
    }
    setExiting(true)
    window.setTimeout(() => setConfirmed(true), 200)
  }

  const handleDecline = () => {
    window.location.href = 'https://google.com'
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Age verification"
      className={exiting ? 'overlay-exit' : 'anim-fade-in'}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        background: 'var(--brand-purple-dark)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-6)',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 800,
          fontSize: 28,
          letterSpacing: '-0.02em',
          color: '#FFFFFF',
          margin: 0,
          lineHeight: 1.1,
        }}
      >
        Monster Depot Market
      </p>

      <p
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontWeight: 300,
          fontSize: 16,
          color: 'rgba(255, 255, 255, 0.7)',
          maxWidth: 320,
          marginTop: 'var(--space-4)',
          marginBottom: 0,
          lineHeight: 1.5,
        }}
      >
        You must be 18 or older to enter.
      </p>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 'var(--space-3)',
          marginTop: 'var(--space-8)',
        }}
      >
        <button
          type="button"
          onClick={handleConfirm}
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 700,
            fontSize: 16,
            color: '#FFFFFF',
            background: 'var(--brand-purple-light)',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            padding: '16px 40px',
            minHeight: 52,
            cursor: 'pointer',
          }}
        >
          I&apos;m 18+
        </button>

        <button
          type="button"
          onClick={handleDecline}
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 700,
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.7)',
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            borderRadius: 'var(--radius-full)',
            padding: '16px 40px',
            minHeight: 52,
            cursor: 'pointer',
          }}
        >
          I&apos;m not 18
        </button>
      </div>
    </div>
  )
}
