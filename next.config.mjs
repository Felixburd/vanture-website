import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root (a stray lockfile in the home dir confuses inference).
  outputFileTracingRoot: import.meta.dirname,
  // Payload + sharp run on the server only.
  serverExternalPackages: ['sharp'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.prod.website-files.com' },
      { protocol: 'https', hostname: '*.onrender.com' },
      { protocol: 'https', hostname: 'vanture.capital' },
    ],
  },
  webpack: (config, { dev }) => {
    // The persistent filesystem cache crashes the build worker on Windows
    // (next-intl's dynamic import can't be snapshotted). Disable it for builds.
    if (!dev) config.cache = false
    return config
  },
}

export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
