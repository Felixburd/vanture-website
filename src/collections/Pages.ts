import type { CollectionConfig } from 'payload'
import { layoutBlocks } from '../blocks'
import { seoField } from '../fields/seo'

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
      admin: { description: 'Use "home" for the homepage, "about" for the About page.' },
    },
    { name: 'layout', type: 'blocks', blocks: layoutBlocks, localized: true },
    seoField,
  ],
}
