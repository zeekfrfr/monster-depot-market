'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSavedRecipes } from '@/lib/savedRecipes'

interface SaveButtonProps {
  recipeId: string
  accent: string
  /** Text/icon color to use when sitting on the accent fill (saved state). */
  accentTextColor?: string
  /** Base text color for the ghost (recipe) variant. */
  textColor?: string
  variant?: 'recipe' | 'card'
}

function Bookmark({ filled, size }: { filled: boolean; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1z" />
    </svg>
  )
}

export default function SaveButton({
  recipeId,
  accent,
  accentTextColor = '#1A1A1A',
  textColor = '#FFFFFF',
  variant = 'recipe',
}: SaveButtonProps) {
  const { isSaved, toggle } = useSavedRecipes()
  const [toast, setToast] = useState(false)
  const saved = isSaved(recipeId)

  const onClick = async () => {
    const result = await toggle(recipeId)
    if (result === 'signed-out') {
      setToast(true)
      window.setTimeout(() => setToast(false), 4000)
    }
  }

  const toastEl = toast ? (
    <div
      role="status"
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 400,
        background: '#1A1A1A',
        color: '#fff',
        borderRadius: 'var(--radius-full)',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontFamily: 'var(--font-dm-sans)',
        fontSize: '14px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
        whiteSpace: 'nowrap',
      }}
    >
      <span>Sign in to save recipes</span>
      <Link
        href="/login"
        style={{ color: '#C084FC', textDecoration: 'underline', textUnderlineOffset: '3px' }}
      >
        Sign in →
      </Link>
    </div>
  ) : null

  if (variant === 'card') {
    return (
      <>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onClick()
          }}
          aria-label={saved ? 'Remove from saved recipes' : 'Save recipe'}
          aria-pressed={saved}
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            cursor: 'pointer',
            background: saved ? accent : 'rgba(255,255,255,0.85)',
            color: saved ? accentTextColor : '#1A1A1A',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            transition: 'background var(--dur-fast) var(--ease-out)',
          }}
        >
          <Bookmark filled={saved} size={18} />
        </button>
        {toastEl}
      </>
    )
  }

  // recipe (large ghost) variant
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label={saved ? 'Remove from saved recipes' : 'Save recipe'}
        aria-pressed={saved}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          minHeight: '52px',
          padding: '14px 24px',
          borderRadius: 'var(--radius-lg)',
          cursor: 'pointer',
          fontFamily: 'var(--font-syne)',
          fontWeight: 700,
          fontSize: '15px',
          transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
          ...(saved
            ? {
                background: accent,
                color: accentTextColor,
                border: '1.5px solid transparent',
              }
            : {
                background: 'transparent',
                color: `color-mix(in srgb, ${textColor} 70%, transparent)`,
                border: `1.5px solid color-mix(in srgb, ${textColor} 30%, transparent)`,
              }),
        }}
      >
        {saved ? (
          <>
            <span aria-hidden="true">✓</span> Saved
          </>
        ) : (
          <>
            <Bookmark filled={false} size={18} /> Save recipe
          </>
        )}
      </button>
      {toastEl}
    </>
  )
}
