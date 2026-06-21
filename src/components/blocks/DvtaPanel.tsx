import { getTranslations } from 'next-intl/server'
import type { DvtaPanelBlock } from '@/payload-types'
import type { Locale } from '@/i18n/routing'
import { Buttons, Container } from './shared'
import { DvtaTabs, type LensPane } from './DvtaTabs'

// The DVTA methodology always scores four lenses in a fixed order (L1–L4), so
// we key panes by position rather than by parsing the score-card label.
const LENS_KEYS = ['revenue', 'execution', 'spending', 'keyPerson'] as const

// A finding carries a free-text `lens` string that varies by locale; these
// aliases map it back to a stable key so findings land under the right pane.
const LENS_ALIASES: Record<(typeof LENS_KEYS)[number], string[]> = {
  revenue: ['revenue', 'revenus'],
  execution: ['execution', 'exécution'],
  spending: ['spending', 'dépenses'],
  keyPerson: ['key person', 'personnes clés'],
}

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()

function lensKeyForFinding(lens: string, scoreLabels: string[]): number {
  const n = normalize(lens)
  // Primary: match the finding's lens text against the alias table.
  for (let i = 0; i < LENS_KEYS.length; i++) {
    if (LENS_ALIASES[LENS_KEYS[i]].some((a) => n.includes(normalize(a)))) return i
  }
  // Fallback: the lens text appears inside a score-card label.
  return scoreLabels.findIndex((label) => normalize(label).includes(n))
}

export async function DvtaPanel({
  block,
  locale,
}: {
  block: DvtaPanelBlock
  locale: Locale
}) {
  const t = await getTranslations('dvtaPanel')

  const scoreCards = block.scoreCards ?? []
  const scoreLabels = scoreCards.map((c) => c.label)

  // Build one pane per score card, attaching findings by lens.
  const lenses: LensPane[] = scoreCards.map((card, i) => ({
    key: LENS_KEYS[i] ?? `lens-${i}`,
    label: t(`tabs.${LENS_KEYS[i] ?? 'summary'}`),
    scoreLabel: card.label,
    value: card.value,
    status: card.status,
    findings:
      block.findings
        ?.filter((f) => lensKeyForFinding(f.lens, scoreLabels) === i)
        .map((f) => ({ finding: f.finding, status: f.status })) ?? [],
  }))

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

            <DvtaTabs
              summaryLabel={t('tabs.summary')}
              decisionLabel={t('tabs.decision')}
              scoreLabel={t('score')}
              noFindingsLabel={t('noFindings')}
              lenses={lenses}
              decision={block.decision}
            />
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
