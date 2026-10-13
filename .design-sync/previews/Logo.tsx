import { Logo } from 'vanture-website'

export function Default() {
  return (
    <div className="flex items-center gap-4 p-8 text-foreground">
      <Logo size={64} />
      <span className="font-display text-2xl font-medium tracking-tight">Vanture</span>
    </div>
  )
}

export function Sizes() {
  return (
    <div className="flex items-end gap-6 p-8 text-foreground">
      <Logo size={24} />
      <Logo size={40} />
      <Logo size={64} />
    </div>
  )
}

// Monochrome by design — currentColor lets the mark invert on a dark tone.
export function OnDark() {
  return (
    <div className="tone-dark flex items-center gap-4 bg-background p-8 text-foreground">
      <Logo size={56} />
      <span className="font-display text-2xl font-medium tracking-tight">Vanture</span>
    </div>
  )
}
