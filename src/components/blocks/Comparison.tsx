import type { ComparisonBlock } from '@/payload-types'
import { Container } from './shared'

export function Comparison({ block }: { block: ComparisonBlock }) {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="max-w-2xl">
          {block.heading ? (
            <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              {block.heading}
            </h2>
          ) : null}
        </div>
        {/* md+ : full comparison table */}
        <div className="mt-10 hidden overflow-hidden rounded-xl border border-border md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-card/60 font-mono text-[11px] uppercase tracking-[0.12em]">
              <tr>
                <th className="px-5 py-4 font-medium text-muted-foreground">Dimension</th>
                <th className="px-5 py-4 font-medium text-muted-foreground">
                  {block.colTraditional}
                </th>
                <th className="px-5 py-4 font-medium text-primary">{block.colDvta}</th>
              </tr>
            </thead>
            <tbody>
              {block.rows?.map((row, i) => (
                <tr key={row.id ?? i} className="border-t border-border/60">
                  <td className="px-5 py-4 font-medium">{row.dimension}</td>
                  <td className="px-5 py-4 text-muted-foreground">{row.traditional}</td>
                  <td className="px-5 py-4">{row.dvta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* mobile : one stacked card per dimension, no sideways scroll */}
        <div className="mt-8 grid gap-3 md:hidden">
          {block.rows?.map((row, i) => (
            <div key={row.id ?? i} className="rounded-xl border border-border bg-card p-5">
              <p className="font-medium">{row.dimension}</p>
              <dl className="mt-4 grid gap-4">
                <div className="grid gap-1">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    {block.colTraditional}
                  </dt>
                  <dd className="text-sm text-muted-foreground">{row.traditional}</dd>
                </div>
                <div className="grid gap-1 border-t border-border/60 pt-4">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-primary">
                    {block.colDvta}
                  </dt>
                  <dd className="text-sm">{row.dvta}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
