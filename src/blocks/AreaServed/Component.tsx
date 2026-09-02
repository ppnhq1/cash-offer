import React from 'react'
import { MapPin } from 'lucide-react'

import type { AreaServedBlock as AreaServedBlockProps } from '@/payload-types'

import { getCachedGlobal } from '@/utilities/getGlobals'

export const AreaServedBlock: React.FC<AreaServedBlockProps> = async ({
  eyebrow,
  heading,
  body,
}) => {
  const business = await getCachedGlobal('business', 0)()
  const areas = business?.areaServed || []
  const mapQuery = encodeURIComponent(
    [business?.addressLocality, business?.addressRegion].filter(Boolean).join(', ') || 'Richmond, VA',
  )

  return (
    <div className="container">
      <div className="grid items-start gap-10 md:grid-cols-2 md:gap-16">
        <div>
          {eyebrow && (
            <span className="badge badge-soft badge-primary badge-lg mb-3 font-bold tracking-wide uppercase">
              {eyebrow}
            </span>
          )}
          <h2 className="text-3xl font-bold md:text-4xl">{heading}</h2>
          <p className="mt-4 text-lg text-base-content/80">{body}</p>

          {areas.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {areas.map((area, index) => (
                <li key={index} className="badge badge-outline badge-lg gap-1.5">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {area.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="aspect-4/3 w-full overflow-hidden rounded-box border border-base-300">
          <iframe
            title={`Map of areas served near ${business?.addressLocality || 'Richmond, VA'}`}
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  )
}
