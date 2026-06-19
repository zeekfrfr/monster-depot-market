'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Recipe } from '@/lib/recipes'

interface GuidedModeProps {
  recipe: Recipe
  accent: string
  bg: string
  textColor: string
  accentTextColor: string
  onExit: (reason: 'exit' | 'done') => void
}

export default function GuidedMode({
  recipe,
  accent,
  bg,
  textColor,
  accentTextColor,
  onExit,
}: GuidedModeProps) {
  const steps =
    recipe.steps && recipe.steps.length
      ? recipe.steps
      : [{ number: 1, instruction: 'No steps for this recipe yet.', tip: null }]
  const total = steps.length

  const [i, setI] = useState(0)
  const [dir, setDir] = useState<'next' | 'prev'>('next')
  const [confirmExit, setConfirmExit] = useState(false)
  const [exiting, setExiting] = useState(false)

  const muted = (pct: number) => `color-mix(in srgb, ${textColor} ${pct}%, transparent)`

  const finish = useCallback(
    (reason: 'exit' | 'done') => {
      setExiting(true)
      window.setTimeout(() => onExit(reason), 200)
    },
    [onExit],
  )

  const goNext = useCallback(() => {
    setI((cur) => {
      if (cur < total - 1) {
        setDir('next')
        return cur + 1
      }
      finish('done')
      return cur
    })
  }, [total, finish])

  const goPrev = useCallback(() => {
    setI((cur) => {
      if (cur > 0) {
        setDir('prev')
        return cur - 1
      }
      return cur
    })
  }, [])

  // Lock page scroll + keyboard navigation while guided mode is open.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        goNext()
      } else if (e.key === 'ArrowLeft') {
        goPrev()
      } else if (e.key === 'Escape') {
        setConfirmExit(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [goNext, goPrev])

  const step = steps[i]
  const isLast = i === total - 1
  const progress = ((i + 1) / total) * 100

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Guided mode — ${recipe.title}`}
      className={exiting ? 'gm-exit' : 'gm-enter'}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        background: bg,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Progress bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: muted(15) }}>
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: accent,
            transition: 'width 300ms ease',
          }}
        />
      </div>

      {/* Top nav */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px var(--space-5) 0',
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={goPrev}
          disabled={i === 0}
          aria-label="Previous step"
          style={{
            minWidth: '44px',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            cursor: i === 0 ? 'default' : 'pointer',
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '14px',
            color: i === 0 ? muted(25) : muted(50),
          }}
        >
          ← Back
        </button>

        <span
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '13px',
            color: muted(50),
            textAlign: 'center',
            padding: '0 8px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {recipe.title}
        </span>

        <button
          type="button"
          onClick={() => setConfirmExit(true)}
          aria-label="Exit guided mode"
          style={{
            minWidth: '44px',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '14px',
            color: muted(50),
          }}
        >
          ✕ Exit
        </button>
      </div>

      {/* Step number label */}
      <p
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontWeight: 400,
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: muted(50),
          textAlign: 'center',
          marginTop: 'var(--space-4)',
          marginBottom: 0,
          flexShrink: 0,
        }}
      >
        Step {i + 1} of {total}
      </p>

      {/* Step body — centered, keyed slide-in */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px var(--space-6)',
        }}
      >
        <div
          key={i}
          className={dir === 'next' ? 'gm-slide-right' : 'gm-slide-left'}
          style={{ maxWidth: '480px', textAlign: 'center' }}
        >
          <p
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 700,
              fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
              color: textColor,
              lineHeight: 1.3,
              margin: 0,
            }}
          >
            {step.instruction}
          </p>
          {step.tip && (
            <p
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 300,
                fontStyle: 'italic',
                fontSize: '15px',
                color: muted(60),
                marginTop: '24px',
                marginBottom: 0,
                lineHeight: 1.5,
              }}
            >
              Tip: {step.tip}
            </p>
          )}
        </div>
      </div>

      {/* Next / Done */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: 'var(--space-5) var(--space-6) var(--space-8)',
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={goNext}
          className="gm-next"
          style={{
            minHeight: '60px',
            minWidth: '140px',
            padding: '0 28px',
            borderRadius: 'var(--radius-lg)',
            border: 'none',
            cursor: 'pointer',
            background: accent,
            color: accentTextColor,
            fontFamily: 'var(--font-syne)',
            fontWeight: 700,
            fontSize: '18px',
          }}
        >
          {isLast ? 'Done ✓' : 'Next →'}
        </button>
      </div>

      {/* Inline exit confirmation */}
      {confirmExit && (
        <div
          className="gm-enter"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-6)',
          }}
        >
          <div
            style={{
              background: 'var(--surface-white)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
              maxWidth: '320px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-syne)',
                fontWeight: 700,
                fontSize: '18px',
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              Exit guided mode?
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: 'var(--space-5)' }}>
              <button
                type="button"
                onClick={() => setConfirmExit(false)}
                style={{
                  flex: 1,
                  minHeight: '48px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #E5E5E5',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 700,
                  fontSize: '15px',
                  color: 'var(--text-primary)',
                }}
              >
                Keep going
              </button>
              <button
                type="button"
                onClick={() => finish('exit')}
                style={{
                  flex: 1,
                  minHeight: '48px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: 'var(--brand-purple-light)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 700,
                  fontSize: '15px',
                }}
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
