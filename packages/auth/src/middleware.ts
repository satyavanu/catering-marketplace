import { withAuth } from 'next-auth/middleware';
import { NextRequest } from 'next/server';

export const authMiddleware = withAuth(
  function middleware(req: NextRequest & { nextauth: any }) {
    const token = req.nextauth.token;

    // Protect account routes
    if (req.nextUrl.pathname.startsWith('/account')) {
      if (!token) {
        const url = new URL('/signin', req.url);
        url.searchParams.set('callbackUrl', req.nextUrl.pathname);
        return Response.redirect(url);
      }
    }

    return null;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const authConfig = {
  matcher: [
    '/account/:path*',
    '/orders/:path*',
    '/saved-caterers/:path*',
    '/event-planner/:path*',
    '/messages/:path*',
    '/reviews/:path*',
    '/payments/:path*',
    '/profile/:path*',
  ],
};