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
  instanceId: 'desktop' | 'mobile'
}> = ({ className, data, locations, instanceId }) => {
  const navItems = data?.navItems || []

  if (navItems.length === 0) return null

  return (
    <nav className={cn('flex items-center gap-6', className)}>
      {navItems.map(({ link }, i) => {
        if (link.type === 'custom' && link.url === '/locations') {
          return (
            <LocationsMegaMenu
              key={i}
              label={link.label || 'Areas We Buy In'}
              locations={locations}
              instanceId={instanceId}
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
