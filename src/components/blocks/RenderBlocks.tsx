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
import { GridFrame } from './shared'

type Block = NonNullable<Page['layout']>[number]

const toneClass: Record<string, string> = {
  light: 'tone-light',
  white: 'tone-white',
  dark: 'tone-dark',
  graydark: 'tone-graydark',
}

function renderBlock(block: Block, locale: Locale, showHeroWireframe: boolean) {
  switch (block.blockType) {
    case 'hero':
      return <Hero block={block} locale={locale} wireframe={showHeroWireframe} />
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
  showHeroWireframe = false,
}: {
  blocks?: Page['layout']
  locale: Locale
  /** Enable the ambient 3D hairline wireframe on this page's hero (About only). */
  showHeroWireframe?: boolean
}) {
  if (!blocks?.length) return null
  return (
    <>
      {await Promise.all(
        blocks.map(async (block: Block, i: number) => {
          const tone = toneClass[block.tone ?? 'light'] ?? 'tone-light'
          return (
            <div
              key={block.id}
              className={`${tone} relative bg-background text-foreground`}
            >
              <GridFrame top={i !== 0} />
              <div className="relative z-10">
                {renderBlock(block, locale, showHeroWireframe)}
              </div>
            </div>
          )
        }),
      )}
    </>
  )
}
