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

const toneClass: Record<string, string> = {
  light: 'tone-light',
  white: 'tone-white',
  dark: 'tone-dark',
  graydark: 'tone-graydark',
}

function renderBlock(block: Block, locale: Locale) {
  switch (block.blockType) {
    case 'hero':
      return <Hero block={block} locale={locale} />
    case 'stats':
      return <Stats block={block} />
    case 'dvtaPanel':
      return <DvtaPanel block={block} locale={locale} />
    case 'lenses':
      return <Lenses block={block} />
    case 'audience':
      return <Audience block={block} locale={locale} />
    case 'comparison':
      return <Comparison block={block} />
    case 'cta':
      return <Cta block={block} locale={locale} />
    case 'richText':
      return <RichTextView block={block} />
    default:
      return null
  }
}

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
          const tone = toneClass[block.tone ?? 'light'] ?? 'tone-light'
          return (
            <div key={block.id} className={`${tone} bg-background text-foreground`}>
              {renderBlock(block, locale)}
            </div>
          )
        }),
      )}
    </>
  )
}
