import type { LensesBlock } from '@/payload-types'
import { Container, Eyebrow } from './shared'

export function Lenses({ block }: { block: LensesBlock }) {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="max-w-2xl">
          {block.eyebrow ? <Eyebrow>{block.eyebrow}</Eyebrow> : null}
          {block.heading ? (
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              {block.heading}
            </h2>
          ) : null}
          {block.body ? (
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">{block.body}</p>
          ) : null}
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {block.lenses?.map((lens, i) => (
            <div
              key={lens.id ?? i}
              className="flex flex-col rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-primary/15 px-2 py-0.5 font-mono text-xs font-medium uppercase tracking-wider text-primary">
                  {lens.code}
                </span>
                {lens.failurePercent ? (
                  <span className="text-right text-sm">
                    <span className="font-mono font-medium tabular-nums">{lens.failurePercent}</span>{' '}
                    <span className="text-muted-foreground">{lens.failureLabel}</span>
                  </span>
                ) : null}
              </div>
              <h3 className="mt-4 text-xl font-semibold tracking-tight">{lens.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {lens.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
