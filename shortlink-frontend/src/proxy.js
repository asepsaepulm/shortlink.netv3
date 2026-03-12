import createProxy from 'next-intl/proxy';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlProxy = createProxy(routing);

export default async function proxy(req) {
  const { pathname } = req.nextUrl;

  // Handle shortlink redirect /r/[code]
  if (pathname.startsWith('/r/')) {
    const code = pathname.split('/r/')[1]?.split('/')[0];
    if (code) {
      try {
        const apiUrl = new URL(`/api/resolve/${code}`, req.url);
        const res = await fetch(apiUrl.toString());
        if (res.ok) {
          const data = await res.json();
          if (data.originalUrl) {
            return NextResponse.redirect(data.originalUrl, { status: 301 });
          }
        }
      } catch {
        // fallback ke home
      }
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Semua request lain → next-intl handle
  return intlProxy(req);
}

export const config = {
  matcher: ['/r/:code*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
