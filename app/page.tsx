'use client'

import { useState } from 'react'
import MonsterCookieAnimation from '@/components/MonsterCookieAnimation'
import FlavorWorldScroll from '@/components/FlavorWorldScroll'
import SubscriptionHook from '@/components/SubscriptionHook'
import ContentFeedPlaceholder from '@/components/ContentFeedPlaceholder'
import { allToppings } from '@/lib/products'

export default function HomePage() {
  const [addedIndex, setAddedIndex] = useState<number | null>(null)
  const [heroHover, setHeroHover] = useState(false)

  const handleAdd = (index: number) => {
    setAddedIndex(index)
    window.setTimeout(() => {
      setAddedIndex((current) => (current === index ? null : current))
    }, 1200)
  }

  const scrollToFlavors = () => {
    document
      .getElementById('flavor-worlds')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main>
      {/* Section 1 — Hero */}
      <section
        style={{
          height: '100svh',
          overflow: 'hidden',
          background: 'var(--brand-purple-dark)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 'var(--space-6)',
        }}
      >
        <MonsterCookieAnimation variant="home" />

        <h1
          className="anim-fade-up"
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: 'clamp(2.25rem, 9vw, 6rem)',
            color: 'var(--surface-white)',
            letterSpacing: '-0.02em',
            lineHeight: 1.0,
            marginBottom: '32px',
          }}
        >
          Got Munchies?
        </h1>

        <button
          type="button"
          onClick={scrollToFlavors}
          onMouseEnter={() => setHeroHover(true)}
          onMouseLeave={() => setHeroHover(false)}
          onFocus={() => setHeroHover(true)}
          onBlur={() => setHeroHover(false)}
          className="anim-fade-up"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--brand-purple-light)',
            color: 'var(--surface-white)',
            fontFamily: 'var(--font-syne)',
            fontWeight: 700,
            fontSize: '16px',
            padding: '16px 40px',
            minHeight: '52px',
            minWidth: '180px',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
            animationDelay: '200ms',
            transform: heroHover ? 'scale(1.03)' : 'scale(1)',
            boxShadow: heroHover
              ? '0 0 32px rgba(124, 58, 237, 0.6)'
              : '0 0 0 rgba(124, 58, 237, 0)',
            transition:
              'transform var(--dur-fast) var(--ease-spring), box-shadow var(--dur-base) var(--ease-out)',
          }}
        >
          Pick your pouch
        </button>
      </section>

      {/* Section 2 — Flavor worlds */}
      <FlavorWorldScroll />

      {/* Section 3 — Subscription */}
      <SubscriptionHook />

      {/* Section 4 — Content feed */}
      <section
        id="content-feed"
        style={{
          width: '100%',
          background: 'var(--surface-off)',
          padding: '64px var(--space-6)',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            color: 'var(--text-primary)',
            textAlign: 'left',
            letterSpacing: '-0.01em',
            lineHeight: 1.05,
          }}
        >
          Real ones.
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 300,
            fontSize: '16px',
            color: 'var(--text-secondary)',
            marginTop: '8px',
          }}
        >
          What people are making.
        </p>

        <div style={{ marginTop: 'var(--space-6)' }}>
          <ContentFeedPlaceholder />
        </div>
      </section>

      {/* Section 5 — Add-ons */}
      <section
        id="add-ons"
        style={{
          width: '100%',
          background: 'var(--surface-white)',
          padding: '64px var(--space-6)',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            color: 'var(--text-primary)',
            textAlign: 'left',
            letterSpacing: '-0.01em',
            lineHeight: 1.05,
          }}
        >
          Make it yours.
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 300,
            fontSize: '15px',
            color: 'var(--text-secondary)',
            marginTop: '8px',
          }}
        >
          Add to any order at checkout.
        </p>

        <ToppingsGrid addedIndex={addedIndex} onAdd={handleAdd} />
      </section>
    </main>
  )
}

function ToppingsGrid({
  addedIndex,
  onAdd,
}: {
  addedIndex: number | null
  onAdd: (index: number) => void
}) {
  return (
    <>
      <style>{`
        .mdm-addons-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: var(--space-6);
        }
        @media (min-width: 768px) {
          .mdm-addons-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
        .mdm-addon-card {
          transition: border-color var(--dur-fast) var(--ease-out),
            transform var(--dur-fast) var(--ease-out);
        }
        .mdm-addon-card:hover {
          border-color: rgba(124, 58, 237, 0.4);
          transform: translateY(-2px);
        }
      `}</style>

      <div className="mdm-addons-grid">
        {allToppings.map((topping, index) => {
          const added = addedIndex === index
          return (
            <div
              key={topping.name}
              className="mdm-addon-card"
              style={{
                background: 'var(--surface-white)',
                border: '1px solid #E5E5E5',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                minHeight: '88px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--text-tertiary)',
                }}
              >
                {topping.category}
              </span>

              <span
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontWeight: 500,
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  lineHeight: 1.25,
                }}
              >
                {topping.name}
              </span>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  marginTop: 'auto',
                  paddingTop: '8px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-syne)',
                    fontWeight: 700,
                    fontSize: '16px',
                    color: 'var(--brand-purple-light)',
                  }}
                >
                  ${topping.price.toFixed(2)}
                </span>

                <button
                  type="button"
                  onClick={() => onAdd(index)}
                  aria-label={`Note ${topping.name} to add at checkout`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '36px',
                    padding: '6px 16px',
                    border: '1px solid var(--brand-purple-light)',
                    borderRadius: 'var(--radius-full)',
                    background: added ? 'var(--brand-purple-light)' : 'transparent',
                    color: added ? 'var(--surface-white)' : 'var(--brand-purple-light)',
                    fontFamily: 'var(--font-dm-sans)',
                    fontWeight: 500,
                    fontSize: '13px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition:
                      'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
                  }}
                >
                  {added ? '✓ Added' : '+ Add'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
