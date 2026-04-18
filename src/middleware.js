import { NextResponse } from 'next/server';
import piRedirects from './pi-redirects.json';
import deadPageRedirects from './dead-page-redirects.json';

/**
 * Middleware: 301 redirects for PI/SSDI suffix-duplicates (2,182) + dead pages (3,773)
 *
 * Dead-page redirects are checked first (geographic-aware, topic-matched).
 * PI/SSDI suffix-duplicate redirects handle remaining cases.
 * FPP redirects (284) remain in next.config.mjs as static redirects.
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Dead page redirects take priority (geographic-aware fixes)
  const deadDest = deadPageRedirects[pathname];
  if (deadDest) {
    const url = request.nextUrl.clone();
    url.pathname = deadDest;
    return NextResponse.redirect(url, 301);
  }

  // PI/SSDI suffix-duplicate redirects
  const piDest = piRedirects[pathname];
  if (piDest) {
    const url = request.nextUrl.clone();
    url.pathname = piDest;
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all page paths. Exclude static assets, API routes, and _next internals.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap|sitemaps|reports).*)',
  ],
};
