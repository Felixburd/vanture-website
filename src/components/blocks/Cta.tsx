import Image from 'next/image'
import type { CtaBlock } from '@/payload-types'
import type { Locale } from '@/i18n/routing'
import { Buttons, Container, Eyebrow, Paragraphs } from './shared'

export async function Cta({ block, locale }: { block: CtaBlock; locale: Locale }) {
  const img = typeof block.image === 'object' ? block.image : null

  if (img?.url) {
    return (
      <section className="py-24 md:py-28">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              {block.eyebrow ? <Eyebrow>{block.eyebrow}</Eyebrow> : null}
              {block.heading ? (
                <h2 className="mt-4 text-balance text-3xl font-medium leading-tight tracking-tight md:text-4xl">
                  {block.heading}
                </h2>
              ) : null}
              <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
                <Paragraphs text={block.body} />
              </div>
              <div className="mt-8">
                <Buttons buttons={block.buttons} locale={locale} />
              </div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border lg:aspect-[4/4.5]">
              <Image
                src={img.url}
                alt={img.alt ?? ''}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 48vw"
              />
            </div>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="py-24 md:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          {block.eyebrow ? <Eyebrow>{block.eyebrow}</Eyebrow> : null}
          {block.heading ? (
            <h2 className="mt-4 text-balance text-4xl font-medium leading-tight tracking-tight md:text-5xl">
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
