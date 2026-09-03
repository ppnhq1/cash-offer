import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getCachedLocationsNav } from '@/utilities/getLocationsNav'
import React from 'react'

export async function Header() {
  const headerData = await getCachedGlobal('header', 1)()
  const business = await getCachedGlobal('business', 0)()
  const locations = await getCachedLocationsNav()()

  return (
    <HeaderClient
      data={headerData}
      phone={business?.telephone}
      businessName={business?.businessName}
      locations={locations}
    />
  )
}
