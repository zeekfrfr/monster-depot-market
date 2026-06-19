'use client'

import { useMemo, useState } from 'react'
import { type Recipe, CATEGORY_LABEL } from '@/lib/recipes'
import RecipeCard from './RecipeCard'

// Canonical pill order; only categories that actually have recipes render.
const CATEGORY_ORDER = ['dessert-pouch', 'munchie-meal', 'munchie-snack', 'munchie-sweet']

function Pill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      style={{
        flexShrink: 0,
        minHeight: '44px',
        padding: '8px 18px',
        borderRadius: 'var(--radius-full)',
        cursor: 'pointer',
        fontFamily: 'var(--font-dm-sans)',
        fontWeight: active ? 500 : 400,
        fontSize: '14px',
        whiteSpace: 'nowrap',
        transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
        ...(active
          ? { background: 'var(--brand-purple-light)', color: '#fff', border: '1px solid var(--brand-purple-light)' }
          : { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--text-disabled)' }),
      }}
    >
      {label}
    </button>
  )
}

export default function RecipesIndex({ recipes }: { recipes: Recipe[] }) {
  const [active, setActive] = useState<string>('all')

  // Only show category pills that have at least one published recipe.
  const categories = useMemo(() => {
    const present = new Set(recipes.map((r) => r.category))
    return CATEGORY_ORDER.filter((c) => present.has(c))
  }, [recipes])

  const filtered = active === 'all' ? recipes : recipes.filter((r) => r.category === active)

  return (
    <main
      style={{
        background: 'var(--surface-off)',
        minHeight: '100svh',
        padding: '120px var(--space-6) 80px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <header>
          <h1
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 800,
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: 'var(--text-primary)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            Every recipe.
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 300,
              fontSize: '18px',
              color: 'var(--text-secondary)',
              marginTop: '8px',
              marginBottom: 0,
            }}
          >
            For every session.
          </p>
        </header>

        {/* Filter pills — only categories with results, plus All */}
        <div
          role="tablist"
          aria-label="Recipe categories"
          className="no-scrollbar"
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            marginTop: 'var(--space-6)',
            paddingBottom: '4px',
          }}
        >
          <Pill label="All" active={active === 'all'} onClick={() => setActive('all')} />
          {categories.map((c) => (
            <Pill
              key={c}
              label={CATEGORY_LABEL[c] ?? c}
              active={active === c}
              onClick={() => setActive(c)}
            />
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p
            style={{
              marginTop: 'var(--space-12)',
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '16px',
              color: 'var(--text-secondary)',
              textAlign: 'center',
            }}
          >
            No recipes here yet. Check back soon.
          </p>
        ) : (
          <div className="recipe-grid" style={{ marginTop: 'var(--space-6)' }}>
            {filtered.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
