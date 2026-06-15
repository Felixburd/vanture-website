import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Traffic-light variants carry a leading status dot via ::before; the plain
// variants don't, so the dot utility lives on the variants, not the base.
const dot = "before:h-1.5 before:w-1.5 before:rounded-full before:bg-current before:content-['']"

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        outline: 'border-border text-foreground',
        muted: 'border-transparent bg-muted text-muted-foreground',
        // green = quiet pass · amber = caution tint · critical = solid alarm.
        green: `border-status-green/25 bg-status-green/10 text-status-green ${dot}`,
        amber: `border-status-amber/30 bg-status-amber/12 text-status-amber ${dot}`,
        critical: `border-transparent bg-status-critical text-white ${dot}`,
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
