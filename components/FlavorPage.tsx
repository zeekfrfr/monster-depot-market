'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Flavor } from '@/lib/products'
import { needsTextScrim } from '@/lib/products'
import BeforeAfterSlider from './BeforeAfterSlider'
import VideoPlaceholder from './VideoPlaceholder'
import ThreeWays from './ThreeWays'
import ToppingsMenu from './ToppingsMenu'
import AddToCartButton from './AddToCartButton'

interface FlavorPageProps {
  flavor: Flavor
}

export default function FlavorPage({ flavor }: FlavorPageProps) {
  // Colored page-enter overlay: runs bgExpand, then is removed from the DOM.
  const [showOverlay, setShowOverlay] = useState(true)
  const [backHover, setBackHover] = useState(false)
  const [watchHover, setWatchHover] = useState(false)

  const scrim = needsTextScrim(flavor.slug)
  const isMonster = flavor.slug === 'monster-cookie'

  // Remove the entrance overlay once its bgExpand run completes (300ms).
  useEffect(() => {
    const id = window.setTimeout(() => setShowOverlay(false), 300)
    return () => window.clearTimeout(id)
  }, [])

  // On mount: if there's a hash in the URL, smooth-scroll to it after 300ms.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash
    if (!hash) return
    const id = window.setTimeout(() => {
      const target = document.querySelector(hash)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 300)
    return () => window.clearTimeout(id)
  }, [])

  // Smooth-scroll helper for in-page anchor buttons.
  const scrollTo = (selector: string) => {
    const target = document.querySelector(selector)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const Headline = (
    <>
      <h1
        className="anim-fade-up-sm"
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 800,
          fontSize: 'clamp(2.5rem, 8vw, 5rem)',
          color: flavor.text,
          lineHeight: 1.02,
          letterSpacing: '-0.02em',
          margin: 0,
        }}
      >
        {flavor.name}
      </h1>
      <p
        className="anim-fade-up-sm"
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontWeight: 300,
          fontSize: '20px',
          color: flavor.text,
          opacity: 0.7,
          lineHeight: 1.35,
          marginTop: 'var(--space-2)',
          marginBottom: 0,
          animationDelay: '60ms',
        }}
      >
        {flavor.hook}
      </p>
      <p
        className="anim-fade-up-sm"
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontWeight: 300,
          fontSize: '15px',
          color: flavor.text,
          opacity: 0.5,
          marginTop: '8px',
          marginBottom: '16px',
          animationDelay: '90ms',
        }}
      >
        Just add liquid.
      </p>
    </>
  )

  return (
    <main style={{ position: 'relative', width: '100%', overflowX: 'hidden' }}>
      {/* Page-enter overlay — colored bloom that expands then unmounts. */}
      {showOverlay && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: flavor.bg,
            zIndex: 40,
            transformOrigin: 'center',
            animation: 'bgExpand 300ms var(--ease-out) both',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Back button — fixed top-left. */}
      <Link
        href="/"
        aria-label="Back to home"
        onMouseEnter={() => setBackHover(true)}
        onMouseLeave={() => setBackHover(false)}
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 50,
          minWidth: 44,
          minHeight: 44,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-dm-sans)',
          fontWeight: 400,
          fontSize: '14px',
          color: flavor.text,
          opacity: backHover ? 1 : 0.5,
          textDecoration: 'none',
          transition: 'opacity var(--dur-fast) var(--ease-out)',
        }}
      >
        ← Back
      </Link>

      {/* Content wrapper — fades in as the overlay clears. */}
      <div className="anim-fade-in">
        {/* Section 1 — hero. */}
        <section
          style={{
            minHeight: '100svh',
            width: '100%',
            background: flavor.bg,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'var(--space-6)',
            boxSizing: 'border-box',
          }}
        >
          <style>{`
            .mdm-hero-inner {
              width: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
            }
            .mdm-hero-cta { justify-content: center; }
            @media (min-width: 1024px) {
              .mdm-hero-inner {
                align-items: flex-start;
                text-align: left;
                max-width: 560px;
                margin-left: 10%;
              }
              .mdm-hero-cta { justify-content: flex-start; }
            }
          `}</style>
          <div className="mdm-hero-inner">
            {scrim ? <div className="text-scrim">{Headline}</div> : Headline}

            <div
              className="anim-fade-up-sm mdm-hero-cta"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-3)',
                marginTop: 'var(--space-8)',
                animationDelay: '120ms',
              }}
            >
              {/* Ghost button — scroll to the moment. */}
              <button
                type="button"
                onClick={() => scrollTo('#the-moment')}
                onMouseEnter={() => setWatchHover(true)}
                onMouseLeave={() => setWatchHover(false)}
                style={{
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 700,
                  fontSize: '15px',
                  color: flavor.accent,
                  background: watchHover
                    ? `color-mix(in srgb, ${flavor.accent} 15%, transparent)`
                    : 'transparent',
                  border: `1.5px solid ${flavor.accent}`,
                  borderRadius: 'var(--radius-full)',
                  padding: '14px 28px',
                  minHeight: 52,
                  lineHeight: 1.1,
                  cursor: 'pointer',
                  transition: 'background var(--dur-fast) var(--ease-out)',
                }}
              >
                Watch it happen
              </button>

              {/* Add to cart — solid accent. */}
              <AddToCartButton
                flavor={flavor}
                label="Add to cart  $8.99"
                style={{
                  background: flavor.accent,
                  color: isMonster ? '#fff' : '#1A1A1A',
                }}
              />
            </div>
          </div>
        </section>

        {/* Section 2 — the moment. */}
        <section
          id="the-moment"
          aria-label={`${flavor.name} — the moment`}
          style={{
            width: '100%',
            background: flavor.bg,
            padding: '64px var(--space-6)',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* White 8% overlay. */}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255, 255, 255, 0.08)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
            {isMonster ? (
              <BeforeAfterSlider />
            ) : (
              <VideoPlaceholder
                ratio="9:16"
                label={`${flavor.name} — video coming soon`}
                accent={flavor.accent}
              />
            )}
          </div>
        </section>

        {/* Section 3 — three ways. */}
        <section
          id="three-ways"
          style={{
            width: '100%',
            background: flavor.bg,
            padding: '64px var(--space-6)',
            boxSizing: 'border-box',
          }}
        >
          <ThreeWays flavor={flavor} />
        </section>

        {/* Section 4 — toppings. */}
        <section
          id="toppings"
          style={{
            width: '100%',
            background: 'var(--surface-white)',
            padding: '64px var(--space-6)',
            boxSizing: 'border-box',
          }}
        >
          <ToppingsMenu flavor={flavor} />
        </section>

        {/* Section 5 — scan. */}
        <section
          id="scan"
          style={{
            width: '100%',
            background: flavor.bg,
            padding: '64px var(--space-6)',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/*
            TODO: Generate QR code linking to this flavor page; scanning
            auto-scrolls to #three-ways via URL hash.
          */}
          <div
            role="img"
            aria-label="QR code placeholder"
            style={{
              width: 200,
              height: 200,
              background: 'var(--surface-white)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--space-4)',
              boxSizing: 'border-box',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 300,
                fontSize: '12px',
                color: 'var(--text-tertiary)',
                textAlign: 'center',
                lineHeight: 1.4,
              }}
            >
              QR code — generate and insert
            </span>
          </div>

          <p
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 700,
              fontSize: '20px',
              color: flavor.text,
              marginTop: 'var(--space-6)',
              marginBottom: 0,
            }}
          >
            Scan to explore.
          </p>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 300,
              fontSize: '14px',
              color: flavor.text,
              opacity: 0.6,
              marginTop: 'var(--space-2)',
              marginBottom: 0,
            }}
          >
            Three ways to make it. Real reactions. Best pairings.
          </p>
        </section>
      </div>
    </main>
  )
}
