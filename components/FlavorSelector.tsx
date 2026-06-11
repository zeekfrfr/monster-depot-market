'use client'

interface FlavorSelectorProps {
  flavors: string[]
  selected: string
  accent: string
  onSelect: (flavor: string) => void
}

export default function FlavorSelector({
  flavors,
  selected,
  accent,
  onSelect,
}: FlavorSelectorProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {flavors.map((flavor) => {
        const isSelected = flavor === selected
        return (
          <button
            key={flavor}
            onClick={() => onSelect(flavor)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '10px 0',
              fontSize: 'var(--text-lg)',
              fontWeight: isSelected ? 500 : 400,
              color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
              transition: 'color 150ms ease, font-weight 0ms',
              textAlign: 'left',
              fontFamily: 'inherit',
            }}
          >
            {/* Selected dot */}
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: accent,
                flexShrink: 0,
                opacity: isSelected ? 1 : 0,
                transition: 'opacity 150ms ease',
              }}
            />
            {flavor}
          </button>
        )
      })}
    </div>
  )
}
