'use client'

import Link from 'next/link'
import {
  type Recipe,
  recipeColors,
  cookLabel,
  METHOD_SHORT,
  CATEGORY_CARD_LABEL,
} from '@/lib/recipes'
import { useSavedRecipes } from '@/lib/savedRecipes'
import SaveButton from './SaveButton'

interface RecipeCardProps {
  recipe: Recipe
  variant?: 'index' | 'account'
  /** Called after an account-tab unsave so the parent can drop the card. */
  onRemoved?: (recipeId: string) => void
}

export default function RecipeCard({ recipe, variant = 'index', onRemoved }: RecipeCardProps) {
  const { bg, text, accent } = recipeColors(recipe)
  const { toggle } = useSavedRecipes()
  const account = variant === 'account'
  const coverHeight = account ? 140 : 200
  const isMonster = recipe.flavor_slug === 'monster-cookie'
  const accentTextColor = isMonster ? '#fff' : '#1A1A1A'
  const methodPill = recipe.method
    ? `${METHOD_SHORT[recipe.method] ?? recipe.method} · ${cookLabel(recipe)}`
    : null

  const handleUnsave = async () => {
    await toggle(recipe.id)
    onRemoved?.(recipe.id)
  }

  return (
    <article
      className="recipe-card"
      style={{
        background: 'var(--surface-white)',
        border: '1px solid #E5E5E5',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Cover */}
      <div
        style={{
          position: 'relative',
          height: coverHeight,
          background: recipe.cover_image_url ? undefined : bg,
        }}
      >
        {recipe.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={recipe.cover_image_url}
            alt={recipe.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-syne)',
              fontWeight: 800,
              fontSize: account ? '56px' : '72px',
              color: text,
              opacity: 0.4,
              pointerEvents: 'none',
            }}
          >
            {recipe.title.charAt(0)}
          </span>
        )}

        {/* Full-cover click layer → standard recipe view */}
        <Link
          href={`/recipes/${recipe.slug}`}
          aria-label={recipe.title}
          style={{ position: 'absolute', inset: 0, zIndex: 1 }}
        />

        {/* Category pill (decorative) */}
        <span
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 2,
            pointerEvents: 'none',
            background: 'rgba(255,255,255,0.92)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 400,
            fontSize: '11px',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
          }}
        >
          {CATEGORY_CARD_LABEL[recipe.category] ?? recipe.category}
        </span>

        {/* Save / unsave (interactive, above the click layer) */}
        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 3 }}>
          {account ? (
            <button
              type="button"
              onClick={handleUnsave}
              aria-label="Remove from saved recipes"
              style={{
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.9)',
                color: '#1A1A1A',
                fontSize: '16px',
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          ) : (
            <SaveButton
              recipeId={recipe.id}
              accent={accent}
              accentTextColor={accentTextColor}
              variant="card"
            />
          )}
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          flex: 1,
        }}
      >
        <Link
          href={`/recipes/${recipe.slug}`}
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 700,
            fontSize: account ? '15px' : '16px',
            color: 'var(--text-primary)',
            textDecoration: 'none',
            lineHeight: 1.25,
          }}
        >
          {recipe.title}
        </Link>

        {methodPill && (
          <span
            style={{
              alignSelf: 'flex-start',
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 400,
              fontSize: '12px',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              background: `color-mix(in srgb, ${accent} 15%, transparent)`,
              color: isMonster ? 'var(--brand-purple-light)' : accent,
            }}
          >
            {methodPill}
          </span>
        )}

        <Link
          href={`/recipes/${recipe.slug}?guided=true`}
          style={{
            marginTop: '6px',
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 500,
            fontSize: '13px',
            color: 'var(--brand-purple-light)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            minHeight: '36px',
          }}
        >
          ▶ Start
        </Link>
      </div>
    </article>
  )
}
