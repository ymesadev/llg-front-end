/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'login.louislawgroup.com' },
    ],
  },
  async redirects() {
    return [
      // ── AHS consolidation (2,568 thin city pages → 1 hub) ──
      // Redirects all AHS article variants to the privacy torts landing page.
      // The privacy torts page (/american-home-shield-privacy-torts) is a static
      // route so it won't be caught by these patterns.

      // ahs-* (61+ pages: ahs-claim-denial-*, ahs-guide-*, ahs-coverage-*, etc.)
      { source: '/ahs-:slug*', destination: '/american-home-shield-privacy-torts', permanent: true },

      // american-home-shield-claim-* (807 pages)
      { source: '/american-home-shield-claim-:slug*', destination: '/american-home-shield-privacy-torts', permanent: true },

      // american-home-shield-guide-* and guide-to-american-* and guide-american-home-* (2,302 pages)
      { source: '/american-home-shield-guide-:slug*', destination: '/american-home-shield-privacy-torts', permanent: true },
      { source: '/guide-to-american-:slug*', destination: '/american-home-shield-privacy-torts', permanent: true },
      { source: '/guide-american-home-:slug*', destination: '/american-home-shield-privacy-torts', permanent: true },

      // american-home-shield-denied-* (denied claims)
      { source: '/american-home-shield-denied-:slug*', destination: '/american-home-shield-privacy-torts', permanent: true },

      // american-home-shield-rights-* and your-rights-after-american-*
      { source: '/american-home-shield-rights-:slug*', destination: '/american-home-shield-privacy-torts', permanent: true },
      { source: '/your-rights-:slug(.*american-home-shield.*)', destination: '/american-home-shield-privacy-torts', permanent: true },
      { source: '/your-guide-to-:slug(.*american-home-shield.*)', destination: '/american-home-shield-privacy-torts', permanent: true },

      // american-home-shield-lawsuit-*, american-home-shield-sue-*
      { source: '/american-home-shield-lawsuit-:slug*', destination: '/american-home-shield-privacy-torts', permanent: true },
      { source: '/american-home-shield-sue-:slug*', destination: '/american-home-shield-privacy-torts', permanent: true },
      { source: '/sue-american-home-:slug*', destination: '/american-home-shield-privacy-torts', permanent: true },

      // american-home-shield-coverage-*
      { source: '/american-home-shield-coverage-:slug*', destination: '/american-home-shield-privacy-torts', permanent: true },

      // legal-guide-american-*, legal-american-home-*
      { source: '/legal-guide-american-:slug*', destination: '/american-home-shield-privacy-torts', permanent: true },
      { source: '/legal-american-home-:slug*', destination: '/american-home-shield-privacy-torts', permanent: true },
    ];
  },

  async rewrites() {
    return [
      {
        // Rewrite /sitemaps/1.xml to /api/sitemap/1
        source: '/sitemaps/:page.xml',
        destination: '/api/sitemap/:page',
      },
      {
        // Clean URL for MIR dashboard report
        source: '/reports/florida-insurance-market-january-2026',
        destination: '/reports/florida-insurance-market-january-2026.html',
      },
      {
        // Clean URL for Pre-Suit Notice Intelligence Report
        source: '/reports/florida-presuit-notice-intelligence-report',
        destination: '/reports/florida-presuit-notice-intelligence-report.html',
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
