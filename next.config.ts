import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'],
  },
  outputFileTracingIncludes: {
    '/*': ['./.env.production'],
  },
};

export default nextConfig;