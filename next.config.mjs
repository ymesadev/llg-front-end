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
      // ── State Farm city pages → pillar ──
      { source: '/why-does-state-farm-deny-so-many-roof-claims-boca-raton-2026', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denials-fort-lauderdale-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-orlando-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guideriviera-beach-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-tampa-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denials-in-hallandale-beach-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-for-port-st-lucie-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denials-in-miami-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denials-in-live-oak-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-for-opa-locka-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denials-in-miami-shores-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-gainesville-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/auto-claim-denial-guide-state-farm-in-oakland-park-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-coconut-creek-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-north-miami-beach-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claims-phone-guide-new-smyrna-beach-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-st-petersburg-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-for-miami-florida-homeowners', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-for-miami-shores-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denials-in-plant-city-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denials-in-delray-beach-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denials-in-tarpon-springs-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-for-jacksonville-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-guide-oakland-park-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-cocoa-beach-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-for-jacksonville-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denial-in-st-petersburg-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-accident-reporting-denial-st-cloud-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-auto-claim-denial-guide-cutler-bay-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-miramar-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-ocala-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-denial-accident-reporting-guide-sunrise-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/cheapest-state-farm-auto-insurance-denial-guide-tampa-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-adjuster-claim-denial-guide-tarpon-springs-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-for-north-miami-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-for-tallahassee-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-miami-florida-homeowners', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denials-in-plant-city-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/mount-dora-fl-guide-to-state-farm-claim-denials', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denials-in-opa-locka-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denials-in-sunrise-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denials-in-live-oak-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denials-in-homestead-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guidecoconut-creek-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-delray-beach-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-for-ocala-florida-homeowners', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-miramar-florida-homeowners', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denials-guide-north-miami-beach-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denials-in-oakland-park-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-for-ocala-florida-owners', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/why-does-state-farm-deny-so-many-roof-claims-gainesville-2026', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/parkland-fl-state-farm-claim-denial-guide', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denial-in-sunrise-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denials-in-north-miami-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-for-pembroke-pines-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denials-in-daytona-beach-shores-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-for-opa-locka-fl-homeowners', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-auto-claim-denials-guide-coral-gables-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-clearwater-fl-homeowners', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-jacksonville-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denials-guide-new-smyrna-beach-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denials-in-gainesville-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denials-guide-marco-island-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denials-daytona-beach-shores-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denials-in-jacksonville-beach-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denials-in-north-miami-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denials-in-winter-haven-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/miramar-florida-homeowners-state-farm-claim-denial-guide', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-accident-claim-denial-guide-marianna-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-for-cutler-bay-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-for-miami-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-mount-dora-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denials-cocoa-beach-florida-guide', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/why-does-state-farm-deny-so-many-roof-claims-jacksonville-2026', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-plant-city-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denials-in-daytona-beach-shores-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denials-in-fort-pierce-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denials-in-lauderhill-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denials-in-marianna-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denials-in-miami-springs-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denials-in-ocala-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denials-in-tallahassee-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/guide-to-state-farm-claim-denialsst-petersburg-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-adjuster-claim-denial-guide-hollywood-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-adjuster-denial-guide-north-miami-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-accident-guide-miami-gardens-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-for-pensacola-florida-homes', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-for-plant-city-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-for-riviera-beach-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-for-riviera-beach-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-hialeah-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-hollywood-fl-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-miami-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-miami-springs-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-parkland-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-pembroke-pines-fl', destination: '/state-farm-insurance-claims-florida', permanent: true },
      { source: '/state-farm-claim-denial-guide-riviera-beach-florida', destination: '/state-farm-insurance-claims-florida', permanent: true },
      // ── Allstate city pages → pillar ──
      { source: '/allstate-denied-my-roof-claim-tallahassee-2026', destination: '/allstate-denied-my-roof-claim', permanent: true },
      { source: '/allstate-denied-my-roof-claim-coral-springs-2026', destination: '/allstate-denied-my-roof-claim', permanent: true },
      { source: '/allstate-denied-my-roof-claim-gainesville-2026', destination: '/allstate-denied-my-roof-claim', permanent: true },
      { source: '/allstate-denied-my-roof-claim-orlando-2026', destination: '/allstate-denied-my-roof-claim', permanent: true },
      { source: '/allstate-denied-my-roof-claim-hollywood-2026', destination: '/allstate-denied-my-roof-claim', permanent: true },
      { source: '/allstate-freeze-claim-denied-arlington-texas', destination: '/allstate-denied-my-roof-claim', permanent: true },
      { source: '/allstate-denied-my-roof-claim-west-palm-beach-2026', destination: '/allstate-denied-my-roof-claim', permanent: true },
      { source: '/allstate-castle-key-gainesville-2026', destination: '/allstate-denied-my-roof-claim', permanent: true },
      { source: '/allstate-castle-key-pembroke-pines-2026', destination: '/allstate-denied-my-roof-claim', permanent: true },
      { source: '/allstate-castle-key-sarasota-2026', destination: '/allstate-denied-my-roof-claim', permanent: true },
      { source: '/allstate-denied-my-roof-claim-tampa-2026', destination: '/allstate-denied-my-roof-claim', permanent: true },
      { source: '/allstate-denied-my-roof-claim-fort-lauderdale-2026', destination: '/allstate-denied-my-roof-claim', permanent: true },
      // ── Castle Key city pages → pillar ──
      { source: '/castle-key-insurance-sarasota-2026', destination: '/castle-key-insurance-florida-homeowners-guide', permanent: true },
      { source: '/castle-key-insurance-tampa-2026', destination: '/castle-key-insurance-florida-homeowners-guide', permanent: true },
      { source: '/castle-key-insurance-fort-lauderdale-2026', destination: '/castle-key-insurance-florida-homeowners-guide', permanent: true },
      { source: '/castle-key-insurance-company-tampa-2026', destination: '/castle-key-insurance-florida-homeowners-guide', permanent: true },
      { source: '/castle-key-insurance-company-hollywood-2026', destination: '/castle-key-insurance-florida-homeowners-guide', permanent: true },
      { source: '/castle-key-insurance-phone-number-naples-2026', destination: '/castle-key-insurance-florida-homeowners-guide', permanent: true },
      { source: '/castle-key-insurance-phone-number-pembroke-pines-2026', destination: '/castle-key-insurance-florida-homeowners-guide', permanent: true },
      { source: '/castle-key-insurance-company-pensacola-2026', destination: '/castle-key-insurance-florida-homeowners-guide', permanent: true },
      { source: '/castle-key-insurance-company-tallahassee-2026', destination: '/castle-key-insurance-florida-homeowners-guide', permanent: true },
      { source: '/castle-key-insurance-st-petersburg-2026', destination: '/castle-key-insurance-florida-homeowners-guide', permanent: true },
      { source: '/castle-key-insurance-company-boca-raton-2026', destination: '/castle-key-insurance-florida-homeowners-guide', permanent: true },
      { source: '/castle-key-insurance-phone-number-hollywood-2026', destination: '/castle-key-insurance-florida-homeowners-guide', permanent: true },
      { source: '/castle-key-insurance-phone-number-tampa-2026', destination: '/castle-key-insurance-florida-homeowners-guide', permanent: true },
      { source: '/castle-key-insurance-phone-number-west-palm-beach-2026', destination: '/castle-key-insurance-florida-homeowners-guide', permanent: true },
      { source: '/castle-key-insurance-phone-number-cape-coral-2026', destination: '/castle-key-insurance-florida-homeowners-guide', permanent: true },
      { source: '/castle-key-premium-jacksonville-2026', destination: '/castle-key-insurance-florida-homeowners-guide', permanent: true },
      { source: '/castle-key-insurance-cape-coral-2026', destination: '/castle-key-insurance-florida-homeowners-guide', permanent: true },
      { source: '/castle-key-insurance-company-hialeah-2026', destination: '/castle-key-insurance-florida-homeowners-guide', permanent: true },
      { source: '/castle-key-homeowners-insurance-hollywood-2026', destination: '/castle-key-insurance-florida-homeowners-guide', permanent: true },
      { source: '/castle-key-insurance-company-orlando-2026', destination: '/castle-key-insurance-florida-homeowners-guide', permanent: true },
      { source: '/castle-key-premium-pensacola-2026', destination: '/castle-key-insurance-florida-homeowners-guide', permanent: true },
      { source: '/castle-key-homeowners-insurance-tampa-2026', destination: '/castle-key-insurance-florida-homeowners-guide', permanent: true },
      { source: '/castle-key-insurance-company-naples-2026', destination: '/castle-key-insurance-florida-homeowners-guide', permanent: true },
      // ── Heritage city pages → pillar ──
      { source: '/heritage-insurance-wind-claim-denied-gainesville-florid', destination: '/heritage-insurance-claim-denial-tips', permanent: true },
      // ── Citizens city pages → pillar ──
      { source: '/citizens-property-appeal-lost-miami-2026', destination: '/ten-tips-citizens-property-claim-denials', permanent: true },
      { source: '/citizens-property-appeal-lost-pensacola-2026', destination: '/ten-tips-citizens-property-claim-denials', permanent: true },
      // ── Farmers city pages → pillar ──
      { source: '/farmers-insurance-wind-claim-denied-arlington-texas', destination: '/farmers-insurance-wind-claim-denied-orlando-florida', permanent: true },
      { source: '/farmers-insurance-wildfire-claim-denied-boulder-colorad', destination: '/farmers-insurance-wind-claim-denied-orlando-florida', permanent: true },
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
