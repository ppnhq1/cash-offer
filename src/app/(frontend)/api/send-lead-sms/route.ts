import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

const PHONE_PATTERN = /^1\d{10}$/

/**
 * Sends a one-time "thanks for contacting us" SMS via the BulkVS REST API
 * right after a lead-capture form submission. Best-effort: the lead is
 * already saved in Payload before this is ever called, so a failure here
 * never blocks or reverses that — see the fire-and-forget call site in
 * LeadCaptureCard.
 */
export async function POST(request: Request) {
  let body: { phone?: unknown; smsConsent?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { phone, smsConsent } = body

  if (smsConsent !== true) {
    return NextResponse.json({ error: 'SMS consent was not given.' }, { status: 400 })
  }

  if (typeof phone !== 'string' || !PHONE_PATTERN.test(phone)) {
    return NextResponse.json({ error: 'Phone number must be in 1XXXXXXXXXX format.' }, { status: 400 })
  }

  const apiUrl = process.env.BULKVS_API_URL
  const basicAuth = process.env.BULKVS_BASIC_AUTH
  const fromNumber = process.env.BULKVS_FROM_NUMBER

  if (!apiUrl || !basicAuth || !fromNumber) {
    console.error('send-lead-sms: BulkVS environment variables are not fully configured.')
    return NextResponse.json({ error: 'SMS is not configured.' }, { status: 503 })
  }

  const payload = await getPayload({ config: configPromise })
  const business = await payload.findGlobal({ slug: 'business' })
  const businessName = business?.businessName || 'us'

  const message = `Thanks for contacting ${businessName}! A member of our team will call you soon with your cash offer. Reply STOP to opt out.`

  try {
    const bulkVsRes = await fetch(`${apiUrl}/messageSend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify({
        From: fromNumber,
        To: [phone],
        Message: message,
      }),
    })

    if (!bulkVsRes.ok) {
      const errorBody = await bulkVsRes.text()
      console.error(`send-lead-sms: BulkVS returned ${bulkVsRes.status}: ${errorBody}`)
      return NextResponse.json({ error: 'Failed to send confirmation text.' }, { status: 502 })
    }

    return NextResponse.json({ status: 'sent' })
  } catch (err) {
    console.error('send-lead-sms: request to BulkVS failed.', err)
    return NextResponse.json({ error: 'Failed to send confirmation text.' }, { status: 502 })
  }
}
