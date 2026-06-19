'use client'

import { useEffect, useRef, useState } from 'react'
import { flavors } from '@/lib/products'
import FlavorCard from './FlavorCard'

export default function FlavorWorldScroll() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeBg, setActiveBg] = useState(flavors[0]?.bg ?? 'var(--surface-off)')

  useEffect(() => {
    const root = scrollRef.current
    if (!root) return
    if (typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const idx = cardRefs.current.findIndex((node) => node === entry.target)
            if (idx >= 0) {
              setActiveIndex(idx)
              setActiveBg(flavors[idx].bg)
            }
          }
        })
      },
      { root, threshold: 0.5 },
    )

    cardRefs.current.forEach((node) => {
      if (node) observer.observe(node)
    })

    return () => observer.disconnect()
  }, [])

  const goTo = (index: number) => {
    const root = scrollRef.current
    if (!root) return
    // Scroll the container directly so we never touch the vertical axis.
    root.scrollTo({ left: index * root.clientWidth, behavior: 'smooth' })
  }

  const scrollByCard = (direction: -1 | 1) => {
    const root = scrollRef.current
    if (!root) return
    root.scrollBy({ left: direction * root.clientWidth, behavior: 'smooth' })
  }

  return (
    <section
      id="flavor-worlds"
      style={{
        position: 'relative',
        height: '100svh',
        overflow: 'hidden',
        background: activeBg,
        transition: 'background 300ms ease',
      }}
    >
      <div
        ref={scrollRef}
        className="no-scrollbar fws-scroll"
        style={{
          display: 'flex',
          height: '100svh',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {flavors.map((flavor, index) => (
          <div
            key={flavor.slug}
            ref={(node) => {
              cardRefs.current[index] = node
            }}
            style={{
              width: '100vw',
              flexShrink: 0,
              scrollSnapAlign: 'start',
              height: '100svh',
            }}
          >
            <FlavorCard flavor={flavor} />
          </div>
        ))}
      </div>

      {/* Desktop-only previous / next arrows */}
      <button
        type="button"
        aria-label="Previous flavor"
        className="fws-arrow fws-arrow-left"
        onClick={() => scrollByCard(-1)}
      >
        <span aria-hidden="true">‹</span>
      </button>
      <button
        type="button"
        aria-label="Next flavor"
        className="fws-arrow fws-arrow-right"
        onClick={() => scrollByCard(1)}
      >
        <span aria-hidden="true">›</span>
      </button>

      {/* Dot navigation */}
      <div
        role="tablist"
        aria-label="Flavor worlds"
        style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        {flavors.map((flavor, index) => {
          const isActive = index === activeIndex
          return (
            <button
              key={flavor.slug}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to ${flavor.name}`}
              onClick={() => goTo(index)}
              style={{
                position: 'relative',
                width: 44,
                height: 44,
                padding: 0,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  display: 'block',
                  width: 8,
                  height: 8,
                  borderRadius: 'var(--radius-full)',
                  background: isActive ? flavor.accent : 'rgba(255, 255, 255, 0.3)',
                  transform: isActive ? 'scale(1.2)' : 'scale(1)',
                  transition: 'transform 200ms ease, background 200ms ease',
                }}
              />
            </button>
          )
        })}
      </div>

      <style>{`
        .fws-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          border-radius: var(--radius-full);
          border: none;
          background: rgba(255, 255, 255, 0.25);
          color: #FFFFFF;
          font-size: 28px;
          line-height: 1;
          display: none;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 2;
          opacity: 0;
          transition: opacity var(--dur-base) var(--ease-out),
            background var(--dur-fast) var(--ease-out),
            transform var(--dur-fast) var(--ease-spring);
          backdrop-filter: blur(4px);
        }
        .fws-arrow-left { left: var(--space-4); }
        .fws-arrow-right { right: var(--space-4); }
        @media (min-width: 1024px) {
          .fws-arrow { display: inline-flex; }
          #flavor-worlds:hover .fws-arrow { opacity: 1; }
          .fws-arrow:focus-visible { opacity: 1; }
          .fws-arrow:hover {
            background: rgba(255, 255, 255, 0.4);
          }
          .fws-arrow-left:hover { transform: translateY(-50%) scale(1.08); }
          .fws-arrow-right:hover { transform: translateY(-50%) scale(1.08); }
        }
      `}</style>
    </section>
  )
}
