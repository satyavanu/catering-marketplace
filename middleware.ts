import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const protectedPrefixes = [
  '/account',
  '/customer',
  '/partner',
  '/admin',
  '/orders',
  '/saved-caterers',
  '/event-planner',
  '/messages',
  '/reviews',
  '/payments',
  '/profile',
];

const campaignAllowedPages = new Set([
  '/',
  '/faq',
  '/contact-us',
  '/terms-of-use',
  '/privacy-policy',
]);

function isCampaignMode(req: NextRequest) {
  const campaignFlag =
    process.env.NEXT_PUBLIC_IS_CAMPAIGN ||
    process.env.NEXT_PUBLIC_IS_CAMPAIGHN;

  if (campaignFlag !== 'true') {
    return false;
  }

  const host = (req.headers.get('host') || '').split(':')[0].toLowerCase();
  return host === 'droooly.com' || host === 'www.droooly.com';
}

function isAssetOrApiPath(pathname: string) {
  return (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isCampaignMode(req)) {
    if (isAssetOrApiPath(pathname)) {
      return NextResponse.next();
    }

    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/partner-onboarding', req.url));
    }

    if (campaignAllowedPages.has(pathname)) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL('/', req.url));
  }

  const isProtected = protectedPrefixes.some((prefix) => {
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: req as any,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
