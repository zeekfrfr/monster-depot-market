import Link from 'next/link'

const FDA_DISCLAIMER = 'These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease.'

export default function Footer() {
  return (
    <footer
      style={{
        padding: '48px 24px 56px',
        borderTop: '1px solid var(--mid-gray)',
        marginTop: '64px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '32px',
          flexWrap: 'wrap',
          marginBottom: '24px',
        }}
      >
        {[
          { href: '/refunds', label: 'Refund Policy' },
          { href: '/shipping', label: 'Shipping' },
          { href: '/privacy', label: 'Privacy' },
          { href: '/terms', label: 'Terms' },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            style={{
              fontSize: 'var(--text-xs)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-tertiary)',
              textDecoration: 'none',
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      <p
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--text-tertiary)',
          textAlign: 'center',
          lineHeight: 1.6,
          maxWidth: '560px',
          margin: '0 auto',
          letterSpacing: '-0.01em',
        }}
      >
        {FDA_DISCLAIMER}
      </p>
    </footer>
  )
}
