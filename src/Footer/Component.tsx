import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import { MapPin, Phone } from 'lucide-react'
import React from 'react'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()
  const business = await getCachedGlobal('business', 0)()

  const navItems = footerData?.navItems || []
  const telHref = business?.telephone ? `tel:${business.telephone.replace(/[^\d+]/g, '')}` : undefined

  return (
    <footer className="mt-auto bg-neutral text-neutral-content">
      <div className="footer sm:footer-horizontal container mx-auto px-4 py-12">
        <aside>
          <Link href="/" className="text-neutral-content">
            <Logo />
          </Link>
          {business?.businessName && (
            <p className="mt-2 max-w-xs text-base opacity-90">
              We buy houses for cash in {business.addressLocality || 'Richmond'},{' '}
              {business.addressRegion || 'VA'} — any condition, no fees, no obligation.
            </p>
          )}
        </aside>

        <nav>
          <h6 className="footer-title opacity-70">Contact Us</h6>
          {telHref && business?.telephone && (
            <a className="link link-hover flex items-center gap-2 text-lg font-bold" href={telHref}>
              <Phone className="size-5" aria-hidden="true" />
              {business.telephone}
            </a>
          )}
          {business?.email && (
            <a className="link link-hover" href={`mailto:${business.email}`}>
              {business.email}
            </a>
          )}
          {business?.streetAddress && (
            <p className="mt-1 flex items-start gap-2 text-sm opacity-90">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                {business.streetAddress}
                <br />
                {business.addressLocality}, {business.addressRegion} {business.postalCode}
              </span>
            </p>
          )}
        </nav>

        {navItems.length > 0 && (
          <nav>
            <h6 className="footer-title opacity-70">Site</h6>
            {navItems.map(({ link }, i) => (
              <CMSLink className="link link-hover" key={i} {...link} />
            ))}
          </nav>
        )}
      </div>

      <div className="footer sm:footer-horizontal footer-center border-t border-neutral-content/10 px-4 py-4 text-sm opacity-70">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between sm:w-full">
          <p>
            &copy; {new Date().getFullYear()} {business?.businessName || 'RVA Cash Home Buyers'}.
            All rights reserved.
          </p>
          <ThemeSelector />
        </div>
      </div>
    </footer>
  )
}
