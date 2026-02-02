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
};

export default nextConfig;
