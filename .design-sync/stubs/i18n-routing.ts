// design-sync build stub for @/i18n/routing — mirrors the real routing config
// shape without importing next-intl's defineRouting (keeps next-intl out of the
// bundle entirely). Mapped in tsconfig.build.json.
export const routing = {
  locales: ['en', 'fr-ca'] as const,
  defaultLocale: 'en',
  localePrefix: 'as-needed' as const,
}

export type Locale = (typeof routing.locales)[number]
