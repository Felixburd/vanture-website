import type { Metadata } from 'next'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'
import { getCaseStudies, getCaseStudy } from '@/lib/payload'
import { Container, Paragraphs } from '@/components/blocks/shared'
import { Badge } from '@/components/ui/badge'
import { CMSLink } from '@/components/CMSLink'
import { docMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: Locale; slug: string }> }

const signalVariant = {
  GO: 'green',
  PROCEED_WITH_CONDITIONS: 'amber',
  NO_GO: 'critical',
} as const

export async function generateStaticParams() {
  const studies = await getCaseStudies('en')
  return studies.map((cs) => ({ slug: cs.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const cs = await getCaseStudy(slug, locale)
  return docMetadata(cs?.seo, cs?.title)
}

export default async function CaseStudyPage({ params }: Props) {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const t = await getTranslations('caseStudy')
  const cs = await getCaseStudy(slug, locale)
  if (!cs) notFound()

  const img = typeof cs.heroImage === 'object' ? cs.heroImage : null
  const published = cs.publishedDate
    ? new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(cs.publishedDate))
    : null

  const Section = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <section className="border-t border-border/60 py-8">
      <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </h2>
      <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  )

  return (
    <article className="py-16 md:py-20">
      <Container className="max-w-3xl">
        <Link
          href="/case-studies"
          locale={locale}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('breadcrumb')}
        </Link>

        {img?.url ? (
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl border border-border">
            <Image src={img.url} alt={img.alt ?? cs.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" priority />
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
          <Badge variant={signalVariant[cs.decisionSignal]}>
            {t('decisionSignal')} · {cs.decisionSignalLabel || cs.decisionSignal}
          </Badge>
          {published ? (
            <span className="text-muted-foreground">
              {t('publishedOn')} {published}
            </span>
          ) : null}
        </div>

        <h1 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          {cs.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
          {cs.industry ? <span className="font-medium">{cs.industry}</span> : null}
          {cs.ebitdaLabel ? (
            <span className="text-muted-foreground">
              {t('ebitda')} <strong className="text-foreground">{cs.ebitdaLabel}</strong>
            </span>
          ) : null}
          {cs.askingPriceLabel ? (
            <span className="text-muted-foreground">
              {t('asking')} <strong className="text-foreground">{cs.askingPriceLabel}</strong>
            </span>
          ) : null}
        </div>

        <div className="mt-10">
          {cs.setup ? (
            <Section label={t('theSetup')}>
              <Paragraphs text={cs.setup} />
            </Section>
          ) : null}

          {cs.twoViews?.traditional || cs.twoViews?.dvta ? (
            <Section label={t('twoViews')}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="text-sm font-semibold text-foreground">{t('traditionalDD')}</div>
                  <p className="mt-2 text-sm">{cs.twoViews?.traditional}</p>
                </div>
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
                  <div className="text-sm font-semibold text-primary">{t('dvta')}</div>
                  <p className="mt-2 text-sm">{cs.twoViews?.dvta}</p>
                </div>
              </div>
            </Section>
          ) : null}

          {cs.surfaced?.intro || cs.surfaced?.metrics?.length ? (
            <Section label={t('whatSurfaced')}>
              <Paragraphs text={cs.surfaced?.intro} />
              {cs.surfaced?.metrics?.length ? (
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {cs.surfaced.metrics.map((m, i) => (
                    <div key={m.id ?? i} className="rounded-xl border border-border bg-card p-5">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">
                        {m.label}
                      </div>
                      <div className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
                        {m.value}
                      </div>
                      {m.note ? <p className="mt-1 text-sm">{m.note}</p> : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </Section>
          ) : null}

          {cs.evidence ? (
            <Section label={t('theEvidence')}>
              <Paragraphs text={cs.evidence} />
            </Section>
          ) : null}

          {cs.decisionImpact?.body || cs.decisionImpact?.stats?.length ? (
            <Section label={t('decisionImpact')}>
              <Paragraphs text={cs.decisionImpact?.body} />
              {cs.decisionImpact?.stats?.length ? (
                <div className="mt-2 grid gap-3 sm:grid-cols-3">
                  {cs.decisionImpact.stats.map((s, i) => (
                    <div key={s.id ?? i} className="rounded-xl border border-border bg-card p-5 text-center">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">
                        {s.label}
                      </div>
                      <div className="mt-1 text-lg font-semibold text-foreground">{s.value}</div>
                    </div>
                  ))}
                </div>
              ) : null}
            </Section>
          ) : null}

          {cs.takeaway ? (
            <Section label={t('takeaway')}>
              <Paragraphs text={cs.takeaway} />
            </Section>
          ) : null}
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">{t('moreAbout')}</p>
          <div className="mt-4 flex justify-center">
            <CMSLink
              link={{ type: 'booking', label: (await getTranslations('common'))('bookCall') }}
              locale={locale}
              variant="default"
            />
          </div>
        </div>
      </Container>
    </article>
  )
}
