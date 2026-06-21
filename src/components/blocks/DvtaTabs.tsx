'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

type Status = 'GREEN' | 'AMBER' | 'CRITICAL'

const statusVariant = {
  GREEN: 'green',
  AMBER: 'amber',
  CRITICAL: 'critical',
} as const

// Score text + progress-bar fill, keyed to the same traffic-light tokens the
// badges use so a lens reads the same colour everywhere it appears.
const statusText = {
  GREEN: 'text-status-green',
  AMBER: 'text-status-amber',
  CRITICAL: 'text-status-critical',
} as const

const statusFill = {
  GREEN: 'bg-status-green',
  AMBER: 'bg-status-amber',
  CRITICAL: 'bg-status-critical',
} as const

export type LensPane = {
  key: string
  label: string
  scoreLabel: string
  value: number
  status: Status
  findings: { finding: string; status: Status }[]
}

export type DvtaTabsProps = {
  summaryLabel: string
  decisionLabel: string
  scoreLabel: string
  noFindingsLabel: string
  lenses: LensPane[]
  decision?: { signal?: string | null; text?: string | null } | null
}

function ScoreBar({ value, status }: { value: number; status: Status }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
      <div
        className={cn('h-full rounded-full transition-[width]', statusFill[status])}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function DvtaTabs({
  summaryLabel,
  decisionLabel,
  scoreLabel,
  noFindingsLabel,
  lenses,
  decision,
}: DvtaTabsProps) {
  const tabs = [summaryLabel, ...lenses.map((l) => l.label), decisionLabel]
  const [active, setActive] = useState(0)

  const isSummary = active === 0
  const isDecision = active === tabs.length - 1
  const lens = !isSummary && !isDecision ? lenses[active - 1] : null

  return (
    <div>
      {/* Tab nav — horizontally scrollable on narrow screens */}
      <div className="-mx-1 flex gap-1 overflow-x-auto border-b border-border/70 pb-3">
        {tabs.map((label, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              'shrink-0 rounded-md px-3 py-1.5 font-mono text-xs font-medium uppercase tracking-wide transition-colors',
              i === active
                ? 'bg-primary/15 text-primary'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-5 min-h-[15rem]">
        {/* Summary — every lens at a glance, plus the headline signal */}
        {isSummary ? (
          <div>
            <ul className="divide-y divide-border/60 overflow-hidden rounded-lg border border-border/70">
              {lenses.map((l) => (
                <li
                  key={l.key}
                  className="flex items-center justify-between gap-4 bg-background/40 px-4 py-3"
                >
                  <span className="text-sm font-medium">{l.scoreLabel}</span>
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-2xl font-medium leading-none tabular-nums">
                      {l.value}
                    </span>
                    <Badge variant={statusVariant[l.status]}>{l.status}</Badge>
                  </span>
                </li>
              ))}
            </ul>
            {decision?.signal ? (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                  {decision.signal}
                </span>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Lens detail — large score, fill bar, and that lens's findings */}
        {lens ? (
          <div>
            <div className="rounded-lg border border-border/70 bg-background/40 p-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    {lens.scoreLabel}
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span
                      className={cn(
                        'font-mono text-4xl font-medium leading-none tabular-nums',
                        statusText[lens.status],
                      )}
                    >
                      {lens.value}
                    </span>
                    <span className="font-mono text-sm text-muted-foreground">/ 100</span>
                  </div>
                </div>
                <Badge variant={statusVariant[lens.status]}>{lens.status}</Badge>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {scoreLabel}
                </span>
                <ScoreBar value={lens.value} status={lens.status} />
              </div>
            </div>

            {lens.findings.length ? (
              <ul className="mt-3 space-y-2">
                {lens.findings.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start justify-between gap-3 rounded-lg border border-border/70 px-3 py-2.5 text-sm"
                  >
                    <span className="leading-relaxed">{f.finding}</span>
                    <Badge variant={statusVariant[f.status]} className="mt-0.5 shrink-0">
                      {f.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 px-1 text-sm text-muted-foreground">{noFindingsLabel}</p>
            )}
          </div>
        ) : null}

        {/* Decision — the recommendation in full */}
        {isDecision ? (
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm leading-relaxed">
            {decision?.signal ? (
              <span className="mb-1.5 block font-mono text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                {decision.signal}
              </span>
            ) : null}
            {decision?.text ? (
              <span className="text-muted-foreground">{decision.text}</span>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
