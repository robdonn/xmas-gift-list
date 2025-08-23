import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable PWA support
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
  },

  // PWA configuration
  images: {
    domains: [
      'lh3.googleusercontent.com', // Google profile images
      'firebasestorage.googleapis.com', // Firebase Storage
    ],
  },

  // Headers for PWA
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },

  // Optimize for PWA
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
