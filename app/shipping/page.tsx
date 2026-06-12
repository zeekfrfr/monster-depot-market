export const metadata = {
  title: 'Shipping Policy — Monster Depot',
}

export default function ShippingPolicy() {
  return (
    <div style={page}>
      <h1 style={heading}>Shipping Policy</h1>
      <p style={body}>
        All orders ship within 3–5 business days of purchase. Once shipped, delivery time
        depends on the carrier. We are not responsible for carrier delays.
      </p>
      <p style={body}>A shipping confirmation will be sent to your email.</p>
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
