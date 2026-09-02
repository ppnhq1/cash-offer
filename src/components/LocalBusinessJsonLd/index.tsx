import React from 'react'

import { getCachedGlobal } from '@/utilities/getGlobals'
import { getServerSideURL } from '@/utilities/getURL'

type Props = {
  /** Overrides the business-wide default areas served — use for a single city/neighborhood page. */
  areaServedOverride?: string[]
}

export const LocalBusinessJsonLd: React.FC<Props> = async ({ areaServedOverride }) => {
  const business = await getCachedGlobal('business', 0)()

  if (!business?.businessName) return null

  const areaServed =
    areaServedOverride && areaServedOverride.length > 0
      ? areaServedOverride
      : (business.areaServed || []).map((a) => a.name)

  const address =
    business.addressLocality || business.streetAddress
      ? {
          '@type': 'PostalAddress',
          ...(business.streetAddress ? { streetAddress: business.streetAddress } : {}),
          ...(business.addressLocality ? { addressLocality: business.addressLocality } : {}),
          ...(business.addressRegion ? { addressRegion: business.addressRegion } : {}),
          ...(business.postalCode ? { postalCode: business.postalCode } : {}),
          addressCountry: 'US',
        }
      : undefined

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: business.businessName,
    url: getServerSideURL(),
    ...(business.telephone ? { telephone: business.telephone } : {}),
    ...(business.email ? { email: business.email } : {}),
    ...(business.priceRange ? { priceRange: business.priceRange } : {}),
    ...(address ? { address } : {}),
    ...(areaServed.length > 0 ? { areaServed: areaServed.map((name) => ({ '@type': 'City', name })) } : {}),
    ...(business.sameAs && business.sameAs.length > 0
      ? { sameAs: business.sameAs.map((s) => s.url) }
      : {}),
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
      }}
    />
  )
}
