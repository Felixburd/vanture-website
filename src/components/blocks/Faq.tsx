import { ChevronDown } from 'lucide-react'
import type { FaqBlock } from '@/payload-types'
import type { Locale } from '@/i18n/routing'
import { Container, Paragraphs } from './shared'

/**
 * One FAQPage entity covering every FAQ block on the page (Google expects a
 * single FAQPage per URL). Returns null when there are no questions.
 */
export function faqStructuredData(blocks: FaqBlock[], locale: Locale) {
  const items = blocks.flatMap((b) => b.items ?? []).filter((i) => i.question && i.answer)
  if (!items.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale === 'fr-ca' ? 'fr-CA' : 'en',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.question,
      acceptedAnswer: { '@type': 'Answer', text: i.answer },
    })),
  }
}

/** Native <details> disclosures: keyboard operable and functional without JS. */
export function Faq({ block }: { block: FaqBlock }) {
  return (
    <section className="py-20 md:py-28">
      <Container className="max-w-3xl">
        {block.heading ? (
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            {block.heading}
          </h2>
        ) : null}
        <div className="mt-10 overflow-hidden rounded-xl border border-border bg-card">
          {block.items?.map((item, i) => (
            <details key={item.id ?? i} className="group border-t border-border/60 first:border-t-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring md:px-6 [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <ChevronDown
                  aria-hidden
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                />
              </summary>
              <div className="space-y-4 px-5 pb-5 text-sm leading-relaxed text-muted-foreground md:px-6">
                <Paragraphs text={item.answer} />
              </div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  )
}
