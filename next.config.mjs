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

      // ── Tower Hill consolidation (dead city pages → pillar) ──
      { source: '/tower-hill-homeowners-insurance-palm-coast', destination: '/tower-hill-homeowners-insurance-florida', permanent: true },
      { source: '/tower-hill-insurance-lauderhill', destination: '/tower-hill-homeowners-insurance-florida', permanent: true },
      { source: '/tower-hill-insurance-pompano-beach', destination: '/tower-hill-homeowners-insurance-florida', permanent: true },
      { source: '/advice-tower-hill-insurance-group-tampa', destination: '/tower-hill-homeowners-insurance-florida', permanent: true },
      { source: '/approach-managing-tower-hill-insurance-hialeah', destination: '/tower-hill-homeowners-insurance-florida', permanent: true },
      { source: '/tower-hill-homeowners-insurance-doral', destination: '/tower-hill-homeowners-insurance-florida', permanent: true },
      { source: '/tower-hill-homeowners-insurance-lakeland', destination: '/tower-hill-homeowners-insurance-florida', permanent: true },
      { source: '/tower-hill-homeowners-insurance-melbourne-fl', destination: '/tower-hill-homeowners-insurance-florida', permanent: true },
      // ── Tower Hill content consolidation (duplicate → pillar) ──
      { source: '/tower-hill-insurance-florida', destination: '/tower-hill-homeowners-insurance-florida', permanent: true },
      { source: '/tower-hill-insurance-claim-florida-help', destination: '/tower-hill-homeowners-insurance-florida', permanent: true },
      // ── American Integrity consolidation (phone/portal dupes → canonical) ──
      { source: '/american-integrity-insurance-company-florida-claims-phone-number', destination: '/american-integrity-insurance-claims-phone-number', permanent: true },
      { source: '/american-integrity-claims-phone-number-orlando', destination: '/american-integrity-insurance-claims-phone-number', permanent: true },
      { source: '/american-integrity-insurance-claims-portal-tallahassee', destination: '/american-integrity-insurance-claims-portal-florida-guide', permanent: true },
      { source: '/american-integrity-insurance-damage-claims-florida', destination: '/american-integrity-insurance-claim-florida', permanent: true },
      { source: '/american-integrity-insurance-file-a-claim-florida', destination: '/american-integrity-insurance-claim-florida', permanent: true },
      { source: '/american-integrity-claim-denials-orlando-florida-guide', destination: '/american-integrity-claims-attorneys', permanent: true },
      // ── American Integrity additional consolidation (2026-04-06) ──
      { source: '/american-integrity-insurance-damage-claims-florida', destination: '/american-integrity-insurance-claim-florida', permanent: true },
      { source: '/american-integrity-insurance-file-a-claim-florida', destination: '/american-integrity-insurance-claim-florida', permanent: true },
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

      // ── Allstate cannibalization fix (2026-04-01) ──
      // Texas variant competes with main Allstate page — LLG doesn't practice in TX.
      // Consolidate 1,162 impr into the main page at pos 3.9
      { source: '/allstate-denied-my-roof-claim-texas', destination: '/allstate-denied-my-roof-claim', permanent: true },
    ];
  },

  async rewrites() {
    return {
      beforeFiles: [
        {
          // Static article page with custom UI — must come before catch-all route
          source: '/case-law-insurance-claim-worth-pursuing-florida-2022-reform',
          destination: '/case-law-insurance-claim-worth-pursuing-florida-2022-reform.html',
        },
        {
          // Static report pages with custom UI
          source: '/reports/florida-insurance-market-january-2026',
          destination: '/reports/florida-insurance-market-january-2026.html',
        },
        {
          source: '/reports/florida-presuit-notice-intelligence-report',
          destination: '/reports/florida-presuit-notice-intelligence-report.html',
        },
        {
          source: '/reports/fee-reform-case-outcomes-dashboard',
          destination: '/reports/fee-reform-case-outcomes-dashboard.html',
        },
      ],
      afterFiles: [
        {
          // Rewrite /sitemaps/1.xml to /api/sitemap/1
          source: '/sitemaps/:page.xml',
          destination: '/api/sitemap/:page',
        },
      ],
      fallback: [],
    };
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
