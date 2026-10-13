// design-sync build stub for @/i18n/navigation.
//
// The real module calls next-intl's createNavigation(routing) at load time,
// which reaches next/navigation and THROWS in a plain browser — taking the whole
// IIFE bundle down (window.<GLOBAL> never gets assigned). The DS bundle only
// pulls this in transitively (shared.tsx → CMSLink → here) and never calls it at
// render time for the components we ship, so a load-safe stub is faithful: it
// preserves the surface (a locale-aware <Link> that renders a plain anchor)
// without the server-only runtime. Mapped in tsconfig.build.json.
import * as React from 'react'

export const Link = ({ href, children, ...props }: any) =>
  React.createElement(
    'a',
    { href: typeof href === 'string' ? href : '#', ...props },
    children,
  )

export const redirect = () => {}
export const usePathname = () => '/'
export const useRouter = () => ({
  push() {},
  replace() {},
  back() {},
  forward() {},
  refresh() {},
  prefetch() {},
})
export const getPathname = () => '/'
