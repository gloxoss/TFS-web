import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false, // IP Protection: Disable source maps in production
  images: {
    // Disable optimization in development to avoid "resolved to private ip" errors with 127.0.0.1
    unoptimized: process.env.NODE_ENV === 'development',
    dangerouslyAllowSVG: true,
    // Modern formats for better compression (AVIF ~50% smaller than JPEG, WebP ~30% smaller)
    formats: ['image/avif', 'image/webp'],
    // Minimum cache TTL for optimized images (24 hours)
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '72.62.27.47',
        port: '8091',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8090',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8090',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'tailwindui.com',
      },
      {
        protocol: 'https',
        hostname: 'nextuipro.nyc3.cdn.digitaloceanspaces.com',
      },
    ],
  },
  output: 'standalone',
  // ...other config
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      'lodash',
      '@heroui/react',
      'framer-motion',
      '@tabler/icons-react',
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: true,
      },
    ];
  },

};

export default nextConfig;
