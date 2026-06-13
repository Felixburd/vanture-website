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
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: img ? [{ url: img }] : undefined,
    },
  }
}
