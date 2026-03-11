import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['example.com'], // Replace with your image domains
  },
  experimental: {
    appDir: true,
  },
};

export default nextConfig;