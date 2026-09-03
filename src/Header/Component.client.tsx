'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Phone, X } from 'lucide-react'
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

const DRAWER_ID = 'mobile-nav-drawer'

export const HeaderClient: React.FC<HeaderClientProps> = ({
  data,
  phone,
  businessName,
  locations,
}) => {
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
    <div className="drawer">
      <input
        id={DRAWER_ID}
        type="checkbox"
        className="drawer-toggle"
        aria-label="Toggle menu"
      />

      <div className="drawer-content">
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

              <div className="flex shrink-0 items-center gap-1 lg:hidden">
                {telHref && (
                  <a
                    className="btn btn-ghost btn-lg gap-2 px-2 text-base font-bold sm:px-4"
                    href={telHref}
                  >
                    <Phone className="size-5 shrink-0" aria-hidden="true" />
                    <span className="hidden sm:inline">{phone}</span>
                  </a>
                )}
                <label
                  htmlFor={DRAWER_ID}
                  aria-label="Open menu"
                  className="btn btn-square btn-ghost btn-lg drawer-button"
                >
                  <Menu className="size-6" aria-hidden="true" />
                </label>
              </div>
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

            <LeadModalTrigger className="btn btn-primary w-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100 lg:hidden">
              Sell My House Fast
            </LeadModalTrigger>
          </div>
        </header>
      </div>

      <div className="drawer-side z-30 lg:hidden">
        <label htmlFor={DRAWER_ID} aria-label="Close menu" className="drawer-overlay" />
        <div className="flex min-h-full w-80 max-w-[85vw] flex-col gap-6 bg-base-100 p-4 text-base-content">
          <div className="flex items-center justify-between">
            <Logo businessName={businessName} />
            <label
              htmlFor={DRAWER_ID}
              aria-label="Close menu"
              className="btn btn-square btn-ghost btn-sm"
            >
              <X className="size-5" aria-hidden="true" />
            </label>
          </div>

          <HeaderNav
            className="w-full flex-1 p-0 text-base"
            data={data}
            locations={locations}
            instanceId="drawer"
          />

          {telHref && (
            <a
              className="btn btn-ghost btn-lg justify-start gap-2 text-base font-bold"
              href={telHref}
            >
              <Phone className="size-5 shrink-0" aria-hidden="true" />
              {phone}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
