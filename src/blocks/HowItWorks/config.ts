import type { Block } from 'payload'

export const HowItWorks: Block = {
  slug: 'howItWorks',
  interfaceName: 'HowItWorksBlock',
  labels: {
    plural: 'How It Works Sections',
    singular: 'How It Works',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'OUR SIMPLE PROCESS',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'How It Works',
    },
    {
      name: 'steps',
      type: 'array',
      minRows: 2,
      maxRows: 5,
      labels: { plural: 'Steps', singular: 'Step' },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}
