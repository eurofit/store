import { withPayload } from '@payloadcms/next/withPayload';
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
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
  // compiler: {
  //   // Remove console logs in production
  //   removeConsole:
  //     process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  // },
  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    productionBrowserSourceMaps: false,
    poweredByHeader: false,
  }),
};

export default withPayload(nextConfig);
