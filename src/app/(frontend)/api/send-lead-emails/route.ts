import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

import { leadNotificationEmail, leadWelcomeEmail } from '@/utilities/emailTemplates'
import { sendEmail } from '@/utilities/sendEmail'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Sends the two post-submission emails for a lead-capture form: a welcome
 * email back to the submitter, and a lead-notification email to the sales
 * inbox. Best-effort, mirroring /api/send-lead-sms — the lead is already
 * saved in Payload before this is ever called, so a failure here never
 * blocks or reverses that. See the fire-and-forget call site in
 * LeadCaptureCard.
 */
export async function POST(request: Request) {
  let body: { address?: unknown; phone?: unknown; email?: unknown; sourcePage?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { address, phone, email, sourcePage } = body

  if (typeof address !== 'string' || !address.trim()) {
    return NextResponse.json({ error: 'Address is required.' }, { status: 400 })
  }
  if (typeof phone !== 'string' || !phone.trim()) {
    return NextResponse.json({ error: 'Phone is required.' }, { status: 400 })
  }
  if (typeof email !== 'string' || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
  }

  const notificationTo = process.env.LEAD_NOTIFICATION_EMAIL
  if (!notificationTo) {
    console.error('send-lead-emails: LEAD_NOTIFICATION_EMAIL is not configured.')
    return NextResponse.json({ error: 'Email is not configured.' }, { status: 503 })
  }

  const payload = await getPayload({ config: configPromise })
  const business = await payload.findGlobal({ slug: 'business' })
  const businessName = business?.businessName || 'us'

  const welcome = leadWelcomeEmail({ businessName, telephone: business?.telephone, address })
  const notification = leadNotificationEmail({
    address,
    phone,
    email,
    sourcePage: typeof sourcePage === 'string' ? sourcePage : undefined,
    submittedAt: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
  })

  const [welcomeResult, notificationResult] = await Promise.allSettled([
    sendEmail({ to: email, ...welcome }),
    sendEmail({ to: notificationTo, ...notification }),
  ])

  if (welcomeResult.status === 'rejected') {
    console.error('send-lead-emails: welcome email failed.', welcomeResult.reason)
  }
  if (notificationResult.status === 'rejected') {
    console.error('send-lead-emails: notification email failed.', notificationResult.reason)
  }

  if (welcomeResult.status === 'rejected' && notificationResult.status === 'rejected') {
    return NextResponse.json({ error: 'Failed to send emails.' }, { status: 502 })
  }

  return NextResponse.json({
    status: 'sent',
    welcome: welcomeResult.status,
    notification: notificationResult.status,
  })
}
