import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { routing, type Locale } from '@/i18n/routing'
import { getPage } from '@/lib/payload'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { pageMetadata } from '@/lib/seo'

// Any CMS page at /<slug>. Explicit routes (about, case-studies, briefing) win
// over this segment. No generateStaticParams, so it renders per request and a
// page created or edited in the admin is live without a redeploy.

type Props = { params: Promise<{ locale: string; slug: string }> }

// The home doc lives at the root, never at /home.
const getSlugPage = (slug: string, locale: Locale) =>
  slug === 'home' ? null : getPage(slug, locale)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const page = await getSlugPage(slug, locale as Locale)
  if (!page) return {}
  return pageMetadata({ locale: locale as Locale, path: `/${slug}`, seo: page.seo, title: page.title })
}

export default async function CmsPage({ params }: Props) {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const page = await getSlugPage(slug, locale)
  if (!page) notFound()

  return <RenderBlocks blocks={page.layout} locale={locale} />
}
