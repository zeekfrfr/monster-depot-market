import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllRecipeSlugs, getRecipeBySlug, getRelatedRecipes } from '@/lib/recipes'
import RecipePage from '@/components/RecipePage'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getAllRecipeSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const recipe = await getRecipeBySlug(params.slug)
  if (!recipe) return { title: 'Recipe — Monster Depot Market' }
  return {
    title: `${recipe.title} — Monster Depot Market`,
    description: recipe.description ?? 'A guided Monster Depot recipe.',
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const recipe = await getRecipeBySlug(params.slug)
  if (!recipe) notFound()

  const related = await getRelatedRecipes(recipe.flavor_slug, recipe.slug)
  return <RecipePage recipe={recipe} related={related} />
}
