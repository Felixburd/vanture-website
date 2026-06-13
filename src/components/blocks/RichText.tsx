import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { RichTextBlock } from '@/payload-types'
import { Container, Eyebrow } from './shared'

export function RichTextView({ block }: { block: RichTextBlock }) {
  return (
    <section className="border-b border-border/60 py-20 md:py-28">
      <Container className="max-w-3xl">
        {block.eyebrow ? <Eyebrow>{block.eyebrow}</Eyebrow> : null}
        {block.heading ? (
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            {block.heading}
          </h2>
        ) : null}
        {block.content ? (
          <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_strong]:text-foreground">
            <LexicalRichText data={block.content} />
          </div>
        ) : null}
      </Container>
    </section>
  )
}
