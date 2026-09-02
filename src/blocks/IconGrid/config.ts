import type { Block } from 'payload'

const iconOptions = [
  'AlertTriangle',
  'Ban',
  'Briefcase',
  'Building2',
  'CalendarCheck2',
  'CalendarClock',
  'CalendarDays',
  'ClipboardCheck',
  'ClipboardList',
  'Clock',
  'DollarSign',
  'FileCheck2',
  'Frown',
  'HandCoins',
  'Handshake',
  'HeartCrack',
  'Home',
  'Key',
  'MapPin',
  'PhoneCall',
  'ShieldAlert',
  'ShieldCheck',
  'TrendingDown',
  'UserX',
  'Users',
  'Wallet',
  'Wrench',
].map((name) => ({ label: name, value: name }))

export const IconGrid: Block = {
  slug: 'iconGrid',
  interfaceName: 'IconGridBlock',
  labels: {
    plural: 'Icon Grids',
    singular: 'Icon Grid',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Short label above the heading, e.g. "IN WHICH SITUATIONS?"',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'subheading',
      type: 'textarea',
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 columns', value: '2' },
        { label: '3 columns', value: '3' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      labels: { plural: 'Items', singular: 'Item' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'icon',
              type: 'select',
              options: iconOptions,
              admin: { width: '40%' },
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: { width: '60%' },
            },
          ],
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
  ],
}
