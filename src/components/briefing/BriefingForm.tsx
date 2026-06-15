'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, ChevronDown } from 'lucide-react'
import type { Locale } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { submitBriefing } from '@/app/(frontend)/[locale]/briefing/actions'
import {
  branchByRole,
  getBriefingContent,
  step2Variant,
  type Choice,
  type LensCode,
  type RiskFlag,
  type RoleKey,
} from './content'

const LENSES: LensCode[] = ['L1', 'L2', 'L3', 'L4']

// Verdict / KPI palette tuned for the dark signal card: saturated solids for the
// chip (white text passes contrast) and translucent tints for the lens cards.
const VERDICT_BG: Record<RiskFlag, string> = {
  critical: 'bg-[#c2410c]',
  amber: 'bg-[#b45309]',
  green: 'bg-[#15803d]',
}
const KPI_TINT: Record<RiskFlag | 'pending', string> = {
  critical: 'border-[#f87171]/60 bg-[#f87171]/10',
  amber: 'border-[#fbbf24]/55 bg-[#fbbf24]/10',
  green: 'border-[#34d399]/55 bg-[#34d399]/10',
  pending: 'border-border bg-white/[0.04]',
}
const KPI_FLAG: Record<RiskFlag | 'pending', string> = {
  critical: 'text-[#fca5a5]',
  amber: 'text-[#fcd34d]',
  green: 'text-[#6ee7b7]',
  pending: 'text-muted-foreground',
}

export function BriefingForm({ locale }: { locale: Locale }) {
  const t = useMemo(() => getBriefingContent(locale), [locale])
  const [step, setStep] = useState(1)
  const [data, setData] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const topRef = useRef<HTMLDivElement>(null)

  const role = data.role as RoleKey | undefined
  const branch = role ? branchByRole[role] : 'dealmaker'
  const branchField = t.step2.branches[branch]
  const variant = step2Variant(role)

  const set = (name: string, value: string) => {
    setData((d) => ({ ...d, [name]: value }))
    if (error) setError(null)
  }

  // Preliminary signal, computed exactly like the legacy form.
  const signal = useMemo(() => {
    const flags = LENSES.map((l) => data[l] as RiskFlag | undefined)
    const critical = flags.filter((f) => f === 'critical').length
    const amber = flags.filter((f) => f === 'amber').length
    let klass: RiskFlag
    let headline: string
    if (critical >= 2) {
      klass = 'critical'
      headline = t.step4.signal.headlineCritical(critical)
    } else if (critical === 1 || amber >= 2) {
      klass = 'amber'
      headline = t.step4.signal.headlineMaterial(critical, amber)
    } else {
      klass = 'green'
      headline = t.step4.signal.headlineStrong
    }
    return { klass, headline, verdict: t.step4.signal.verdicts[klass] }
  }, [data, t])

  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email ?? '')
  const valid = (() => {
    switch (step) {
      case 1:
        return Boolean(data.role && data.intent)
      case 2:
        return Boolean(data.revenue && data.industry && data.geo && data[branchField.field])
      case 3:
        return LENSES.every((l) => data[l])
      case 4:
        return Boolean(data.name && emailOk && data.company && data.title)
      default:
        return true
    }
  })()

  const visualStep = Math.min(step, 4)

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [step])

  async function handleNext() {
    if (!valid || submitting) return
    if (step < 4) {
      setStep((s) => s + 1)
      return
    }
    // Step 4 → submit, then advance to confirmation.
    setSubmitting(true)
    setError(null)
    const res = await submitBriefing({ ...data, locale, signal: signal.klass })
    setSubmitting(false)
    if (res.ok) setStep(5)
    else setError(t.ui.submitError)
  }

  const summaryItems = (() => {
    const find = (list: Choice[], v?: string) => list.find((o) => o.value === v)?.title
    const items: [string, string | undefined][] = [
      [t.step5.labels.role, find(t.step1.roles, data.role)],
      [t.step5.labels.intent, find(t.step1.intents, data.intent)],
      [t.step5.labels.revenue, find(t.step2.revenues, data.revenue)],
      [t.step5.labels.industry, find(t.step2.industries, data.industry)],
      [t.step5.labels.geo, find(t.step2.geos, data.geo)],
      [t.step5.labels.signal, LENSES.map((l) => `${l}:${(data[l] ?? '—').toUpperCase()}`).join(' · ')],
    ]
    return items.filter(([, v]) => v) as [string, string][]
  })()

  return (
    <div ref={topRef} className="scroll-mt-24">
      {/* Instrument header: mono step counter + segmented progress rail */}
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {t.ui.step} <span className="text-foreground">{visualStep}</span> {t.ui.of} 4
        </span>
        {step === 5 ? (
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-status-green">
            ✓ {t.step5.labels.signal.split(' ')[0]}
          </span>
        ) : null}
      </div>
      <div className="mb-10 flex gap-1.5" aria-hidden>
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={cn(
              'h-0.5 flex-1 transition-colors duration-300',
              i <= visualStep ? 'bg-foreground' : 'bg-border',
            )}
          />
        ))}
      </div>

      <div
        key={step}
        className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-300"
      >
        {step === 1 ? (
          <Step
            tagline={t.step1.tagline}
            heading={t.step1.heading}
            lede={t.step1.lede}
          >
            <RadioGroup
              legend={t.step1.roleLabel}
              name="role"
              value={data.role}
              onChange={set}
              options={t.step1.roles}
            />
            <RadioGroup
              legend={t.step1.intentLabel}
              name="intent"
              value={data.intent}
              onChange={set}
              options={t.step1.intents}
            />
          </Step>
        ) : null}

        {step === 2 ? (
          <Step
            tagline={t.step2.tagline}
            heading={t.step2.heading[variant]}
            lede={t.step2.lede[variant]}
          >
            <RadioGroup
              legend={t.step2.revenueLabel}
              name="revenue"
              value={data.revenue}
              onChange={set}
              options={t.step2.revenues}
              columns={2}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField
                label={t.step2.industryLabel}
                name="industry"
                value={data.industry}
                onChange={set}
                placeholder={t.ui.select}
                options={t.step2.industries}
              />
              <SelectField
                label={t.step2.geoLabel}
                name="geo"
                value={data.geo}
                onChange={set}
                placeholder={t.ui.select}
                options={t.step2.geos}
              />
            </div>
            <RadioGroup
              legend={branchField.label}
              hint={branchField.hint}
              name={branchField.field}
              value={data[branchField.field]}
              onChange={set}
              options={branchField.options}
            />
          </Step>
        ) : null}

        {step === 3 ? (
          <Step
            tagline={t.step3.tagline}
            heading={t.step3.heading}
            lede={t.step3.lede}
          >
            <div className="space-y-3">
              {t.step3.questions.map((q) => (
                <fieldset key={q.lens} className="border border-border bg-card p-5">
                  <div className="mb-3 inline-flex items-stretch border border-border">
                    <span className="flex items-center bg-foreground px-2 font-mono text-[11px] font-medium text-background">
                      {q.lens}
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-muted-foreground">
                      <b className="font-medium text-foreground">{q.tagName}</b> · {q.tagStat}
                    </span>
                  </div>
                  <legend className="sr-only">{q.tagName}</legend>
                  <p className="mb-4 font-display text-base font-medium leading-snug md:text-lg">
                    {q.question}
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {q.options.map((o) => (
                      <label
                        key={o.value}
                        className="group flex cursor-pointer items-center justify-center border border-border bg-background px-3 py-2.5 text-center text-sm text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground has-[:checked]:border-foreground has-[:checked]:bg-card has-[:checked]:font-medium has-[:checked]:text-foreground has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring"
                      >
                        <input
                          type="radio"
                          name={q.lens}
                          value={o.value}
                          checked={data[q.lens] === o.value}
                          onChange={(e) => set(q.lens, e.target.value)}
                          className="sr-only"
                        />
                        {o.text}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
          </Step>
        ) : null}

        {step === 4 ? (
          <Step
            tagline={t.step4.tagline}
            heading={t.step4.heading}
            lede={t.step4.lede}
            signalCard={
              <div className="tone-dark mb-10 border border-border bg-card p-6 text-foreground">
                <span className="inline-flex items-center border border-border bg-white/[0.06] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {t.step4.signal.eyebrow}
                </span>
                <h2 className="mt-4 font-display text-2xl font-medium leading-tight tracking-tight">
                  {signal.headline}
                </h2>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-white',
                      VERDICT_BG[signal.klass],
                    )}
                  >
                    {signal.verdict}
                  </span>
                  <span className="text-sm text-muted-foreground">{t.step4.signal.note}</span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {t.step3.questions.map((q) => {
                    const flag = (data[q.lens] as RiskFlag | undefined) ?? 'pending'
                    return (
                      <div
                        key={q.lens}
                        className={cn('flex flex-col gap-1 border p-3', KPI_TINT[flag])}
                      >
                        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          {q.lens}
                        </span>
                        <span className="font-display text-sm font-medium text-foreground">
                          {q.short}
                        </span>
                        <span
                          className={cn(
                            'font-mono text-[10px] font-semibold uppercase tracking-wider',
                            KPI_FLAG[flag],
                          )}
                        >
                          {t.step4.signal.flags[flag]}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            }
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                label={t.step4.fields.name.label}
                name="name"
                value={data.name}
                onChange={set}
                placeholder={t.step4.fields.name.placeholder}
                autoComplete="name"
              />
              <TextField
                label={t.step4.fields.email.label}
                name="email"
                type="email"
                value={data.email}
                onChange={set}
                placeholder={t.step4.fields.email.placeholder}
                autoComplete="email"
              />
              <TextField
                label={t.step4.fields.company.label}
                name="company"
                value={data.company}
                onChange={set}
                placeholder={t.step4.fields.company.placeholder}
                autoComplete="organization"
              />
              <TextField
                label={t.step4.fields.title.label}
                name="title"
                value={data.title}
                onChange={set}
                placeholder={t.step4.fields.title.placeholder}
                autoComplete="organization-title"
              />
            </div>
            <TextField
              className="mt-5"
              label={t.step4.fields.phone.label}
              optionalLabel={t.ui.optional}
              name="phone"
              type="tel"
              value={data.phone}
              onChange={set}
              placeholder={t.step4.fields.phone.placeholder}
              autoComplete="tel"
            />
          </Step>
        ) : null}

        {step === 5 ? (
          <div className="py-4 text-center">
            <span className="mx-auto mb-6 inline-flex size-12 items-center justify-center bg-[var(--btn)] text-[var(--btn-foreground)]">
              <Check className="size-6" />
            </span>
            <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
              {t.step5.heading}
            </h1>
            <p className="mx-auto mt-3 max-w-md text-base text-muted-foreground">{t.step5.lede}</p>
            <div className="mx-auto mt-8 max-w-md border border-border bg-card p-6 text-left">
              <h2 className="mb-4 text-sm font-medium">{t.step5.summaryTitle}</h2>
              <dl className="space-y-3">
                {summaryItems.map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                      {k}
                    </dt>
                    <dd className="mt-0.5 text-sm text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        ) : null}
      </div>

      {/* Navigation */}
      {step < 5 ? (
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-border pt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              {t.ui.back}
            </button>
          ) : (
            <span />
          )}
          <div className="flex flex-col items-end gap-2">
            {error ? <span className="text-xs text-status-critical">{error}</span> : null}
            <button
              type="button"
              onClick={handleNext}
              disabled={!valid || submitting}
              className={cn(buttonVariants({ variant: 'default' }))}
            >
              {submitting ? t.ui.submitting : step === 4 ? t.ui.book : t.ui.continue}
              {!submitting ? <ArrowRight className="size-4" /> : null}
            </button>
          </div>
        </div>
      ) : null}

      <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground">
        {t.ui.confidential}
      </p>
    </div>
  )
}

/* ── Building blocks ─────────────────────────────────────────────────────── */

function Step({
  tagline,
  heading,
  lede,
  signalCard,
  children,
}: {
  tagline: string
  heading: string
  lede: string
  signalCard?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div>
      {signalCard}
      <span className="inline-flex items-center border border-border bg-muted px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        {tagline}
      </span>
      <h1 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight md:text-4xl">
        {heading}
      </h1>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
        {lede}
      </p>
      <div className="mt-8 space-y-8">{children}</div>
    </div>
  )
}

function RadioGroup({
  legend,
  hint,
  name,
  value,
  onChange,
  options,
  columns = 1,
}: {
  legend: string
  hint?: string
  name: string
  value?: string
  onChange: (name: string, value: string) => void
  options: Choice[]
  columns?: 1 | 2
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium text-foreground">{legend}</legend>
      <div className={cn('grid gap-2', columns === 2 ? 'sm:grid-cols-2' : 'grid-cols-1')}>
        {options.map((o) => (
          <label
            key={o.value}
            className="group flex cursor-pointer items-start gap-3 border border-border bg-card p-4 transition-colors hover:border-foreground/40 has-[:checked]:border-foreground has-[:checked]:bg-accent has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={(e) => onChange(name, e.target.value)}
              className="sr-only"
            />
            <span
              aria-hidden
              className="mt-0.5 size-4 shrink-0 border border-foreground/40 transition-all group-has-[:checked]:border-foreground group-has-[:checked]:bg-foreground group-has-[:checked]:shadow-[inset_0_0_0_3px_var(--card)]"
            />
            <span className="min-w-0">
              <span className="block text-sm font-medium leading-tight">{o.title}</span>
              {o.sub ? (
                <span className="mt-0.5 block text-xs text-muted-foreground">{o.sub}</span>
              ) : null}
            </span>
          </label>
        ))}
      </div>
      {hint ? <p className="mt-2 text-xs text-muted-foreground">{hint}</p> : null}
    </fieldset>
  )
}

function SelectField({
  label,
  name,
  value,
  onChange,
  placeholder,
  options,
}: {
  label: string
  name: string
  value?: string
  onChange: (name: string, value: string) => void
  placeholder: string
  options: Choice[]
}) {
  return (
    <label className="block">
      <span className="mb-3 block text-sm font-medium text-foreground">{label}</span>
      <div className="relative">
        <select
          name={name}
          value={value ?? ''}
          onChange={(e) => onChange(name, e.target.value)}
          className={cn(
            'h-11 w-full appearance-none border border-input bg-card px-3 pr-10 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            !value && 'text-muted-foreground',
          )}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value} className="text-foreground">
              {o.title}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </label>
  )
}

function TextField({
  label,
  optionalLabel,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  autoComplete,
  className,
}: {
  label: string
  optionalLabel?: string
  name: string
  value?: string
  onChange: (name: string, value: string) => void
  placeholder: string
  type?: string
  autoComplete?: string
  className?: string
}) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-3 block text-sm font-medium text-foreground">
        {label}
        {optionalLabel ? (
          <span className="ml-1.5 font-normal text-muted-foreground">— {optionalLabel}</span>
        ) : null}
      </span>
      <Input
        type={type}
        name={name}
        value={value ?? ''}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="bg-card"
      />
    </label>
  )
}
