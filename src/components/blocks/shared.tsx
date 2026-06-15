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

/**
 * Blueprint frame: continuous hairline rails at the content-column edges, an
 * optional container-width divider at the top/bottom, and small "+" registration
 * marks where rails meet a divider. Rails use `border-border`, which is
 * tone-aware, so the frame recolors per section automatically. Render inside a
 * `relative` wrapper, behind `z-10` content.
 */
export function GridFrame({
  top = false,
  bottom = false,
}: {
  top?: boolean
  bottom?: boolean
}) {
  const plus =
    'pointer-events-none absolute z-10 font-mono text-xs leading-none text-muted-foreground select-none'
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <div
        className={cn(
          'relative mx-auto h-full max-w-6xl border-x border-border',
          top && 'border-t',
          bottom && 'border-b',
        )}
      >
        {top ? (
          <>
            <span className={cn(plus, '-left-1.5 -top-2')}>+</span>
            <span className={cn(plus, '-right-1.5 -top-2')}>+</span>
          </>
        ) : null}
        {bottom ? (
          <>
            <span className={cn(plus, '-bottom-2 -left-1.5')}>+</span>
            <span className={cn(plus, '-bottom-2 -right-1.5')}>+</span>
          </>
        ) : null}
      </div>
    </div>
  )
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
