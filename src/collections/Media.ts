import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  upload: {
    // On Render, MEDIA_DIR points at a mounted persistent disk.
    staticDir: process.env.MEDIA_DIR || undefined,
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumbnail', width: 480 },
      { name: 'card', width: 768 },
      { name: 'hero', width: 1600 },
    ],
  },
  fields: [
    { name: 'alt', type: 'text', localized: true },
    { name: 'caption', type: 'text', localized: true },
  ],
}
