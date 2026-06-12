export const metadata = {
  title: 'Refund Policy — Monster Depot',
}

export default function RefundPolicy() {
  return (
    <div
      style={{
        maxWidth: '640px',
        margin: '0 auto',
        padding: '64px 24px 96px',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: 'var(--text-3xl)',
          fontWeight: 300,
          letterSpacing: '0.12em',
          color: 'var(--text-primary)',
          marginBottom: '48px',
          lineHeight: 1.1,
        }}
      >
        Refund Policy
      </h1>

      <p style={body}>
        All sales are final. We do not offer refunds.
      </p>

      <p style={body}>
        If a product arrives faulty or damaged, we will replace it at no cost.
        Contact us within 7 days of delivery at{' '}
        <a href="mailto:monsterdepotmarketing@gmail.com" style={link}>
          monsterdepotmarketing@gmail.com
        </a>{' '}
        with your order number and a photo of the issue. Replacements are limited
        to the faulty items only.
      </p>

      <p style={body}>
        Monster Depot is operated by Monster Depot Holdings LLC.
      </p>
    </div>
  )
}

const body: React.CSSProperties = {
  fontSize: 'var(--text-base)',
  fontWeight: 300,
  color: 'var(--text-secondary)',
  lineHeight: 1.8,
  marginBottom: '24px',
  letterSpacing: '-0.01em',
}

const link: React.CSSProperties = {
  color: 'var(--text-primary)',
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
}
