import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        outline: 'border-border text-foreground',
        muted: 'border-transparent bg-muted text-muted-foreground',
        // Monochrome severity scale: green = subtle, amber = outlined, critical = solid
        green: 'border border-border bg-transparent text-muted-foreground',
        amber: 'border border-foreground/40 bg-transparent text-foreground',
        critical: 'border-transparent bg-foreground text-background',
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
