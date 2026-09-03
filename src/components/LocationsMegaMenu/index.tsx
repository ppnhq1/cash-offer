import React from 'react'
import Link from 'next/link'
import { ChevronDown, MapPin, MoveRight } from 'lucide-react'

import type { LocationNavItem } from '@/utilities/getLocationsNav'

type Props = {
  label: string
  locations: LocationNavItem[]
  instanceId: 'desktop' | 'drawer'
}

const MegaMenuPanel: React.FC<{ locations: LocationNavItem[] }> = ({ locations }) => (
  <div className="card-body">
    <p className="text-sm font-bold tracking-wide text-base-content/60 uppercase">
      Where We Buy Houses
    </p>
    <ul className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
      {locations.map((location) => (
        <li key={location.slug}>
          <Link
            href={`/locations/${location.slug}`}
            className="flex items-center gap-2 rounded-field px-2 py-2 text-base font-semibold text-base-content hover:bg-base-200"
          >
            <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
            {location.cityName}, {location.stateAbbr}
          </Link>
        </li>
      ))}
    </ul>
    <div className="mt-2 border-t border-base-200 pt-3">
      <Link
        href="/locations"
        className="link link-hover flex items-center gap-1.5 font-semibold text-primary"
      >
        View All Locations
        <MoveRight className="size-4" aria-hidden="true" />
      </Link>
    </div>
  </div>
)

export const LocationsMegaMenu: React.FC<Props> = ({ label, locations, instanceId }) => {
  if (locations.length === 0) {
    const fallbackLink = (
      <Link
        href="/locations"
        className="flex items-center gap-1 text-base font-semibold text-base-content no-underline hover:underline"
      >
        {label}
      </Link>
    )
    return instanceId === 'drawer' ? <li>{fallbackLink}</li> : fallbackLink
  }

  if (instanceId === 'drawer') {
    return (
      <li>
        <details>
          <summary className="text-base font-semibold">{label}</summary>
          <ul>
            {locations.map((location) => (
              <li key={location.slug}>
                <Link href={`/locations/${location.slug}`} className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  {location.cityName}, {location.stateAbbr}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/locations"
                className="flex items-center gap-1.5 font-semibold text-primary"
              >
                View All Locations
                <MoveRight className="size-4" aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </details>
      </li>
    )
  }

  return (
    <>
      <button
        type="button"
        className="flex items-center gap-1 text-base font-semibold text-base-content no-underline hover:underline [anchor-name:--locations-megamenu-desktop]"
        popoverTarget="locations-megamenu-desktop"
      >
        {label}
        <ChevronDown className="size-4" aria-hidden="true" />
      </button>

      <div
        className="dropdown dropdown-center card card-sm z-30 mt-3 w-[min(90vw,44rem)] bg-base-100 shadow-xl [position-anchor:--locations-megamenu-desktop]"
        popover="auto"
        id="locations-megamenu-desktop"
      >
        <MegaMenuPanel locations={locations} />
      </div>
    </>
  )
}
