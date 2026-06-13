import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { setRequestLocale, getMessages } from 'next-intl/server'
import { Inter } from 'next/font/google'
import { routing, type Locale } from '@/i18n/routing'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getSiteSettings } from '@/lib/payload'
import '../globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const settings = await getSiteSettings(locale)
  const ogImage =
    typeof settings.defaultSeo?.image === 'object' ? settings.defaultSeo?.image?.url : undefined

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
    title: {
      default: settings.defaultSeo?.title || 'Vanture',
      template: '%s · Vanture',
    },
    description: settings.defaultSeo?.description || undefined,
    openGraph: {
      siteName: settings.siteName || 'Vanture',
      locale,
      type: 'website',
      images: ogImage ? [{ url: ogImage }] : [],
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale} className={`dark ${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale} />
          <main>{children}</main>
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
