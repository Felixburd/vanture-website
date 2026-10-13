import type { Metadata } from 'next'
import type { Media } from '@/payload-types'
import { routing, type Locale } from '@/i18n/routing'
import { getSiteSettings } from '@/lib/payload'

/** Public origin every canonical/hreflang/sitemap URL is built from (no trailing slash). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(
  /\/+$/,
  '',
)

// hreflang codes and OpenGraph locales for each routing locale.
const hreflang: Record<Locale, string> = { en: 'en', 'fr-ca': 'fr-CA' }
const ogLocale: Record<Locale, string> = { en: 'en_CA', 'fr-ca': 'fr_CA' }

/** Site-relative path for `path` in `locale` — English is unprefixed (`localePrefix: 'as-needed'`). */
export function localePath(locale: Locale, path = ''): string {
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`
  return `${prefix}${path}` || '/'
}

export function absoluteUrl(path: string): string {
  return path.startsWith('http') ? path : `${SITE_URL}${path}`
}

export const OG_SIZE = { width: 1200, height: 630 }

/** Generated share image (src/app/og) for a locale-agnostic route path, e.g. '' or '/about'. */
export const ogImagePath = (locale: Locale, path = '') => `/og/${locale}${path}`

/** hreflang map for one route across every locale, plus x-default → the default locale. */
export function languageAlternates(path = ''): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const loc of routing.locales) languages[hreflang[loc]] = localePath(loc, path)
  languages['x-default'] = localePath(routing.defaultLocale, path)
  return languages
}

type Seo =
  | {
      title?: string | null
      description?: string | null
      image?: (number | null) | Media
    }
  | null
  | undefined

const mediaUrl = (m?: (number | null) | Media) => (m && typeof m === 'object' ? m.url : undefined)

/** Share image for a page: an explicit doc-level SEO image, else the generated one. */
export function shareImages(locale: Locale, path: string, seoImage?: (number | null) | Media) {
  const explicit = mediaUrl(seoImage)
  return explicit ? [{ url: explicit }] : [{ url: ogImagePath(locale, path), ...OG_SIZE }]
}

/**
 * Full page metadata: per-doc SEO overrides → page fallbacks → site defaults,
 * plus canonical, hreflang alternates and a complete OpenGraph block.
 *
 * The share image skips the generic fallbacks (hero image, site-default SEO
 * image): a generated, on-brand image beats stock — only a doc-level SEO image
 * overrides it.
 *
 * OpenGraph is built whole here because Next replaces (not deep-merges) the
 * layout's `openGraph` whenever a page sets one.
 */
export async function pageMetadata({
  locale,
  path,
  seo,
  title: fallbackTitle,
  description: fallbackDescription,
  article,
}: {
  locale: Locale
  /** Locale-agnostic route path, e.g. '' for home or '/about'. */
  path: string
  seo?: Seo
  title?: string | null
  description?: string | null
  article?: { publishedTime?: string | null; modifiedTime?: string | null }
}): Promise<Metadata> {
  const settings = await getSiteSettings(locale)
  const defaults = settings.defaultSeo

  // Omit an empty title entirely — an explicit `title: undefined` suppresses the
  // layout's `title.default` instead of falling back to it (e.g. blank home title).
  const title = seo?.title || fallbackTitle || undefined
  const description = seo?.description || fallbackDescription || defaults?.description || undefined
  const images = shareImages(locale, path, seo?.image)
  const url = localePath(locale, path)

  const meta: Metadata = {
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      title: title || defaults?.title || settings.siteName || 'Vanture',
      description,
      url,
      siteName: settings.siteName || 'Vanture',
      locale: ogLocale[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      images,
      ...(article
        ? {
            type: 'article',
            publishedTime: article.publishedTime || undefined,
            modifiedTime: article.modifiedTime || undefined,
          }
        : { type: 'website' }),
    },
    twitter: { card: 'summary_large_image', images },
  }
  if (title) meta.title = title
  if (description) meta.description = description
  return meta
}
