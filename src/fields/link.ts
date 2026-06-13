import type { Field } from 'payload'

/**
 * Reusable link field. `type: 'booking'` resolves to the central booking/contact
 * URL stored in the SiteSettings global at render time — so there is one source of
 * truth for the CTA and no hardcoded dev URLs can leak into content.
 */
export const linkField = (name = 'link'): Field => ({
  name,
  type: 'group',
  fields: [
    { name: 'label', type: 'text', localized: true },
    {
      name: 'type',
      type: 'select',
      defaultValue: 'booking',
      options: [
        { label: 'Booking / Contact (Site Settings)', value: 'booking' },
        { label: 'Internal page', value: 'page' },
        { label: 'Custom URL', value: 'custom' },
      ],
    },
    {
      name: 'page',
      type: 'relationship',
      relationTo: 'pages',
      admin: { condition: (_, siblingData) => siblingData?.type === 'page' },
    },
    {
      name: 'url',
      type: 'text',
      admin: { condition: (_, siblingData) => siblingData?.type === 'custom' },
    },
    { name: 'newTab', type: 'checkbox', label: 'Open in new tab' },
  ],
})

/** An array of links (used for groups of CTA buttons). */
export const linksField = (name = 'links'): Field => ({
  name,
  type: 'array',
  fields: [linkField('link')],
})
