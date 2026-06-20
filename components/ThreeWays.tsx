'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { Flavor } from '@/lib/products'

// Maps a flavor's cooking-method name to its recipe slug suffix.
const METHOD_SLUG: Record<string, string> = {
  '12oz Mug + Microwave': 'mug',
  'Air Fryer': 'air-fryer',
  'Waffle Maker': 'waffle-maker',
}

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
        {flavor.cookingMethods.map((method, i) => {
          const recipeSlug = `${flavor.slug}-${METHOD_SLUG[method.method] ?? ''}`
          return (
            <article
              key={method.method}
              style={{
                position: 'relative',
                width: '260px',
                flexShrink: 0,
                scrollSnapAlign: 'start',
                background: `color-mix(in srgb, ${flavor.bg} 92%, #ffffff)`,
                border: `1px solid color-mix(in srgb, ${flavor.accent} 20%, transparent)`,
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                opacity: visible ? 1 : 0,
                animation: visible
                  ? `fadeInRight 350ms var(--ease-out) both ${i * 100}ms`
                  : 'none',
              }}
            >
              {/* Tapping the card → the recipe (standard view) */}
              <Link
                href={`/recipes/${recipeSlug}`}
                aria-label={`${flavor.name} — ${method.method} recipe`}
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', flex: 1 }}
              >
                {/* Watermark header — flavor bg with the method name as a decorative mark */}
                <div
                  style={{
                    height: '120px',
                    background: flavor.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    padding: '0 12px',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: 'var(--font-syne)',
                      fontWeight: 800,
                      fontSize: '26px',
                      color: flavor.text,
                      opacity: 0.2,
                      textAlign: 'center',
                      lineHeight: 1.05,
                    }}
                  >
                    {method.method}
                  </span>
                </div>

                {/* Body */}
                <div style={{ padding: 'var(--space-5)' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-syne)',
                      fontWeight: 700,
                      fontSize: '18px',
                      color: flavor.text,
                      lineHeight: 1.2,
                      margin: 0,
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
                      margin: 'var(--space-1) 0 0',
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
                      margin: 'var(--space-2) 0 0',
                    }}
                  >
                    {method.result}
                  </p>
                </div>
              </Link>

              {/* Start → recipe page with guided mode auto-activated */}
              <div style={{ padding: '0 var(--space-5) var(--space-5)' }}>
                <Link
                  href={`/recipes/${recipeSlug}?guided=true`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    minHeight: '44px',
                    padding: '10px 18px',
                    borderRadius: 'var(--radius-full)',
                    background: flavor.accent,
                    color: flavor.slug === 'monster-cookie' ? '#fff' : '#1A1A1A',
                    fontFamily: 'var(--font-syne)',
                    fontWeight: 700,
                    fontSize: '14px',
                    textDecoration: 'none',
                  }}
                >
                  ▶ Start
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
