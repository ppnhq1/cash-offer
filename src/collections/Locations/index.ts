import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { revalidateDelete, revalidateLocation } from './hooks/revalidateLocation'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

/**
 * Structured, fill-in-the-blanks template for a single city/service-area
 * landing page — the "Locations" hub lists every published entry here.
 * Editors only ever fill in fields, never rebuild the layout, so dozens of
 * these can be created quickly and stay visually consistent.
 */
export const Locations: CollectionConfig<'locations'> = {
  slug: 'locations',
  labels: {
    plural: 'Locations',
    singular: 'Location',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['cityName', 'stateAbbr', 'slug', 'updatedAt'],
    useAsTitle: 'cityName',
  },
  defaultPopulate: {
    cityName: true,
    stateAbbr: true,
    slug: true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'cityName',
          type: 'text',
          required: true,
          admin: { width: '60%', description: 'e.g. "Hopewell" — used throughout the page copy.' },
        },
        {
          name: 'stateAbbr',
          type: 'text',
          required: true,
          defaultValue: 'VA',
          admin: { width: '40%' },
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'heroHeadline',
              type: 'text',
              required: true,
              admin: {
                description: 'e.g. "We Buy Houses for Cash in the City of Hopewell, VA"',
              },
            },
            {
              name: 'form',
              type: 'relationship',
              relationTo: 'forms',
              label: 'Lead capture form',
              admin: {
                description: 'Reuse the site-wide "Get Your Cash Offer" form unless this location needs its own.',
              },
            },
            {
              name: 'heroIntro',
              type: 'textarea',
              required: true,
              admin: {
                description:
                  'One or two sentences — local geography/neighborhood color makes this page feel genuinely local, not templated.',
              },
            },
          ],
        },
        {
          label: 'Sell As-Is',
          fields: [
            {
              name: 'sellHeading',
              type: 'text',
              required: true,
              defaultValue: 'Sell Your House in As-Is Condition',
            },
            {
              name: 'sellBody',
              type: 'textarea',
              required: true,
            },
            {
              name: 'sellReasons',
              type: 'array',
              minRows: 2,
              maxRows: 6,
              labels: { plural: 'Reasons', singular: 'Reason' },
              fields: [{ name: 'text', type: 'text', required: true }],
            },
          ],
        },
        {
          label: 'Local Trust',
          fields: [
            {
              name: 'trustHeading',
              type: 'text',
              required: true,
              defaultValue: 'Local Cash Homebuyers You Can Trust',
            },
            {
              name: 'trustBody',
              type: 'textarea',
              required: true,
            },
            {
              name: 'checklistGroups',
              type: 'array',
              minRows: 1,
              maxRows: 3,
              labels: { plural: 'Checklist Groups', singular: 'Checklist Group' },
              defaultValue: [
                { heading: 'Sell Your House For Any Reason', items: [] },
                { heading: 'Sell Your House In Any Condition', items: [] },
                { heading: 'Sell Your House Facing Any Challenge', items: [] },
              ],
              fields: [
                { name: 'heading', type: 'text', required: true },
                {
                  name: 'items',
                  type: 'array',
                  minRows: 1,
                  fields: [{ name: 'text', type: 'text', required: true }],
                },
              ],
            },
          ],
        },
        {
          label: 'Closing',
          fields: [
            {
              name: 'closingHeading',
              type: 'text',
              required: true,
              admin: { description: 'e.g. "Get A Fast And Fair Cash Offer On Your House In Hopewell"' },
            },
            {
              name: 'closingBody',
              type: 'textarea',
              required: true,
            },
          ],
        },
        {
          name: 'localSeo',
          label: 'Local SEO',
          fields: [
            {
              name: 'enableLocalBusinessSchema',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'schemaAreaServed',
              type: 'array',
              labels: { singular: 'Area', plural: 'Areas Served (override)' },
              admin: {
                condition: (_, siblingData) => Boolean(siblingData?.enableLocalBusinessSchema),
                description: 'Leave empty to use the business-wide default.',
              },
              fields: [{ name: 'name', type: 'text', required: true }],
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    slugField({ useAsSlug: 'cityName' }),
  ],
  hooks: {
    afterChange: [revalidateLocation],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
