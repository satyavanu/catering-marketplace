import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://droooly.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/partner/',
        '/customer/',
        '/login',
        '/signup',
        '/register',
        '/forgot-password',
        '/verify-otp',
        '/accept-terms',
        '/onboarding',
        '/checkout',
        '/contact',
        '/help-center',
        '/faqs',
        '/become-a-caterer',
        '/become-caterer',
      ],
    },
    sitemap: new URL('/sitemap.xml', siteUrl).toString(),
  };
}
