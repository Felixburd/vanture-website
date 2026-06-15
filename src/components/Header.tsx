import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getHeader } from '@/lib/payload'
import { CMSLink } from '@/components/CMSLink'
import { LocaleSwitcher } from './LocaleSwitcher'
import type { Locale } from '@/i18n/routing'

export async function Header({ locale }: { locale: Locale }) {
  const header = await getHeader(locale)
  const logo = typeof header.logo === 'object' ? header.logo : null

  return (
    <header className="tone-light sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between border-x border-border px-6">
        <Link
          href="/"
          locale={locale}
          className="flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          {logo?.url ? (
            <Image
              src={logo.url}
              alt={logo.alt ?? 'Vanture'}
              width={120}
              height={28}
              className="h-7 w-auto"
            />
          ) : (
            'Vanture'
          )}
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {header.navItems?.map((item, i) => (
            <CMSLink
              key={item.id ?? i}
              link={item.link}
              locale={locale}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            />
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LocaleSwitcher locale={locale} />
          <CMSLink
            link={header.cta}
            locale={locale}
            variant="default"
            size="sm"
            className="hidden sm:inline-flex"
          />
        </div>
      </div>
    </header>
  )
}
