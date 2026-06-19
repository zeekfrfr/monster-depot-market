import { getFlavor } from './products'

export interface RecipeIngredient {
  amount: string
  unit: string | null
  name: string
  note: string | null
}

export interface RecipeStep {
  number: number
  instruction: string
  tip: string | null
}

export interface Recipe {
  id: string
  title: string
  slug: string
  description: string | null
  category: string
  flavor_slug: string | null
  method: string | null
  cook_time_minutes: number | null
  prep_time_minutes: number | null
  difficulty: string
  ingredients: RecipeIngredient[]
  steps: RecipeStep[]
  tags: string[]
  cover_image_url: string | null
  is_published: boolean
  base_servings?: number
}

// ---- Display maps ----
export const METHOD_LABEL: Record<string, string> = {
  mug: 'Mug Cake',
  'air-fryer': 'Air Fryer',
  'waffle-maker': 'Waffle Maker',
}

export const METHOD_SHORT: Record<string, string> = {
  mug: 'Mug',
  'air-fryer': 'Air Fryer',
  'waffle-maker': 'Waffle Maker',
}

// The schema stores cook_time_minutes as an integer for sorting; the human label
// comes from the method so a mug cake reads "90 sec", not "2 min".
export const METHOD_COOK_LABEL: Record<string, string> = {
  mug: '90 sec',
  'air-fryer': '8–10 min',
  'waffle-maker': '3–5 min',
}

// Filter-pill label (plural) — used on the /recipes index.
export const CATEGORY_LABEL: Record<string, string> = {
  'dessert-pouch': 'Munchie Pouches',
  'munchie-meal': 'Munchie Meals',
  'munchie-snack': 'Munchie Snacks',
  'munchie-sweet': 'Munchie Sweets',
}

// Card label (singular) — used on the small category pill on each recipe card.
export const CATEGORY_CARD_LABEL: Record<string, string> = {
  'dessert-pouch': 'Munchie Pouch',
  'munchie-meal': 'Munchie Meal',
  'munchie-snack': 'Munchie Snack',
  'munchie-sweet': 'Munchie Sweet',
}

export function cookLabel(r: Pick<Recipe, 'method' | 'cook_time_minutes'>): string {
  if (r.method && METHOD_COOK_LABEL[r.method]) return METHOD_COOK_LABEL[r.method]
  return r.cook_time_minutes ? `${r.cook_time_minutes} min` : ''
}

// Flavor-derived colors; falls back to brand purple for non-pouch recipes.
export function recipeColors(r: Pick<Recipe, 'flavor_slug'>): { bg: string; text: string; accent: string } {
  const f = r.flavor_slug ? getFlavor(r.flavor_slug) : undefined
  return {
    bg: f?.bg ?? 'var(--brand-purple-dark)',
    text: f?.text ?? '#FFFFFF',
    accent: f?.accent ?? 'var(--brand-purple-light)',
  }
}

// ---- Serving scaler ----
const FRACTIONS: Array<[number, string]> = [
  [1 / 8, '⅛'], [1 / 6, '⅙'], [1 / 4, '¼'], [1 / 3, '⅓'], [3 / 8, '⅜'],
  [1 / 2, '½'], [5 / 8, '⅝'], [2 / 3, '⅔'], [3 / 4, '¾'], [7 / 8, '⅞'],
]

function prettyAmount(v: number): string {
  // Over 1 → round to 1 decimal; at/under 1 → nearest tidy fraction, else 2dp.
  if (v > 1) {
    const r = Math.round(v * 10) / 10
    return String(r)
  }
  for (const [val, glyph] of FRACTIONS) {
    if (Math.abs(v - val) < 0.04) return glyph
  }
  if (Math.abs(v - 1) < 0.04) return '1'
  return String(Math.round(v * 100) / 100)
}

/**
 * Scales an ingredient amount string by a multiplier, with smart fractions.
 * Handles ranges ("3-4" → both ends scaled), single numbers, and passes through
 * null / non-numeric amounts ("small dash") unchanged. multiplier 1 = as-written.
 */
export function scaleAmount(amount: string | null, multiplier: number): string | null {
  if (!amount) return amount
  if (multiplier === 1) return amount
  return amount
    .split('-')
    .map((p) => {
      const n = parseFloat(p)
      return Number.isNaN(n) ? p.trim() : prettyAmount(n * multiplier)
    })
    .join('–')
}

// ---- Server-side data access (public, anon-readable via RLS) ----
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function restGet(query: string): Promise<Recipe[]> {
  if (!SUPABASE_URL || !ANON_KEY) return []
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${query}`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
      // ISR: new/edited recipes appear within an hour without a redeploy.
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    return (await res.json()) as Recipe[]
  } catch {
    return []
  }
}

export async function getPublishedRecipes(): Promise<Recipe[]> {
  return restGet('recipes?select=*&is_published=eq.true&order=flavor_slug.asc,method.asc')
}

export async function getAllRecipeSlugs(): Promise<string[]> {
  const rows = await restGet('recipes?select=slug&is_published=eq.true')
  return rows.map((r) => r.slug)
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const rows = await restGet(
    `recipes?select=*&is_published=eq.true&slug=eq.${encodeURIComponent(slug)}&limit=1`,
  )
  return rows[0] ?? null
}

export async function getRelatedRecipes(
  flavorSlug: string | null,
  excludeSlug: string,
): Promise<Recipe[]> {
  if (!flavorSlug) return []
  return restGet(
    `recipes?select=*&is_published=eq.true&flavor_slug=eq.${encodeURIComponent(
      flavorSlug,
    )}&slug=neq.${encodeURIComponent(excludeSlug)}&order=method.asc`,
  )
}
