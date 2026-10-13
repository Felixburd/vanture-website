import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { setRequestLocale, getMessages } from 'next-intl/server'
import { Inter, Roboto_Flex, IBM_Plex_Mono } from 'next/font/google'
import { routing, type Locale } from '@/i18n/routing'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { JsonLd } from '@/components/JsonLd'
import { getFooter, getSiteSettings } from '@/lib/payload'
import { SITE_URL, absoluteUrl, localePath, shareImages } from '@/lib/seo'
import '../globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const robotoFlex = Roboto_Flex({
  subsets: ['latin'],
  variable: '--font-roboto-flex',
  display: 'swap',
})
// Utility/data face — used only for the "instrument" register: eyebrows, scores,
// lens codes, table labels, status. Keeps the display/body type unchanged.
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const settings = await getSiteSettings(locale as Locale)
  // Pages without their own openGraph fall back to the locale's generated home image.
  const images = shareImages(locale as Locale, '')

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: settings.defaultSeo?.title || 'Vanture',
      template: '%s · Vanture',
    },
    description: settings.defaultSeo?.description || undefined,
    openGraph: {
      siteName: settings.siteName || 'Vanture',
      locale: locale === 'fr-ca' ? 'fr_CA' : 'en_CA',
      type: 'website',
      images,
    },
    twitter: { card: 'summary_large_image', images },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const messages = await getMessages()
  const [settings, footer] = await Promise.all([getSiteSettings(locale), getFooter(locale)])
  const siteName = settings.siteName || 'Vanture'

  // Sitewide entity graph: who publishes this site, and the site itself.
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: siteName,
        url: absoluteUrl('/'),
        logo: absoluteUrl('/vanture-mark.svg'),
        description: settings.defaultSeo?.description || undefined,
        sameAs: footer.socialLinks?.map((s) => s.url).filter(Boolean),
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: siteName,
        url: absoluteUrl(localePath(locale)),
        inLanguage: locale === 'fr-ca' ? 'fr-CA' : 'en',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  }

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${robotoFlex.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans antialiased">
        <JsonLd data={structuredData} />
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale} />
          <main>{children}</main>
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
