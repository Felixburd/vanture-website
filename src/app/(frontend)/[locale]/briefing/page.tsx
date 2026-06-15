import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { routing, type Locale } from '@/i18n/routing'
import { getBriefingContent } from '@/components/briefing/content'
import { BriefingForm } from '@/components/briefing/BriefingForm'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const c = getBriefingContent(locale as Locale)
  return {
    title: c.meta.title,
    description: c.meta.description,
    // A lead-capture funnel shouldn't be indexed.
    robots: { index: false, follow: false },
  }
}

export default async function BriefingPage({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  return (
    <section className="tone-light bg-background py-16 md:py-24">
      <div className="mx-auto w-full max-w-3xl px-6">
        <BriefingForm locale={locale} />
      </div>
    </section>
  )
}
