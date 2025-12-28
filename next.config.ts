import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false, // IP Protection: Disable source maps in production
  transpilePackages: ["three", "three-globe"],
  images: {
    // Enable unoptimized to bypass Next.js optimizer fetch failures on some VPS environments
    unoptimized: true,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '72.62.27.47',
        port: '8090',
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
