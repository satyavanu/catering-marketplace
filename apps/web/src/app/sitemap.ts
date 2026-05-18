import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://droooly.com';

const publicRoutes = [
  {
    path: '/',
    priority: 1,
    changeFrequency: 'weekly',
  },
  {
    path: '/partner-with-us',
    priority: 0.9,
    changeFrequency: 'weekly',
  },
  {
    path: '/how-it-works',
    priority: 0.8,
    changeFrequency: 'monthly',
  },
  {
    path: '/about-us',
    priority: 0.7,
    changeFrequency: 'monthly',
  },
  {
    path: '/faq',
    priority: 0.7,
    changeFrequency: 'monthly',
  },
  {
    path: '/contact-us',
    priority: 0.6,
    changeFrequency: 'yearly',
  },
  {
    path: '/privacy-policy',
    priority: 0.4,
    changeFrequency: 'yearly',
  },
  {
    path: '/terms-of-use',
    priority: 0.4,
    changeFrequency: 'yearly',
  },
  {
    path: '/cookie-policy',
    priority: 0.3,
    changeFrequency: 'yearly',
  },
] satisfies Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
}>;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.map((route) => ({
    url: new URL(route.path, siteUrl).toString(),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
