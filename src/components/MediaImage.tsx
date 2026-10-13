import type { Media } from '@/payload-types'
import { cn } from '@/lib/utils'

type SizeName = keyof NonNullable<Media['sizes']>
type Source = { url: string; width: number; height?: number | null }

// Smallest → largest, matching the Media collection's imageSizes.
const ORDER: SizeName[] = ['thumbnail', 'card', 'hero']

/**
 * Picks pre-generated Payload sizes up to `max` for a srcset (next/image runs
 * unoptimized, so it can't do this for us). Only WebP sizes are trusted: older
 * JPEG sizes were generated off-disk by the seed job and may be missing on
 * Render until `pnpm media:regenerate` has run. Falls back to the original.
 */
export function mediaSources(media: Media, max: SizeName) {
  const sizes: Source[] = ORDER.slice(0, ORDER.indexOf(max) + 1)
    .map((name) => media.sizes?.[name])
    .filter(
      (s): s is Source => Boolean(s?.url && s.width && s.mimeType === 'image/webp'),
    )

  // Payload skips sizes wider than the original, so an image narrower than
  // `max` keeps the original as its largest candidate.
  const largest = sizes.at(-1)
  if (
    largest &&
    !media.sizes?.[max]?.url &&
    media.url &&
    media.width &&
    media.width > largest.width
  ) {
    sizes.push({ url: media.url, width: media.width, height: media.height })
  }

  const src = sizes.at(-1) ?? { url: media.url ?? '', width: media.width ?? 0, height: media.height }
  return {
    src: src.url,
    srcSet: sizes.length ? sizes.map((s) => `${s.url} ${s.width}w`).join(', ') : undefined,
    width: src.width || undefined,
    height: src.height || undefined,
  }
}

export function MediaImage({
  media,
  max,
  sizes,
  alt,
  className,
  priority = false,
}: {
  media: Media
  max: SizeName
  /** Rendered width hint for the browser's srcset choice. */
  sizes: string
  alt?: string
  className?: string
  priority?: boolean
}) {
  const { src, srcSet, width, height } = mediaSources(media, max)
  return (
    // Fills its positioned parent, like next/image `fill`.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      width={width}
      height={height}
      alt={alt ?? media.alt ?? ''}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      className={cn('absolute inset-0 h-full w-full', className)}
    />
  )
}
