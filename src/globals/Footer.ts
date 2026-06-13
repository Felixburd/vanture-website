import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: { read: () => true },
  fields: [
    { name: 'newsletterHeading', type: 'text', localized: true },
    { name: 'newsletterBody', type: 'text', localized: true },
    { name: 'newsletterDisclaimer', type: 'text', localized: true },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: ['LinkedIn', 'Facebook', 'Instagram', 'X', 'YouTube'],
          required: true,
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'legalName',
      type: 'text',
      localized: true,
      defaultValue: 'Vanture. All rights reserved.',
      admin: { description: 'Rendered as "© {currentYear} {legalName}".' },
    },
  ],
}
