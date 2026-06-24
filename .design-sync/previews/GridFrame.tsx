import { GridFrame } from 'vanture-website'

// The blueprint frame: continuous hairline rails at the content-column edges
// with small "+" registration marks where rails meet a divider. Rails use the
// tone-aware --border, so the frame recolors per section. Render inside a
// relative wrapper, behind z-10 content.
export function TopAndBottom() {
  return (
    <div className="relative h-72 w-full overflow-hidden bg-background">
      <GridFrame top bottom />
      <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-6">
        <div>
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Section frame
          </div>
          <h3 className="mt-3 font-display text-2xl font-medium tracking-tight text-foreground">
            Hairline rails with registration marks
          </h3>
        </div>
      </div>
    </div>
  )
}

export function OnDark() {
  return (
    <div className="tone-dark relative h-64 w-full overflow-hidden bg-background">
      <GridFrame top bottom />
      <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-6">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Frame recolors on dark tones
        </span>
      </div>
    </div>
  )
}
