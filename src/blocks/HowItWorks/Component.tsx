import React from 'react'
import { ChevronRight } from 'lucide-react'

import type { HowItWorksBlock as HowItWorksBlockProps } from '@/payload-types'

const TimelineLayout: React.FC<{ steps: NonNullable<HowItWorksBlockProps['steps']> }> = ({
  steps,
}) => (
  <ul className="timeline timeline-vertical timeline-snap-icon max-md:timeline-compact lg:timeline-horizontal">
    {steps.map((step, index) => {
      const isFirst = index === 0
      const isLast = index === steps.length - 1
      const contentSide = index % 2 === 0 ? 'start' : 'end'

      const content = (
        <div
          className={
            contentSide === 'start'
              ? 'mb-10 md:mb-0 md:text-end lg:mb-10'
              : 'md:mb-0 lg:mb-10'
          }
        >
          <div className="text-lg font-bold">{step.title}</div>
          <p className="mt-1 text-base-content/80">{step.description}</p>
        </div>
      )

      return (
        <li key={index}>
          {!isFirst && <hr className="bg-base-300" />}
          {contentSide === 'start' && <div className="timeline-start">{content}</div>}
          <div className="timeline-middle">
            <span className="relative flex size-12 items-center justify-center">
              <span
                className="absolute inset-0 rounded-full bg-primary/40 motion-safe:animate-pulse motion-reduce:hidden"
                aria-hidden="true"
              />
              <span className="relative flex size-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-content shadow-md">
                {index + 1}
              </span>
            </span>
          </div>
          {contentSide === 'end' && <div className="timeline-end">{content}</div>}
          {!isLast && <hr className="bg-base-300" />}
        </li>
      )
    })}
  </ul>
)

const NumberedLayout: React.FC<{ steps: NonNullable<HowItWorksBlockProps['steps']> }> = ({
  steps,
}) => (
  <ol className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
    {steps.map((step, index) => (
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
)

export const HowItWorksBlock: React.FC<HowItWorksBlockProps> = ({
  layout,
  eyebrow,
  heading,
  steps,
}) => {
  const items = steps || []
  const isTimeline = layout === 'timeline'

  return (
    <div
      className="container scroll-mt-24"
      {...(isTimeline ? {} : { id: 'how-it-works' })}
    >
      <div className="mx-auto mb-10 max-w-2xl text-center">
        {eyebrow && (
          <span className="badge badge-soft badge-primary badge-lg mb-3 font-bold tracking-wide uppercase">
            {eyebrow}
          </span>
        )}
        <h2 className="text-3xl font-bold md:text-4xl">{heading}</h2>
      </div>

      {isTimeline ? <TimelineLayout steps={items} /> : <NumberedLayout steps={items} />}
    </div>
  )
}
