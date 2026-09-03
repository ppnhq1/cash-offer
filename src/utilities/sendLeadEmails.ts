import { leadNotificationEmail, leadWelcomeEmail } from './emailTemplates'
import { formatPhoneDisplay } from './formatPhone'
import { sendEmail } from './sendEmail'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const STORED_PHONE_PATTERN = /^1\d{10}$/

/**
 * Sends the two post-submission emails for a lead-capture form: a welcome
 * email back to the submitter, and a lead-notification email to the sales
 * inbox. Called only from the form-submissions afterChange hook — never
 * directly reachable from the client — so these values always come from an
 * actual saved lead record, not arbitrary request input.
 */
export async function sendLeadEmails({
  address,
  phone,
  email,
  sourcePage,
  businessName,
  telephone,
}: {
  address: string
  phone: string
  email: string
  sourcePage?: string
  businessName: string
  telephone?: string | null
}): Promise<void> {
  if (!EMAIL_PATTERN.test(email)) {
    throw new Error(`Refusing to email malformed address: ${email}`)
  }

  const notificationTo = process.env.LEAD_NOTIFICATION_EMAIL
  if (!notificationTo) {
    throw new Error('LEAD_NOTIFICATION_EMAIL is not configured.')
  }

  // `phone` arrives in the stored 1XXXXXXXXXX format; show it the way a
  // human reads a phone number in these emails.
  const displayPhone = STORED_PHONE_PATTERN.test(phone) ? formatPhoneDisplay(phone.slice(1)) : phone

  const welcome = leadWelcomeEmail({ businessName, telephone, address })
  const notification = leadNotificationEmail({
    address,
    phone: displayPhone,
    email,
    sourcePage,
    submittedAt: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
  })

  const [welcomeResult, notificationResult] = await Promise.allSettled([
    sendEmail({ to: email, ...welcome }),
    sendEmail({ to: notificationTo, ...notification }),
  ])

  if (welcomeResult.status === 'rejected') {
    console.error('sendLeadEmails: welcome email failed.', welcomeResult.reason)
  }
  if (notificationResult.status === 'rejected') {
    console.error('sendLeadEmails: notification email failed.', notificationResult.reason)
  }

  if (welcomeResult.status === 'rejected' && notificationResult.status === 'rejected') {
    throw new Error('Both lead emails failed to send.')
  }
}
