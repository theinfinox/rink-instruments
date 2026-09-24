/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/technologies',
        destination: '/instruments',
        permanent: true,
      },
      {
        source: '/technologies/:path*',
        destination: '/instruments/:path*',
        permanent: true,
      },
      {
        source: '/institutions',
        destination: '/#institutions',
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-Architect',
            value: 'Architectured and designed by Govind S R @theinfinox',
          },
        ],
      },
    ];
  },
  output: 'standalone',
  images: {
    remotePatterns: [
      // KSUM & Startup Mission domains
      {
        protocol: 'https',
        hostname: 'startupmission.kerala.gov.in',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.startupmission.kerala.gov.in',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'startupmission.in',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.startupmission.in',
        pathname: '/**',
      },
      // Dev backend
      {
        protocol: 'https',
        hostname: 'rink-git-cron.vercel.app',
        pathname: '/**',
      },
      // Localhost
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
      // Original External Sources
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/thumbnail/**',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/uc/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh4.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
