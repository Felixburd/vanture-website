// design-sync curated bundle entry.
//
// The site is a Next.js/Payload app, not a packaged component library, so there
// is no dist entry. The default synth-entry (export * from every src file) would
// pull in Payload, next/font, and server-only code and break the bundle. Instead
// we re-export ONLY the components that render standalone in the design agent's
// runtime. Components are added milestone by milestone as they're decoupled.
//
// Milestone 1 — clean primitives (no Payload / next-intl / server coupling):
export { Button, buttonVariants } from '../src/components/ui/button'
export { Badge, badgeVariants } from '../src/components/ui/badge'
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../src/components/ui/card'
export { Input } from '../src/components/ui/input'
export { HeroWireframe } from '../src/components/blocks/HeroWireframe'

// Brand mark — packaged for the DS (the app serves the SVG as CMS media; this
// is the same geometry, made tone-adaptive via currentColor).
export { Logo } from './components/brand/Logo'

// Milestone 2 — presentational page blocks. These take CMS block data as props
// (typed against @/payload-types; types erased at runtime) and render fully
// client-side. The async server blocks (Hero/Cta/Audience) and the async
// Buttons/CMSLink they depend on are intentionally NOT exported: async server
// components can't render in claude.ai/design's client runtime.
export { Stats } from '../src/components/blocks/Stats'
export { Comparison } from '../src/components/blocks/Comparison'
export { Lenses } from '../src/components/blocks/Lenses'
export { DvtaTabs } from '../src/components/blocks/DvtaTabs'
// Layout + decoration primitives (tree-shaken free of the async helpers in shared).
export { Container, GridFrame } from '../src/components/blocks/shared'
