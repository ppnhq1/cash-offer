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
      name: 'layout',
      type: 'select',
      defaultValue: 'numbered',
      options: [
        { label: 'Numbered steps (grid)', value: 'numbered' },
        { label: 'Timeline', value: 'timeline' },
      ],
      admin: {
        description:
          'Use "Timeline" for a second How It Works section on the same page so it reads differently from the first.',
      },
    },
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
