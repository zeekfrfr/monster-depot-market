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
  'dessert-pouch': 'Dessert Pouches',
  'munchie-meal': 'Munchie Meals',
  'munchie-snack': 'Munchie Snacks',
  savory: 'Savory',
  drink: 'Drinks',
}

// Card label (singular) — used on the small category pill on each recipe card.
export const CATEGORY_CARD_LABEL: Record<string, string> = {
  'dessert-pouch': 'Dessert Pouch',
  'munchie-meal': 'Munchie Meal',
  'munchie-snack': 'Munchie Snack',
  savory: 'Savory',
  drink: 'Drink',
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
