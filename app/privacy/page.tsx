export const metadata = {
  title: 'Privacy Policy — Monster Depot Market',
}

export default function PrivacyPolicy() {
  return (
    <div style={page}>
      <h1 style={heading}>Privacy Policy</h1>

      <p style={body}>Last updated: June 2026</p>

      <p style={body}>
        Monster Depot Holdings LLC (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) operates
        monsterdepotmarket.com. This policy explains what we collect, how we use it, and the
        choices you have.
      </p>

      <h2 style={subheading}>What we collect</h2>
      <p style={body}>
        We collect the contact details, shipping address, and order information you provide at
        checkout. Payment is handled entirely by Square — we never see or store your full card
        number.
      </p>

      <h2 style={subheading}>How we use it</h2>
      <p style={body}>
        We use your information to fulfil and ship your orders, to provide customer support, and,
        only if you opt in, to send you marketing about new flavors and drops. You can unsubscribe
        from marketing at any time.
      </p>

      <h2 style={subheading}>Processors</h2>
      <p style={body}>
        We rely on trusted service providers to run the store. Square processes payments, and
        Supabase stores account and order data on our behalf. These processors handle your
        information only to provide their services to us.
      </p>

      <h2 style={subheading}>Cookies and analytics</h2>
      <p style={body}>
        We use cookies and basic analytics to keep the site working, remember your cart, and
        understand how the site is used so we can improve it. Most browsers let you control or
        disable cookies in their settings.
      </p>

      <h2 style={subheading}>Age restriction</h2>
      <p style={body}>
        This site and our products are intended for adults 18 and over. We do not knowingly
        collect information from anyone under 18.
      </p>

      <h2 style={subheading}>Your data requests</h2>
      <p style={body}>
        You may request access to, correction of, or deletion of your personal information. Email
        us at{' '}
        <a href="mailto:monsterdepotmarketing@gmail.com" style={link}>
          monsterdepotmarketing@gmail.com
        </a>{' '}
        and we will respond as required by applicable law.
      </p>

      <h2 style={subheading}>No sale of personal data</h2>
      <p style={body}>
        We do not sell your personal data, and we do not share it with third parties for their own
        marketing.
      </p>

      <h2 style={subheading}>Contact</h2>
      <p style={body}>
        Questions about this policy? Reach us at{' '}
        <a href="mailto:monsterdepotmarketing@gmail.com" style={link}>
          monsterdepotmarketing@gmail.com
        </a>
        . This site is operated by Monster Depot Holdings LLC.
      </p>
    </div>
  )
}

const page: React.CSSProperties = {
  maxWidth: '680px',
  margin: '0 auto',
  padding: '120px 24px 80px',
  background: 'var(--surface-white)',
  minHeight: '100svh',
}

const heading: React.CSSProperties = {
  fontFamily: 'var(--font-syne)',
  fontSize: '22px',
  fontWeight: 800,
  letterSpacing: '-0.02em',
  color: 'var(--text-primary)',
  marginBottom: '32px',
  lineHeight: 1.2,
}

const subheading: React.CSSProperties = {
  fontFamily: 'var(--font-syne)',
  fontSize: '18px',
  fontWeight: 800,
  letterSpacing: '-0.01em',
  color: 'var(--text-primary)',
  marginTop: '40px',
  marginBottom: '12px',
  lineHeight: 1.3,
}

const body: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 400,
  color: 'var(--text-primary)',
  lineHeight: 1.7,
  marginBottom: '20px',
}

const link: React.CSSProperties = {
  color: 'var(--text-primary)',
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
}
