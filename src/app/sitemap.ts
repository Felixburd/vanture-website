import type { MetadataRoute } from 'next'
import { getCaseStudies } from '@/lib/payload'
import { routing } from '@/i18n/routing'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  let studyPaths: string[] = []
  try {
    const studies = await getCaseStudies('en')
    studyPaths = studies.map((s) => `/case-studies/${s.slug}`)
  } catch {
    /* DB unavailable at build — emit static paths only */
  }

  const paths = ['', '/about', '/case-studies', ...studyPaths]
  const entries: MetadataRoute.Sitemap = []
  for (const p of paths) {
    for (const loc of routing.locales) {
      const prefix = loc === routing.defaultLocale ? '' : `/${loc}`
      entries.push({
        url: `${base}${prefix}${p}` || `${base}/`,
        changeFrequency: 'monthly',
        priority: p === '' ? 1 : 0.7,
      })
    }
  }
  return entries
}
