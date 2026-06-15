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
  const iconUrl =
    typeof block.icon === 'object' && block.icon?.url ? block.icon.url : '/vanture-mark.svg'

  return (
    <section id="dvta" className="scroll-mt-24 py-20 md:py-28">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          {/* The sample assessment panel */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xl md:p-7">
            {block.panelLabel ? (
              <div className="mb-4 flex items-center justify-between font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                <span>{block.panelLabel}</span>
                <span aria-hidden className="flex items-center gap-1.5 opacity-70">
                  <span className="h-1.5 w-1.5 rounded-full bg-status-green" />
                  <span className="h-1.5 w-1.5 rounded-full bg-status-amber" />
                  <span className="h-1.5 w-1.5 rounded-full bg-status-critical" />
                </span>
              </div>
            ) : null}

            <DvtaTabs tabs={tabs} />

            {/* Score cards */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              {block.scoreCards?.map((card, i) => (
                <div key={card.id ?? i} className="rounded-lg border border-border/70 bg-background/40 p-3">
                  <div className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    {card.label}
                  </div>
                  <div className="mt-1.5 flex items-end justify-between">
                    <span className="font-mono text-3xl font-medium leading-none tabular-nums">
                      {card.value}
                    </span>
                    <Badge variant={statusVariant[card.status]}>{card.status}</Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Findings table */}
            {block.findings?.length ? (
              <div className="mt-5 overflow-hidden rounded-lg border border-border/70">
                <table className="w-full text-left text-sm">
                  <thead className="bg-background/40 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2.5 font-medium">{t('finding')}</th>
                      <th className="px-3 py-2.5 font-medium">{t('lens')}</th>
                      <th className="px-3 py-2.5 text-right font-medium">{t('status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {block.findings.map((f, i) => (
                      <tr key={f.id ?? i} className="border-t border-border/60">
                        <td className="px-3 py-2.5">{f.finding}</td>
                        <td className="px-3 py-2.5 font-mono text-xs uppercase tracking-wide text-muted-foreground">
                          {f.lens}
                        </td>
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
                  <span className="mb-1.5 block font-mono text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                    {block.decision.signal}
                  </span>
                ) : null}
                <span className="text-muted-foreground">{block.decision.text}</span>
              </div>
            ) : null}
          </div>

          {/* Copy beside the panel */}
          <div className="lg:pt-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={iconUrl} alt="" className="mb-6 h-12 w-auto" />
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
