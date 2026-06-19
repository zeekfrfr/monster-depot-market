export const metadata = {
  title: 'Refund Policy — Monster Depot Market',
}

export default function RefundPolicy() {
  return (
    <main style={page}>
      <h1 style={h1}>Refund Policy</h1>
      <p style={meta}>Last updated: June 2026</p>

      <p style={body}>
        Monster Depot Holdings LLC sells single-serving consumable Munchie Pouches.
        Because every pouch is a food item made for eating, our refund policy is built
        around food safety. Please read it carefully before you order.
      </p>

      <h2 style={h2}>All sales are final on consumables</h2>
      <p style={body}>
        Once a pouch leaves our hands, we cannot accept it back. All sales of opened or
        consumable items are final. For food-safety reasons we do not accept returns of
        any food product, and we cannot offer refunds or exchanges on pouches that have
        been opened, used, or partially consumed.
      </p>

      <h2 style={h2}>Damaged or incorrect orders</h2>
      <p style={body}>
        We stand behind what we ship. If your order arrives damaged in transit, or if you
        received the wrong item, we will make it right with a replacement or a refund. To
        qualify, the issue must be reported within 7 days of delivery and include clear
        photos of the product and its packaging.
      </p>

      <h2 style={h2}>How to start a claim</h2>
      <p style={body}>
        Email us at{' '}
        <a href="mailto:monsterdepotmarketing@gmail.com" style={link}>
          monsterdepotmarketing@gmail.com
        </a>{' '}
        within 7 days of delivery. Include your order number, a short description of the
        problem, and photos showing the damage or the incorrect item. The more detail you
        send, the faster we can sort it out.
      </p>

      <h2 style={h2}>Refund processing time</h2>
      <p style={body}>
        Once we approve a claim, your refund is issued to the original payment method
        within 5–10 business days. Depending on your bank or card provider, it may take a
        few additional days to appear on your statement.
      </p>

      <h2 style={h2}>No returns of opened food</h2>
      <p style={body}>
        We do not accept physical returns of any food item, opened or unopened. For
        approved damaged-in-transit or incorrect-item claims, please do not mail anything
        back unless we specifically ask you to — your photos are all we need.
      </p>

      <h2 style={h2}>Questions</h2>
      <p style={body}>
        Reach the team at{' '}
        <a href="mailto:monsterdepotmarketing@gmail.com" style={link}>
          monsterdepotmarketing@gmail.com
        </a>
        . This policy is provided by Monster Depot Holdings LLC.
      </p>
    </main>
  )
}

const page: React.CSSProperties = {
  maxWidth: '680px',
  margin: '0 auto',
  padding: '80px var(--space-6)',
  background: 'var(--surface-white)',
  fontFamily: 'var(--font-dm-sans)',
}

const h1: React.CSSProperties = {
  fontFamily: 'var(--font-syne)',
  fontWeight: 800,
  fontSize: 'clamp(28px, 7vw, 36px)',
  lineHeight: 1.15,
  color: 'var(--text-primary)',
  margin: '0 0 var(--space-2)',
}

const meta: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans)',
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: 1.7,
  color: 'var(--text-secondary)',
  margin: '0 0 var(--space-8)',
}

const h2: React.CSSProperties = {
  fontFamily: 'var(--font-syne)',
  fontWeight: 800,
  fontSize: '22px',
  lineHeight: 1.25,
  color: 'var(--text-primary)',
  margin: 'var(--space-8) 0 var(--space-3)',
}

const body: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans)',
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: 1.7,
  color: 'var(--text-primary)',
  margin: '0 0 var(--space-4)',
}

const link: React.CSSProperties = {
  color: 'var(--brand-purple-light)',
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
}
