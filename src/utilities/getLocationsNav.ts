import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

export type LocationNavItem = {
  cityName: string
  stateAbbr: string
  slug: string
}

async function getLocationsNav(): Promise<LocationNavItem[]> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'locations',
    draft: false,
    overrideAccess: false,
    pagination: false,
    limit: 200,
    sort: 'cityName',
    where: { _status: { equals: 'published' } },
    select: { cityName: true, stateAbbr: true, slug: true },
  })

  return result.docs
    .filter((doc): doc is typeof doc & { slug: string } => Boolean(doc.slug))
    .map((doc) => ({ cityName: doc.cityName, stateAbbr: doc.stateAbbr, slug: doc.slug as string }))
}

/**
 * Cached list of published locations for the header megamenu. Tagged with
 * `locations-sitemap` so it revalidates whenever a Location is published,
 * unpublished, or deleted (see Locations/hooks/revalidateLocation.ts) — new
 * cities show up in the nav automatically, no header edits required.
 */
export const getCachedLocationsNav = () =>
  unstable_cache(getLocationsNav, ['locations-nav'], {
    tags: ['locations-sitemap'],
  })
