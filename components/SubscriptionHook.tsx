'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const SYNE: React.CSSProperties = { fontFamily: 'var(--font-syne)', fontWeight: 700 }

export default function SubscriptionHook() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  // Sequential stagger: lines at 0 / 150 / 300ms, button at 300 + 200 = 500ms.
  const reveal = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(16px)',
    transition: `opacity 400ms var(--ease-out) ${delay}ms, transform 400ms var(--ease-out) ${delay}ms`,
    willChange: 'opacity, transform',
  })

  return (
    <section
      ref={sectionRef}
      id="subscription"
      style={{
        width: '100%',
        background: 'var(--brand-purple-dark)',
        padding: '80px var(--space-6)',
      }}
    >
      <div
        style={{
          maxWidth: 640,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 'var(--space-2)',
        }}
      >
        <p
          style={{
            ...SYNE,
            margin: 0,
            color: '#FFFFFF',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            lineHeight: 1.2,
            ...reveal(0),
          }}
        >
          A different dessert every night.
        </p>
        <p
          style={{
            ...SYNE,
            margin: 0,
            color: '#FFFFFF',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            lineHeight: 1.2,
            ...reveal(150),
          }}
        >
          Mystery drop every week.{' '}
          <span className="shimmer-star" aria-hidden="true">
            ✦
          </span>
        </p>
        <p
          style={{
            ...SYNE,
            margin: 0,
            color: '#FFFFFF',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            lineHeight: 1.2,
            ...reveal(300),
          }}
        >
          Skip whenever. No guilt.
        </p>

        <Link
          href="/subscribe"
          className="subscription-cta"
          style={{
            ...SYNE,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 'var(--space-10)',
            minHeight: 52,
            padding: '16px 40px',
            fontSize: 16,
            color: '#FFFFFF',
            background: 'var(--brand-purple-light)',
            borderRadius: 'var(--radius-full)',
            textDecoration: 'none',
            ...reveal(500),
          }}
        >
          Start your week
        </Link>
      </div>

      <style>{`
        .subscription-cta {
          transition: transform var(--dur-fast) var(--ease-spring),
            box-shadow var(--dur-fast) var(--ease-spring);
        }
        @media (hover: hover) {
          .subscription-cta:hover {
            transform: scale(1.03);
            box-shadow: 0 8px 30px rgba(124, 58, 237, 0.4);
          }
        }
      `}</style>
    </section>
  )
}
