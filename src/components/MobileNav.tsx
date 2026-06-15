'use client'

import { useEffect, useState } from 'react'
import { Link, usePathname } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export type NavLink = {
  label: string
  href: string
  external: boolean
  newTab: boolean
}

/**
 * Mobile-only nav: a hamburger toggle that opens a full-width panel below the
 * header bar. Nav items are pre-resolved server-side (label + href) so this
 * stays a light client component. Hidden at `md` and up, where the inline nav
 * takes over.
 */
export function MobileNav({
  locale,
  navItems,
  cta,
}: {
  locale: Locale
  navItems: NavLink[]
  cta: NavLink | null
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close on navigation.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Lock body scroll while the panel is open.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const itemClass =
    'border-b border-border/60 py-4 text-base text-foreground transition-colors hover:text-muted-foreground'

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="-mr-2 inline-flex h-10 w-10 items-center justify-center text-foreground"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          {open ? (
            <path d="M5 5l14 14M19 5 5 19" strokeLinecap="round" />
          ) : (
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-x-0 bottom-0 top-16 z-40 cursor-default bg-foreground/10"
          />
          <nav className="fixed inset-x-0 top-16 z-40 border-b bg-background/95 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-2">
              {navItems.map((item, i) =>
                item.external ? (
                  <a
                    key={i}
                    href={item.href}
                    target={item.newTab ? '_blank' : undefined}
                    rel={item.newTab ? 'noopener noreferrer' : undefined}
                    className={itemClass}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link key={i} href={item.href} locale={locale} className={itemClass}>
                    {item.label}
                  </Link>
                ),
              )}
              {cta ? (
                <Link
                  href={cta.href}
                  locale={locale}
                  className={cn(buttonVariants({ variant: 'default' }), 'mt-4 mb-2 w-full')}
                >
                  {cta.label}
                </Link>
              ) : null}
            </div>
          </nav>
        </>
      ) : null}
    </div>
  )
}
