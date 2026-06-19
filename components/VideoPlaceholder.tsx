// TODO: Replace VideoPlaceholder with filmed recipe / apparatus video
import type { CSSProperties } from 'react'

interface VideoPlaceholderProps {
  ratio: '9:16' | '16:9'
  label: string
  accent: string
  bg?: string
}

export default function VideoPlaceholder({
  ratio,
  label,
  accent,
  bg,
}: VideoPlaceholderProps) {
  const isPortrait = ratio === '9:16'

  const containerStyle: CSSProperties = {
    width: '100%',
    aspectRatio: isPortrait ? '9 / 16' : '16 / 9',
    maxWidth: isPortrait ? '280px' : undefined,
    marginLeft: isPortrait ? 'auto' : undefined,
    marginRight: isPortrait ? 'auto' : undefined,
    background: bg ?? 'rgba(0, 0, 0, 0.04)',
    border: `2px dashed ${accent}`,
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--space-4)',
    boxSizing: 'border-box',
  }

  const labelStyle: CSSProperties = {
    fontFamily: 'var(--font-dm-sans)',
    fontWeight: 300,
    fontSize: '13px',
    lineHeight: 1.4,
    textAlign: 'center',
    color: accent,
    opacity: 0.65,
    margin: 0,
  }

  return (
    <div role="img" aria-label={label} style={containerStyle}>
      <p style={labelStyle}>{label}</p>
    </div>
  )
}
