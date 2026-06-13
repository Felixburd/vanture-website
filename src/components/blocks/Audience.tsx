import type { AudienceBlock } from '@/payload-types'
import type { Locale } from '@/i18n/routing'
import { Buttons, Container } from './shared'

export async function Audience({
  block,
  locale,
}: {
  block: AudienceBlock
  locale: Locale
}) {
  return (
    <section className="border-b border-border/60 py-20 md:py-28">
      <Container>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {await Promise.all(
            (block.cards ?? []).map(async (card, i) => (
              <div
                key={card.id ?? i}
                className="flex flex-col justify-between rounded-xl border border-border bg-card p-6"
              >
                <div>
                  {card.eyebrow ? (
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      {card.eyebrow}
                    </span>
                  ) : null}
                  <h3 className="mt-3 text-xl font-semibold tracking-tight">{card.title}</h3>
                  {card.body ? (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {card.body}
                    </p>
                  ) : null}
                </div>
                <div className="mt-6">
                  <Buttons buttons={card.buttons} locale={locale} variants={['link']} />
                </div>
              </div>
            )),
          )}
        </div>
      </Container>
    </section>
  )
}
