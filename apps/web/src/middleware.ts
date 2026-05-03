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
  const routeArea = getRouteArea(req.nextUrl.pathname);

  if (!routeArea) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
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
  matcher: ['/customer/:path*', '/partner/:path*', '/admin/:path*'],
};
