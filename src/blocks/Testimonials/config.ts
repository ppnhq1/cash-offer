import type { Block } from 'payload'

export const Testimonials: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: {
    plural: 'Testimonials',
    singular: 'Testimonials',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'What Local Sellers Say',
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      labels: {
        plural: 'Testimonials',
        singular: 'Testimonial',
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
          name: 'authorLocation',
          type: 'text',
          admin: {
            description: 'e.g. "Church Hill, Richmond VA" — local proof matters for both trust and SEO.',
          },
        },
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          defaultValue: 5,
        },
      ],
    },
  ],
}
