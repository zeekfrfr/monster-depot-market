'use client'

import Link from 'next/link'
import type { Flavor } from '@/lib/products'
import { needsTextScrim } from '@/lib/products'
import AddToCartButton from './AddToCartButton'

interface FlavorCardProps {
  flavor: Flavor
}

export default function FlavorCard({ flavor }: FlavorCardProps) {
  const scrim = needsTextScrim(flavor.slug)

  const nameStyle: React.CSSProperties = {
    fontFamily: 'var(--font-syne)',
    fontWeight: 800,
    fontSize: 'clamp(2rem, 6vw, 4.5rem)',
    lineHeight: 1.02,
    letterSpacing: '-0.02em',
    color: flavor.text,
    margin: 0,
  }

  const hookStyle: React.CSSProperties = {
    fontFamily: 'var(--font-dm-sans)',
    fontWeight: 300,
    fontSize: '18px',
    lineHeight: 1.35,
    color: flavor.text,
    opacity: 0.7,
    marginTop: '8px',
    marginBottom: 0,
  }

  const heading = (
    <>
      <h2 style={nameStyle}>{flavor.name}</h2>
      <p style={hookStyle}>{flavor.hook}</p>
    </>
  )

  return (
    <div
      style={{
        position: 'relative',
        flex: '0 0 100vw',
        width: '100vw',
        height: '100svh',
        background: flavor.bg,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 var(--space-6)',
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div
        className="flavor-card-content anim-fade-up-sm"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        {scrim ? (
          <div className="text-scrim">{heading}</div>
        ) : (
          heading
        )}

        <p
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 400,
            fontSize: '15px',
            color: flavor.text,
            opacity: 0.6,
            marginTop: '16px',
            marginBottom: 0,
          }}
        >
          {`$${flavor.price.toFixed(2)} · 7-pack $${flavor.sevenPackPrice.toFixed(2)}`}
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 'var(--space-3)',
            marginTop: 'var(--space-6)',
          }}
        >
          <AddToCartButton
            flavor={flavor}
            label="Add to cart"
            style={{
              background: flavor.accent,
              color: flavor.slug === 'monster-cake' ? '#fff' : '#1A1A1A',
              fontSize: '15px',
            }}
          />
          <Link
            href={`/${flavor.slug}`}
            aria-label={`See more about ${flavor.name}`}
            className="flavor-card-seemore"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-syne)',
              fontWeight: 600,
              fontSize: '15px',
              lineHeight: 1.1,
              color: flavor.text,
              borderRadius: 'var(--radius-full)',
              border: `1px solid ${flavor.text}`,
              padding: '14px 32px',
              minHeight: 52,
              opacity: 0.75,
              textDecoration: 'none',
              transition: 'opacity var(--dur-fast) var(--ease-out)',
            }}
          >
            See more →
          </Link>
        </div>
      </div>

      <style>{`
        .flavor-card-seemore:hover { opacity: 1 !important; }
        @media (min-width: 1024px) {
          .flavor-card-content {
            align-items: flex-start !important;
            text-align: left !important;
            max-width: 560px;
            margin-left: 10%;
          }
          .flavor-card-content > div:last-of-type {
            justify-content: flex-start !important;
          }
        }
      `}</style>
    </div>
  )
}
