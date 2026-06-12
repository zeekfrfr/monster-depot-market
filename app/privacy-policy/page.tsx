export const metadata = {
  title: 'Privacy Policy — Monster Depot',
}

export default function PrivacyPolicy() {
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
        Privacy Policy
      </h1>

      <p style={body}>
        We collect only what is needed to fulfill your order: your name, email
        address, shipping address, and order details. We do not sell, rent, or
        share your information with third parties for marketing purposes.
      </p>

      <p style={body}>
        Payment is processed securely by Square. We never store your card number
        or payment credentials — that data goes directly to Square and never
        passes through our servers.
      </p>

      <p style={body}>
        Your order information is retained for order fulfillment and customer
        service purposes. You may request access to or deletion of your data
        by contacting us at{' '}
        <a href="mailto:monsterdepotmarketing@gmail.com" style={link}>
          monsterdepotmarketing@gmail.com
        </a>.
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
