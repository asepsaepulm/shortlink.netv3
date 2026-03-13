import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlProxy = createMiddleware(routing);

export default async function proxy(req) {
  const { pathname } = req.nextUrl;

  // 1. Skip paths that are definitely NOT shortlinks
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/_vercel/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return intlProxy(req);
  }

  console.log('--- PROXY MIDDLEWARE ---');
  console.log('Pathname:', pathname);

  const segments = pathname.split('/').filter(Boolean);
  const code = segments[0];

  // 2. Skip locale prefixes (id, en) and known routes
  const locales = ['id', 'en'];
  const appRoutes = ['login', 'terms', 'dashboard'];

  if (!code || locales.includes(code) || appRoutes.includes(code)) {
    return intlProxy(req);
  }

  // 3. Backward Compatibility: Support /r/CODE
  let resolveCode = code;
  if (code === 'r' && segments[1]) {
    resolveCode = segments[1];
    console.log('[Middleware] Backward compatibility detected:', resolveCode);
  }

  // 4. Try resolving the code
  try {
    // Note: fetch to internal API from middleware can be blocked in some Next.js versions/configs
    // but the user mentioned it worked before. Let's use the explicit resolve API.
    const apiUrl = new URL(`/api/resolve/${resolveCode}`, req.url);
    console.log(`[Middleware] Resolving: ${resolveCode} -> ${apiUrl}`);

    const res = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    console.log(`[Middleware] API Status: ${res.status}`);

    if (res.ok) {
      const data = await res.json();
      if (data.originalUrl) {
        console.log(`[Middleware] FOUND: ${resolveCode} -> ${data.originalUrl}`);
        return NextResponse.redirect(new URL(data.originalUrl).toString(), { status: 301 });
      }
    }
  } catch (err) {
    console.error('[Middleware] ERROR:', err.message);
  }

  // 5. Fallback
  console.log(`[Middleware] No match for ${code}, falling back.`);
  return intlProxy(req);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
