import type { Page } from '@/payload-types'
import type { Locale } from '@/i18n/routing'
import { Hero } from './Hero'
import { Stats } from './Stats'
import { DvtaPanel } from './DvtaPanel'
import { Lenses } from './Lenses'
import { Audience } from './Audience'
import { Comparison } from './Comparison'
import { Cta } from './Cta'
import { RichTextView } from './RichText'

type Block = NonNullable<Page['layout']>[number]

export async function RenderBlocks({
  blocks,
  locale,
}: {
  blocks?: Page['layout']
  locale: Locale
}) {
  if (!blocks?.length) return null
  return (
    <>
      {await Promise.all(
        blocks.map(async (block: Block) => {
          switch (block.blockType) {
            case 'hero':
              return <Hero key={block.id} block={block} locale={locale} />
            case 'stats':
              return <Stats key={block.id} block={block} />
            case 'dvtaPanel':
              return <DvtaPanel key={block.id} block={block} locale={locale} />
            case 'lenses':
              return <Lenses key={block.id} block={block} />
            case 'audience':
              return <Audience key={block.id} block={block} locale={locale} />
            case 'comparison':
              return <Comparison key={block.id} block={block} />
            case 'cta':
              return <Cta key={block.id} block={block} locale={locale} />
            case 'richText':
              return <RichTextView key={block.id} block={block} />
            default:
              return null
          }
        }),
      )}
    </>
  )
}
