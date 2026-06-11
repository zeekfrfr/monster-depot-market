import { notFound } from 'next/navigation'
import { getModeBySlug, MODES } from '@/lib/products'
import ModePage from '@/components/ModePage'

interface Props {
  params: { mode: string }
}

export default function ModeRoute({ params }: Props) {
  const mode = getModeBySlug(params.mode)
  if (!mode) notFound()
  return <ModePage mode={mode} />
}

export function generateStaticParams() {
  return MODES.map((m) => ({ mode: m.slug }))
}

export function generateMetadata({ params }: Props) {
  const mode = getModeBySlug(params.mode)
  if (!mode) return {}
  return {
    title: `${mode.name} — Monster Depot`,
    description: mode.tagline,
  }
}
