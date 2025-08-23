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

  // Optimize for PWA
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
