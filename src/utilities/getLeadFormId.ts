import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

async function getLeadFormId(): Promise<number | null> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'forms',
    where: { title: { equals: 'Get Your Cash Offer' } },
    limit: 1,
    pagination: false,
    depth: 0,
  })

  return result.docs[0]?.id ?? null
}

/**
 * Cached id of the shared "Get Your Cash Offer" form, used by the global
 * lead-capture modal (see LeadCaptureModal) rendered once in the frontend
 * layout. Tagged so it revalidates if the form is ever recreated.
 */
export const getCachedLeadFormId = () =>
  unstable_cache(getLeadFormId, ['lead-form-id'], {
    tags: ['global_forms'],
  })
