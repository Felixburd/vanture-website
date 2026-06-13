import type { Field } from 'payload'

/** Per-document SEO overrides. Falls back to SiteSettings defaults when empty. */
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  admin: { description: 'Optional. Overrides the site-wide SEO defaults.' },
  fields: [
    { name: 'title', type: 'text', localized: true },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}
