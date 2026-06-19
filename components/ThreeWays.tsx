'use client'

import { useEffect, useRef, useState } from 'react'
import type { Flavor } from '@/lib/products'
import VideoPlaceholder from './VideoPlaceholder'

interface ThreeWaysProps {
  flavor: Flavor
}

export default function ThreeWays({ flavor }: ThreeWaysProps) {
  const rowRef = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = rowRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.2 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      aria-label={`Three ways to make ${flavor.name}`}
      style={{ width: '100%' }}
    >
      {/* Header */}
      <h2
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 800,
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          color: flavor.text,
          lineHeight: 1.05,
          margin: 0,
          letterSpacing: '-0.01em',
        }}
      >
        Make it three ways.
      </h2>
      <p
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontWeight: 300,
          fontSize: '15px',
          color: flavor.text,
          opacity: 0.6,
          marginTop: 'var(--space-2)',
          marginBottom: 0,
        }}
      >
        Same pouch. Three different results.
      </p>

      {/* Row */}
      <div
        ref={rowRef}
        className="no-scrollbar"
        style={{
          display: 'flex',
          gap: 'var(--space-4)',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          paddingBottom: 'var(--space-2)',
          marginTop: 'var(--space-6)',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {flavor.cookingMethods.map((method, i) => (
          <article
            key={method.method}
            style={{
              position: 'relative',
              width: '260px',
              flexShrink: 0,
              scrollSnapAlign: 'start',
              background: flavor.bg,
              border: `1px solid color-mix(in srgb, ${flavor.accent} 20%, transparent)`,
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
              opacity: visible ? 1 : 0,
              animation: visible
                ? `fadeInRight 350ms var(--ease-out) both ${i * 100}ms`
                : 'none',
            }}
          >
            {/* White 10% overlay layer */}
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(255, 255, 255, 0.1)',
                pointerEvents: 'none',
              }}
            />

            {/* Content above the overlay */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <VideoPlaceholder
                ratio="16:9"
                label={method.method}
                accent={flavor.accent}
              />

              <h3
                style={{
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 700,
                  fontSize: '18px',
                  color: flavor.text,
                  lineHeight: 1.2,
                  margin: 0,
                  marginTop: 'var(--space-4)',
                }}
              >
                {method.method}
              </h3>

              <p
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontWeight: 300,
                  fontSize: '14px',
                  color: flavor.accent,
                  margin: 0,
                  marginTop: 'var(--space-1)',
                }}
              >
                {method.time}
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontWeight: 300,
                  fontSize: '13px',
                  color: flavor.text,
                  opacity: 0.6,
                  lineHeight: 1.4,
                  margin: 0,
                  marginTop: 'var(--space-2)',
                }}
              >
                {method.result}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
