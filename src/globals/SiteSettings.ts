import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  label: 'Site Settings',
  access: { read: () => true },
  fields: [
    {
      name: 'bookingUrl',
      type: 'text',
      required: true,
      admin: {
        description:
          'The single source of truth for every "Book a briefing / Contact" CTA. Use the production portal URL.',
      },
    },
    { name: 'siteName', type: 'text', defaultValue: 'Vanture' },
    {
      name: 'defaultSeo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
