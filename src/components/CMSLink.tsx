import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import type { Page } from '@/payload-types'

export type LinkGroup =
  | {
      label?: string | null
      type?: ('booking' | 'page' | 'custom') | null
      page?: (number | null) | Page
      url?: string | null
      newTab?: boolean | null
    }
  | null
  | undefined

type Variant = 'default' | 'outline' | 'secondary' | 'ghost' | 'link'
type Size = 'default' | 'sm' | 'lg' | 'icon'

function slugToPath(slug?: string | null) {
  if (!slug || slug === 'home') return '/'
  return `/${slug}`
}

export async function resolveHref(link: LinkGroup) {
  const label = link?.label ?? ''
  const newTab = Boolean(link?.newTab)
  if (!link) return { href: '#', external: false, label, newTab }
  if (link.type === 'booking') {
    // Every "Book a briefing / Contact" CTA now routes to the in-app multi-step
    // briefing form; the locale-aware <Link> prepends /fr-ca as needed.
    return { href: '/briefing', external: false, label, newTab: false }
  }
  if (link.type === 'page') {
    const slug = typeof link.page === 'object' && link.page ? link.page.slug : undefined
    return { href: slugToPath(slug), external: false, label, newTab }
  }
  const url = link.url || '#'
  return { href: url, external: /^https?:\/\//.test(url), label, newTab }
}

export async function CMSLink({
  link,
  locale,
  className,
  variant,
  size,
  children,
}: {
  link: LinkGroup
  locale: Locale
  className?: string
  variant?: Variant
  size?: Size
  children?: React.ReactNode
}) {
  const { href, external, label, newTab } = await resolveHref(link)
  const cls = variant ? cn(buttonVariants({ variant, size }), className) : className
  const content = children ?? label
  if (!content) return null

  if (external) {
    return (
      <a
        href={href}
        className={cls}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    )
  }
  return (
    <Link href={href} locale={locale} className={cls}>
      {content}
    </Link>
  )
}
