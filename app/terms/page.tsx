export const metadata = {
  title: 'Terms — Monster Depot Market',
}

export default function Terms() {
  return (
    <div style={page}>
      <h1 style={heading}>Terms of Service</h1>

      <p style={updated}>Last updated: June 2026</p>

      <p style={body}>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of
        Monster Depot Market and any purchase you make through it. The site is operated by
        Monster Depot Holdings LLC (&ldquo;Monster Depot,&rdquo; &ldquo;we,&rdquo;
        &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By browsing the site, creating an account,
        or placing an order, you agree to be bound by these Terms. If you do not agree, do
        not use the site.
      </p>

      <h2 style={subheading}>Acceptance of Terms</h2>
      <p style={body}>
        By accessing the site or completing checkout, you confirm that you have read,
        understood, and accept these Terms, along with our{' '}
        <a href="/privacy" style={link}>Privacy Policy</a>. We may update these Terms from
        time to time, and your continued use after any change constitutes acceptance of the
        revised Terms.
      </p>

      <h2 style={subheading}>Eligibility</h2>
      <p style={body}>
        You must be at least 18 years of age to use this site and to place an order. By
        purchasing, you represent and warrant that you are 18 or older and that the
        information you provide is accurate. We may refuse service, cancel orders, or close
        accounts that we reasonably believe do not meet this requirement.
      </p>

      <h2 style={subheading}>Our Products</h2>
      <p style={body}>
        Products sold on this site are food and novelty dessert items. They are intended for
        enjoyment, not as a substitute for a balanced diet, medical care, or professional
        advice. Product descriptions, imagery, and flavor copy are provided for
        informational purposes and may be updated without notice.
      </p>

      <h2 style={subheading}>Orders &amp; Pricing</h2>
      <p style={body}>
        All prices are listed in U.S. dollars and are subject to change without notice. We
        reserve the right to correct pricing errors, limit order quantities, and refuse or
        cancel any order at our discretion, including after an order has been submitted. If
        we cancel an order you have already paid for, we will issue a refund for that order.
      </p>

      <h2 style={subheading}>Payment</h2>
      <p style={body}>
        Payments are processed securely by Square. We do not collect or store your full card
        details. By submitting payment information, you authorize the charge for your order
        total, including any applicable taxes and shipping. Your use of Square is also
        subject to Square&apos;s own terms and policies.
      </p>

      <h2 style={subheading}>Shipping &amp; Refunds</h2>
      <p style={body}>
        Shipping timelines, carrier responsibilities, and delivery terms are described in
        our <a href="/shipping" style={link}>Shipping Policy</a>. Returns, replacements, and
        eligibility for refunds are described in our{' '}
        <a href="/refunds" style={link}>Refund Policy</a>. By completing checkout you confirm
        you have read and accept both, and that the shipping information you provide is
        accurate and complete.
      </p>

      <h2 style={subheading}>Acceptable Use</h2>
      <p style={body}>
        You agree to use the site only for lawful purposes. You may not attempt to interfere
        with the site&apos;s operation or security, access it through automated means without
        permission, resell products in violation of applicable law, misrepresent your age or
        identity, or use the site in any way that infringes the rights of others.
      </p>

      <h2 style={subheading}>Disclaimers</h2>
      <p style={body}>
        These statements have not been evaluated by the Food and Drug Administration. These
        products are not intended to diagnose, treat, cure, or prevent any disease. The site
        and all products are provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo;
        without warranties of any kind, whether express or implied, to the fullest extent
        permitted by law.
      </p>

      <h2 style={subheading}>Limitation of Liability</h2>
      <p style={body}>
        To the maximum extent permitted by law, Monster Depot Holdings LLC&apos;s total
        liability for any claim arising out of or relating to your use of the site or any
        product is limited to the amount you paid for the product giving rise to the claim.
        We are not liable for indirect, incidental, special, or consequential damages.
      </p>

      <h2 style={subheading}>Governing Law</h2>
      <p style={body}>
        These Terms are governed by the laws of the United States and the state in which
        Monster Depot Holdings LLC is organized, without regard to conflict-of-law
        principles. Any dispute arising under these Terms shall be subject to the exclusive
        jurisdiction of the courts located in the United States.
      </p>

      <h2 style={subheading}>Changes to These Terms</h2>
      <p style={body}>
        We may revise these Terms at any time by posting an updated version on this page. The
        &ldquo;Last updated&rdquo; date above reflects the most recent revision. Your
        continued use of the site after changes are posted means you accept the updated
        Terms.
      </p>

      <h2 style={subheading}>Contact</h2>
      <p style={body}>
        Questions about these Terms? Reach us at{' '}
        <a href="mailto:monsterdepotmarketing@gmail.com" style={link}>
          monsterdepotmarketing@gmail.com
        </a>
        . Monster Depot Market is operated by Monster Depot Holdings LLC.
      </p>
    </div>
  )
}

const page: React.CSSProperties = {
  maxWidth: '680px',
  margin: '0 auto',
  padding: 'var(--space-16) var(--space-6) var(--space-20)',
}

const heading: React.CSSProperties = {
  fontFamily: 'var(--font-syne)',
  fontWeight: 800,
  fontSize: 'clamp(2rem, 8vw, 2.75rem)',
  letterSpacing: '-0.02em',
  color: 'var(--text-primary)',
  lineHeight: 1.05,
  marginBottom: 'var(--space-3)',
}

const subheading: React.CSSProperties = {
  fontFamily: 'var(--font-syne)',
  fontWeight: 800,
  fontSize: 'clamp(1.125rem, 4.5vw, 1.375rem)',
  letterSpacing: '-0.01em',
  color: 'var(--text-primary)',
  lineHeight: 1.2,
  marginTop: 'var(--space-12)',
  marginBottom: 'var(--space-4)',
}

const updated: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans)',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'var(--text-tertiary)',
  letterSpacing: '0.02em',
  marginBottom: 'var(--space-12)',
}

const body: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans)',
  fontSize: '1rem',
  fontWeight: 400,
  color: 'var(--text-secondary)',
  lineHeight: 1.8,
  marginBottom: 'var(--space-6)',
}

const link: React.CSSProperties = {
  color: 'var(--text-primary)',
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
  fontWeight: 500,
}
