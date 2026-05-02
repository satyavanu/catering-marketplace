import { withAuth } from 'next-auth/middleware';
import { NextRequest } from 'next/server';

export const authMiddleware = withAuth(
  function middleware(req: NextRequest & { nextauth: any }) {
    const token = req.nextauth.token;

    const protectedPrefixes = ['/account', '/customer', '/partner', '/admin'];
    const isProtectedRoute = protectedPrefixes.some((prefix) =>
      req.nextUrl.pathname.startsWith(prefix)
    );

    if (isProtectedRoute) {
      if (!token) {
        const url = new URL('/login', req.url);
        url.searchParams.set('callbackUrl', req.nextUrl.pathname);
        return Response.redirect(url);
      }
    }

    return null;
  },
  {
    pages: {
      signIn: '/login',
    },
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const authConfig = {
  matcher: [
    '/account/:path*',
    '/customer/:path*',
    '/partner/:path*',
    '/admin/:path*',
    '/orders/:path*',
    '/saved-caterers/:path*',
    '/event-planner/:path*',
    '/messages/:path*',
    '/reviews/:path*',
    '/payments/:path*',
    '/profile/:path*',
  ],
};
