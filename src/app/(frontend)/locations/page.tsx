import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { MapPin, MoveRight } from 'lucide-react'
import React from 'react'

import { getCachedGlobal } from '@/utilities/getGlobals'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export default async function LocationsHubPage() {
  const payload = await getPayload({ config: configPromise })

  const [{ docs: locations }, business] = await Promise.all([
    payload.find({
      collection: 'locations',
      draft: false,
      overrideAccess: false,
      pagination: false,
      sort: 'cityName',
      select: { cityName: true, stateAbbr: true, slug: true, heroIntro: true },
    }),
    getCachedGlobal('business', 0)(),
  ])

  return (
    <article className="pt-16 pb-24">
      <div className="hero -mt-16 bg-neutral text-neutral-content">
        <div className="hero-content w-full max-w-4xl flex-col py-12 text-center motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 md:py-20">
          <span className="badge badge-lg badge-soft mb-5 font-bold tracking-wide uppercase">
            Where We Buy Houses
          </span>
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            We Buy Houses Across {business?.addressRegion === 'VA' ? 'Virginia' : business?.addressRegion}
          </h1>
          <p className="mt-4 text-lg opacity-90 md:text-xl">
            {business?.businessName || 'We'} buys houses for cash throughout{' '}
            {business?.addressLocality} and the surrounding area. Find your city below, or call us
            directly if you don’t see it listed — we’re likely still able to help.
          </p>
        </div>
      </div>

      <div className="container my-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {locations.length === 0 && (
            <p className="text-lg text-base-content/70">
              No locations published yet — add one in the admin under &ldquo;Locations&rdquo;.
            </p>
          )}
          {locations.map((location) => (
            <Link
              key={location.id}
              href={`/locations/${location.slug}`}
              className="group card border border-base-300 bg-base-100 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <div className="card-body">
                <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                  <MapPin className="size-5" aria-hidden="true" />
                </div>
                <h2 className="card-title text-lg">
                  {location.cityName}, {location.stateAbbr}
                </h2>
                {location.heroIntro && (
                  <p className="line-clamp-2 text-base-content/70">{location.heroIntro}</p>
                )}
                <span className="mt-1 flex items-center gap-1 text-sm font-semibold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:opacity-100">
                  View details
                  <MoveRight className="size-4" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </article>
  )
}

export const metadata: Metadata = {
  title: 'Where We Buy Houses | RVA Cash Home Buyers',
  description: 'See every city and area we buy houses for cash in.',
  openGraph: mergeOpenGraph({
    title: 'Where We Buy Houses | RVA Cash Home Buyers',
    description: 'See every city and area we buy houses for cash in.',
  }),
}
