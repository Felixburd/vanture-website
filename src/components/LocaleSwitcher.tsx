'use client'

import { usePathname, Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { cn } from '@/lib/utils'

const labels: Record<string, string> = { en: 'en', 'fr-ca': 'fr' }

export function LocaleSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname()
  return (
    <div className="flex items-center gap-1.5 text-xs">
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-1.5">
          <Link
            href={pathname}
            locale={loc}
            className={cn(
              'uppercase tracking-wide transition-colors',
              loc === locale
                ? 'font-semibold text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {labels[loc] ?? loc}
          </Link>
          {i < routing.locales.length - 1 ? (
            <span className="text-muted-foreground/40">/</span>
          ) : null}
        </span>
      ))}
    </div>
  )
}
