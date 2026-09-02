import React from 'react'
import { ChevronRight } from 'lucide-react'

import type { HowItWorksBlock as HowItWorksBlockProps } from '@/payload-types'

export const HowItWorksBlock: React.FC<HowItWorksBlockProps> = ({ eyebrow, heading, steps }) => {
  const items = steps || []

  return (
    <div className="container scroll-mt-24" id="how-it-works">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        {eyebrow && (
          <span className="badge badge-soft badge-primary badge-lg mb-3 font-bold tracking-wide uppercase">
            {eyebrow}
          </span>
        )}
        <h2 className="text-3xl font-bold md:text-4xl">{heading}</h2>
      </div>

      <ol className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {items.map((step, index) => (
          <li key={index} className="group relative flex flex-col items-center text-center">
            {index > 0 && (
              <span
                className="absolute top-8 -left-4 hidden -translate-x-1/2 items-center justify-center rounded-full bg-primary text-primary-content md:flex"
                aria-hidden="true"
              >
                <ChevronRight className="size-5" />
              </span>
            )}
            <span
              className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-content shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <h3 className="text-xl font-bold">{step.title}</h3>
            <p className="mt-2 text-base-content/80">{step.description}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
