// Ensures Payload's media files exist on the mounted disk before the server starts.
// Idempotent: downloads only what's missing. Filenames are derived exactly as the
// seed derives them (decoded basename of the source URL), so they match the DB
// records Payload created. Runs on the web instance where MEDIA_DIR is mounted.
import fs from 'node:fs'
import path from 'node:path'

const dir = process.env.MEDIA_DIR || path.resolve('media')

const SOURCES = [
  'https://cdn.prod.website-files.com/694f82d3ab726ade91d3acc4/694f8420fd4e67d5bc2c4e94_Fichier%201.png',
  'https://cdn.prod.website-files.com/6a108e4f6aac487ad29139a7/6a109419d003d7b727e04097_pexels-photo-7675029.jpeg',
  'https://cdn.prod.website-files.com/6a108e4f6aac487ad29139a7/6a10941931c483ab8f15d508_pexels-photo-6803542.jpeg',
  'https://cdn.prod.website-files.com/6a108e4f6aac487ad29139a7/6a109418dc9c4de6766aa261_pexels-photo-6170405.jpeg',
  'https://cdn.prod.website-files.com/6a108e4f6aac487ad29139a7/6a1094181253c6442795c723_pexels-photo-37605911.jpeg',
]

const nameFromUrl = (url) => decodeURIComponent(url.split('/').pop())

try {
  fs.mkdirSync(dir, { recursive: true })
} catch (err) {
  console.error(`[ensure-media] cannot create ${dir}:`, err.message)
  process.exit(0) // never block server start
}

for (const url of SOURCES) {
  const name = nameFromUrl(url)
  const dest = path.join(dir, name)
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
    console.log(`[ensure-media] present: ${name}`)
    continue
  }
  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.error(`[ensure-media] download failed (${res.status}): ${name}`)
      continue
    }
    fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()))
    console.log(`[ensure-media] downloaded: ${name}`)
  } catch (err) {
    console.error(`[ensure-media] error for ${name}:`, err.message)
  }
}
console.log('[ensure-media] done')
