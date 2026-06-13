import { getTranslations } from 'next-intl/server'
import type { DvtaPanelBlock } from '@/payload-types'
import type { Locale } from '@/i18n/routing'
import { Badge } from '@/components/ui/badge'
import { Buttons, Container } from './shared'
import { DvtaTabs } from './DvtaTabs'

const statusVariant = {
  GREEN: 'green',
  AMBER: 'amber',
  CRITICAL: 'critical',
} as const

export async function DvtaPanel({
  block,
  locale,
}: {
  block: DvtaPanelBlock
  locale: Locale
}) {
  const t = await getTranslations('dvtaPanel')
  const tabs = (block.tabs ?? []).map((tab) => tab.label)

  return (
    <section id="dvta" className="scroll-mt-24 py-20 md:py-28">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          {/* The sample assessment panel */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xl md:p-7">
            {block.panelLabel ? (
              <div className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {block.panelLabel}
              </div>
            ) : null}

            <DvtaTabs tabs={tabs} />

            {/* Score cards */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              {block.scoreCards?.map((card, i) => (
                <div key={card.id ?? i} className="rounded-lg border border-border/70 bg-background/40 p-3">
                  <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {card.label}
                  </div>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-2xl font-semibold tabular-nums">{card.value}</span>
                    <Badge variant={statusVariant[card.status]}>{card.status}</Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Findings table */}
            {block.findings?.length ? (
              <div className="mt-5 overflow-hidden rounded-lg border border-border/70">
                <table className="w-full text-left text-sm">
                  <thead className="bg-background/40 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 font-medium">{t('finding')}</th>
                      <th className="px-3 py-2 font-medium">{t('lens')}</th>
                      <th className="px-3 py-2 text-right font-medium">{t('status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {block.findings.map((f, i) => (
                      <tr key={f.id ?? i} className="border-t border-border/60">
                        <td className="px-3 py-2.5">{f.finding}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{f.lens}</td>
                        <td className="px-3 py-2.5 text-right">
                          <Badge variant={statusVariant[f.status]}>{f.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}

            {/* Decision */}
            {block.decision?.text ? (
              <div className="mt-5 rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm leading-relaxed">
                {block.decision.signal ? (
                  <strong className="text-primary">{block.decision.signal} </strong>
                ) : null}
                <span className="text-muted-foreground">{block.decision.text}</span>
              </div>
            ) : null}
          </div>

          {/* Copy beside the panel */}
          <div className="lg:pt-6">
            {block.heading ? (
              <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                {block.heading}
              </h2>
            ) : null}
            {block.body ? (
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">{block.body}</p>
            ) : null}
            <div className="mt-8">
              <Buttons buttons={block.buttons} locale={locale} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
