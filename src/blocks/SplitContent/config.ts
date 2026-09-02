import type { Block } from 'payload'

export const SplitContent: Block = {
  slug: 'splitContent',
  interfaceName: 'SplitContentBlock',
  labels: {
    plural: 'Split Content Sections',
    singular: 'Split Content',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
    },
    {
      name: 'linkLabel',
      type: 'text',
    },
    {
      name: 'linkUrl',
      type: 'text',
      admin: {
        condition: (_, { linkLabel } = {}) => Boolean(linkLabel),
      },
    },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'Image on right', value: 'right' },
        { label: 'Image on left', value: 'left' },
      ],
    },
  ],
}
