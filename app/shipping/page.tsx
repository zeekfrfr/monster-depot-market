export const metadata = {
  title: 'Shipping — Monster Depot Market',
}

export default function ShippingPolicy() {
  return (
    <main style={page}>
      <h1 style={heading}>Shipping</h1>
      <p style={updated}>Last updated: June 2026</p>

      <p style={body}>
        We hand-pack every order and ship it out within 3–5 business days of purchase. Once your
        order leaves us, delivery time is in the hands of the carrier — so hang tight, the munchies
        are on the way.
      </p>

      <h2 style={subheading}>Where we ship</h2>
      <p style={body}>
        Right now we ship to addresses within the United States only. No international shipping for
        the time being — but stay tuned, we&apos;re working on it.
      </p>

      <h2 style={subheading}>Carriers &amp; timing</h2>
      <p style={body}>
        Orders go out via standard carriers including USPS, UPS, and FedEx, selected based on your
        destination and what gets your order there fastest. We can&apos;t control carrier delays,
        weather, or holiday backups, but we&apos;ll always do our part to get your pack moving on
        time.
      </p>

      <h2 style={subheading}>Free shipping on subscriptions</h2>
      <p style={body}>
        Every subscription ships free, every single time. No minimums, no fine print — keep the
        weekly drop coming and we&apos;ve got the shipping covered.
      </p>

      <h2 style={subheading}>Tracking</h2>
      <p style={body}>
        Once your order ships, we&apos;ll email you a tracking number so you can watch it travel
        from our door to yours. Keep an eye on your inbox (and your spam folder, just in case).
      </p>

      <h2 style={subheading}>Address accuracy</h2>
      <p style={body}>
        Double-check your shipping address at checkout — it&apos;s your responsibility to make sure
        it&apos;s correct and complete. We ship to the address you provide, so orders sent to an
        incorrect or incomplete address may be delayed, returned, or lost, and we can&apos;t be
        held responsible for those.
      </p>

      <h2 style={subheading}>Lost or stolen packages</h2>
      <p style={body}>
        If tracking shows your order as delivered but you can&apos;t find it, start by checking
        around your property and with anyone else at your address, then reach out to the carrier
        with your tracking number to file a claim. If you&apos;re still stuck, email us at{' '}
        <a href="mailto:monsterdepotmarketing@gmail.com" style={link}>
          monsterdepotmarketing@gmail.com
        </a>{' '}
        and we&apos;ll help however we can. Packages lost or stolen after the carrier marks them
        delivered are generally outside our control, but we&apos;ll always try to make it right.
      </p>

      <h2 style={subheading}>Questions</h2>
      <p style={body}>
        Need a hand with anything shipping-related? Reach out to{' '}
        <a href="mailto:monsterdepotmarketing@gmail.com" style={link}>
          monsterdepotmarketing@gmail.com
        </a>{' '}
        and we&apos;ll get back to you.
      </p>

      <p style={seller}>
        Sold by Monster Depot Holdings LLC.
      </p>
    </main>
  )
}

const page: React.CSSProperties = {
  maxWidth: '640px',
  margin: '0 auto',
  padding: 'var(--space-16) var(--space-6) var(--space-20)',
}

const heading: React.CSSProperties = {
  fontFamily: 'var(--font-syne)',
  fontWeight: 800,
  fontSize: 'clamp(2.25rem, 8vw, 3rem)',
  letterSpacing: '-0.02em',
  color: 'var(--text-primary)',
  lineHeight: 1.05,
  marginBottom: 'var(--space-2)',
}

const subheading: React.CSSProperties = {
  fontFamily: 'var(--font-syne)',
  fontWeight: 800,
  fontSize: 'clamp(1.125rem, 4vw, 1.375rem)',
  letterSpacing: '-0.01em',
  color: 'var(--text-primary)',
  lineHeight: 1.2,
  marginTop: 'var(--space-10)',
  marginBottom: 'var(--space-3)',
}

const updated: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans)',
  fontSize: '0.875rem',
  color: 'var(--text-tertiary)',
  marginBottom: 'var(--space-8)',
}

const body: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans)',
  fontSize: '1rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.7,
  marginBottom: 'var(--space-4)',
}

const seller: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans)',
  fontSize: '0.875rem',
  color: 'var(--text-tertiary)',
  lineHeight: 1.7,
  marginTop: 'var(--space-10)',
}

const link: React.CSSProperties = {
  color: 'var(--text-primary)',
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
  fontWeight: 600,
}
