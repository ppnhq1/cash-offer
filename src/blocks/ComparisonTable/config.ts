import type { Block } from 'payload'

export const ComparisonTable: Block = {
  slug: 'comparisonTable',
  interfaceName: 'ComparisonTableBlock',
  labels: {
    plural: 'Comparison Tables',
    singular: 'Comparison Table',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Sell Your House Without An Agent',
    },
    {
      name: 'subheading',
      type: 'textarea',
    },
    {
      name: 'ourColumnLabel',
      type: 'text',
      required: true,
      defaultValue: 'Sell To Us',
    },
    {
      name: 'agentColumnLabel',
      type: 'text',
      required: true,
      defaultValue: 'Sell With An Agent',
    },
    {
      name: 'rows',
      type: 'array',
      minRows: 1,
      labels: { plural: 'Rows', singular: 'Row' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: { width: '34%' },
            },
            {
              name: 'ourValue',
              type: 'text',
              required: true,
              admin: { width: '33%' },
            },
            {
              name: 'agentValue',
              type: 'text',
              required: true,
              admin: { width: '33%' },
            },
          ],
        },
      ],
    },
  ],
}
