import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { routing, type Locale } from '@/i18n/routing'
import { getPage } from '@/lib/payload'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { pageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const page = await getPage('home', locale as Locale)
  // Home uses the site-default title from the layout; only override if SEO is set.
  return pageMetadata({ locale: locale as Locale, path: '', seo: page?.seo })
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const page = await getPage('home', locale)
  if (!page) notFound()

  return <RenderBlocks blocks={page.layout} locale={locale} />
}
