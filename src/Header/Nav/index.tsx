'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'
import type { LocationNavItem } from '@/utilities/getLocationsNav'

import { CMSLink } from '@/components/Link'
import { LocationsMegaMenu } from '@/components/LocationsMegaMenu'
import { cn } from '@/utilities/ui'

export const HeaderNav: React.FC<{
  className?: string
  data: HeaderType
  locations: LocationNavItem[]
  instanceId: 'desktop' | 'drawer'
}> = ({ className, data, locations, instanceId }) => {
  const navItems = data?.navItems || []

  if (navItems.length === 0) return null

  if (instanceId === 'drawer') {
    return (
      <ul className={cn('menu w-full', className)}>
        {navItems.map(({ link }, i) => {
          if (link.type === 'custom' && link.url === '/locations') {
            return (
              <LocationsMegaMenu
                key={i}
                label={link.label || 'Areas We Buy In'}
                locations={locations}
                instanceId="drawer"
              />
            )
          }

          return (
            <li key={i}>
              <CMSLink
                {...link}
                appearance="link"
                className="w-full justify-start text-base font-semibold"
              />
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <nav className={cn('flex items-center gap-6', className)}>
      {navItems.map(({ link }, i) => {
        if (link.type === 'custom' && link.url === '/locations') {
          return (
            <LocationsMegaMenu
              key={i}
              label={link.label || 'Areas We Buy In'}
              locations={locations}
              instanceId="desktop"
            />
          )
        }

        return (
          <CMSLink
            key={i}
            {...link}
            appearance="link"
            className="text-base font-semibold text-base-content no-underline hover:underline"
          />
        )
      })}
    </nav>
  )
}
