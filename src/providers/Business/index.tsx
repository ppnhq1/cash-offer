'use client'

import React, { createContext, use } from 'react'

export interface BusinessContextType {
  businessName: string
}

const initialContext: BusinessContextType = {
  businessName: 'RVA Cash Home Buyers',
}

const BusinessContext = createContext(initialContext)

/**
 * Makes the Business global's name available to client components without
 * threading it as a prop through every intermediate layer — LeadCaptureCard
 * in particular renders at three different nesting depths (hero, location
 * template, global modal), and this is the one place its data comes from.
 */
export const BusinessProvider = ({
  businessName,
  children,
}: {
  businessName?: string | null
  children: React.ReactNode
}) => {
  return (
    <BusinessContext value={{ businessName: businessName || initialContext.businessName }}>
      {children}
    </BusinessContext>
  )
}

export const useBusiness = (): BusinessContextType => use(BusinessContext)
