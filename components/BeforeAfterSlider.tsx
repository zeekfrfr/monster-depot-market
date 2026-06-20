'use client'

import { useCallback, useRef, useState } from 'react'

const BEFORE_SRC =
  'https://vmoqfnkwswwbewzsbyqb.supabase.co/storage/v1/object/sign/Mommnt%20v2/Blue-batter-mug.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jNTY0NTIzZS05NWVhLTRiNTUtODM1ZS0xMzgzMDNiZjVhNTAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJNb21tbnQgdjIvQmx1ZS1iYXR0ZXItbXVnLnBuZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODE5MTE2NjIsImV4cCI6MTg3NjUxOTY2Mn0.p3JYp5WZsFJRQ8rArwue4yMwU9xVzuElXhyiT7HtTHM'

const AFTER_SRC =
  'https://vmoqfnkwswwbewzsbyqb.supabase.co/storage/v1/object/sign/Mommnt%20v2/Purple-batter-mug.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jNTY0NTIzZS05NWVhLTRiNTUtODM1ZS0xMzgzMDNiZjVhNTAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJNb21tbnQgdjIvUHVycGxlLWJhdHRlci1tdWcucG5nIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4MTkxMTY3NywiZXhwIjoxODc2NTE5Njc3fQ.W1kH81Rbx3ifGX3AFBt-0Ad_0K7JVcUYWIrDGJZVBoU'

export default function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pct, setPct] = useState(50)

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const raw = ((clientX - rect.left) / rect.width) * 100
    setPct(Math.max(5, Math.min(95, raw)))
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    setFromClientX(e.clientX)
    const move = (ev: PointerEvent) => setFromClientX(ev.clientX)
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setPct((p) => Math.max(5, p - 2))
    else if (e.key === 'ArrowRight') setPct((p) => Math.min(95, p + 2))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '340px',
          aspectRatio: '1 / 1',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          touchAction: 'none',
          cursor: 'ew-resize',
          userSelect: 'none',
        }}
      >
        {/* Before (blue) — always fully visible beneath */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BEFORE_SRC}
          alt="Blue batter in a mug before liquid activates the butterfly pea flower"
          draggable={false}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* After (purple) — on top, clipped from the left by pct */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={AFTER_SRC}
          alt="Purple batter in a mug after the color change"
          draggable={false}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            clipPath: `inset(0 0 0 ${pct}%)`,
          }}
        />
        {/* Divider */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${pct}%`,
            width: '2px',
            background: '#fff',
            transform: 'translateX(-1px)',
            pointerEvents: 'none',
          }}
        />
        {/* Handle */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: `${pct}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className="ba-handle"
            role="slider"
            aria-label="Drag to reveal the colour change"
            aria-valuemin={5}
            aria-valuemax={95}
            aria-valuenow={Math.round(pct)}
            tabIndex={0}
            onKeyDown={onKeyDown}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#fff',
              border: '2px solid var(--monster-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--monster-accent)',
              fontSize: '16px',
              lineHeight: 1,
              cursor: 'ew-resize',
              transition: 'transform 150ms ease',
            }}
          >
            ↔
          </div>
        </div>
      </div>

      <p
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontWeight: 300,
          fontSize: '14px',
          color: 'var(--monster-text)',
          opacity: 0.6,
          textAlign: 'center',
          marginTop: '16px',
          marginBottom: 0,
        }}
      >
        Add your liquid. Watch it change.
      </p>
    </div>
  )
}
