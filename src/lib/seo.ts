import type { Metadata } from 'next'
import type { Media } from '@/payload-types'

type Seo = {
  title?: string | null
  description?: string | null
  image?: (number | null) | Media
} | null | undefined

export function docMetadata(seo: Seo, fallbackTitle?: string | null): Metadata {
  const title = seo?.title || fallbackTitle || undefined
  const description = seo?.description || undefined
  const img = seo?.image && typeof seo.image === 'object' ? seo.image.url : undefined

  // Omit undefined keys entirely — an explicit `title: undefined` suppresses the
  // layout's `title.default` instead of falling back to it (e.g. blank home title).
  const meta: Metadata = {}
  if (title) meta.title = title
  if (description) meta.description = description
  // Next overwrites (not deep-merges) `openGraph`, so only set it when this doc has
  // its own share image; otherwise the layout's default OG image is preserved.
  if (img) {
    meta.openGraph = { title, description, images: [{ url: img }] }
  }
  return meta
}
