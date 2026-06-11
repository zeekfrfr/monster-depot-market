'use client'

import { useState, useRef, useEffect } from 'react'
import type { Active } from '@/lib/products'

interface IngredientAccordionProps {
  actives: Active[]
}

export default function IngredientAccordion({ actives }: IngredientAccordionProps) {
  const [open, setOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight)
    }
  }, [actives])

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 'var(--text-sm)',
          fontWeight: 400,
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontFamily: 'inherit',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '0',
        }}
      >
        What&apos;s inside
        <span
          style={{
            display: 'inline-block',
            transition: 'transform 250ms ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            fontSize: '10px',
            color: 'var(--text-tertiary)',
          }}
        >
          ▾
        </span>
      </button>

      <div
        style={{
          overflow: 'hidden',
          height: open ? `${height}px` : '0px',
          transition: 'height 250ms ease',
        }}
      >
        <div ref={contentRef} style={{ paddingTop: '16px' }}>
          {actives.map((active) => (
            <div
              key={active.name}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '6px 0',
                borderBottom: '1px solid var(--mid-gray)',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                  fontFamily: 'inherit',
                }}
              >
                {active.name}
              </span>
              <span
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                  fontFamily: 'inherit',
                  fontWeight: 500,
                }}
              >
                {active.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
