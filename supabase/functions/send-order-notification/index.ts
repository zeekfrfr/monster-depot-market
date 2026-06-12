const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const POSTMARK_API = 'https://api.postmarkapp.com/email'
const FROM_ADDRESS = 'orders@monsterdepotmarket.com'
const ADMIN_EMAIL = 'monsterdepotmarketing@gmail.com'

interface OrderItem {
  modeName: string
  flavor: string
  sizeLabel: string
  quantity: number
  unit_price_cents: number
}

interface Shipping {
  name: string
  address1: string
  address2?: string
  city: string
  state: string
  zip: string
}

interface Payload {
  orderId: string
  email: string
  items: OrderItem[]
  totalCents: number
  shipping: Shipping
}

async function sendEmail(token: string, to: string, subject: string, text: string, html: string) {
  const res = await fetch(POSTMARK_API, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Postmark-Server-Token': token,
    },
    body: JSON.stringify({
      From: FROM_ADDRESS,
      To: to,
      Subject: subject,
      TextBody: text,
      HtmlBody: html,
      MessageStream: 'outbound',
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    console.error(`Postmark error (${res.status}):`, body)
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  const token = Deno.env.get('POSTMARK_SERVER_TOKEN')
  if (!token) {
    console.error('POSTMARK_SERVER_TOKEN not set')
    return new Response(JSON.stringify({ error: 'Email not configured.' }), {
      status: 503,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  let payload: Payload
  try {
    payload = await req.json() as Payload
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid body.' }), {
      status: 400,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const { orderId, email, items, totalCents, shipping } = payload
  const shortId = orderId.slice(0, 8).toUpperCase()
  const totalDollars = (totalCents / 100).toFixed(2)

  const shippingLines = [
    shipping.name,
    shipping.address1,
    shipping.address2,
    `${shipping.city}, ${shipping.state} ${shipping.zip}`,
    'US',
  ].filter(Boolean) as string[]

  // ── Customer confirmation ──────────────────────────────────

  const customerText = [
    `Monster Depot — Order Confirmation`,
    `Order #${shortId}`,
    ``,
    ...items.map(i =>
      `${i.quantity}× ${i.modeName} ${i.sizeLabel} — ${i.flavor}  $${((i.unit_price_cents * i.quantity) / 100).toFixed(2)}`
    ),
    ``,
    `Total  $${totalDollars}`,
    ``,
    `Ships to`,
    ...shippingLines,
    ``,
    `Your order ships within 3–5 business days.`,
    ``,
    `Monster Depot`,
  ].join('\n')

  const customerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{font-family:'DM Sans',Arial,sans-serif;font-size:15px;color:#1A1A1A;background:#FAF9F6;margin:0;padding:0}
  .wrap{max-width:560px;margin:0 auto;padding:48px 32px}
  .brand{font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#8A8A8A;margin-bottom:40px}
  h1{font-size:13px;font-weight:400;text-transform:uppercase;letter-spacing:0.08em;color:#8A8A8A;margin:0 0 4px}
  .order-id{font-size:22px;font-weight:300;letter-spacing:0.06em;margin:0 0 40px}
  table{width:100%;border-collapse:collapse;margin-bottom:24px}
  td{padding:12px 0;border-bottom:1px solid #E8E6E0;font-size:14px;vertical-align:top;line-height:1.5}
  td:last-child{text-align:right;white-space:nowrap}
  .flavor{color:#8A8A8A;font-size:13px}
  .total-row td{border-bottom:none;font-weight:500;padding-top:20px}
  .section-label{font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#8A8A8A;margin:32px 0 8px}
  .ship-line{font-size:14px;line-height:1.7;margin:0}
  .note{font-size:13px;color:#8A8A8A;margin-top:40px;line-height:1.7}
  .footer{font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#C8C5BC;margin-top:56px}
</style>
</head>
<body>
<div class="wrap">
  <p class="brand">Monster Depot</p>
  <p class="section-label">Order confirmation</p>
  <p class="order-id">#${shortId}</p>
  <table>
    ${items.map(i => `
    <tr>
      <td>
        ${i.modeName} — ${i.sizeLabel}<br>
        <span class="flavor">${i.flavor} · qty ${i.quantity}</span>
      </td>
      <td>$${((i.unit_price_cents * i.quantity) / 100).toFixed(2)}</td>
    </tr>`).join('')}
    <tr class="total-row">
      <td>Total</td>
      <td>$${totalDollars}</td>
    </tr>
  </table>
  <p class="section-label">Ships to</p>
  ${shippingLines.map(l => `<p class="ship-line">${l}</p>`).join('')}
  <p class="note">Your order ships within 3–5 business days.</p>
  <p class="footer">Monster Depot</p>
</div>
</body>
</html>`

  // ── Admin alert ────────────────────────────────────────────

  const adminText = [
    `New order — #${shortId}`,
    ``,
    `Customer: ${shipping.name}`,
    `Email:    ${email}`,
    ``,
    `Items:`,
    ...items.map(i =>
      `  ${i.quantity}× ${i.modeName} ${i.sizeLabel} — ${i.flavor}  ($${((i.unit_price_cents * i.quantity) / 100).toFixed(2)})`
    ),
    ``,
    `Total: $${totalDollars}`,
    ``,
    `Ship to:`,
    ...shippingLines.map(l => `  ${l}`),
    ``,
    `Order ID: ${orderId}`,
  ].join('\n')

  const adminHtml = `<!DOCTYPE html><html><body>
<pre style="font-family:monospace;font-size:14px;line-height:1.7;white-space:pre-wrap">${adminText}</pre>
</body></html>`

  await Promise.all([
    sendEmail(token, email, `Your Monster Depot order — #${shortId}`, customerText, customerHtml),
    sendEmail(token, ADMIN_EMAIL, `New order #${shortId} — ${shipping.name}`, adminText, adminHtml),
  ])

  return new Response(JSON.stringify({ sent: true }), {
    status: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
})
