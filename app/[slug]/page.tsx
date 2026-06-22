import { notFound } from 'next/navigation'
import { activeFlavors as flavors, getFlavor } from '@/lib/products'
import FlavorPage from '@/components/FlavorPage'

export function generateStaticParams() {
  return flavors.map((f) => ({ slug: f.slug }))
}

export const dynamicParams = false

export function generateMetadata({ params }: { params: { slug: string } }) {
  const f = getFlavor(params.slug)
  return {
    title: f ? f.name + ' — Monster Depot Market' : 'Monster Depot Market',
  }
}

export default function Page({ params }: { params: { slug: string } }) {
  const flavor = getFlavor(params.slug)
  if (!flavor) notFound()
  return <FlavorPage flavor={flavor} />
}
