import type { StatsBlock } from '@/payload-types'
import { Container, Eyebrow } from './shared'

export function Stats({ block }: { block: StatsBlock }) {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            {block.eyebrow ? <Eyebrow>{block.eyebrow}</Eyebrow> : null}
            {block.heading ? (
              <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                {block.heading}
              </h2>
            ) : null}
            {block.body ? (
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                {block.body}
              </p>
            ) : null}
          </div>
          <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-1">
            {block.stats?.map((s, i) => (
              <div key={s.id ?? i} className="bg-card p-7">
                <div className="text-4xl font-semibold tracking-tight text-primary">
                  {s.value}
                </div>
                <h3 className="mt-2 text-base font-medium leading-snug">{s.label}</h3>
                {s.source ? (
                  <p className="mt-2 text-sm italic text-muted-foreground">{s.source}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
