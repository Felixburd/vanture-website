import type { CollectionConfig } from 'payload'

// Generated sizes are encoded as WebP; the original upload is kept as-is.
const webp = { format: 'webp', options: { quality: 80 } } as const

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  upload: {
    // On Render, MEDIA_DIR points at a mounted persistent disk.
    staticDir: process.env.MEDIA_DIR || undefined,
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumbnail', width: 480, formatOptions: webp },
      { name: 'card', width: 768, formatOptions: webp },
      { name: 'hero', width: 1600, formatOptions: webp },
    ],
  },
  fields: [
    { name: 'alt', type: 'text', localized: true },
    { name: 'caption', type: 'text', localized: true },
  ],
}
