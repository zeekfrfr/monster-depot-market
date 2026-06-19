'use client'

import { useState } from 'react'

interface StepTipProps {
  tip: string
  variant?: 'standard' | 'guided'
}

function InfoIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11.5" x2="12" y2="16" />
      <circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export default function StepTip({ tip, variant = 'standard' }: StepTipProps) {
  const [open, setOpen] = useState(false)
  if (!tip) return null

  // Guided mode — larger "Pro tip" toggle + a card that slides up on open.
  if (variant === 'guided') {
    return (
      <div style={{ marginTop: '16px' }}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            minHeight: '40px',
            padding: '8px 16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 500,
            fontSize: '14px',
            color: 'var(--brand-purple-light)',
          }}
        >
          <InfoIcon size={16} /> Pro tip
        </button>
        {open && (
          <div
            className="step-tip-card"
            style={{
              margin: '8px auto 0',
              maxWidth: '400px',
              background: 'var(--surface-white)',
              borderLeft: '3px solid var(--brand-purple-light)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 300,
              fontSize: '15px',
              color: 'var(--text-primary)',
              lineHeight: 1.5,
              textAlign: 'left',
            }}
          >
            {tip}
          </div>
        )}
      </div>
    )
  }

  // Standard recipe view — "ⓘ Tip" pill: tap expands inline, desktop also hovers.
  return (
    <div className="step-tip" style={{ position: 'relative', marginTop: '6px' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="step-tip-toggle"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 0',
          fontFamily: 'var(--font-dm-sans)',
          fontWeight: 500,
          fontSize: '12px',
          color: 'var(--brand-purple-light)',
          borderBottom: '1px dashed color-mix(in srgb, var(--brand-purple-light) 45%, transparent)',
        }}
      >
        <InfoIcon /> Tip
      </button>

      {/* Desktop-only floating tooltip on hover/focus (hidden on touch via CSS). */}
      <span className="step-tip-hovercard" role="tooltip">
        {tip}
      </span>

      {/* Tap-to-expand inline (grid-rows trick = smooth height animation). */}
      <div
        aria-hidden={!open}
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 200ms ease',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              paddingTop: '8px',
              margin: 0,
            }}
          >
            {tip}
          </p>
        </div>
      </div>
    </div>
  )
}
