'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getFlavor, needsTextScrim } from '@/lib/products'
import {
  type Recipe,
  recipeColors,
  cookLabel,
  scaleAmount,
  METHOD_SHORT,
} from '@/lib/recipes'
import SaveButton from './SaveButton'
import GuidedMode from './GuidedMode'
import StepTip from './StepTip'

interface RecipePageProps {
  recipe: Recipe
  related: Recipe[]
}

export default function RecipePage({ recipe, related }: RecipePageProps) {
  const { bg, text, accent } = recipeColors(recipe)
  const isMonster = recipe.flavor_slug === 'monster-cookie'
  const accentTextColor = recipe.flavor_slug && !isMonster ? '#1A1A1A' : '#fff'
  const scrim = recipe.flavor_slug ? needsTextScrim(recipe.flavor_slug) : false
  const includedTopping = recipe.flavor_slug ? getFlavor(recipe.flavor_slug)?.includedTopping : null

  const [guided, setGuided] = useState(false)
  const [success, setSuccess] = useState(false)

  // ?guided=true → auto-open guided mode shortly after render. Read from window
  // (not useSearchParams) so the page stays statically rendered.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('guided') !== 'true') return
    const id = window.setTimeout(() => setGuided(true), 500)
    return () => window.clearTimeout(id)
  }, [])

  // Serving scaler — written amounts are the full batch (base_servings); buttons
  // scale every amount by selected/base.
  const baseServings = recipe.base_servings && recipe.base_servings > 0 ? recipe.base_servings : 1
  const [servings, setServings] = useState(baseServings)
  const multiplier = servings / baseServings
  const presets: { label: string; value: number }[] = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '4', value: 4 },
  ]
  if (![1, 2, 4].includes(baseServings)) {
    presets.push({ label: `Full batch (${baseServings})`, value: baseServings })
  }
  const servingsLabel =
    ![1, 2, 4].includes(baseServings) && servings === baseServings
      ? `full batch (${baseServings})`
      : `${servings} serving${servings === 1 ? '' : 's'}`

  const pillStyle: React.CSSProperties = {
    fontFamily: 'var(--font-dm-sans)',
    fontWeight: 400,
    fontSize: '13px',
    padding: '6px 12px',
    borderRadius: 'var(--radius-full)',
    background: `color-mix(in srgb, ${text} 10%, transparent)`,
    color: `color-mix(in srgb, ${text} 70%, transparent)`,
    whiteSpace: 'nowrap',
  }

  const heading = (
    <>
      <h1
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 800,
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          color: text,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          margin: 0,
        }}
      >
        {recipe.title}
      </h1>
      {recipe.description && (
        <p
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 300,
            fontSize: '16px',
            color: text,
            opacity: 0.7,
            lineHeight: 1.5,
            marginTop: 'var(--space-3)',
            marginBottom: 0,
            maxWidth: '560px',
          }}
        >
          {recipe.description}
        </p>
      )}
      {recipe.flavor_slug && (
        <span
          style={{
            display: 'inline-block',
            marginTop: 'var(--space-3)',
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 400,
            fontSize: '13px',
            padding: '5px 12px',
            borderRadius: 'var(--radius-full)',
            background: `color-mix(in srgb, ${accent} 16%, transparent)`,
            color: `color-mix(in srgb, ${accent} 80%, transparent)`,
          }}
        >
          Munchie Pouch · Just add liquid.
        </span>
      )}
    </>
  )

  return (
    <main>
      {/* Above the fold */}
      <section
        style={{
          background: bg,
          padding: '120px var(--space-6) 56px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {scrim ? <div className="text-scrim">{heading}</div> : heading}

          {/* Info pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 'var(--space-5)' }}>
            <span style={pillStyle}>⏱ {cookLabel(recipe)}</span>
            {recipe.prep_time_minutes ? (
              <span style={pillStyle}>🔪 {recipe.prep_time_minutes} min prep</span>
            ) : null}
            <span style={{ ...pillStyle, textTransform: 'capitalize' }}>{recipe.difficulty}</span>
          </div>

          {/* Actions */}
          <div
            className="recipe-actions"
            style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: 'var(--space-6)' }}
          >
            <button
              type="button"
              onClick={() => setGuided(true)}
              className="recipe-start"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                minHeight: '60px',
                padding: '0 28px',
                borderRadius: 'var(--radius-lg)',
                border: 'none',
                cursor: 'pointer',
                background: accent,
                color: accentTextColor,
                fontFamily: 'var(--font-syne)',
                fontWeight: 700,
                fontSize: '18px',
              }}
            >
              <span className="recipe-start-icon" aria-hidden="true" style={{ display: 'inline-flex' }}>
                ▶
              </span>
              Start guided mode
            </button>

            <SaveButton
              recipeId={recipe.id}
              accent={accent}
              accentTextColor={accentTextColor}
              textColor={text}
              variant="recipe"
            />
          </div>
        </div>
      </section>

      {/* Success banner (after finishing guided mode) */}
      {success && (
        <div
          style={{
            background: 'var(--brand-purple-light)',
            color: '#fff',
            textAlign: 'center',
            padding: 'var(--space-5) var(--space-6)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 700,
              fontSize: '18px',
              margin: 0,
            }}
          >
            You made it. How&apos;d it turn out?
          </p>
        </div>
      )}

      {/* Below the fold — standard recipe view */}
      <section
        style={{
          background: 'var(--surface-white)',
          padding: '56px var(--space-6) 64px',
        }}
      >
        {/* Serving size scaler */}
        <div style={{ maxWidth: '900px', margin: '0 auto 32px' }}>
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 400, fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 10px' }}>
            How many?
          </p>
          <div role="group" aria-label="Serving size" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {presets.map((p) => {
              const active = servings === p.value
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setServings(p.value)}
                  aria-pressed={active}
                  style={{
                    flex: '1 1 auto',
                    minHeight: '44px',
                    padding: '10px 16px',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    ...(active
                      ? { background: 'var(--brand-purple-light)', color: '#fff', border: '1px solid var(--brand-purple-light)', fontFamily: 'var(--font-syne)', fontWeight: 700 }
                      : { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--text-disabled)', fontFamily: 'var(--font-dm-sans)', fontWeight: 400 }),
                  }}
                >
                  {p.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="recipe-cols" style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Ingredients */}
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-syne)',
                fontWeight: 700,
                fontSize: '20px',
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              What you need
            </h2>

            {includedTopping && (
              <span
                style={{
                  display: 'inline-block',
                  marginTop: 'var(--space-4)',
                  fontFamily: 'var(--font-dm-sans)',
                  fontWeight: 400,
                  fontSize: '12px',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: `color-mix(in srgb, ${accent} 18%, transparent)`,
                  color: isMonster ? 'var(--brand-purple-light)' : 'var(--text-primary)',
                }}
              >
                Includes: {includedTopping}
              </span>
            )}

            <div style={{ marginTop: 'var(--space-4)' }}>
              {recipe.ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: '16px',
                    padding: '12px 0',
                    borderBottom: '1px solid #F3F4F6',
                  }}
                >
                  <span
                    key={`${servings}-${idx}`}
                    className="recipe-amt"
                    style={{
                      fontFamily: 'var(--font-dm-sans)',
                      fontWeight: 500,
                      fontSize: '15px',
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {scaleAmount(ing.amount, multiplier)}
                    {ing.amount && ing.unit ? ` ${ing.unit}` : ''}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-dm-sans)',
                      fontWeight: 400,
                      fontSize: '15px',
                      color: 'var(--text-primary)',
                      textAlign: 'right',
                    }}
                  >
                    {ing.name}
                    {ing.note && (
                      <span
                        style={{ display: 'block', fontSize: '12px', color: 'var(--text-tertiary)' }}
                      >
                        {ing.note}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-syne)',
                fontWeight: 700,
                fontSize: '20px',
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              How to make it
            </h2>
            <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {recipe.steps.map((s) => (
                <div key={s.number} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: 'var(--font-syne)',
                      fontWeight: 800,
                      fontSize: '32px',
                      lineHeight: 1,
                      color: `color-mix(in srgb, ${accent} 35%, var(--text-disabled))`,
                      flexShrink: 0,
                      minWidth: '36px',
                    }}
                  >
                    {s.number}
                  </span>
                  <div>
                    <p
                      style={{
                        fontFamily: 'var(--font-dm-sans)',
                        fontWeight: 400,
                        fontSize: '16px',
                        color: 'var(--text-primary)',
                        lineHeight: 1.5,
                        margin: 0,
                      }}
                    >
                      {s.instruction}
                    </p>
                    {s.tip && <StepTip tip={s.tip} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ maxWidth: '900px', margin: '48px auto 0' }}>
            <h2
              style={{
                fontFamily: 'var(--font-syne)',
                fontWeight: 700,
                fontSize: '20px',
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              More ways to make it
            </h2>
            <div
              className="no-scrollbar"
              style={{
                display: 'flex',
                gap: 'var(--space-4)',
                overflowX: 'auto',
                marginTop: 'var(--space-4)',
                paddingBottom: 'var(--space-2)',
              }}
            >
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/recipes/${r.slug}`}
                  style={{
                    flexShrink: 0,
                    width: '220px',
                    scrollSnapAlign: 'start',
                    border: '1px solid #E5E5E5',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-5)',
                    textDecoration: 'none',
                    background: 'var(--surface-white)',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-syne)',
                      fontWeight: 700,
                      fontSize: '15px',
                      color: 'var(--text-primary)',
                      margin: 0,
                      lineHeight: 1.25,
                    }}
                  >
                    {r.title}
                  </p>
                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: '8px',
                      fontFamily: 'var(--font-dm-sans)',
                      fontSize: '12px',
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: `color-mix(in srgb, ${accent} 15%, transparent)`,
                      color: isMonster ? 'var(--brand-purple-light)' : accent,
                    }}
                  >
                    {r.method ? METHOD_SHORT[r.method] ?? r.method : 'Recipe'} · {cookLabel(r)}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      marginTop: '12px',
                      fontFamily: 'var(--font-dm-sans)',
                      fontWeight: 500,
                      fontSize: '13px',
                      color: 'var(--brand-purple-light)',
                    }}
                  >
                    View →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {guided && (
        <GuidedMode
          recipe={recipe}
          accent={accent}
          bg={bg}
          textColor={text}
          accentTextColor={accentTextColor}
          servingsLabel={servingsLabel}
          onExit={(reason) => {
            setGuided(false)
            if (reason === 'done') setSuccess(true)
          }}
        />
      )}
    </main>
  )
}
