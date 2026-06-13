import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react'
import { getFooter } from '@/lib/payload'
import { NewsletterForm } from './NewsletterForm'
import type { Locale } from '@/i18n/routing'

const icons = {
  LinkedIn: Linkedin,
  Facebook: Facebook,
  Instagram: Instagram,
  X: Twitter,
  YouTube: Youtube,
} as const

export async function Footer({ locale }: { locale: Locale }) {
  const footer = await getFooter(locale)
  const year = new Date().getFullYear()

  return (
    <footer className="tone-dark border-t bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
          <div className="max-w-md">
            {footer.newsletterHeading ? (
              <h3 className="text-lg font-semibold tracking-tight">{footer.newsletterHeading}</h3>
            ) : null}
            {footer.newsletterBody ? (
              <p className="mt-1 text-sm text-muted-foreground">{footer.newsletterBody}</p>
            ) : null}
            <div className="mt-4">
              <NewsletterForm locale={locale} />
            </div>
            {footer.newsletterDisclaimer ? (
              <p className="mt-2 text-xs text-muted-foreground">{footer.newsletterDisclaimer}</p>
            ) : null}
          </div>

          {footer.socialLinks?.length ? (
            <div className="flex gap-3">
              {footer.socialLinks.map((s, i) => {
                const Icon = icons[s.platform]
                return (
                  <a
                    key={s.id ?? i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.platform}
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          ) : null}
        </div>

        <div className="mt-12 border-t border-border/60 pt-6 text-sm text-muted-foreground">
          © {year} {footer.legalName}
        </div>
      </div>
    </footer>
  )
}
