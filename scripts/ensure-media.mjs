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
  'https://cdn.prod.website-files.com/694f82d3ab726ade91d3acc4/6978c7980351d298984ff548_pexels-francesco-ungaro-3324591.jpg',
  'https://cdn.prod.website-files.com/694f82d3ab726ade91d3acc4/6978e4586cc662577a6b08dc_pexels-soulful-pizza-2080276-4107051.jpg',
  'https://cdn.prod.website-files.com/694f82d3ab726ade91d3acc4/6978d6a16ba1e2dcfae2eae7_Vanture_Icon-Black.svg',
  'https://cdn.prod.website-files.com/694f82d3ab726ade91d3acc4/69e6709bce1f295e14beaf5f_pexels-sonny-12317362.jpg',
  'https://cdn.prod.website-files.com/694f82d3ab726ade91d3acc4/69e66ebe1538181ef978bee4_pexels-casperstarenda-2224919.jpg',
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
