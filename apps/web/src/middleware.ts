import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

type AccountRole = 'customer' | 'partner' | 'caterer' | 'admin' | 'super_admin';
type RouteArea = 'customer' | 'partner' | 'admin';

const routeAccess: Record<RouteArea, AccountRole[]> = {
  customer: ['customer'],
  partner: ['partner', 'caterer'],
  admin: ['admin', 'super_admin'],
};

const roleHomePath: Record<AccountRole, string> = {
  customer: '/customer',
  partner: '/partner',
  caterer: '/partner',
  admin: '/admin',
  super_admin: '/admin',
};

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

function campaignResponse(req: NextRequest) {
  if (!isCampaignMode(req)) {
    return null;
  }

  const { pathname } = req.nextUrl;
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

function getRouteArea(pathname: string): RouteArea | null {
  if (pathname === '/customer' || pathname.startsWith('/customer/')) {
    return 'customer';
  }

  if (pathname === '/partner' || pathname.startsWith('/partner/')) {
    return 'partner';
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return 'admin';
  }

  return null;
}

function normalizeRole(role: unknown, isPartner: unknown): AccountRole {
  if (role === 'admin' || role === 'super_admin') {
    return role;
  }

  if (role === 'partner' && isPartner === true) {
    return 'partner';
  }

  if (role === 'caterer' && isPartner === true) {
    return 'caterer';
  }

  return 'customer';
}

export async function middleware(req: NextRequest) {
  const campaign = campaignResponse(req);
  if (campaign) {
    return campaign;
  }

  const routeArea = getRouteArea(req.nextUrl.pathname);

  if (!routeArea) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: req as any,
     secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = normalizeRole(token.role, token.isPartner);
  const allowedRoles = routeAccess[routeArea];

  if (!allowedRoles.includes(role)) {
    return NextResponse.redirect(new URL(roleHomePath[role], req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
