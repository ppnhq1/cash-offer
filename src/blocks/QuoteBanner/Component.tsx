import React from 'react'

import type { QuoteBannerBlock as QuoteBannerBlockProps } from '@/payload-types'

const colorwayClasses: Record<string, string> = {
  accent: 'bg-accent text-accent-content',
  neutral: 'bg-neutral text-neutral-content',
  primary: 'bg-primary text-primary-content',
  secondary: 'bg-secondary text-secondary-content',
}

export const QuoteBannerBlock: React.FC<QuoteBannerBlockProps> = ({
  quote,
  authorName,
  rating,
  colorway,
}) => {
  const stars = rating ?? 5

  return (
    <div className={colorwayClasses[colorway || 'primary']}>
      <div className="container py-12 text-center">
        <div className="rating rating-md mb-4" aria-label={`${stars} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, starIndex) => (
            <div
              key={starIndex}
              className="mask mask-star bg-current"
              aria-label={`${starIndex + 1} star`}
              aria-current={starIndex === stars - 1}
            />
          ))}
        </div>
        <p className="mx-auto max-w-3xl text-xl font-medium md:text-2xl">&ldquo;{quote}&rdquo;</p>
        <p className="mt-4 text-base font-semibold opacity-80">— {authorName}</p>
      </div>
    </div>
  )
}
