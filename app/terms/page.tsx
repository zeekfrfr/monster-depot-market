export const metadata = {
  title: 'Terms of Service — Monster Depot',
}

export default function Terms() {
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
        Terms of Service
      </h1>

      <p style={body}>
        By placing an order with Monster Depot, you agree to the following terms.
      </p>

      <p style={body}>
        All purchases are subject to our{' '}
        <a href="/refund-policy" style={link}>Refund Policy</a> and{' '}
        <a href="/shipping-policy" style={link}>Shipping Policy</a>. By
        completing checkout you confirm you have read and accept both.
      </p>

      <p style={body}>
        You confirm that the shipping information provided is accurate. Monster
        Depot Holdings LLC is not responsible for orders that cannot be delivered
        due to incorrect or incomplete addresses.
      </p>

      <p style={body}>
        Monster Depot Holdings LLC's liability is limited to the value of the
        product purchased. We are not liable for indirect, incidental, or
        consequential damages.
      </p>

      <p style={body}>
        These terms are governed by Monster Depot Holdings LLC. Questions:{' '}
        <a href="mailto:monsterdepotmarketing@gmail.com" style={link}>
          monsterdepotmarketing@gmail.com
        </a>
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
