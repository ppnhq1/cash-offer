import type { GlobalConfig } from 'payload'

import { revalidateBusiness } from './hooks/revalidateBusiness'

export const Business: GlobalConfig = {
  slug: 'business',
  label: 'Business Info',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Local SEO',
  },
  hooks: {
    afterChange: [revalidateBusiness],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'businessName',
          type: 'text',
          required: true,
          defaultValue: 'RVA Cash Home Buyers',
          admin: { width: '50%' },
        },
        {
          name: 'telephone',
          type: 'text',
          admin: { width: '50%', description: 'e.g. (804) 555-0100' },
        },
      ],
    },
    {
      name: 'email',
      type: 'text',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'addressLocality',
          type: 'text',
          defaultValue: 'Richmond',
          admin: { width: '34%' },
        },
        {
          name: 'addressRegion',
          type: 'text',
          defaultValue: 'VA',
          admin: { width: '33%' },
        },
        {
          name: 'postalCode',
          type: 'text',
          admin: { width: '33%' },
        },
      ],
    },
    {
      name: 'streetAddress',
      type: 'text',
      admin: {
        description: 'Optional — omit if you operate without a public office address.',
      },
    },
    {
      name: 'priceRange',
      type: 'text',
      defaultValue: '$$',
    },
    {
      name: 'areaServed',
      type: 'array',
      labels: { singular: 'Area', plural: 'Areas Served' },
      admin: {
        description:
          'Default cities/neighborhoods used in LocalBusiness schema. Individual pages can override this with a more specific area.',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
      defaultValue: [
        { name: 'Richmond, VA' },
        { name: 'Henrico County, VA' },
        { name: 'Chesterfield County, VA' },
      ],
    },
    {
      name: 'sameAs',
      type: 'array',
      labels: { singular: 'Profile URL', plural: 'Social / Profile URLs' },
      admin: {
        description: 'Google Business Profile, Facebook, BBB, etc. — feeds the sameAs schema property.',
      },
      fields: [
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
