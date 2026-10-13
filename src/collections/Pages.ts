import type { CollectionConfig, TextFieldSingleValidation } from 'payload'
import { text } from 'payload/shared'
import { routing } from '../i18n/routing'
import { layoutBlocks } from '../blocks'
import { seoField } from '../fields/seo'

// Every page publishes at /<slug>, so a slug must not shadow a code route,
// Payload's mount points, or a locale prefix (`/fr-ca/...` is French, not a page).
const RESERVED_SLUGS = [
  'case-studies',
  'briefing',
  'admin',
  'api',
  'graphql',
  'graphql-playground',
  ...routing.locales,
]

const validateSlug: TextFieldSingleValidation = (value, options) => {
  if (value) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value))
      return 'Use lowercase letters, numbers and single hyphens only (e.g. "due-diligence").'
    if ((RESERVED_SLUGS as string[]).includes(value))
      return `"${value}" is reserved by the site (it is already a route or a language prefix). Choose another slug.`
  }
  return text(value, options)
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', 'updatedAt'] },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description:
          'Published at /<slug> (EN) and /fr-ca/<slug> (FR-CA). Use "home" for the homepage, "about" for the About page.',
      },
      validate: validateSlug,
    },
    { name: 'layout', type: 'blocks', blocks: layoutBlocks, localized: true },
    seoField,
  ],
}
