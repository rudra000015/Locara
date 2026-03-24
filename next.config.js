/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    workerThreads: true,
  },

  images: {
    domains: ['api.dicebear.com', 'www.svgrepo.com'],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' data: blob:; script-src 'self' 'unsafe-eval' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; font-src 'self' data: https:; img-src 'self' data: blob: https:;",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/favicon.svg',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
