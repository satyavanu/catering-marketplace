/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@catering/types', '@catering/shared', '@catering/ui', '@catering/themes'],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
