import { Button } from 'vanture-website'

// Primary CTA uses the dark-teal --btn token; the rest are surface-aware.
export function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-3 p-6">
      <Button>Request access</Button>
      <Button variant="outline">View the briefing</Button>
      <Button variant="secondary">Documentation</Button>
      <Button variant="ghost">Learn more</Button>
      <Button variant="link">Read the spec</Button>
    </div>
  )
}

export function Sizes() {
  return (
    <div className="flex flex-wrap items-center gap-3 p-6">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  )
}

export function Disabled() {
  return (
    <div className="flex flex-wrap items-center gap-3 p-6">
      <Button disabled>Processing…</Button>
      <Button variant="outline" disabled>
        Unavailable
      </Button>
    </div>
  )
}
