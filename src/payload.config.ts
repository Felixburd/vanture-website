import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { CaseStudies } from './collections/CaseStudies'
import { Subscribers } from './collections/Subscribers'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const usingRenderDb = (process.env.DATABASE_URI || '').includes('render.com')

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: '· Vanture',
    },
  },
  collections: [Pages, CaseStudies, Media, Subscribers, Users],
  globals: [Header, Footer, SiteSettings],
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Français (CA)', code: 'fr-ca' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      // Render's external Postgres endpoint requires SSL.
      ssl: usingRenderDb ? { rejectUnauthorized: false } : undefined,
    },
  }),
  sharp,
})
