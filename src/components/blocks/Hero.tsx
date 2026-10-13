import Image from 'next/image'
import type { HeroBlock } from '@/payload-types'
import type { Locale } from '@/i18n/routing'
import { Buttons, Container } from './shared'
import { HeroWireframe } from './HeroWireframe'

export async function Hero({
  block,
  locale,
  wireframe = false,
}: {
  block: HeroBlock
  locale: Locale
  wireframe?: boolean
}) {
  const img = typeof block.image === 'object' ? block.image : null

  return (
    <section className="relative overflow-hidden">
      {wireframe ? <HeroWireframe /> : null}
      <Container className="relative z-10 py-24 md:py-32">
        <div
          className={
            img ? 'grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]' : 'max-w-3xl'
          }
        >
          <div>
            <h1 className="text-balance text-4xl font-medium leading-[1.04] tracking-tight md:text-6xl">
              {block.headline}
            </h1>
            {block.subhead ? (
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {block.subhead}
              </p>
            ) : null}
            <div className="mt-9">
              <Buttons buttons={block.buttons} locale={locale} />
            </div>
          </div>

          {img?.url ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border lg:aspect-[5/6]">
              <Image
                src={img.url}
                alt={img.alt ?? ''}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 48vw"
              />
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
