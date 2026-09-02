import React from 'react'

import type { TestimonialsBlock as TestimonialsBlockProps } from '@/payload-types'

import { ScrollReveal } from '@/components/ScrollReveal'

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

export const TestimonialsBlock: React.FC<TestimonialsBlockProps> = ({ heading, items }) => {
  return (
    <div className="container scroll-mt-24" id="reviews">
      {heading && (
        <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl">{heading}</h2>
      )}
      <ScrollReveal>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(items || []).map((item, index) => {
            const rating = item.rating ?? 5

            return (
              <div
                key={index}
                className="card border border-base-300 bg-base-100 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <div className="card-body">
                  <div className="rating rating-sm mb-3" aria-label={`${rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <div
                        key={starIndex}
                        className="mask mask-star bg-warning"
                        aria-label={`${starIndex + 1} star`}
                        aria-current={starIndex === rating - 1}
                      />
                    ))}
                  </div>
                  <p className="text-base-content">&ldquo;{item.quote}&rdquo;</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="avatar avatar-placeholder">
                      <div className="w-10 rounded-full bg-primary text-primary-content">
                        <span className="text-sm font-bold">{initials(item.authorName)}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{item.authorName}</p>
                      {item.authorLocation && (
                        <p className="text-sm text-base-content/70">{item.authorLocation}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollReveal>
    </div>
  )
}
