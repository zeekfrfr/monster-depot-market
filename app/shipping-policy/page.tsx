export const metadata = {
  title: 'Shipping Policy — Monster Depot',
}

export default function ShippingPolicy() {
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
        Shipping Policy
      </h1>

      <p style={body}>
        All orders ship within 3–5 business days of purchase. Once shipped,
        delivery time depends on the carrier and destination.
      </p>

      <p style={body}>
        We are not responsible for delays caused by the carrier after shipment.
        A shipping confirmation with tracking information will be sent to the
        email address provided at checkout.
      </p>

      <p style={body}>
        Questions?{' '}
        <a href="mailto:monsterdepotmarketing@gmail.com" style={link}>
          monsterdepotmarketing@gmail.com
        </a>
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
