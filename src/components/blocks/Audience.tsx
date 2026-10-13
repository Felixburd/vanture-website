import Image from 'next/image'
import type { AudienceBlock } from '@/payload-types'
import type { Locale } from '@/i18n/routing'
import { CMSLink } from '@/components/CMSLink'
import { Container } from './shared'
import { cn } from '@/lib/utils'

// Bento layout: a large feature tile + three supporting tiles.
const spans = [
  'lg:col-span-2 lg:row-span-2',
  'lg:col-span-2',
  'lg:col-span-1',
  'lg:col-span-1',
]

export async function Audience({
  block,
  locale,
}: {
  block: AudienceBlock
  locale: Locale
}) {
  const cards = block.cards ?? []
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[minmax(15rem,auto)]">
          {await Promise.all(
            cards.map(async (card, i) => {
              const img = typeof card.image === 'object' ? card.image : null
              const big = i === 0
              return (
                <div
                  key={card.id ?? i}
                  className={cn(
                    'group relative flex flex-col justify-end overflow-hidden rounded-2xl border p-6',
                    spans[i] ?? 'lg:col-span-1',
                  )}
                >
                  {img?.url ? (
                    <>
                      <Image
                        src={img.url}
                        alt={img.alt ?? ''}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-card" />
                  )}

                  <div className="relative">
                    {card.eyebrow ? (
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                        {card.eyebrow}
                      </span>
                    ) : null}
                    <h3
                      className={cn(
                        'mt-2 font-medium tracking-tight text-white',
                        big ? 'text-2xl md:text-3xl' : 'text-xl',
                      )}
                    >
                      {card.title}
                    </h3>
                    {card.body ? (
                      <p
                        className={cn(
                          'mt-2 text-sm leading-relaxed text-white/80',
                          big ? 'max-w-md' : '',
                        )}
                      >
                        {card.body}
                      </p>
                    ) : null}
                    {card.buttons?.length ? (
                      <div className="mt-4 flex flex-wrap gap-4">
                        {await Promise.all(
                          card.buttons.map(async (b, j) => (
                            <CMSLink
                              key={b.id ?? j}
                              link={b.link}
                              locale={locale}
                              variant="link"
                              className="h-auto px-0 text-white hover:text-white/75"
                            />
                          )),
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              )
            }),
          )}
        </div>
      </Container>
    </section>
  )
}
