import type { Block } from 'payload'

export const QuoteBanner: Block = {
  slug: 'quoteBanner',
  interfaceName: 'QuoteBannerBlock',
  labels: {
    plural: 'Quote Banners',
    singular: 'Quote Banner',
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      defaultValue: 5,
    },
    {
      name: 'colorway',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { label: 'Primary (cherry blossom)', value: 'primary' },
        { label: 'Secondary (sweet peony)', value: 'secondary' },
        { label: 'Accent (dark magenta)', value: 'accent' },
        { label: 'Neutral (midnight violet)', value: 'neutral' },
      ],
    },
  ],
}
