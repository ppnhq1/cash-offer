/**
 * Plain, inline-styled HTML (email clients don't reliably support <style>
 * blocks or CSS classes) with a matching plain-text fallback for each
 * message. Keep markup minimal — this isn't meant to reuse the site's
 * daisyUI components, which don't render in an inbox.
 *
 * Every value below originates from a public, unauthenticated form
 * submission, so it's HTML-escaped before interpolation — this is staff's
 * inbox reading it, and an injected link/script in a submitted "address"
 * field is a real phishing vector otherwise.
 */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const wrapper = (bodyHtml: string) => `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a;">
  ${bodyHtml}
</div>
`

export function leadWelcomeEmail({
  businessName,
  telephone,
  address,
}: {
  businessName: string
  telephone?: string | null
  address: string
}) {
  const safeBusinessName = escapeHtml(businessName)
  const safeAddress = escapeHtml(address)
  const safeTelephone = telephone ? escapeHtml(telephone) : null

  const subject = `Thanks for reaching out to ${businessName}!`

  const html = wrapper(`
    <h1 style="font-size: 22px; margin: 0 0 16px;">Thanks for reaching out!</h1>
    <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
      We received your info for <strong>${safeAddress}</strong>. A member of our team will call you within 24 hours with your fair cash offer — no obligation.
    </p>
    ${
      safeTelephone
        ? `<p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
             Have a question before then? Call or text us at <a href="tel:${safeTelephone.replace(/[^\d+]/g, '')}" style="color: #e71826; text-decoration: none;">${safeTelephone}</a>.
           </p>`
        : ''
    }
    <p style="font-size: 16px; line-height: 1.6; margin: 24px 0 0; color: #555;">
      — The ${safeBusinessName} Team
    </p>
  `)

  const text = [
    `Thanks for reaching out to ${businessName}!`,
    '',
    `We received your info for ${address}. A member of our team will call you within 24 hours with your fair cash offer — no obligation.`,
    telephone ? `\nHave a question before then? Call or text us at ${telephone}.` : '',
    `\n— The ${businessName} Team`,
  ]
    .filter(Boolean)
    .join('\n')

  return { subject, html, text }
}

export function leadNotificationEmail({
  address,
  phone,
  email,
  sourcePage,
  submittedAt,
}: {
  address: string
  phone: string
  email: string
  sourcePage?: string
  submittedAt: string
}) {
  const subject = `New Lead: ${address}`

  const rows: [string, string][] = [
    ['Address', address],
    ['Phone', phone],
    ['Email', email],
    ['Submitted', submittedAt],
  ]
  if (sourcePage) rows.push(['Source Page', sourcePage])

  const html = wrapper(`
    <h1 style="font-size: 22px; margin: 0 0 16px;">New Lead Submitted</h1>
    <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
      ${rows
        .map(
          ([label, value]) => `
        <tr>
          <td style="padding: 8px 12px 8px 0; color: #666; white-space: nowrap; vertical-align: top;">${escapeHtml(label)}</td>
          <td style="padding: 8px 0; font-weight: 600;">${escapeHtml(value)}</td>
        </tr>
      `,
        )
        .join('')}
    </table>
  `)

  const text = ['New Lead Submitted', '', ...rows.map(([label, value]) => `${label}: ${value}`)].join('\n')

  return { subject, html, text }
}
