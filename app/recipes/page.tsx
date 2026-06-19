import type { Metadata } from 'next'
import { getPublishedRecipes } from '@/lib/recipes'
import RecipesIndex from '@/components/RecipesIndex'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Recipes — Monster Depot Market',
  description:
    'Every way to make your Monster Depot pouches — mug, air fryer, or waffle maker. Step-by-step, guided.',
}

export default async function RecipesPage() {
  const recipes = await getPublishedRecipes()
  return <RecipesIndex recipes={recipes} />
}
