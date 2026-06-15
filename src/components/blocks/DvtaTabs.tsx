'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export function DvtaTabs({ tabs }: { tabs: string[] }) {
  const [active, setActive] = useState(0)
  if (!tabs.length) return null
  return (
    <div className="flex flex-wrap gap-1 border-b border-border/70 pb-3">
      {tabs.map((label, i) => (
        <button
          key={i}
          type="button"
          onClick={() => setActive(i)}
          className={cn(
            'rounded-md px-3 py-1.5 font-mono text-xs font-medium uppercase tracking-wide transition-colors',
            i === active
              ? 'bg-primary/15 text-primary'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
