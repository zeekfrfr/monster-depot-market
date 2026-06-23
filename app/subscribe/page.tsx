'use client'

import { useCart } from '@/lib/cart'
import { WEEKLY_SUB_PRICE } from '@/lib/products'
import { useCatalog } from '@/lib/catalogContext'

const weeklyChecklist = [
  '7 pouches (one flavor or mix)',
  'Mystery drop — subscribers only',
  'Free shipping',
  'No commitment. Reorder anytime.',
]

const monthlyChecklist = [
  'Coming soon',
  'Best value',
  'Bonus serving each week',
  'Mystery drop — subscribers only',
  'Free shipping',
]

function Check({ text, textColor }: { text: string; textColor?: string }) {
  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-2)',
        fontFamily: 'var(--font-dm-sans)',
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: 1.4,
        color: textColor ?? 'var(--text-primary)',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          color: 'var(--brand-purple-light)',
          fontWeight: 700,
          flexShrink: 0,
          lineHeight: 1.4,
        }}
      >
        ✓
      </span>
      <span>{text}</span>
    </li>
  )
}

export default function SubscribePage() {
  const { addItem, openCart } = useCart()
  const catalog = useCatalog()
  const weeklyPrice = catalog?.weeklySub ?? WEEKLY_SUB_PRICE

  const handleStartWeek = () => {
    addItem({
      id: 'weekly-sub-' + Date.now(),
      slug: 'weekly-sub',
      name: 'Weekly Subscription',
      format: 'weekly-sub',
      price: weeklyPrice,
      toppings: [],
      bg: 'var(--brand-purple-dark)',
      accent: 'var(--brand-purple-light)',
    })
    openCart()
  }

  const cardBase: React.CSSProperties = {
    backgroundColor: 'var(--surface-white)',
    borderRadius: 'var(--radius-xl)',
    padding: '32px var(--space-6)',
    color: 'var(--text-primary)',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  }

  return (
    <main
      style={{
        backgroundColor: 'var(--brand-purple-dark)',
        minHeight: '100svh',
        width: '100%',
      }}
    >
      {/* Responsive: stack plan cards on mobile, side-by-side >=768px */}
      <style>{`
        @media (min-width: 768px) {
          .mdm-plan-grid { flex-direction: row !important; align-items: stretch !important; }
        }
      `}</style>

      <div
        style={{
          maxWidth: '640px',
          margin: '0 auto',
          padding: '96px var(--space-6) 80px',
        }}
      >
        {/* Hero */}
        <header style={{ textAlign: 'center' }}>
          <h1
            className="anim-fade-up"
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 800,
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              lineHeight: 1.05,
              color: 'var(--surface-white)',
              margin: 0,
            }}
          >
            Got Munchies?
          </h1>
          <p
            className="anim-fade-up"
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 700,
              fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
              lineHeight: 1.4,
              color: 'var(--surface-white)',
              marginTop: '24px',
              marginBottom: 0,
            }}
          >
            A different dessert every night. Mystery drop every week. Skip
            whenever. No guilt.
          </p>
        </header>

        {/* Plan cards */}
        <div
          className="mdm-plan-grid"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
            marginTop: 'var(--space-12)',
          }}
        >
          {/* Weekly card */}
          <section style={cardBase} aria-labelledby="plan-weekly-title">
            <h2
              id="plan-weekly-title"
              style={{
                fontFamily: 'var(--font-syne)',
                fontWeight: 800,
                fontSize: '22px',
                margin: 0,
                color: 'var(--text-primary)',
              }}
            >
              Weekly
            </h2>

            <p
              style={{
                margin: '12px 0 0',
                display: 'flex',
                alignItems: 'baseline',
                gap: '4px',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 800,
                  fontSize: '32px',
                  color: 'var(--brand-purple-light)',
                  lineHeight: 1,
                }}
              >
                ${weeklyPrice.toFixed(2)}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontWeight: 300,
                  fontSize: '16px',
                  color: 'var(--text-secondary)',
                }}
              >
                /week
              </span>
            </p>

            <hr
              style={{
                border: 'none',
                borderTop: '1px solid #E5E5E5',
                margin: '20px 0',
                width: '100%',
              }}
            />

            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
              }}
            >
              {weeklyChecklist.map((item) => (
                <Check key={item} text={item} />
              ))}
            </ul>

            <button
              type="button"
              onClick={handleStartWeek}
              style={{
                width: '100%',
                minHeight: '52px',
                marginTop: '24px',
                backgroundColor: 'var(--brand-purple-light)',
                color: 'var(--surface-white)',
                fontFamily: 'var(--font-syne)',
                fontWeight: 700,
                fontSize: '16px',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
              }}
            >
              Start my week
            </button>

            <p
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 300,
                fontSize: '12px',
                color: 'var(--text-secondary)',
                textAlign: 'center',
                margin: '12px 0 0',
              }}
            >
              One week of pouches · reorder anytime
            </p>
          </section>

          {/* Monthly card */}
          <section
            style={{ ...cardBase, position: 'relative' }}
            aria-labelledby="plan-monthly-title"
          >
            <span
              style={{
                position: 'absolute',
                top: 'var(--space-4)',
                right: 'var(--space-4)',
                backgroundColor: 'var(--surface-off)',
                color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 400,
                fontSize: '12px',
                borderRadius: 'var(--radius-full)',
                padding: '4px 12px',
              }}
            >
              Coming Soon
            </span>

            <h2
              id="plan-monthly-title"
              style={{
                fontFamily: 'var(--font-syne)',
                fontWeight: 800,
                fontSize: '22px',
                margin: 0,
                color: 'var(--text-primary)',
              }}
            >
              Monthly
            </h2>

            <p
              style={{
                margin: '12px 0 0',
                fontFamily: 'var(--font-syne)',
                fontWeight: 800,
                fontSize: '32px',
                color: 'var(--brand-purple-light)',
                lineHeight: 1,
              }}
            >
              TBD
            </p>

            <hr
              style={{
                border: 'none',
                borderTop: '1px solid #E5E5E5',
                margin: '20px 0',
                width: '100%',
              }}
            />

            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
              }}
            >
              {monthlyChecklist.map((item) => (
                <Check key={item} text={item} />
              ))}
            </ul>

            <button
              type="button"
              disabled
              aria-disabled="true"
              tabIndex={-1}
              style={{
                width: '100%',
                minHeight: '52px',
                marginTop: 'auto',
                backgroundColor: 'transparent',
                color: 'var(--text-disabled)',
                fontFamily: 'var(--font-syne)',
                fontWeight: 700,
                fontSize: '16px',
                border: '1px solid #E5E5E5',
                borderRadius: 'var(--radius-md)',
                cursor: 'default',
                pointerEvents: 'none',
                padding: 0,
              }}
            >
              Coming soon
            </button>
          </section>
        </div>

        {/* Fine print */}
        <p
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 300,
            fontSize: '13px',
            lineHeight: 1.5,
            color: 'rgba(255, 255, 255, 0.5)',
            textAlign: 'center',
            marginTop: 'var(--space-8)',
            marginBottom: 0,
          }}
        >
          One-time charge for one week of pouches — no auto-renewal. Reorder
          anytime. Free shipping.
        </p>
      </div>
    </main>
  )
}
