import type { MetadataRoute } from 'next'
import { getCaseStudies, getPages } from '@/lib/payload'
import { routing } from '@/i18n/routing'
import { absoluteUrl, languageAlternates, localePath } from '@/lib/seo'

// Render per request so pages and case studies published in the CMS are listed
// without a redeploy (otherwise the build-time render is served forever).
export const dynamic = 'force-dynamic'

type Route = { path: string; lastModified?: string; priority: number }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let studies: Route[] = []
  let pages: { slug: string; updatedAt: string }[] = []
  try {
    const [studyDocs, pageDocs] = await Promise.all([getCaseStudies('en'), getPages()])
    studies = studyDocs.map((s) => ({
      path: `/case-studies/${s.slug}`,
      lastModified: s.updatedAt,
      priority: 0.6,
    }))
    pages = pageDocs
  } catch {
    /* DB unavailable at build — emit static paths only */
  }

  const lastEdit = (slug: string) => pages.find((p) => p.slug === slug)?.updatedAt
  const routes: Route[] = [
    { path: '', priority: 1, lastModified: lastEdit('home') },
    { path: '/about', priority: 0.8, lastModified: lastEdit('about') },
    { path: '/case-studies', priority: 0.8, lastModified: studies[0]?.lastModified },
    ...studies,
    // Every other CMS page is served at /<slug> by the [slug] route.
    ...pages
      .filter((p) => p.slug !== 'home' && p.slug !== 'about')
      .map((p) => ({ path: `/${p.slug}`, lastModified: p.updatedAt, priority: 0.7 })),
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
