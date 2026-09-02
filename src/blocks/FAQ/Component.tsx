import React from 'react'

import type { FAQBlock as FAQBlockProps } from '@/payload-types'

export const FAQBlock: React.FC<FAQBlockProps> = ({ heading, items }) => {
  const faqItems = items || []
  const groupName = `faq-${heading?.replace(/\s+/g, '-').toLowerCase() || 'group'}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <div className="container">
      {heading && (
        <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">{heading}</h2>
      )}
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="collapse-plus collapse border border-base-300 bg-base-100 transition-colors duration-300 has-[:checked]:border-primary/40"
          >
            <input type="radio" name={groupName} aria-label={item.question} />
            <div className="collapse-title text-lg font-semibold">{item.question}</div>
            <div className="collapse-content text-base-content/80">
              <p className="whitespace-pre-line">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
      {faqItems.length > 0 && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
      )}
    </div>
  )
}
