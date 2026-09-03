/**
 * Seeds real starter content for the Richmond, VA cash-home-buyer site:
 * Business info, header/footer nav, a homepage, one example city landing
 * page, and one blog post — demonstrating the Testimonials/FAQ blocks and
 * LocalBusiness schema wiring end to end.
 *
 * Run with: npm run seed:richmond
 */
import { getPayload } from 'payload'

import configPromise from './payload.config'
import type { IconGridBlock } from './payload-types'

type IconGridItem = NonNullable<IconGridBlock['items']>[number]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LexicalNode = any

type LexicalDoc = {
  root: {
    type: 'root'
    children: LexicalNode[]
    direction: 'ltr'
    format: ''
    indent: 0
    version: 1
  }
}

const textNode = (text: string, extra: Record<string, unknown> = {}) => ({
  type: 'text',
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text,
  version: 1,
  ...extra,
})

const heading = (text: string, tag: 'h1' | 'h2' = 'h1') => ({
  type: 'heading',
  tag,
  children: [textNode(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})

const paragraph = (text: string) => ({
  type: 'paragraph',
  children: [textNode(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})

const richText = (...nodes: LexicalNode[]): LexicalDoc => ({
  root: {
    type: 'root',
    children: nodes,
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})

async function run() {
  const payload = await getPayload({ config: configPromise })

  payload.logger.info('Seeding Richmond cash-home-buyer content...')

  // --- Business info (global) ---
  await payload.updateGlobal({
    slug: 'business',
    data: {
      businessName: 'RVA Cash Home Buyers',
      telephone: '(804) 555-0123',
      email: 'offers@example.com',
      streetAddress: '123 Example St #10',
      addressLocality: 'Richmond',
      addressRegion: 'VA',
      postalCode: '23220',
      priceRange: '$$',
      areaServed: [
        { name: 'Richmond, VA' },
        { name: 'Henrico County, VA' },
        { name: 'Chesterfield County, VA' },
        { name: 'Church Hill, Richmond VA' },
        { name: 'Southside Richmond, VA' },
      ],
      sameAs: [],
    },
    context: { disableRevalidate: true },
  })

  // --- Category for the blog ---
  let category = (
    await payload.find({
      collection: 'categories',
      where: { slug: { equals: 'selling-tips' } },
      limit: 1,
    })
  ).docs[0]

  if (!category) {
    category = await payload.create({
      collection: 'categories',
      data: { title: 'Selling Tips', slug: 'selling-tips' },
    })
  }

  // --- Lead capture form (used by the "Lead Capture" hero) ---
  let leadForm = (
    await payload.find({
      collection: 'forms',
      where: { title: { equals: 'Get Your Cash Offer' } },
      limit: 1,
    })
  ).docs[0]

  const leadFormData = {
    title: 'Get Your Cash Offer',
    submitButtonLabel: 'Get My Fair Cash Offer',
    confirmationType: 'message' as const,
    confirmationMessage: richText(
      paragraph('Thanks! We’ll call you within 24 hours with your cash offer.'),
    ),
    fields: [
      {
        blockType: 'text' as const,
        name: 'address',
        label: 'Property address',
        required: true,
        width: 100,
      },
      {
        blockType: 'text' as const,
        name: 'phone',
        label: 'Phone number',
        required: true,
        width: 100,
      },
      {
        blockType: 'email' as const,
        name: 'email',
        label: 'Email address',
        required: true,
        width: 100,
      },
      {
        blockType: 'checkbox' as const,
        name: 'smsConsent',
        label:
          'I agree to receive text messages from VA Cash Offer regarding my inquiry, including follow-up messages about buying or selling my property. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help. Consent is not a condition of purchase.',
        required: true,
        width: 100,
      },
    ],
  }

  if (leadForm) {
    await payload.update({
      collection: 'forms',
      id: leadForm.id,
      data: leadFormData,
      context: { disableRevalidate: true },
    })
  } else {
    leadForm = await payload.create({
      collection: 'forms',
      data: leadFormData,
      context: { disableRevalidate: true },
    })
  }

  // --- Homepage ---
  const homeFAQItems = [
    {
      question: 'How fast can you buy my house?',
      answer:
        'Most Richmond-area sellers close in as little as 7–14 days after accepting our offer. If you need more time, we can work around your schedule.',
    },
    {
      question: 'Do I need to make repairs before selling?',
      answer:
        'No. We buy houses as-is — including homes that need major repairs, have code violations, fire or water damage, or are mid-renovation.',
    },
    {
      question: 'Are there any fees or commissions?',
      answer:
        'None. There are no agent commissions, no closing costs charged to you, and no hidden fees. The cash offer you accept is what you receive at closing.',
    },
    {
      question: 'What areas around Richmond do you buy in?',
      answer:
        'We buy houses throughout the City of Richmond and surrounding Henrico and Chesterfield Counties, including Church Hill, The Fan, Southside, and Northside.',
    },
    {
      question: 'How do I know if my cash offer is legit?',
      answer:
        'Check that the buyer is a real, established local company with a track record and references — not just a lead-generation site. Read the contract carefully for financing or inspection contingencies, and be wary of anyone who lowballs the offer after first seeing the property.',
    },
    {
      question: 'What are the pros and cons of an all-cash offer?',
      answer:
        'The upside: little risk of the deal falling through, a fast close with no lender or appraisal delays, and no showings or repair negotiations. The tradeoff: a cash offer is usually below full retail market value, since you’re trading some price for speed and certainty.',
    },
    {
      question: 'What is the fastest way to sell a house?',
      answer:
        'Selling directly to a cash buyer is the fastest route — you skip listing, showings, financing contingencies, and appraisal delays that come with a traditional sale.',
    },
    {
      question: 'Are companies that offer cash for houses legit?',
      answer:
        'Many are, but do your homework: check for a real local presence, transparent terms, and verifiable reviews before signing anything.',
    },
  ]

  const homeTestimonials = [
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
    {
      quote:
        'They were upfront about every step and never tried to renegotiate the price after the walkthrough. Closed exactly when they said they would.',
      authorName: 'Carlton R.',
      authorLocation: 'The Fan, Richmond VA',
      rating: 5,
    },
    {
      quote:
        'I was behind on repairs I couldn’t afford, and honestly a little embarrassed to have anyone see the house. They didn’t blink — made a fair offer as-is.',
      authorName: 'Angela W.',
      authorLocation: 'Northside, Richmond VA',
      rating: 5,
    },
    {
      quote:
        'Going through a divorce was hard enough without also dealing with a house neither of us wanted. They made that one part simple.',
      authorName: 'Sam & Kelly D.',
      authorLocation: 'Henrico County, VA',
      rating: 5,
    },
    {
      quote:
        'My dad’s house needed a full gut renovation. Getting a cash offer instead of financing that myself was a huge relief.',
      authorName: 'Reginald P.',
      authorLocation: 'Manchester, Richmond VA',
      rating: 5,
    },
    {
      quote: 'Quick answers, fair number, no pressure to accept. Closed on the date I asked for.',
      authorName: 'Laura B.',
      authorLocation: 'Chesterfield County, VA',
      rating: 5,
    },
  ]

  const whoWeHelpItems: IconGridItem[] = [
    {
      icon: 'Ban',
      title: 'No Realtor Fees',
      description:
        'You won’t pay a listing commission when you sell directly to us. There’s no agent, no percentage cut of your sale price, and no surprise line items at closing.',
    },
    {
      icon: 'Key',
      title: 'No Open Houses',
      description:
        'Skip staging your home and hosting strangers all weekend. You send us the details, we make an offer, and there’s nothing to show.',
    },
    {
      icon: 'ShieldCheck',
      title: 'No Stress',
      description:
        'One phone call replaces months of listing prep, showings, and back-and-forth negotiation. We make it simple from offer to closing.',
    },
  ]

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
    {
      title: 'Get Your Cash!',
      description: 'Choose the day you want to close and sell, and pick up your cash from us.',
    },
  ]

  const situationsItems: IconGridItem[] = [
    { icon: 'AlertTriangle', title: 'Avoiding Foreclosure', description: 'Behind on payments? We can often close before your sale date.' },
    { icon: 'Briefcase', title: 'Job Relocation', description: 'Moving for work and need to sell fast without a long listing process.' },
    { icon: 'Home', title: 'Inherited a House', description: 'Skip the repairs, cleanout, and hassle of an inherited property.' },
    { icon: 'Wrench', title: 'Too Many Repairs', description: 'Sell as-is — we handle any repairs after closing, not you.' },
    { icon: 'HeartCrack', title: 'Going Through a Divorce', description: 'Sell quickly and split proceeds without a drawn-out sale.' },
    { icon: 'UserX', title: 'Tired Landlord', description: 'Done with tenants and maintenance calls? We buy rental property too.' },
    { icon: 'CalendarClock', title: 'Downsizing for Retirement', description: 'Move on your own timeline with a simple, predictable sale.' },
    { icon: 'ShieldAlert', title: 'Bad Neighborhood', description: 'We buy homes as-is, regardless of the surrounding area.' },
    { icon: 'Clock', title: 'Family Emergency', description: 'Need to sell fast for reasons beyond your control? We can move quickly.' },
  ]

  const benefitsItems: IconGridItem[] = [
    { icon: 'Ban', title: 'No Realtor Fees', description: 'No commissions or listing fees — the offer you accept is what you get.' },
    { icon: 'Key', title: 'No Open Houses', description: 'No strangers walking through your home. No staging, no showings.' },
    { icon: 'Wrench', title: 'No Repairs Needed', description: 'Sell exactly as-is. We take care of any repairs after closing.' },
    { icon: 'DollarSign', title: 'No Commissions Or Fees', description: 'What we offer is what you walk away with at closing.' },
    { icon: 'CalendarCheck2', title: 'Close When You Want', description: 'Pick a closing date that fits your schedule, not a buyer’s.' },
    { icon: 'ShieldCheck', title: 'Private, Simple Sale', description: 'No public listing. A straightforward, private transaction.' },
  ]

  const existingHome = (
    await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1 })
  ).docs[0]

  const homeData = {
    title: 'Home',
    slug: 'home',
    _status: 'published' as const,
    hero: {
      type: 'leadCapture' as const,
      badgeText: 'Local Cash Home Buyers Serving Richmond, VA',
      form: leadForm.id,
      richText: richText(
        heading('Sell Your Richmond House Fast — Get a Fair Cash Offer'),
        paragraph(
          'No repairs. No agent fees. No showings. We buy houses as-is throughout Richmond, Henrico, and Chesterfield — on your timeline.',
        ),
      ),
    },
    layout: [
      {
        blockType: 'splitContent' as const,
        eyebrow: 'MAKE YOUR LIFE EASIER',
        heading: 'We Buy Houses in Richmond, VA',
        body: 'Whether you’re in a rush and need cash fast, or you just want a simple, certain sale, we’re local Richmond cash buyers who make it easy. Tell us about your house, get a fair offer within 24 hours, and pick the closing date that works for you — no repairs, no showings, no cleaning required.',
        linkLabel: 'Get My Cash Offer',
        linkUrl: '#lead-modal',
        imagePosition: 'left' as const,
      },
      {
        blockType: 'quoteBanner' as const,
        quote: homeTestimonials[0].quote,
        authorName: `${homeTestimonials[0].authorName} — ${homeTestimonials[0].authorLocation}`,
        rating: homeTestimonials[0].rating,
        colorway: 'primary' as const,
      },
      {
        blockType: 'splitContent' as const,
        eyebrow: 'SELL WITH CONFIDENCE',
        heading: 'One of the Top Cash Home Buyers in Richmond',
        body: 'We’re not a national call center — we’re a local team that buys houses throughout the Richmond area, from Church Hill to Southside to Henrico County. We know the local market, we close on the timeline we promise, and we make the process transparent from your first call to closing day.',
        linkLabel: 'See How It Works',
        linkUrl: '/#how-it-works',
        imagePosition: 'right' as const,
      },
      {
        blockType: 'cta' as const,
        richText: richText(
          heading('Sell Your Richmond House To Cash Buyers, Fast', 'h2'),
          paragraph(
            'Fill out the short form and get a no-obligation cash offer — most sellers hear back within 24 hours.',
          ),
        ),
        links: [
          {
            link: {
              type: 'custom' as const,
              appearance: 'default' as const,
              label: 'Get My Cash Offer',
              url: '#lead-modal',
            },
          },
        ],
      },
      {
        blockType: 'quoteBanner' as const,
        quote: homeTestimonials[1].quote,
        authorName: `${homeTestimonials[1].authorName} — ${homeTestimonials[1].authorLocation}`,
        rating: homeTestimonials[1].rating,
        colorway: 'secondary' as const,
      },
      {
        blockType: 'howItWorks' as const,
        eyebrow: 'OUR SIMPLE PROCESS',
        heading: 'How Do I Sell My House Fast For Cash In Richmond?',
        steps: howItWorksSteps,
      },
      {
        blockType: 'iconGrid' as const,
        eyebrow: 'IN WHICH SITUATIONS?',
        heading: 'We Buy Houses In All Situations',
        columns: '3' as const,
        items: situationsItems,
      },
      {
        blockType: 'quoteBanner' as const,
        quote: homeTestimonials[2].quote,
        authorName: `${homeTestimonials[2].authorName} — ${homeTestimonials[2].authorLocation}`,
        rating: homeTestimonials[2].rating,
        colorway: 'accent' as const,
      },
      {
        blockType: 'iconGrid' as const,
        eyebrow: 'WHO WE HELP',
        heading: 'We Buy Houses For Cash In Richmond, VA',
        columns: '3' as const,
        items: whoWeHelpItems,
      },
      {
        blockType: 'iconGrid' as const,
        layout: 'carousel' as const,
        eyebrow: 'SKIP THE REPAIRS',
        heading: 'Selling Made Simple',
        columns: '3' as const,
        items: benefitsItems,
      },
      {
        blockType: 'splitContent' as const,
        eyebrow: 'FAST SALE, NO REPAIRS',
        heading: 'Cash For My House In Richmond, Virginia',
        body: 'When you sell your house the traditional way, you list on the market, host showings, and wait. Selling directly to us skips all of that: no agent commissions, no repairs, no cleaning — just a fair cash offer and a closing date you pick.',
        linkLabel: 'Get My Cash Offer',
        linkUrl: '#lead-modal',
        imagePosition: 'left' as const,
      },
      {
        blockType: 'testimonials' as const,
        heading: 'What Local Richmond Sellers Say',
        items: homeTestimonials,
      },
      {
        blockType: 'comparisonTable' as const,
        heading: 'Sell Your House In Richmond, VA, Without An Agent',
        subheading:
          'Selling without a real estate agent is easier than you think. See the difference between listing with an agent and selling directly to us.',
        ourColumnLabel: 'Sell To Us',
        agentColumnLabel: 'Sell With An Agent',
        rows: [
          { label: 'Commissions / Fees', ourValue: 'None', agentValue: 'Typically 5–6% on average' },
          { label: 'Who Pays Closing Costs?', ourValue: 'We pay all costs', agentValue: 'You, the seller, typically pay' },
          { label: 'Mortgage Financing', ourValue: 'None — we make cash offers', agentValue: 'Sale often subject to lender approval' },
          { label: 'Appraisal Needed?', ourValue: 'None when you sell to us', agentValue: 'Sale is often subject to appraisal' },
          { label: 'Showings Or Open Houses', ourValue: 'None', agentValue: 'Daily / weekly' },
          { label: 'Closing Date', ourValue: 'On the day of your choice', agentValue: '30–60+ days after accepting an offer' },
          { label: 'Who Pays For Repairs?', ourValue: 'We pay for all repairs', agentValue: 'Typically negotiated before closing' },
        ],
      },
      {
        blockType: 'areaServed' as const,
        eyebrow: 'WHERE DO WE SERVE',
        heading: 'Where We Buy Houses',
        body: 'We buy houses throughout Richmond and the surrounding area. Whether you have tax liens, can’t afford repairs, or just want a fast, stress-free sale, our goal is a straightforward experience for every homeowner we work with.',
      },
      {
        blockType: 'archive' as const,
        populateBy: 'collection' as const,
        relationTo: 'posts' as const,
        limit: 6,
      },
      {
        blockType: 'content' as const,
        columns: [
          {
            size: 'full' as const,
            richText: richText(
              heading('We Love Investing In Richmond', 'h2'),
              paragraph(
                'Richmond is a city rich in history, culture, and opportunity. Nestled along the James River, it offers a mix of Southern charm and forward-thinking growth that makes it one of the most compelling real estate markets in the region.',
              ),
              paragraph(
                'Neighborhoods across the city — from Church Hill and The Fan to Manchester and Northside — are seeing real investment: new businesses, updated infrastructure, and a steady influx of new residents. Every block has a story, and every house has a different path forward, whether that’s a property facing foreclosure, a home that needs extensive repairs, or a family dealing with an unexpected life event.',
              ),
              paragraph(
                'Richmond isn’t just where we do business — it’s where we live and work too. We’re glad to be part of helping local homeowners find a straightforward path forward, one house at a time.',
              ),
            ),
          },
        ],
      },
      {
        blockType: 'faq' as const,
        heading: 'Frequently Asked Questions',
        items: homeFAQItems,
      },
      {
        blockType: 'cta' as const,
        richText: richText(
          paragraph(
            'Tell us about your property and get a no-obligation cash offer — most sellers hear back within 24 hours.',
          ),
        ),
        links: [
          {
            link: {
              type: 'custom' as const,
              appearance: 'default' as const,
              label: 'Get My Cash Offer',
              url: '#lead-modal',
            },
          },
        ],
      },
    ],
    localSeo: {
      enableLocalBusinessSchema: true,
    },
    meta: {
      title: 'Sell My House Fast in Richmond, VA | Fair Cash Offers',
      description:
        'We buy houses for cash in Richmond, VA and surrounding areas — any condition, no repairs, no fees. Get a fair cash offer in 24 hours.',
    },
  }

  const pageWriteOpts = { context: { disableRevalidate: true } } as const

  if (existingHome) {
    await payload.update({
      collection: 'pages',
      id: existingHome.id,
      data: homeData,
      ...pageWriteOpts,
    })
  } else {
    await payload.create({ collection: 'pages', data: homeData, ...pageWriteOpts })
  }

  // --- City landing page: Richmond ---
  const cityFAQItems = [
    {
      question: 'How does the process work if I sell my house fast in Richmond?',
      answer:
        'Request an offer, we visit or review the property, and you get a written cash offer — usually within 24–48 hours. Accept it and pick your closing date.',
    },
    {
      question: 'Do you buy houses in Church Hill and Southside Richmond?',
      answer:
        'Yes. We actively buy homes across Church Hill, Southside, The Fan, Northside, and the rest of the City of Richmond.',
    },
    {
      question: 'What if my house has code violations or fire damage?',
      answer:
        'That’s exactly the kind of property we specialize in. Code violations, fire damage, hoarding situations, and deferred maintenance are all fine.',
    },
  ]

  const cityData = {
    title: 'Sell My House Fast in Richmond, VA',
    slug: 'sell-my-house-fast-richmond-va',
    _status: 'published' as const,
    hero: {
      type: 'leadCapture' as const,
      badgeText: 'We’ve Been Buying Richmond Houses For Years',
      form: leadForm.id,
      richText: richText(
        heading('We Buy Houses in Richmond, VA — Get Your Cash Offer Today'),
        paragraph(
          'Local cash buyers serving Church Hill, The Fan, Southside, Northside, and every Richmond neighborhood in between.',
        ),
      ),
    },
    layout: [
      {
        blockType: 'content' as const,
        columns: [
          {
            size: 'full' as const,
            richText: richText(
              heading('Why Richmond Homeowners Sell to Us', 'h2'),
              paragraph(
                'Richmond’s housing stock skews older — historic homes in Church Hill and the Fan, mid-century houses in Northside, and rental properties across Southside often need more work than a traditional buyer wants to take on. We buy those houses as-is, close on your timeline, and handle the repairs ourselves after closing.',
              ),
              paragraph(
                'Whether you’re dealing with an inherited property, falling behind on payments, facing foreclosure, or just need to sell quickly without listing on the open market, we make a fair, no-obligation cash offer and let you decide.',
              ),
            ),
          },
        ],
      },
      {
        blockType: 'testimonials' as const,
        heading: 'Richmond Sellers Who Worked With Us',
        items: homeTestimonials.slice(0, 2),
      },
      {
        blockType: 'faq' as const,
        heading: 'Richmond Seller FAQs',
        items: cityFAQItems,
      },
      {
        blockType: 'cta' as const,
        richText: richText(paragraph('Ready to see what your Richmond house is worth in cash?')),
        links: [
          {
            link: {
              type: 'custom' as const,
              appearance: 'default' as const,
              label: 'Get My Free Cash Offer',
              url: '#lead-modal',
            },
          },
        ],
      },
    ],
    localSeo: {
      enableLocalBusinessSchema: true,
      schemaAreaServed: [{ name: 'Richmond, VA' }],
    },
    meta: {
      title: 'Sell My House Fast Richmond VA | Cash Home Buyers',
      description:
        'Need to sell your house fast in Richmond, VA? Get a fair, no-obligation cash offer — any condition, no repairs, no fees, close on your timeline.',
    },
  }

  const existingCity = (
    await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'sell-my-house-fast-richmond-va' } },
      limit: 1,
    })
  ).docs[0]

  if (existingCity) {
    await payload.update({
      collection: 'pages',
      id: existingCity.id,
      data: cityData,
      ...pageWriteOpts,
    })
  } else {
    await payload.create({ collection: 'pages', data: cityData, ...pageWriteOpts })
  }

  // --- Dedicated "How It Works" page ---
  const detailedSteps = [
    {
      title: 'Tell Us About Your Property',
      description:
        'Reach out by phone or fill out the short form on this site. We’ll ask a few basic questions about the house and your timeline.',
    },
    {
      title: 'Schedule A Convenient Appointment',
      description:
        'We’ll set up a quick walkthrough — in person or over video — around your schedule. After that, we’ll present a no-obligation, as-is cash offer.',
    },
    {
      title: 'Choose A Closing Date And Sell',
      description:
        'Accept the offer and pick your closing date. We handle the paperwork, cover the closing costs, and you get paid.',
    },
  ]

  const howItWorksStatItems = [
    { value: 'Offer In 24 Hours', description: 'Get a cash offer within a day of contacting us.' },
    { value: 'Close In 7 Days', description: 'Or on whatever timeline works best for you.' },
    { value: 'Pay No Fees', description: 'No commissions, no closing costs, no hidden fees.' },
  ]

  const howItWorksPageData = {
    title: 'How It Works',
    slug: 'how-it-works',
    _status: 'published' as const,
    hero: {
      type: 'leadCapture' as const,
      badgeText: 'How It Works',
      form: leadForm.id,
      richText: richText(
        heading('How To Sell Your House Fast For Cash In Richmond'),
        paragraph(
          'From your first call to cash in hand, here’s exactly what to expect when you sell your Richmond house to us.',
        ),
      ),
    },
    layout: [
      {
        blockType: 'content' as const,
        columns: [
          {
            size: 'full' as const,
            richText: richText(
              heading('How It Works With RVA Cash Home Buyers', 'h2'),
              paragraph(
                'We make selling your home simple and stress-free. We take care of costly repairs, you skip traditional agent fees, and the whole process works on your schedule. Get started by filling out the form above or calling us directly so we can understand your situation and timeline.',
              ),
            ),
          },
        ],
      },
      {
        blockType: 'howItWorks' as const,
        eyebrow: 'OUR SIMPLE PROCESS',
        heading: 'How It Works, Step By Step',
        steps: howItWorksSteps,
      },
      {
        blockType: 'content' as const,
        columns: [
          {
            size: 'full' as const,
            richText: richText(
              paragraph(
                'Timeframe: after we receive your details, we’ll present a fair, all-cash offer within 24 hours. From there, we can close in as little as seven days — or whenever works best for you. Take the time to ask questions and gather what you need; we’ll walk you through the process from start to finish so you can make a confident, informed choice.',
              ),
            ),
          },
        ],
      },
      {
        blockType: 'statRow' as const,
        items: howItWorksStatItems,
      },
      {
        blockType: 'content' as const,
        columns: [
          {
            size: 'full' as const,
            richText: richText(
              heading('How We Determine Your Cash Offer', 'h2'),
              paragraph(
                'Our offers are based on your home’s after-repair value (ARV) — what it would be worth fully fixed up — minus the cost of repairs and our margin for taking on that work and risk. We review recent comparable sales in your neighborhood, factor in the property’s condition, and walk you through exactly how we arrived at the number. No lowball guesses, no pressure to accept.',
              ),
            ),
          },
        ],
      },
      {
        blockType: 'howItWorks' as const,
        layout: 'timeline' as const,
        eyebrow: 'IN DETAIL',
        heading: 'How The Process Works In Detail',
        steps: detailedSteps,
      },
      {
        blockType: 'iconGrid' as const,
        eyebrow: 'IN WHICH SITUATIONS?',
        heading: 'We Buy Houses In All Situations',
        columns: '3' as const,
        items: situationsItems,
      },
      {
        blockType: 'testimonials' as const,
        heading: 'What Local Richmond Sellers Say',
        items: homeTestimonials.slice(0, 3),
      },
      {
        blockType: 'faq' as const,
        heading: 'How It Works: Frequently Asked Questions',
        items: homeFAQItems,
      },
      {
        blockType: 'cta' as const,
        richText: richText(
          heading('Ready To See Your Offer?', 'h2'),
          paragraph('Fill out the form above and we’ll be in touch within 24 hours.'),
        ),
        links: [
          {
            link: {
              type: 'custom' as const,
              appearance: 'default' as const,
              label: 'Get My Cash Offer',
              url: '#lead-modal',
            },
          },
        ],
      },
    ],
    localSeo: {
      enableLocalBusinessSchema: true,
    },
    meta: {
      title: 'How It Works | Sell Your House Fast For Cash In Richmond, VA',
      description:
        'See exactly how selling your Richmond house for cash works, from your first call to closing day — no repairs, no fees, no obligation.',
    },
  }

  const existingHowItWorksPage = (
    await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'how-it-works' } },
      limit: 1,
    })
  ).docs[0]

  if (existingHowItWorksPage) {
    await payload.update({
      collection: 'pages',
      id: existingHowItWorksPage.id,
      data: howItWorksPageData,
      ...pageWriteOpts,
    })
  } else {
    await payload.create({ collection: 'pages', data: howItWorksPageData, ...pageWriteOpts })
  }

  // --- Example location pages (the reusable per-city template) ---
  const sharedChecklistGroups = [
    {
      heading: 'Sell Your House For Any Reason',
      items: [
        { text: 'Want a quick sale' },
        { text: 'Want to sell an inherited property' },
        { text: 'Major repairs needed' },
        { text: 'Nasty tenants or squatters' },
        { text: 'Storm, fire, or mold damage' },
      ],
    },
    {
      heading: 'Sell Your House In Any Condition',
      items: [
        { text: 'Full of clutter — can’t clean it out' },
        { text: 'Hoarder home' },
        { text: 'Unfinished construction' },
        { text: 'Condemned property' },
        { text: 'Fire damaged home' },
      ],
    },
    {
      heading: 'Sell Your House Facing Any Challenge',
      items: [
        { text: 'Inherited a property you don’t want' },
        { text: 'Behind on payments / foreclosure' },
        { text: 'Unpaid taxes or code violations' },
        { text: 'Need to move to assisted living' },
        { text: 'Divorce or bankruptcy' },
      ],
    },
  ]

  const locationsData = [
    {
      cityName: 'Hopewell',
      stateAbbr: 'VA',
      heroHeadline: 'We Buy Houses for Cash in the City of Hopewell, VA',
      heroIntro:
        'Hopewell sits at the confluence of the James and Appomattox Rivers and is home to the Hopewell Historic District. Whether your house needs work or you just want a fast, simple sale, we make cash offers on Hopewell homes as-is.',
      form: leadForm.id,
      sellHeading: 'Sell Your Hopewell House in As-Is Condition',
      sellBody:
        'With us, you can sell in as-is condition while enjoying a quick closing process. Let us handle the hard part so you can focus on what’s next, whether you’re selling because of:',
      sellReasons: [
        { text: 'Inherited property' },
        { text: 'Divorce' },
        { text: 'Job relocation' },
        { text: 'Financial stress' },
      ],
      trustHeading: 'Local Cash Homebuyers You Can Trust',
      trustBody:
        'In serving the Hopewell area, our trusted team believes in hassle-free sales based on transparency and professionalism. We’re not appraising to try to lowball you or pad our profit — we’re direct buyers. That means no showings, appraisals, or lender approvals, and no waiting around while costs or commissions pile up.',
      checklistGroups: sharedChecklistGroups,
      closingHeading: 'Get A Fast And Fair Cash Offer On Your House In Hopewell, Virginia',
      closingBody:
        'If you’re ready to move on from a property in Hopewell, VA, we do it fast. Contact us today or fill out our online form to get your free, no-obligation offer.',
      localSeo: { enableLocalBusinessSchema: true, schemaAreaServed: [{ name: 'Hopewell, VA' }] },
      meta: {
        title: 'We Buy Houses for Cash in Hopewell, VA',
        description:
          'Sell your Hopewell, VA house fast for cash — any condition, no repairs, no fees, no obligation.',
      },
    },
    {
      cityName: 'Glen Allen',
      stateAbbr: 'VA',
      heroHeadline: 'We Buy Houses for Cash in Glen Allen, VA',
      heroIntro:
        'There’s an easier way to sell real estate in Glen Allen, VA, that avoids the expense and stress of repairs, inspections, and the traditional realtor-driven listing process. We buy houses for cash in Glen Allen, regardless of their condition.',
      form: leadForm.id,
      sellHeading: 'The Easiest Way to Sell Your Glen Allen House to a Trusted Cash Home Buyer',
      sellBody:
        'The Glen Allen area has expensive dealing with agents, waiting for months, and stressing over unavoidable issues. We make cash home buying fast and easy. Read on to see how it works — we’ve developed a simple process you get the cash you need, with no fees or charges.',
      sellReasons: [
        { text: 'Fast closings — we can close on your home sale in as little as seven days' },
        { text: 'No repairs needed — sell your house as-is' },
        { text: 'Flexible process — choose your closing date on your timeline' },
        { text: 'No hidden fees — no commissions, closing costs, or hidden charges' },
      ],
      trustHeading: 'Sell Your Home Fast in Glen Allen, VA',
      trustBody:
        'As local home buyers in Glen Allen, VA, we’re ready to make a fast and fair offer on your house, rental home, or house that needs extensive repairs. Skip the stress of finding a buyer and dealing with the delays that come with listing, showings, and waiting for financing to fall through.',
      checklistGroups: sharedChecklistGroups,
      closingHeading: 'Contact Us Today In Glen Allen, VA',
      closingBody:
        'Glen Allen attracts residents with its suburban, family-friendly atmosphere and excellent schools. Are you ready to sell your house fast in VA? We buy houses for cash in Glen Allen, VA — call us or fill out our online form to get your free, no-obligation cash offer today.',
      localSeo: { enableLocalBusinessSchema: true, schemaAreaServed: [{ name: 'Glen Allen, VA' }] },
      meta: {
        title: 'We Buy Houses for Cash in Glen Allen, VA',
        description:
          'Sell your Glen Allen, VA house fast for cash — any condition, no repairs, no fees, no obligation.',
      },
    },
    {
      cityName: 'Highland Springs',
      stateAbbr: 'VA',
      heroHeadline: 'We Buy Houses Fast for Cash in Highland Springs, VA',
      heroIntro:
        'Selling a home the traditional way can be full of hassles and frustrations, especially for the seller. You’ll need to fix up the place, bundle repairs, work with an agent, and deal with buyers who try to lowball you. If your home isn’t in great condition, let us show you a better way.',
      form: leadForm.id,
      sellHeading: 'The Easiest Way To Sell Your Highland Springs House to a Trusted Cash Home Buyer',
      sellBody:
        'Why not skip all the stress and let us make a cash offer instead? You can sell your home as-is, no matter what condition it’s in.',
      sellReasons: [
        { text: 'Any condition' },
        { text: 'No cleaning or repairs' },
        { text: 'Sell as-is' },
        { text: 'No hidden fees' },
      ],
      trustHeading: 'Why Choose Us?',
      trustBody:
        'We understand the challenges of selling a house the traditional way: listing with a real estate agent typically involves costly repairs, lengthy showings, and uncertainty about whether or if your home will sell. When you work with us, you avoid those headaches — no fees or commissions, we buy your house as-is, and we can close in as little as seven days on a timeline that suits you.',
      checklistGroups: sharedChecklistGroups,
      closingHeading: 'Sell Your Highland Springs, VA Property Fast With Us',
      closingBody:
        'Highland Springs is close to Richmond with a strong sense of community pride. Whatever your reason for selling, we count on our team to make the process stress-free. Contact us online or call today, and we’ll buy your house for cash in Highland Springs, VA.',
      localSeo: {
        enableLocalBusinessSchema: true,
        schemaAreaServed: [{ name: 'Highland Springs, VA' }],
      },
      meta: {
        title: 'We Buy Houses Fast for Cash in Highland Springs, VA',
        description:
          'Sell your Highland Springs, VA house fast for cash — any condition, no repairs, no fees, no obligation.',
      },
    },
  ]

  for (const locationData of locationsData) {
    const existingLocation = (
      await payload.find({
        collection: 'locations',
        where: { cityName: { equals: locationData.cityName } },
        limit: 1,
      })
    ).docs[0]

    const data = {
      ...locationData,
      slug: `${locationData.cityName}-${locationData.stateAbbr}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      _status: 'published' as const,
    }

    if (existingLocation) {
      await payload.update({
        collection: 'locations',
        id: existingLocation.id,
        data,
        draft: false,
        context: { disableRevalidate: true },
      })
    } else {
      await payload.create({
        collection: 'locations',
        data,
        draft: false,
        context: { disableRevalidate: true },
      })
    }
  }

  // --- Example blog post ---
  const postData = {
    title: 'How the Foreclosure Process Works in Virginia (And How to Stop It)',
    slug: 'foreclosure-process-virginia',
    _status: 'published' as const,
    publishedAt: new Date().toISOString(),
    categories: [category.id],
    content: richText(
      paragraph(
        'Virginia is a non-judicial foreclosure state, which means the process can move faster than homeowners expect — often in as little as 60 days from the first missed payment notice, once the lender begins the formal process.',
      ),
      heading('The Timeline', 'h2'),
      paragraph(
        'After several missed payments, your lender sends a notice of default. If the loan isn’t brought current, Virginia law allows the trustee named in your deed of trust to schedule and advertise a foreclosure sale — no court hearing required.',
      ),
      heading('Your Options', 'h2'),
      paragraph(
        'You can catch up on payments, negotiate a loan modification or repayment plan, sell the house before the sale date, or in some cases sell directly to a cash buyer who can close before the auction and let you walk away with your equity instead of losing it.',
      ),
      paragraph(
        'If you’re behind on your Richmond-area mortgage and want to understand your options before the sale date, reach out — we can often close faster than a foreclosure auction moves.',
      ),
    ),
    meta: {
      title: 'How the Foreclosure Process Works in Virginia',
      description:
        'A plain-English guide to how non-judicial foreclosure works in Virginia, the typical timeline, and options for Richmond-area homeowners.',
    },
  }

  const existingPost = (
    await payload.find({
      collection: 'posts',
      where: { slug: { equals: 'foreclosure-process-virginia' } },
      limit: 1,
    })
  ).docs[0]

  if (existingPost) {
    await payload.update({
      collection: 'posts',
      id: existingPost.id,
      data: postData,
      ...pageWriteOpts,
    })
  } else {
    await payload.create({ collection: 'posts', data: postData, ...pageWriteOpts })
  }

  // --- Header / Footer nav ---
  await payload.updateGlobal({
    slug: 'header',
    data: {
      navItems: [
        { link: { type: 'custom', label: 'How It Works', url: '/how-it-works' } },
        { link: { type: 'custom', label: 'Reviews', url: '/#reviews' } },
        { link: { type: 'custom', label: 'Areas We Buy In', url: '/locations' } },
        { link: { type: 'custom', label: 'Blog', url: '/posts' } },
      ],
    },
    context: { disableRevalidate: true },
  })

  await payload.updateGlobal({
    slug: 'footer',
    context: { disableRevalidate: true },
    data: {
      navItems: [
        { link: { type: 'custom', label: 'Home', url: '/' } },
        { link: { type: 'custom', label: 'How It Works', url: '/how-it-works' } },
        {
          link: {
            type: 'custom',
            label: 'Sell My House Fast in Richmond, VA',
            url: '/sell-my-house-fast-richmond-va',
          },
        },
        { link: { type: 'custom', label: 'Areas We Buy In', url: '/locations' } },
        { link: { type: 'custom', label: 'Blog', url: '/posts' } },
      ],
    },
  })

  payload.logger.info('Done. Visit /admin to create your first admin user if you haven’t yet.')
}

// `payload run` exits the process as soon as this module's import() resolves,
// so the seeding work must be awaited at module scope rather than fired-and-forgotten.
try {
  await run()
} catch (err) {
  console.error(err)
  process.exitCode = 1
}
