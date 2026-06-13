import type { Metadata } from 'next'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'
import { getCaseStudies } from '@/lib/payload'
import { Container } from '@/components/blocks/shared'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'caseStudy' })
  return { title: t('indexTitle'), description: t('indexIntro') }
}

export default async function CaseStudiesPage({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const t = await getTranslations('caseStudy')
  const tCommon = await getTranslations('common')
  const studies = await getCaseStudies(locale)

  return (
    <div className="py-20 md:py-28">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {t('breadcrumb')}
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
          {t('indexTitle')}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t('indexIntro')}</p>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {studies.map((cs) => {
            const img = typeof cs.heroImage === 'object' ? cs.heroImage : null
            return (
              <Link
                key={cs.id}
                href={`/case-studies/${cs.slug}`}
                locale={locale}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/50"
              >
                {img?.url ? (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={img.url}
                      alt={img.alt ?? cs.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{cs.industry}</span>
                    {cs.askingPriceLabel ? (
                      <span className="font-semibold text-primary">{cs.askingPriceLabel}</span>
                    ) : null}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight">
                    {cs.title}
                  </h3>
                  {cs.cardSummary ? (
                    <p className="mt-2 text-sm text-muted-foreground">{cs.cardSummary}</p>
                  ) : null}
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-primary">
                    {tCommon('readMore')}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </Container>
    </div>
  )
}
