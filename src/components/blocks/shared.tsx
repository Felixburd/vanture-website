import { CMSLink, type LinkGroup } from '@/components/CMSLink'
import type { Locale } from '@/i18n/routing'
import { cn } from '@/lib/utils'

type Variant = 'default' | 'outline' | 'secondary' | 'ghost' | 'link'

/** Render an array of CTA buttons; first is primary, rest outline by default. */
export async function Buttons({
  buttons,
  locale,
  variants,
  className,
}: {
  buttons?: { link?: LinkGroup; id?: string | null }[] | null
  locale: Locale
  variants?: Variant[]
  className?: string
}) {
  if (!buttons?.length) return null
  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {await Promise.all(
        buttons.map(async (b, i) => (
          <CMSLink
            key={b.id ?? i}
            link={b.link}
            locale={locale}
            variant={variants?.[i] ?? (i === 0 ? 'default' : 'outline')}
          />
        )),
      )}
    </div>
  )
}

/** Split a textarea value into paragraphs on blank lines. */
export function Paragraphs({
  text,
  className,
}: {
  text?: string | null
  className?: string
}) {
  if (!text) return null
  const parts = text.split(/\n\s*\n/).filter(Boolean)
  return (
    <>
      {parts.map((p, i) => (
        <p key={i} className={className}>
          {p.trim()}
        </p>
      ))}
    </>
  )
}

export function Container({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn('mx-auto w-full max-w-6xl px-6', className)}>{children}</div>
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  if (!children) return null
  return (
    <span className="inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
      <span aria-hidden className="h-px w-7 bg-current opacity-50" />
      {children}
    </span>
  )
}
