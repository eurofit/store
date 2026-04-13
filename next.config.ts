import { publicUrl } from '@/env.mjs';
import { withPayload } from '@payloadcms/next/withPayload';
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // cacheComponents: true,
  images: {
    // localPatterns: [
    //   {
    //     pathname: '/payload/api/media/file/**',
    //   },
    //   {
    //     pathname: '/assets/images**',
    //   },
    // ],
    remotePatterns: [
      ...[publicUrl].map((item) => {
        const url = new URL(item);

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', '') as 'http' | 'https',
        };
      }),

      {
        protocol: 'https',
        hostname: 'www.tropicanawholesale.com',
      },
    ],
    // Modern image formats for better performance
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@tanstack/react-query'],
  },
  // Target modern browsers to avoid unnecessary polyfills
  compiler: {
    // Remove console logs in production
    removeConsole:
      process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    productionBrowserSourceMaps: false,
    poweredByHeader: false,
  }),
};

export default withPayload(nextConfig);
