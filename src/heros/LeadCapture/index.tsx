'use client'

import React from 'react'
import { ShieldCheck } from 'lucide-react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import { LeadCaptureCard } from '@/components/LeadCaptureCard'

type LeadCaptureHeroType = Page['hero']

export const LeadCaptureHero: React.FC<LeadCaptureHeroType> = ({ richText, badgeText, form }) => {
  const formDoc = typeof form === 'object' ? form : null

  return (
    <div className="hero -mt-16 bg-neutral text-neutral-content">
      <div className="hero-content w-full max-w-6xl flex-col gap-10 py-12 md:py-20 lg:flex-row-reverse lg:items-center lg:gap-16">
        <div className="w-full shrink-0 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:delay-150 motion-safe:duration-700 motion-safe:fill-mode-both lg:w-auto">
          <LeadCaptureCard formID={formDoc?.id} />
        </div>

        <div className="min-w-0 flex-1 text-center motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 motion-safe:fill-mode-both lg:text-left">
          {badgeText && (
            <div className="badge badge-lg badge-soft mb-5 gap-2 py-4">
              <ShieldCheck className="size-4" aria-hidden="true" />
              {badgeText}
            </div>
          )}
          {richText && (
            <RichText
              className="[&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:leading-tight md:[&_h1]:text-6xl [&_p]:mt-4 [&_p]:text-lg [&_p]:opacity-90 md:[&_p]:text-xl"
              data={richText}
              enableGutter={false}
              enableProse={false}
            />
          )}
        </div>
      </div>
    </div>
  )
}
