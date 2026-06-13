import { getPayload } from 'payload'
import config from '@payload-config'
import { cache } from 'react'
import type { Locale } from '@/i18n/routing'

export const getPayloadClient = cache(async () => getPayload({ config }))

export const getPage = cache(async (slug: string, locale: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    locale,
    depth: 2,
    limit: 1,
  })
  return docs[0] ?? null
})

export const getCaseStudies = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'caseStudies',
    locale,
    depth: 1,
    limit: 50,
    sort: '-publishedDate',
  })
  return docs
})

export const getCaseStudy = cache(async (slug: string, locale: Locale) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'caseStudies',
    where: { slug: { equals: slug } },
    locale,
    depth: 1,
    limit: 1,
  })
  return docs[0] ?? null
})

export const getHeader = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'header', locale, depth: 1 })
})

export const getFooter = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'footer', locale, depth: 1 })
})

export const getSiteSettings = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'siteSettings', locale, depth: 1 })
})
