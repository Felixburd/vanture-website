import type { HeroBlock } from '@/payload-types'
import type { Locale } from '@/i18n/routing'
import { Buttons, Container, Eyebrow } from './shared'

export async function Hero({ block, locale }: { block: HeroBlock; locale: Locale }) {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,oklch(0.8_0.13_78/0.12),transparent)]" />
      <Container className="relative py-24 md:py-36">
        <div className="max-w-3xl">
          {block.eyebrow ? (
            <div className="mb-5">
              <Eyebrow>{block.eyebrow}</Eyebrow>
            </div>
          ) : null}
          <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            {block.headline}
          </h1>
          {block.subhead ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {block.subhead}
            </p>
          ) : null}
          <div className="mt-9">
            <Buttons buttons={block.buttons} locale={locale} />
          </div>
        </div>
      </Container>
    </section>
  )
}
