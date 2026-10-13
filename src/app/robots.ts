import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      // Uploaded images are served from /api/media — keep them crawlable for
      // image search and link previews while the rest of the API stays blocked.
      allow: ['/', '/api/media/'],
      disallow: ['/admin', '/api'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
