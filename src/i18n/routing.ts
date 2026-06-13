import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'fr-ca'],
  defaultLocale: 'en',
  // English lives at `/`, French at `/fr-ca` — matches the legacy site's URLs.
  localePrefix: 'as-needed',
})

export type Locale = (typeof routing.locales)[number]
