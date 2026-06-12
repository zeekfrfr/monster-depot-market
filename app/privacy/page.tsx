export const metadata = {
  title: 'Privacy Policy — Monster Depot',
}

export default function PrivacyPolicy() {
  return (
    <div style={page}>
      <h1 style={heading}>Privacy Policy</h1>
      <p style={body}>
        We collect only what&apos;s needed to fulfill your order: name, email, shipping address,
        and order details. We do not sell your information.
      </p>
      <p style={body}>
        Payment is processed securely by Square — we never store card numbers.
      </p>
      <p style={body}>
        Contact{' '}
        <a href="mailto:monsterdepotmarketing@gmail.com" style={link}>
          monsterdepotmarketing@gmail.com
        </a>{' '}
        with any privacy requests.
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
