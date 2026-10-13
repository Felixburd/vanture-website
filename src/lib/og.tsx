import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import type { CaseStudy } from '@/payload-types'
import { OG_SIZE } from '@/lib/seo'

// Colours from the `.tone-dark` tokens in globals.css (the brand hero surface).
const c = {
  background: '#010202',
  foreground: '#ffffff',
  muted: '#9a9a9a',
  border: 'rgba(255, 255, 255, 0.14)',
}

// Decision signal colours mirror the Badge variants (green / amber / critical)
// under tone-dark. Critical is the solid alarm; dark text keeps it legible on
// the lighter dark-tone red.
const signal: Record<CaseStudy['decisionSignal'], { color: string; background: string; border: string }> = {
  GO: { color: '#34d399', background: 'rgba(52, 211, 153, 0.10)', border: 'rgba(52, 211, 153, 0.25)' },
  PROCEED_WITH_CONDITIONS: {
    color: '#fbbf24',
    background: 'rgba(251, 191, 36, 0.12)',
    border: 'rgba(251, 191, 36, 0.30)',
  },
  NO_GO: { color: '#010202', background: '#f87171', border: '#f87171' },
}

// Fonts and the mark are read from disk once per process — no network at render.
// Static woff files (satori can't read woff2 or variable fonts): Roboto Flex 500
// as the display face and IBM Plex Mono for the instrument register.
let assets: Promise<{ fonts: NonNullable<ConstructorParameters<typeof ImageResponse>[1]>['fonts']; mark: string }>
function loadAssets() {
  assets ??= (async () => {
    const dir = join(process.cwd(), 'src/assets/og')
    const font = (file: string) => readFile(join(dir, file))
    const [display, mono, svg] = await Promise.all([
      font('roboto-flex-latin-500-normal.woff'),
      font('ibm-plex-mono-latin-500-normal.woff'),
      readFile(join(process.cwd(), 'public/vanture-mark.svg'), 'utf8'),
    ])
    return {
      fonts: [
        { name: 'Roboto Flex', data: display, weight: 500, style: 'normal' },
        { name: 'IBM Plex Mono', data: mono, weight: 500, style: 'normal' },
      ],
      // The mark is drawn in near-black; recolour it for the dark surface.
      mark: `data:image/svg+xml;base64,${Buffer.from(svg.replaceAll('#1d1d1b', c.foreground)).toString('base64')}`,
    }
  })()
  return assets
}

// Step the title size down as it grows so long (French) titles still fit in
// three lines; lineClamp is the backstop for anything longer. Balanced wrapping
// is skipped once clamping is likely — satori balances over the full text, which
// leaves the visible lines short.
const titleSize = (title: string) => (title.length > 90 ? 56 : title.length > 55 ? 64 : 76)

export async function renderOgImage({
  title,
  eyebrow,
  siteName,
  host,
  caseStudy,
}: {
  title: string
  /** Small mono label above the title, e.g. the case study's industry. */
  eyebrow?: string | null
  siteName: string
  host: string
  caseStudy?: { signal: CaseStudy['decisionSignal']; signalLabel: string }
}) {
  const { fonts, mark } = await loadAssets()
  const s = caseStudy ? signal[caseStudy.signal] : null

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          color: c.foreground,
          backgroundColor: c.background,
          // Same faint top glow as the dark sections on the site.
          backgroundImage:
            'radial-gradient(125% 90% at 50% -25%, rgba(255, 255, 255, 0.10), rgba(255, 255, 255, 0) 55%)',
          fontFamily: 'Roboto Flex',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mark} width={64} height={56} alt="" />
          <div style={{ fontFamily: 'Roboto Flex', fontSize: 34, letterSpacing: '0.02em' }}>
            {siteName}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {eyebrow ? (
            <div
              style={{
                fontFamily: 'IBM Plex Mono',
                fontSize: 22,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: c.muted,
                marginBottom: 20,
                display: 'block',
                maxWidth: 1000,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              display: 'block',
              fontFamily: 'Roboto Flex',
              fontSize: titleSize(title),
              lineHeight: 1.12,
              letterSpacing: '-0.018em',
              maxWidth: 1000,
              lineClamp: 3,
              textWrap: title.length > 110 ? 'wrap' : 'balance',
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: `1px solid ${c.border}`,
            paddingTop: 28,
            fontFamily: 'IBM Plex Mono',
            fontSize: 20,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {s && caseStudy ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '8px 16px',
                color: s.color,
                backgroundColor: s.background,
                border: `1px solid ${s.border}`,
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: 9999, backgroundColor: s.color }} />
              {caseStudy.signalLabel}
            </div>
          ) : (
            <div style={{ display: 'flex' }} />
          )}
          <div style={{ color: c.muted }}>{host}</div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts,
      // The URL is stable per page, so don't let ImageResponse's default
      // year-long `immutable` pin an outdated title in browsers and CDNs.
      headers: { 'cache-control': 'public, max-age=86400, stale-while-revalidate=604800' },
    },
  )
}
