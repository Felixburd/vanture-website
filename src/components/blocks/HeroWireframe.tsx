// Ambient 3D hairline wireframe for the hero — a slowly rotating sphere of
// meridian rings drawn in tone-aware hairlines, pinned to the right and clipped
// to the content column so the blueprint rails frame it. Pure CSS 3D transforms
// (no JS), honors prefers-reduced-motion. Decorative only: aria-hidden /
// pointer-events-none, rendered behind the hero content.
//
// Note: positioning (translate) lives on the wrapper and rotation (vtr-orbit)
// on the inner element — they can't share one `transform`, or the spin keyframes
// would wipe out the positioning.

const MERIDIANS = 8

export function HeroWireframe() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      {/* Clip to the content column so the hairline rails frame the sphere */}
      <div className="relative mx-auto h-full max-w-6xl overflow-hidden">
        {/* Positioning + perspective; pinned right, nudged past the rail to be cut */}
        <div className="absolute right-0 top-1/2 aspect-square w-[min(92vw,44rem)] -translate-y-1/2 translate-x-[14%] [perspective:1200px]">
          <div className="vtr-orbit absolute inset-0 opacity-[0.2] [transform-style:preserve-3d]">
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
      </div>
    </div>
  )
}
