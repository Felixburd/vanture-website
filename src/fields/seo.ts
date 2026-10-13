import type { Field } from 'payload'

const lengthHint = (recommended: number, noun: string) => ({
  path: '/components/admin/SeoLengthHint#SeoLengthHint',
  clientProps: { recommended, noun },
})

/** Shared title/description/image fields for per-doc SEO and the site-wide defaults. */
export const seoFields: Field[] = [
  {
    name: 'title',
    type: 'text',
    localized: true,
    admin: { components: { Description: lengthHint(60, 'title') } },
  },
  {
    name: 'description',
    type: 'textarea',
    localized: true,
    admin: { components: { Description: lengthHint(155, 'description') } },
  },
  { name: 'image', type: 'upload', relationTo: 'media' },
]

/** Per-document SEO overrides. Falls back to SiteSettings defaults when empty. */
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  admin: { description: 'Optional. Overrides the site-wide SEO defaults.' },
  fields: seoFields,
}
