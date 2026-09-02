import React from 'react'

import type { StatRowBlock as StatRowBlockProps } from '@/payload-types'

import { ScrollReveal } from '@/components/ScrollReveal'

export const StatRowBlock: React.FC<StatRowBlockProps> = ({ items }) => {
  return (
    <div className="container">
      <ScrollReveal>
        <div className="stats stats-vertical w-full border border-base-300 shadow-sm sm:stats-horizontal">
          {(items || []).map((item, index) => (
            <div
              key={index}
              className="stat place-items-center text-center transition-colors duration-300 hover:bg-base-200/60"
            >
              <div className="stat-value text-2xl text-primary md:text-3xl">{item.value}</div>
              {item.description && (
                <div className="stat-desc mt-1 max-w-2xs text-base whitespace-normal">
                  {item.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  )
}
