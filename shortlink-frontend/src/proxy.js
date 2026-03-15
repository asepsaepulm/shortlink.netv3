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

    // ✅ Forward headers so the resolve API knows the actual visitor's IP and User-Agent
    const forwardedHeaders = new Headers();
    forwardedHeaders.set('Accept', 'application/json');
    if (req.headers.has('user-agent')) {
      forwardedHeaders.set('user-agent', req.headers.get('user-agent'));
    }
    if (req.headers.has('x-forwarded-for')) {
      forwardedHeaders.set('x-forwarded-for', req.headers.get('x-forwarded-for'));
    } else if (req.headers.has('x-real-ip')) {
      forwardedHeaders.set('x-forwarded-for', req.headers.get('x-real-ip'));
    }

    const res = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: forwardedHeaders,
    });

    console.log(`[Middleware] API Status: ${res.status}`);

    if (res.ok) {
      const data = await res.json();
      if (data.originalUrl) {
        console.log(`[Middleware] FOUND: ${resolveCode} -> ${data.originalUrl}`);
        
        // 5. Bot Detection Logic
        const userAgent = req.headers.get('user-agent') || '';
        const isBot = /bot|facebookexternalhit|whatsapp|twitter|pinterest|vkShare|telegram|linkedin|slack|discord|skype|viber/i.test(userAgent);

        if (!isBot) {
          // Send real users directly to destination (fastest, no 0s delay)
          return NextResponse.redirect(new URL(data.originalUrl).toString(), { status: 301 });
        }

        console.log(`[Middleware] Crawler detected (${userAgent}). Serving OG metadata.`);
        // 6. Generate HTML with OG Tags for Bots
        const ogTitle = data.ogTitle || 'Shortlink.net - The smarter way to shorten URLs';
        const ogImage = data.ogImageUrl || 'https://shortl.site/default-og.png'; // Fallback image if none
        
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${ogTitle}</title>
    
    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${req.url}">
    <meta property="og:title" content="${ogTitle}">
    <meta property="og:description" content="Click to follow link">
    <meta property="og:image" content="${ogImage}">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${req.url}">
    <meta name="twitter:title" content="${ogTitle}">
    <meta name="twitter:description" content="Click to follow link">
    <meta name="twitter:image" content="${ogImage}">
    
    <!-- No Auto Redirect for Bots -->
</head>
<body>
    <p>Loading metadata...</p>
</body>
</html>`;

        return new NextResponse(html, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600'
          },
        });
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
