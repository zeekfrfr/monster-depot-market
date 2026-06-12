import Link from 'next/link'

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
        }}
      >
        {[
          { href: '/refund-policy', label: 'Refund Policy' },
          { href: '/shipping-policy', label: 'Shipping' },
          { href: '/privacy-policy', label: 'Privacy' },
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
    </footer>
  )
}
