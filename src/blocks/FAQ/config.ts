import type { Block } from 'payload'

export const FAQ: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  labels: {
    plural: 'FAQs',
    singular: 'FAQ',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Frequently Asked Questions',
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      labels: {
        plural: 'Questions',
        singular: 'Question',
      },
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
          admin: {
            description:
              'Plain text — this also feeds the FAQPage structured data, so keep it a direct, complete answer.',
          },
        },
      ],
    },
  ],
}
