'use client'

import Link from 'next/link'
import type { Flavor } from '@/lib/products'
import { needsTextScrim } from '@/lib/products'
import { useCatalog } from '@/lib/catalogContext'
import AddToCartButton from './AddToCartButton'

interface FlavorCardProps {
  flavor: Flavor
}

export default function FlavorCard({ flavor }: FlavorCardProps) {
  const scrim = needsTextScrim(flavor.slug)
  const catalog = useCatalog()
  const price = catalog?.flavorPrice[flavor.slug] ?? flavor.price
  const sevenPack = catalog?.sevenPack ?? flavor.sevenPackPrice
  const stock = catalog?.stock[flavor.slug] ?? 'in_stock'
  const soldOut = stock === 'sold_out'

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
      <p
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontWeight: 300,
          fontSize: '14px',
          color: flavor.text,
          opacity: 0.5,
          marginTop: '6px',
          marginBottom: 0,
        }}
      >
        Just add liquid.
      </p>
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
          {`$${price.toFixed(2)} · 7-pack $${sevenPack.toFixed(2)}`}
        </p>

        {stock !== 'in_stock' && (
          <span
            style={{
              marginTop: '12px',
              display: 'inline-block',
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 600,
              fontSize: '12px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: flavor.text,
              border: `1px solid ${flavor.text}`,
              borderRadius: 'var(--radius-full)',
              padding: '3px 12px',
            }}
          >
            {soldOut ? 'Sold out' : 'Low stock'}
          </span>
        )}

        <div
          className="flavor-card-cta"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 'var(--space-3)',
            marginTop: 'var(--space-6)',
          }}
        >
          {soldOut ? (
            <span
              aria-disabled="true"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-syne)',
                fontWeight: 700,
                fontSize: '15px',
                lineHeight: 1.1,
                background: 'rgba(255,255,255,0.18)',
                color: flavor.text,
                borderRadius: 'var(--radius-full)',
                padding: '14px 32px',
                minHeight: 52,
                cursor: 'not-allowed',
                opacity: 0.7,
              }}
            >
              Sold out
            </span>
          ) : (
            <AddToCartButton
              flavor={flavor}
              label="Add to cart"
              style={{
                background: flavor.accent,
                color: '#FFFFFF',
                fontSize: '15px',
              }}
            />
          )}
          <Link
            href={`/${flavor.slug}`}
            aria-label={`Explore ${flavor.name}`}
            className="flavor-card-seemore"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-syne)',
              fontWeight: 700,
              fontSize: '15px',
              lineHeight: 1.1,
              background: flavor.text,
              color: flavor.bg,
              borderRadius: 'var(--radius-full)',
              border: 'none',
              padding: '14px 32px',
              minHeight: 52,
              opacity: 0.9,
              textDecoration: 'none',
              transition: 'opacity var(--dur-fast) var(--ease-out)',
            }}
          >
            Explore the flavor →
          </Link>
        </div>
      </div>
    </div>
  )
}
