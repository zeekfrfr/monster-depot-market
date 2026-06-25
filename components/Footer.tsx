import Link from 'next/link'
import { activeFlavors as flavors } from '@/lib/products'

const policyLinks: { label: string; href: string }[] = [
  { label: 'Contact', href: '/contact' },
  { label: 'Refund Policy', href: '/refunds' },
  { label: 'Shipping', href: '/shipping' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
]

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--surface-off)',
        padding: '48px var(--space-6) 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-4)',
        textAlign: 'center',
      }}
    >
      {/* Row 1: brand */}
      <div>
        <p
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: '18px',
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          Monster Depot Market
        </p>
        <p
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 300,
            fontSize: '14px',
            color: 'var(--text-secondary)',
            marginTop: '4px',
            marginBottom: 0,
          }}
        >
          Got Munchies?
        </p>
      </div>

      {/* Row 2: flavor links */}
      <nav
        aria-label="Flavors"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {flavors.map((flavor, i) => (
          <span
            key={flavor.slug}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Link
              href={`/${flavor.slug}`}
              className="footer-link"
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 400,
                fontSize: '13px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color var(--dur-fast) var(--ease-out)',
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: '44px',
              }}
            >
              {flavor.name}
            </Link>
            {i < flavors.length - 1 && (
              <span aria-hidden="true" style={{ color: 'var(--text-tertiary)' }}>
                ·
              </span>
            )}
          </span>
        ))}
        <span aria-hidden="true" style={{ color: 'var(--text-tertiary)' }}>·</span>
        <Link
          href="/recipes"
          className="footer-link"
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 400,
            fontSize: '13px',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            transition: 'color var(--dur-fast) var(--ease-out)',
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
          }}
        >
          Recipes
        </Link>
      </nav>

      {/* Row 3: policy links */}
      <nav
        aria-label="Policies"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          marginTop: 'var(--space-4)',
        }}
      >
        {policyLinks.map((link, i) => (
          <span
            key={link.href}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Link
              href={link.href}
              className="footer-link"
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 400,
                fontSize: '12px',
                color: 'var(--text-tertiary)',
                textDecoration: 'none',
                transition: 'color var(--dur-fast) var(--ease-out)',
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: '44px',
              }}
            >
              {link.label}
            </Link>
            {i < policyLinks.length - 1 && (
              <span aria-hidden="true" style={{ color: 'var(--text-disabled)' }}>
                ·
              </span>
            )}
          </span>
        ))}
      </nav>

      {/* Row 5: copyright */}
      <p
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontWeight: 300,
          fontSize: '11px',
          color: 'var(--text-disabled)',
          textAlign: 'center',
          marginTop: '8px',
          marginBottom: 0,
          lineHeight: 1.5,
        }}
      >
        © 2026 Monster Depot Holdings LLC · monsterdepotmarket.com ·
        monsterdepotmarketing@gmail.com · 18+
      </p>

      <style>{`
        .footer-link:hover {
          color: var(--text-primary) !important;
        }
      `}</style>
    </footer>
  )
}
