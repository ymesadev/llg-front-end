import "./globals.css";
import CookieConsent from "./components/CookieConsent/CookieConsent";
import TrackingScripts from "./components/TrackingScripts/TrackingScripts";
import ConditionalPopup from "./components/ConditionalPopup/ConditionalPopup";
import ConditionalNavbar from "./components/ConditionalNavbar/ConditionalNavbar";
import ConditionalFooter from "./components/ConditionalFooter/ConditionalFooter";
// import ChatbotPopup from "./components/ChatBot/ChatBot";
import AIChatBot from "./components/AIChatBot/AIChatBot";
import { Analytics } from "@vercel/analytics/next";



export const metadata = {
  title: "Louis Law Group | Florida Property Damage & SSDI Attorneys",
  description: "Louis Law Group helps Florida residents fight denied insurance claims and win SSDI/SSI benefits. Free consultation — no fees unless we win.",
};

const legalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  "name": "Louis Law Group",
  "url": "https://www.louislawgroup.com",
  "logo": "https://www.louislawgroup.com/logo.png",
  "telephone": "+18336574812",
  "priceRange": "Free consultation — contingency fee",
  "description": "Louis Law Group is a Florida law firm specializing in Social Security Disability (SSDI/SSI) and property damage insurance claims. No fees unless we win.",
  "areaServed": { "@type": "State", "name": "Florida" },
  "address": { "@type": "PostalAddress", "addressRegion": "FL", "addressCountry": "US" },
  "openingHours": "Mo-Fr 09:00-17:00",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Legal Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Social Security Disability (SSDI/SSI) Representation" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Property Damage Insurance Claims" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Insurance Claim Denials & Appeals" } }
    ]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts — non-blocking with preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(legalServiceSchema) }}
        />
      </head>
      <body>
        <ConditionalNavbar />
        <ConditionalPopup />
        <TrackingScripts />
        {children}
        <ConditionalFooter />
        
        {/* Global Lead Attribution Tracking - Before Chat Bot */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              /* =========================================
                 GLOBAL LEAD ATTRIBUTION TRACKING
              ========================================= */
              (function () {
                try {
                  console.log('[Lead Attribution] Script initialized');
                  
                  const UTM_KEYS = [
                    'utm_source',
                    'utm_medium',
                    'utm_campaign',
                    'utm_content',
                    'utm_term'
                  ];

                  // Landing page configuration mapping
                  const LANDING_PAGE_CONFIG = {
                    // Meta Ads Landing Pages
                    'warranty-case-evaluation': { page_source: 'meta_warranty_01', campaign_type: 'meta' },
                    // Add more Meta landing pages here as needed
                    
                    // Google Ads Landing Pages
                    'american-integrity-claims-attorneys': { page_source: 'google_warranty_01', campaign_type: 'google' },
                    'social-security-disability-attorneys': { page_source: 'google_ssdi_01', campaign_type: 'google' },
                    'property-damage-claims-attorneys': { page_source: 'google_property_damage_01', campaign_type: 'google' },
                  };

                  function setPageIdentifier() {
                    try {
                      // Get current pathname (remove leading slash and query params)
                      const pathname = window.location.pathname.replace(/^\\//, '').split('?')[0];
                      
                      // Check if this is a landing page
                      const config = LANDING_PAGE_CONFIG[pathname];
                      
                      if (config) {
                        localStorage.setItem('page_source', config.page_source);
                        localStorage.setItem('campaign_type', config.campaign_type);
                        console.log('[Lead Attribution] Set page identifier:', {
                          page_source: config.page_source,
                          campaign_type: config.campaign_type,
                          pathname: pathname
                        });
                      }
                    } catch (error) {
                      console.error('[Lead Attribution] Error setting page identifier:', error);
                    }
                  }

                  function setOrganicFallback() {
                    try {
                      /* =========================================
                         ORGANIC FALLBACK
                      ========================================= */
                      if (!localStorage.getItem('page_source')) {
                        localStorage.setItem('page_source', 'organic_site');
                        localStorage.setItem('campaign_type', 'organic');
                        console.log('[Lead Attribution] Set organic fallback:', {
                          page_source: 'organic_site',
                          campaign_type: 'organic'
                        });
                      }
                    } catch (error) {
                      console.error('[Lead Attribution] Error setting organic fallback:', error);
                    }
                  }

                  function captureAttribution() {
                    try {
                      console.log('[Lead Attribution] Capturing attribution data...');
                      
                      // Set page identifier first
                      setPageIdentifier();
                      
                      // Set organic fallback if no page_source exists
                      setOrganicFallback();
                      
                      // Capture UTMs once per session
                      const params = new URLSearchParams(window.location.search);
                      const capturedUTMs = {};
                      
                      UTM_KEYS.forEach(key => {
                        const value = params.get(key);
                        if (value && !localStorage.getItem(key)) {
                          localStorage.setItem(key, value);
                          capturedUTMs[key] = value;
                          console.log('[Lead Attribution] Captured UTM:', key, '=', value);
                        } else if (localStorage.getItem(key)) {
                          console.log('[Lead Attribution] UTM already stored:', key, '=', localStorage.getItem(key));
                        }
                      });

                      // Capture referrer once
                      if (!localStorage.getItem('referrer')) {
                        const referrer = document.referrer || '';
                        localStorage.setItem('referrer', referrer);
                        console.log('[Lead Attribution] Captured referrer:', referrer || '(empty)');
                      } else {
                        console.log('[Lead Attribution] Referrer already stored:', localStorage.getItem('referrer'));
                      }

                      // Always update current page URL
                      const currentUrl = window.location.href;
                      localStorage.setItem('page_url', currentUrl);
                      console.log('[Lead Attribution] Updated page_url:', currentUrl);
                      
                      // Log all stored values
                      const storedData = {
                        page_url: localStorage.getItem('page_url'),
                        referrer: localStorage.getItem('referrer'),
                        page_source: localStorage.getItem('page_source'),
                        campaign_type: localStorage.getItem('campaign_type'),
                        utm_source: localStorage.getItem('utm_source'),
                        utm_medium: localStorage.getItem('utm_medium'),
                        utm_campaign: localStorage.getItem('utm_campaign'),
                        utm_content: localStorage.getItem('utm_content'),
                        utm_term: localStorage.getItem('utm_term')
                      };
                      console.log('[Lead Attribution] All stored values:', storedData);
                    } catch (error) {
                      console.error('[Lead Attribution] Error in captureAttribution:', error);
                    }
                  }

                  // Run immediately if DOM is ready, otherwise wait
                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', captureAttribution);
                  } else {
                    captureAttribution();
                  }

                  // Listen for route changes (works with Next.js App Router)
                  if (typeof window !== 'undefined') {
                    // Listen to popstate for browser back/forward
                    window.addEventListener('popstate', function() {
                      console.log('[Lead Attribution] Route change detected (popstate)');
                      captureAttribution();
                    });
                    
                    // Intercept pushState/replaceState for Next.js client-side navigation
                    const originalPushState = history.pushState;
                    const originalReplaceState = history.replaceState;
                    
                    history.pushState = function() {
                      originalPushState.apply(history, arguments);
                      console.log('[Lead Attribution] Route change detected (pushState)');
                      setTimeout(captureAttribution, 0);
                    };
                    
                    history.replaceState = function() {
                      originalReplaceState.apply(history, arguments);
                      console.log('[Lead Attribution] Route change detected (replaceState)');
                      setTimeout(captureAttribution, 0);
                    };
                  }
                } catch (error) {
                  console.error('[Lead Attribution] Script initialization error:', error);
                }
              })();
            `,
          }}
        />
        
        <AIChatBot />
        <CookieConsent />
        {/* Vercel Analytics — cookieless, fires for ALL visitors regardless of consent */}
        <Analytics />
        {/* Real-time visitor beacon — fires on every page load */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              fetch('https://www.louislawgroup.com/api/hit', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                  path: window.location.pathname,
                  referrer: document.referrer || '',
                  ua: navigator.userAgent
                }),
                keepalive: true
              });
            } catch(e) {}
          })();
        `}} />
      </body>
    </html>
  );
}
