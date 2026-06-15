// Ambient 3D hairline wireframe for the hero — a slowly rotating sphere of
// meridian rings drawn in tone-aware hairlines. Pure CSS 3D transforms (no JS),
// honors prefers-reduced-motion (paused, held at a tilted angle). Decorative
// only: aria-hidden and pointer-events-none, rendered behind the hero content.

const MERIDIANS = 8

export function HeroWireframe() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden [perspective:1200px]"
    >
      <div className="vtr-orbit relative aspect-square w-[min(96vw,46rem)] opacity-[0.18] [transform-style:preserve-3d]">
        {Array.from({ length: MERIDIANS }).map((_, i) => (
          <span
            key={i}
            className="absolute inset-0 rounded-full border border-foreground"
            style={{ transform: `rotateY(${(i * 180) / MERIDIANS}deg)` }}
          />
        ))}
        {/* equatorial ring */}
        <span className="absolute inset-0 rounded-full border border-foreground [transform:rotateX(90deg)]" />
        {/* focal point */}
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground" />
      </div>
    </div>
  )
}
