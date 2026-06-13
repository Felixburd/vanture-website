import type { CtaBlock } from '@/payload-types'
import type { Locale } from '@/i18n/routing'
import { Buttons, Container, Eyebrow, Paragraphs } from './shared'

export async function Cta({ block, locale }: { block: CtaBlock; locale: Locale }) {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          {block.eyebrow ? <Eyebrow>{block.eyebrow}</Eyebrow> : null}
          {block.heading ? (
            <h2 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              {block.heading}
            </h2>
          ) : null}
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted-foreground">
            <Paragraphs text={block.body} />
          </div>
          <div className="mt-9 flex justify-center">
            <Buttons buttons={block.buttons} locale={locale} />
          </div>
        </div>
      </Container>
    </section>
  )
}
