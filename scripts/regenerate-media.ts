// Regenerates Payload's imageSizes for existing media from the originals on disk.
// Idempotent: a doc is skipped when every size it should have is recorded in the
// DB in the configured format and present on disk (pass --force to redo all).
//
// Kept lean for the 512MB Render instance: one image at a time, each original
// decoded once, sharp's cache off and libvips on one thread (the npm script also
// caps the V8 heap and glibc arenas; peak RSS measured ~375MB). Old size files
// are left in place, since statically built pages may still reference them
// until the next deploy. Must run where MEDIA_DIR is mounted (the web instance,
// not a one-off job, which has no disk).
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media } from '@/payload-types'

sharp.cache(false)
sharp.concurrency(1)

const force = process.argv.includes('--force')
const RESIZABLE = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/tiff', 'image/avif']

type SizeName = keyof NonNullable<Media['sizes']>

const payload = await getPayload({ config })
const upload = payload.collections.media.config.upload
const staticDir = upload.staticDir as string
const imageSizes = upload.imageSizes ?? []

const fileOnDisk = (name?: string | null) =>
  Boolean(name) && fs.existsSync(path.join(staticDir, name as string))

function isCurrent(doc: Media) {
  return imageSizes.every((cfg) => {
    const size = doc.sizes?.[cfg.name as SizeName]
    // Payload omits sizes wider than the original (no enlargement).
    const expected = cfg.width ? (doc.width ?? 0) >= cfg.width : true
    if (!expected) return !size?.filename
    const format = cfg.formatOptions?.format
    return (
      fileOnDisk(size?.filename) &&
      size?.width === cfg.width &&
      (!format || size?.mimeType === `image/${format}`)
    )
  })
}

const { docs } = await payload.find({ collection: 'media', pagination: false, depth: 0 })
let regenerated = 0
let failed = 0

for (const doc of docs) {
  const label = `${doc.id} ${doc.filename}`
  if (!doc.filename || !RESIZABLE.includes(doc.mimeType ?? '')) continue
  const original = path.join(staticDir, doc.filename)
  if (!fs.existsSync(original)) {
    payload.logger.warn(`[regenerate-media] original missing, skipped: ${label}`)
    continue
  }
  if (!force && isCurrent(doc)) {
    payload.logger.info(`[regenerate-media] up to date: ${label}`)
    continue
  }

  try {
    const base = doc.filename.replace(/\.[^.]+$/, '')
    const fits = (cfg: (typeof imageSizes)[number]) => !cfg.width || (doc.width ?? 0) >= cfg.width
    // Decode the (possibly 30MP) original once, down to the largest size as raw
    // pixels, and derive every size from that small buffer.
    const maxWidth = Math.max(0, ...imageSizes.filter(fits).map((cfg) => cfg.width ?? 0))
    const source = maxWidth
      ? await sharp(original)
          .rotate()
          .resize({ width: maxWidth })
          .raw()
          .toBuffer({ resolveWithObject: true })
      : null

    const sizes: Record<string, unknown> = {}
    for (const cfg of imageSizes) {
      if (!source || !fits(cfg)) {
        sizes[cfg.name] = { filename: null, width: null, height: null, mimeType: null, filesize: null }
        continue
      }
      let img = sharp(source.data, { raw: source.info }).resize({ width: cfg.width, height: cfg.height })
      if (cfg.formatOptions) img = img.toFormat(cfg.formatOptions.format, cfg.formatOptions.options)
      else img = img.toFormat((await sharp(original).metadata()).format ?? 'png')
      const { data, info } = await img.toBuffer({ resolveWithObject: true })
      const ext = info.format === 'jpeg' ? 'jpg' : info.format
      // Same naming scheme Payload uses for sizes on upload.
      const filename = `${base}-${info.width}x${info.height}.${ext}`
      // Write via a temp name so a crash never leaves a truncated file behind.
      const tmp = path.join(staticDir, `.${filename}.tmp`)
      fs.writeFileSync(tmp, data)
      fs.renameSync(tmp, path.join(staticDir, filename))
      sizes[cfg.name] = {
        filename,
        width: info.width,
        height: info.height,
        mimeType: `image/${info.format}`,
        filesize: info.size,
      }
    }
    await payload.update({ collection: 'media', id: doc.id, data: { sizes }, depth: 0 })
    regenerated++
    payload.logger.info(`[regenerate-media] regenerated: ${label}`)
  } catch (err) {
    failed++
    payload.logger.error(`[regenerate-media] failed: ${label}: ${(err as Error).message}`)
  }
}

payload.logger.info(
  `[regenerate-media] done: ${regenerated} regenerated, ${failed} failed, ${docs.length} total`,
)
process.exit(failed ? 1 : 0)
