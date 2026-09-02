import type { Block } from 'payload'

export const AreaServed: Block = {
  slug: 'areaServed',
  interfaceName: 'AreaServedBlock',
  labels: {
    plural: 'Area Served Sections',
    singular: 'Area Served',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'WHERE DO WE SERVE',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Where We Buy Houses',
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
    },
  ],
}
