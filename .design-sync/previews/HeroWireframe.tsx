import { HeroWireframe } from 'vanture-website'

// HeroWireframe is a decorative, aria-hidden, absolute-inset-0 layer that fills
// its nearest positioned ancestor. It draws tone-aware hairlines, so it reads
// best on a dark surface (tone-dark sets --foreground to white). These previews
// supply the relative, sized, dark frame the hero section provides in the app.

export function OnDarkHero() {
  return (
    <div className="tone-dark relative h-80 w-full overflow-hidden bg-background p-10">
      <HeroWireframe />
      <div className="relative z-10 max-w-md">
        <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Drone vetting &amp; threat assessment
        </div>
        <h2 className="mt-3 font-display text-3xl font-medium leading-tight tracking-tight text-foreground">
          Know every aircraft before it flies.
        </h2>
      </div>
    </div>
  )
}

export function Standalone() {
  return (
    <div className="tone-dark relative h-72 w-full overflow-hidden bg-background">
      <HeroWireframe />
    </div>
  )
}
