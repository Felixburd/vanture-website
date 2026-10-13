import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { routing, type Locale } from '@/i18n/routing'
import { getCaseStudies, getCaseStudy, getPage, getSiteSettings } from '@/lib/payload'
import { renderOgImage } from '@/lib/og'
import { SITE_URL } from '@/lib/seo'

/*
  Generated share images, one per indexable route: `/og/{locale}{path}` mirrors
  the page at `{path}` (see `ogImagePath`). Lives outside `[locale]` and the
  next-intl middleware so the URL is stable in both locales.

  Rendered at build (and on first request for new case studies), then served
  from the cache — satori/resvg never run per request on the 512MB instance.
*/
export const dynamic = 'force-static'

type Params = { locale: string; path?: string[] }

export async function generateStaticParams(): Promise<Params[]> {
  const studies = await getCaseStudies('en')
  const paths = [[], ['about'], ['case-studies'], ...studies.map((cs) => ['case-studies', cs.slug])]
  return routing.locales.flatMap((locale) => paths.map((path) => ({ locale, path })))
}

export async function GET(_req: Request, { params }: { params: Promise<Params> }) {
  const { locale, path = [] } = await params
  if (!hasLocale(routing.locales, locale)) return new Response('Not found', { status: 404 })

  const settings = await getSiteSettings(locale)
  const siteName = settings.siteName || 'Vanture'
  const host = new URL(SITE_URL).host
  const content = await resolve(locale, path, settings.defaultSeo?.title || siteName)
  if (!content) return new Response('Not found', { status: 404 })

  return renderOgImage({ ...content, siteName, host })
}

/** Title (and case study details) per route — the same title the page puts in og:title. */
async function resolve(locale: Locale, path: string[], defaultTitle: string) {
  const [section, slug, ...rest] = path
  if (rest.length) return null

  if (!section) {
    const page = await getPage('home', locale)
    return { title: page?.seo?.title || defaultTitle }
  }
  if (section === 'about' && !slug) {
    const page = await getPage('about', locale)
    return page ? { title: page.seo?.title || page.title } : null
  }
  if (section === 'case-studies') {
    const t = await getTranslations({ locale, namespace: 'caseStudy' })
    if (!slug) return { title: t('indexTitle') }

    const cs = await getCaseStudy(slug, locale)
    if (!cs) return null
    return {
      title: cs.seo?.title || cs.title,
      eyebrow: cs.industry,
      caseStudy: {
        signal: cs.decisionSignal,
        signalLabel: `${t('decisionSignal')} · ${cs.decisionSignalLabel || cs.decisionSignal}`,
      },
    }
  }
  return null
}
