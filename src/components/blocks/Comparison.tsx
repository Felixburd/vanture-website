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
        <div className="mt-10 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[34rem] text-left text-sm">
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
      </Container>
    </section>
  )
}
