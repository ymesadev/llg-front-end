/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // Rewrite /sitemaps/1.xml to /api/sitemap/1
        source: '/sitemaps/:page.xml',
        destination: '/api/sitemap/:page',
      },
    ];
  },

  async headers() {
    return [
      {
        // Cache all article pages: 24h CDN, serve stale while revalidating
        source: '/:slug*',
        has: [{ type: 'header', key: 'x-nextjs-data', value: undefined }],
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=86400, stale-while-revalidate=3600',
          },
        ],
      },
      {
        // Never cache API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
