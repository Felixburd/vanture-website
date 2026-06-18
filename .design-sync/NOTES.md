# design-sync notes — Vanture Design System

Claude Design project: `131b5ffe-64a7-44b7-a028-c59c074439c4`
(https://claude.ai/design/p/131b5ffe-64a7-44b7-a028-c59c074439c4)

## This repo is NOT a packaged design system
It's the Next.js + Payload marketing app. There is no `dist/` and no published
component library, so the sync runs the package shape in **synth-entry mode** off a
**curated entry** (`.design-sync/bundle-entry.tsx`) — it re-exports ONLY the components
that render standalone. Do NOT fall back to the converter's default synth entry: it does
`export * from` every src file and pulls in Payload / next/font / server code → the IIFE
bundle throws on load and `window.VantureDS` never gets assigned.

## Build pipeline (order matters)
1. `node .design-sync/compile-css.mjs` — compiles Tailwind v4 (the site compiles at
   `next build`; a standalone bundle has no styling otherwise). Output:
   `.design-sync/.cache/compiled.css` (gitignored) → `cfg.cssEntry`. **Re-run before every
   build** when component/preview classes change.
2. `node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules ./node_modules --entry ./.design-sync/bundle-entry.tsx --out ./ds-bundle`
3. `node .ds-sync/package-validate.mjs ./ds-bundle`
   (or the driver `resync.mjs` with the same flags + `--remote .design-sync/.cache/remote-sync.json`).

## Gotchas (cost real debugging the first time)
- **i18n stubs.** `tsconfig.build.json` (cfg.tsconfig) shadows `@/i18n/navigation` and
  `@/i18n/routing` with load-safe stubs in `.design-sync/stubs/`. The real
  `@/i18n/navigation` calls `createNavigation(routing)` at module load, which reaches
  `next/navigation` and THROWS in a plain browser — taking the whole IIFE down. The stubs
  are pulled in only transitively (shared.tsx → CMSLink) and never called at render time.
- **No `//` comment KEYS in `tsconfig.build.json`.** The converter's path plugin strips
  `//…` line comments before JSON.parse; a `"//": "…"` key gets mangled, the parse fails
  silently, the paths plugin returns null, and the i18n stubs stop applying (next-intl
  contamination returns). After any build, sanity-check:
  `grep -c -E 'next-intl|next/navigation' ds-bundle/_ds_bundle.js` must be **0**.
- **Tailwind safelist.** `tw-entry.css` uses `@source inline(...)` to emit the full
  brand token-backed utility set (bg/text/border × tokens, status tints, fonts) — a
  precompiled DS stylesheet must carry utilities the design agent might compose, since it
  can't run Tailwind. `tone-light/white/dark/graydark` are literal rules in globals.css.
- **playwright** pinned to **1.60.0** (matches the machine's cached `chromium-1223`; the
  repo itself has no playwright dep). 1.61 pins 1228 → would trigger a ~150MB download.
- **Fonts** load via remote Google Fonts `@import` → `[FONT_REMOTE]` is expected, not a
  missing-font error.
- **Logo** is a DS-only component (`.design-sync/components/brand/Logo.tsx`), the
  `public/vanture-mark.svg` geometry made tone-adaptive via `currentColor`. The app itself
  serves the logo as CMS media, so there's no app-side Logo component to track.

## Scope (12 components)
Shipped: Button, Badge, Card, Input (general); HeroWireframe, Stats, Comparison, Lenses,
DvtaTabs, Container, GridFrame (blocks); Logo (brand).

**Deliberately excluded** (user decision, 2026-06-18): async server components — Hero,
Cta, Audience, Header, Footer, and the async Buttons/CMSLink they use — can't render in
claude.ai/design's client runtime (async components only run under RSC). App chrome
(LocaleSwitcher, MobileNav, NewsletterForm, BriefingForm) was also not synced.

## Known render warns
None. Render check was 12/12 clean. `[FONT_REMOTE]` is the only standing warn and is expected.

## Re-sync risks (watch-list)
- **Adding components:** extend `bundle-entry.tsx` + `componentSrcMap`, then recompile CSS.
  After building, re-run the `next-intl|next/navigation|payload` grep on `_ds_bundle.js` —
  a new component may drag server/i18n runtime in through a fresh import path. If so, extend
  the `tsconfig.build.json` path shadows the same way the i18n stubs work.
- **`.cache/compiled.css` is gitignored** — a fresh clone must run `compile-css.mjs` before
  the first build, or `cfg.cssEntry` won't exist.
- **Stub drift:** if the app's real `@/i18n/navigation`/`routing` surface changes (new
  exports CMSLink/shared start using), update the stubs to match or the bundle breaks.
- **Synth-mode `.d.ts`:** props are extracted from `src/` (no shipped types), so complex
  prop types may degrade — add `cfg.dtsPropsFor.<Name>` if `[DTS_*]` fires.
- **GridFrame** rails are intentionally faint in card view (the frame spans `max-w-6xl`).
