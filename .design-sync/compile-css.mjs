/*
 * design-sync: compile the site's Tailwind v4 styling into a standalone stylesheet
 * for the Claude Design bundle. Run from the repo root so node resolves the repo's
 * own @tailwindcss/postcss (same version the site builds with):
 *
 *   node .design-sync/compile-css.mjs
 *
 * Output: .design-sync/.cache/compiled.css  (point cfg.cssEntry at it)
 */
import postcss from 'postcss'
import tailwind from '@tailwindcss/postcss'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
const input = path.join(here, 'tw-entry.css')
const outDir = path.join(here, '.cache')
const output = path.join(outDir, 'compiled.css')

const css = readFileSync(input, 'utf8')
const result = await postcss([tailwind()]).process(css, { from: input })
mkdirSync(outDir, { recursive: true })
writeFileSync(output, result.css)
console.log(`compiled ${result.css.length} bytes -> ${output}`)
