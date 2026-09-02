import type { Block } from 'payload'

export const StatRow: Block = {
  slug: 'statRow',
  interfaceName: 'StatRowBlock',
  labels: {
    plural: 'Stat Rows',
    singular: 'Stat Row',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 2,
      maxRows: 4,
      labels: { plural: 'Stats', singular: 'Stat' },
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "Offer In 24 Hours"' },
        },
        {
          name: 'description',
          type: 'text',
        },
      ],
    },
  ],
}
