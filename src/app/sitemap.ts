import type { MetadataRoute } from 'next'
import { getCaseStudies } from '@/lib/payload'
import { routing } from '@/i18n/routing'
import { absoluteUrl, languageAlternates, localePath } from '@/lib/seo'

type Route = { path: string; lastModified?: string; priority: number }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let studies: Route[] = []
  try {
    const docs = await getCaseStudies('en')
    studies = docs.map((s) => ({
      path: `/case-studies/${s.slug}`,
      lastModified: s.updatedAt,
      priority: 0.6,
    }))
  } catch {
    /* DB unavailable at build — emit static paths only */
  }

  const routes: Route[] = [
    { path: '', priority: 1 },
    { path: '/about', priority: 0.8 },
    { path: '/case-studies', priority: 0.8, lastModified: studies[0]?.lastModified },
    ...studies,
  ]

  // One entry per locale, each listing every language version (hreflang) so
  // Google pairs the EN and FR-CA pages instead of treating them as duplicates.
  return routes.flatMap((r) => {
    const languages = Object.fromEntries(
      Object.entries(languageAlternates(r.path)).map(([lang, p]) => [lang, absoluteUrl(p)]),
    )
    return routing.locales.map((loc) => ({
      url: absoluteUrl(localePath(loc, r.path)),
      lastModified: r.lastModified,
      changeFrequency: 'monthly' as const,
      priority: r.priority,
      alternates: { languages },
    }))
  })
}
