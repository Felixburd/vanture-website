import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Run on every path EXCEPT Payload's admin/API/GraphQL routes, Next internals,
  // and anything with a file extension. This keeps next-intl off Payload.
  matcher: [
    '/((?!api|admin|graphql|graphql-playground|_next|_vercel|.*\\..*).*)',
  ],
}
