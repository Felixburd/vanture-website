import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

// Canonical origin, from the same env var the canonical tags/sitemap use.
// Unset (e.g. local dev) means no host redirect at all.
const canonicalOrigin = (() => {
  try {
    return process.env.NEXT_PUBLIC_SERVER_URL ? new URL(process.env.NEXT_PUBLIC_SERVER_URL) : null
  } catch {
    return null
  }
})()

export default function middleware(request: NextRequest) {
  // Render's public `*.onrender.com` host duplicates the site; 301 it to the
  // canonical origin. Only that hostname is matched, so localhost and internal
  // hosts pass through. Render health checks use the custom domain as Host once
  // one is verified, and count a 3xx as healthy anyway.
  const host = request.headers.get('host')?.split(':')[0].toLowerCase()
  if (canonicalOrigin && host?.endsWith('.onrender.com') && host !== canonicalOrigin.hostname) {
    const target = new URL(request.nextUrl.pathname + request.nextUrl.search, canonicalOrigin)
    return NextResponse.redirect(target, 301)
  }
  return intlMiddleware(request)
}

export const config = {
  // Run on every path EXCEPT Payload's admin/API/GraphQL routes, Next internals,
  // and anything with a file extension. This keeps next-intl off Payload.
  matcher: [
    '/((?!api|admin|graphql|graphql-playground|_next|_vercel|.*\\..*).*)',
  ],
}
