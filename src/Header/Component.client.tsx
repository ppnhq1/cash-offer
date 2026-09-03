'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Phone } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'
import type { LocationNavItem } from '@/utilities/getLocationsNav'

import { Logo } from '@/components/Logo/Logo'
import { LeadModalTrigger } from '@/components/LeadModalTrigger'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
  phone?: string | null
  businessName?: string | null
  locations: LocationNavItem[]
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, phone, businessName, locations }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  const telHref = phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : undefined

  return (
    <header
      className="sticky top-0 z-20 bg-base-100 shadow-sm"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="hidden bg-neutral text-neutral-content lg:block">
        <div className="container mx-auto flex items-center justify-end gap-6 px-4 py-1.5 text-sm">
          {telHref && (
            <a className="link link-hover flex items-center gap-1.5 font-semibold" href={telHref}>
              <Phone className="size-3.5" aria-hidden="true" />
              Call Us {phone}
            </a>
          )}
          <LeadModalTrigger className="link link-hover font-semibold">
            Contact Us
          </LeadModalTrigger>
        </div>
      </div>

      <div className="container mx-auto flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-3">
          <Link className="text-base-content shrink-0" href="/">
            <Logo businessName={businessName} loading="eager" priority="high" />
          </Link>

          {telHref && (
            <a
              className="btn btn-ghost btn-lg shrink-0 gap-2 px-2 text-base font-bold sm:px-4 lg:hidden"
              href={telHref}
            >
              <Phone className="size-5 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">{phone}</span>
            </a>
          )}
        </div>

        <div className="hidden lg:flex">
          <HeaderNav data={data} locations={locations} instanceId="desktop" />
        </div>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          {telHref && (
            <a className="btn btn-ghost btn-lg gap-2 px-2 text-base font-bold sm:px-4" href={telHref}>
              <Phone className="size-5 shrink-0" aria-hidden="true" />
              <span>{phone}</span>
            </a>
          )}
          <LeadModalTrigger className="btn btn-primary btn-lg transition-transform duration-200 hover:scale-[1.02] active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100">
            Sell My House Fast
          </LeadModalTrigger>
        </div>

        <LeadModalTrigger className="btn btn-primary btn-lg w-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100 lg:hidden">
          Sell My House Fast
        </LeadModalTrigger>
      </div>

      <div className="lg:hidden">
        <HeaderNav
          className="menu menu-horizontal w-full justify-center gap-2 border-t border-base-200 py-2"
          data={data}
          locations={locations}
          instanceId="mobile"
        />
      </div>
    </header>
  )
}
