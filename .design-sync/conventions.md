## Vanture design system — conventions

A monochrome, "engineered instrument" aesthetic: near-black on off-white, **sharp 0px
corners** (all `--radius*` tokens are `0`), and a traffic-light status palette. Every
component is the site's real shipped code, bundled to `window.VantureDS.*`.

### Setup — no provider, but mind the tones
The shipped components need **no context provider**. Brand fonts (Inter / Roboto&nbsp;Flex /
IBM&nbsp;Plex&nbsp;Mono) load via a remote `@import` already in `styles.css`.

Surfaces are driven by **tone classes**, not per-element colors. Wrap a section in one of
`tone-light` · `tone-white` · `tone-dark` · `tone-graydark` and every surface/text/border
utility below recolors for that subtree automatically. Default (no class) = light tone.

### Styling idiom — Tailwind utilities bound to tokens
Style with these utility families (real classes; do not invent a parallel vocabulary):

| Role | Classes |
|---|---|
| Surfaces | `bg-background` `bg-card` `bg-muted` `bg-accent` `bg-secondary` `bg-popover` |
| Text | `text-foreground` `text-muted-foreground` `text-primary` `text-card-foreground` |
| Borders | `border-border` `border-input` (use `border` width; corners stay square) |
| Status | `bg-status-green` `bg-status-amber` `bg-status-critical` (+ `text-status-*`, `/10`–`/30` tints) |
| Type | `font-sans` (body, Inter) · `font-display` (headings, Roboto Flex) · `font-mono` (labels/figures, IBM Plex Mono) |

Conventions to match the brand: mono + `uppercase tracking-wider` for eyebrows, status
labels, and metric captions; `tabular-nums` for figures. The primary CTA color is its own
dark-teal `--btn` token (carried by `<Button>`'s default variant) — not `--primary`.

### Where the truth lives
Read `_ds/<folder>/styles.css` and its `@import`ed `_ds_bundle.css` for the full token +
utility set, and each component's `<Name>.prompt.md` + `<Name>.d.ts` for its API.

### Idiomatic snippet
```tsx
const { Card, CardHeader, CardTitle, CardContent, Badge } = window.VantureDS
;<div className="tone-dark bg-background p-8">
  <Card className="max-w-sm">
    <CardHeader className="flex-row items-start justify-between gap-4">
      <CardTitle>Pipeline throughput</CardTitle>
      <Badge variant="green">Operational</Badge>
    </CardHeader>
    <CardContent>
      <div className="font-display text-4xl font-medium tracking-tight tabular-nums">1,284</div>
      <div className="mt-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        assessments cleared
      </div>
    </CardContent>
  </Card>
</div>
```
