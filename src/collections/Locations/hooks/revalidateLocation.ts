import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Location } from '../../../payload-types'

export const revalidateLocation: CollectionAfterChangeHook<Location> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/locations/${doc.slug}`

      payload.logger.info(`Revalidating location at path: ${path}`)

      revalidatePath(path)
      revalidatePath('/locations')
      revalidateTag('locations-sitemap', 'max')
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/locations/${previousDoc.slug}`

      payload.logger.info(`Revalidating old location at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidatePath('/locations')
      revalidateTag('locations-sitemap', 'max')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Location> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidatePath(`/locations/${doc?.slug}`)
    revalidatePath('/locations')
    revalidateTag('locations-sitemap', 'max')
  }

  return doc
}
