import React from 'react'
import Link from 'next/link'

import type { SplitContentBlock as SplitContentBlockProps } from '@/payload-types'

import { GeometricComposition } from '@/components/GeometricComposition'
import { LeadModalTrigger } from '@/components/LeadModalTrigger'
import { LEAD_MODAL_URL } from '@/utilities/leadCaptureModal'

export const SplitContentBlock: React.FC<SplitContentBlockProps> = ({
  eyebrow,
  heading,
  body,
  linkLabel,
  linkUrl,
  imagePosition,
}) => {
  const imageOnLeft = imagePosition === 'left'

  const textColClass = imageOnLeft ? 'md:order-2' : 'md:order-1'
  const imageColClass = imageOnLeft
    ? 'md:order-1 flex justify-center'
    : 'md:order-2 flex justify-center'

  return (
    <div className="container">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className={textColClass}>
          {eyebrow && (
            <span className="badge badge-soft badge-secondary badge-lg mb-3 font-bold tracking-wide uppercase">
              {eyebrow}
            </span>
          )}
          <h2 className="text-3xl font-bold md:text-4xl">{heading}</h2>
          <p className="mt-4 text-lg text-base-content/80">{body}</p>
          {linkLabel && linkUrl && linkUrl === LEAD_MODAL_URL && (
            <LeadModalTrigger className="btn btn-primary btn-lg mt-6 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100">{linkLabel}</LeadModalTrigger>
          )}
          {linkLabel && linkUrl && linkUrl !== LEAD_MODAL_URL && (
            <Link className="btn btn-primary btn-lg mt-6 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100" href={linkUrl}>
              {linkLabel}
            </Link>
          )}
        </div>
        <div className={imageColClass}>
          <GeometricComposition />
        </div>
      </div>
    </div>
  )
}
