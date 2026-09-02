import React from 'react'
import { Check } from 'lucide-react'

import type { Location } from '@/payload-types'

import { LeadCaptureCard } from '@/components/LeadCaptureCard'
import { LeadModalTrigger } from '@/components/LeadModalTrigger'
import { LocalBusinessJsonLd } from '@/components/LocalBusinessJsonLd'
import { HowItWorksBlock } from '@/blocks/HowItWorks/Component'
import { StatRowBlock } from '@/blocks/StatRow/Component'
import { TestimonialsBlock } from '@/blocks/Testimonials/Component'

const howItWorksSteps = [
  {
    title: 'Contact Us!',
    description:
      'Call us or fill out the short form and tell us about your house so we can get started on your offer.',
  },
  {
    title: 'Get Your Offer!',
    description:
      'After reviewing your house, we’ll make you an as-is fast cash offer — usually within 24 hours.',
  },
  { title: 'Get Your Cash!', description: 'Choose the day you want to close and sell, and pick up your cash from us.' },
]

const statItems = [
  { value: 'Offer In 24 Hours', description: 'Get a cash offer within a day of contacting us.' },
  { value: 'Close In 7 Days', description: 'Or on whatever timeline works best for you.' },
  { value: 'Pay No Fees', description: 'No commissions, no closing costs, no hidden fees.' },
]

const sharedTestimonials = [
  {
    quote:
      'I inherited a house I didn’t want to deal with. They made a fair offer and closed in two weeks — no repairs, no hassle.',
    authorName: 'Denise M.',
    authorLocation: 'Church Hill, Richmond VA',
    rating: 5,
  },
  {
    quote:
      'Facing foreclosure was terrifying. They walked me through my options and got me a cash offer before the sale date.',
    authorName: 'Marcus T.',
    authorLocation: 'Southside, Richmond VA',
    rating: 5,
  },
  {
    quote: 'No showings, no agent, no waiting around. Sold my rental property in under three weeks.',
    authorName: 'Priya S.',
    authorLocation: 'Henrico County, VA',
    rating: 5,
  },
]

export const LocationTemplate: React.FC<{ location: Location; phone?: string | null }> = ({
  location,
  phone,
}) => {
  const {
    cityName,
    stateAbbr,
    heroHeadline,
    heroIntro,
    form,
    sellHeading,
    sellBody,
    sellReasons,
    trustHeading,
    trustBody,
    checklistGroups,
    closingHeading,
    closingBody,
    localSeo,
  } = location

  const formDoc = typeof form === 'object' ? form : null
  const mapQuery = encodeURIComponent(`${cityName}, ${stateAbbr}`)
  const telHref = phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : undefined

  return (
    <article className="pt-16 pb-24">
      {localSeo?.enableLocalBusinessSchema && (
        <LocalBusinessJsonLd
          areaServedOverride={(localSeo.schemaAreaServed || [])
            .map((a) => a.name)
            .filter((n): n is string => Boolean(n))}
        />
      )}

      {/* Hero */}
      <div className="hero -mt-16 bg-neutral text-neutral-content">
        <div className="hero-content w-full max-w-6xl flex-col gap-10 py-12 md:py-20 lg:flex-row-reverse lg:items-center lg:gap-16">
          <div className="w-full shrink-0 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:delay-150 motion-safe:duration-700 motion-safe:fill-mode-both lg:w-auto">
            <LeadCaptureCard formID={formDoc?.id} />
          </div>
          <div className="min-w-0 flex-1 text-center motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 motion-safe:fill-mode-both lg:text-left">
            <span className="badge badge-lg badge-soft mb-5 font-bold tracking-wide uppercase">
              {cityName}
            </span>
            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">{heroHeadline}</h1>
            <p className="mt-4 text-lg opacity-90 md:text-xl">{heroIntro}</p>
          </div>
        </div>
      </div>

      {/* Sell as-is */}
      <div className="container my-16">
        <div className="grid items-start gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <span className="badge badge-soft badge-lg mb-3 font-bold tracking-wide uppercase">
              Cash For Your House
            </span>
            <h2 className="text-3xl font-bold md:text-4xl">{sellHeading}</h2>
            <p className="mt-4 text-lg text-base-content/80">{sellBody}</p>
            {(sellReasons || []).length > 0 && (
              <ul className="mt-6 space-y-2">
                {sellReasons?.map((reason, i) => (
                  <li key={i} className="flex items-center gap-2 text-lg">
                    <Check className="size-5 shrink-0 text-success" aria-hidden="true" />
                    {reason.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="card w-full max-w-md shrink-0 border border-base-300 bg-base-200">
            <div className="card-body items-center text-center">
              <h3 className="card-title text-2xl">Ready to sell your {cityName} house?</h3>
              <p className="text-base-content/80">
                Get your free, no-obligation cash offer in minutes — just tell us a bit about your
                property.
              </p>
              <LeadModalTrigger className="btn btn-primary btn-lg mt-2 w-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100">
                Get My Fair Cash Offer
              </LeadModalTrigger>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="my-16">
        <HowItWorksBlock
          blockType="howItWorks"
          eyebrow="Sell Your House Fast With"
          heading={`3 Easy Steps In ${cityName}, ${stateAbbr}`}
          steps={howItWorksSteps}
        />
      </div>

      {/* Stat row */}
      <div className="my-16">
        <StatRowBlock blockType="statRow" items={statItems} />
      </div>

      <div className="container my-16 text-center">
        <LeadModalTrigger className="btn btn-primary btn-lg transition-transform duration-200 hover:scale-[1.02] active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100">Get A Fair Cash Offer</LeadModalTrigger>
      </div>

      {/* Local trust + map */}
      <div className="container my-16">
        <div className="grid items-start gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <span className="badge badge-soft badge-lg mb-3 font-bold tracking-wide uppercase">
              Sell Your House In Any Condition
            </span>
            <h2 className="text-3xl font-bold md:text-4xl">{trustHeading}</h2>
            <p className="mt-4 text-lg text-base-content/80">{trustBody}</p>
          </div>
          <div className="aspect-4/3 w-full overflow-hidden rounded-box border border-base-300">
            <iframe
              title={`Map of ${cityName}, ${stateAbbr}`}
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {(checklistGroups || []).length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {checklistGroups?.map((group, i) => (
              <div
                key={i}
                className="card border border-base-300 bg-base-100 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <div className="card-body">
                  <h3 className="card-title text-lg">{group.heading}</h3>
                  <ul className="mt-2 space-y-1.5">
                    {(group.items || []).map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-base-content/80">
                        <Check className="mt-1 size-4 shrink-0 text-success" aria-hidden="true" />
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <LeadModalTrigger className="btn btn-primary btn-lg transition-transform duration-200 hover:scale-[1.02] active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100">Get A Fair Cash Offer</LeadModalTrigger>
        </div>
      </div>

      {/* Testimonials */}
      <div className="my-16">
        <TestimonialsBlock
          blockType="testimonials"
          heading="What Our Clients Say"
          items={sharedTestimonials}
        />
      </div>

      {/* Closing */}
      <div className="bg-neutral text-neutral-content">
        <div className="container py-16 text-center">
          <span className="badge badge-soft badge-lg mb-3 font-bold tracking-wide uppercase">
            {cityName}, {stateAbbr}
          </span>
          <h2 className="text-3xl font-bold md:text-4xl">{closingHeading}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">{closingBody}</p>
          {telHref && phone && (
            <p className="mt-2 text-lg opacity-90">
              Call or text us at{' '}
              <a className="link font-semibold" href={telHref}>
                {phone}
              </a>
            </p>
          )}
          <LeadModalTrigger className="btn btn-primary btn-lg mt-6 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100">
            Get A Fair Cash Offer
          </LeadModalTrigger>
        </div>
      </div>
    </article>
  )
}
