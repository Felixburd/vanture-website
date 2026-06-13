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

  const meta: Metadata = { title, description }
  // Next overwrites (not deep-merges) `openGraph`, so only set it when this doc has
  // its own share image. Otherwise the layout's default OG image is preserved on
  // every page, while `title`/`description` above still apply per page.
  if (img) {
    meta.openGraph = { title, description, images: [{ url: img }] }
  }
  return meta
}
