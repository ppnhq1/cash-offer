import type { CollectionAfterChangeHook } from 'payload'

import { after } from 'next/server'

import type { FormSubmission } from '@/payload-types'

import { sendLeadEmails } from '@/utilities/sendLeadEmails'
import { sendLeadSms } from '@/utilities/sendLeadSms'

const NOTIFICATION_COOLDOWN_MINUTES = 15
const MAX_NOTIFICATIONS_PER_WINDOW = 2

function fieldValue(doc: FormSubmission, name: string): string | undefined {
  const entry = doc.submissionData?.find((f) => f.field === name)
  return entry?.value
}

/**
 * Fires the lead-confirmation SMS and welcome/notification emails whenever
 * a lead-capture submission (one with both `phone` and `email` fields) is
 * saved. This is the *only* place these sends are triggered from — there
 * is no public API route that accepts arbitrary phone/email input, so a
 * bad actor can't use this business's BulkVS/Brevo accounts to bomb an
 * arbitrary phone number or inbox without also creating a matching,
 * auditable record in Payload.
 *
 * A lightweight per-value cooldown (independent of that inherent
 * protection) caps how many times the SAME phone or email can trigger a
 * send within a short window, so even a scripted flood of fake submissions
 * against one victim can't turn into an unbounded number of real messages.
 */
export const notifyLead: CollectionAfterChangeHook<FormSubmission> = ({
  doc,
  operation,
  req: { payload },
}) => {
  if (operation !== 'create') return doc

  const address = fieldValue(doc, 'address')
  const phone = fieldValue(doc, 'phone')
  const email = fieldValue(doc, 'email')
  const smsConsent = fieldValue(doc, 'smsConsent')
  const sourcePage = fieldValue(doc, 'sourcePage')

  // Only lead-capture-shaped submissions (address + phone + email) trigger
  // notifications — other form types on the site pass through untouched.
  if (!address || !phone || !email) return doc

  payload.logger.info(`notifyLead: scheduling notifications for submission ${doc.id}.`)

  after(async () => {
    try {
      const withinCooldown = await payload.count({
        collection: 'form-submissions',
        where: {
          and: [
            { createdAt: { greater_than: new Date(Date.now() - NOTIFICATION_COOLDOWN_MINUTES * 60_000) } },
            {
              or: [
                { 'submissionData.value': { equals: phone } },
                { 'submissionData.value': { equals: email } },
              ],
            },
          ],
        },
      })

      if (withinCooldown.totalDocs > MAX_NOTIFICATIONS_PER_WINDOW) {
        payload.logger.warn(
          `notifyLead: cooldown hit for phone/email, skipping notifications (${withinCooldown.totalDocs} recent submissions).`,
        )
        return
      }

      const business = await payload.findGlobal({ slug: 'business' })
      const businessName = business?.businessName || 'us'

      if (String(smsConsent) === 'true') {
        await sendLeadSms({ phone, businessName }).catch((err) => {
          payload.logger.error({ err }, 'notifyLead: SMS send failed.')
        })
      }

      await sendLeadEmails({
        address,
        phone,
        email,
        sourcePage,
        businessName,
        telephone: business?.telephone,
      }).catch((err) => {
        payload.logger.error({ err }, 'notifyLead: email send failed.')
      })

      payload.logger.info(`notifyLead: finished notifications for submission ${doc.id}.`)
    } catch (err) {
      payload.logger.error({ err }, 'notifyLead: unexpected error.')
    }
  })

  return doc
}
