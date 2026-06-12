export const metadata = {
  title: 'Refund Policy — Monster Depot',
}

export default function RefundPolicy() {
  return (
    <div style={page}>
      <h1 style={heading}>Refund Policy</h1>
      <p style={body}>All sales are final. We do not offer refunds.</p>
      <p style={body}>
        If a product arrives faulty or damaged, contact us within 7 days of delivery at{' '}
        <a href="mailto:monsterdepotmarketing@gmail.com" style={link}>
          monsterdepotmarketing@gmail.com
        </a>{' '}
        with your order number and a photo of the issue. We will replace faulty items at no cost.
        Replacements are limited to the affected items only.
      </p>
      <p style={body}>
        Questions? Reach us at{' '}
        <a href="mailto:monsterdepotmarketing@gmail.com" style={link}>
          monsterdepotmarketing@gmail.com
        </a>
      </p>
    </div>
  )
}

const page: React.CSSProperties = {
  maxWidth: '640px',
  margin: '0 auto',
  padding: '64px 24px 96px',
}

const heading: React.CSSProperties = {
  fontFamily: 'var(--font-cormorant)',
  fontSize: 'var(--text-3xl)',
  fontWeight: 300,
  letterSpacing: '0.12em',
  color: 'var(--text-primary)',
  marginBottom: '48px',
  lineHeight: 1.1,
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
