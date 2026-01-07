import "./globals.css";
import Script from "next/script";
import TrovoTracking from "./components/TrovoTracking"; // Ensure correct path
import CookieConsent from "./components/CookieConsent/CookieConsent";
import ConditionalPopup from "./components/ConditionalPopup/ConditionalPopup";
import ConditionalNavbar from "./components/ConditionalNavbar/ConditionalNavbar";
import ConditionalFooter from "./components/ConditionalFooter/ConditionalFooter";
// import ChatbotPopup from "./components/ChatBot/ChatBot";
import AIChatBot from "./components/AIChatBot/AIChatBot";



export const metadata = {
  title: "Louis Law Group",
  description: "Trusted legal services",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>


        {/* ✅ Load jQuery First */}
        <Script
          id="jquery"
          strategy="beforeInteractive"
          src="https://code.jquery.com/jquery-3.6.0.min.js"
        />

        {/* ✅ Google Tag Manager (GTM) */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),
                    dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-KC6Q66XC');
            `,
          }}
        />

        {/* ✅ Google Analytics (GA4 & Ads Pixel) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-722091953"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-722091953');
              gtag('config', 'G-3Z6F2Q3TQ5');
            `,
          }}
        />

        {/* ✅ Facebook Pixel */}
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s){
                if(f.fbq)return;
                n=f.fbq=function(){
                  n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)
                };
                if(!f._fbq) f._fbq=n;
                n.push=n;
                n.loaded=!0;
                n.version='2.0';
                n.queue=[];
                t=b.createElement(e);
                t.async=!0;
                t.src=v;
                s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)
              }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '909380096123158');
              fbq('track', 'PageView');
            `,
          }}
        />

        {/* Example of another inline script (encoded data) */}
        <Script
          id="sa-dynamic-optimization"
          data-nowprocket
          data-nitro-exclude
          type="text/javascript"
          strategy="afterInteractive"
          src="data:text/javascript;base64,dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoInNjcmlwdCIpO3NjcmlwdC5zZXRBdHRyaWJ1dGUoIm5vd3Byb2NrZXQiLCAiIik7c2NyaXB0LnNldEF0dHJpYnV0ZSgibml0cm8tZXhjbHVkZSIsICIiKTtzY3JpcHQuc3JjID0gImh0dHBzOi8vZGFzaGJvYXJkLnNlYXJjaGF0bGFzLmNvbS9zY3JpcHRzL2R5bmFtaWNfb3B0aW1pemF0aW9uLmpzIjtzY3JpcHQuZGF0YXNldC51dWlkID0gIjkyODQ2M2Q5LTVhYjktNDU4Ny05YTUyLTg2N2Y3MjYzOWFlNiI7c2NyaXB0LmlkID0gInNhLWR5bmFtaWMtb3B0aW1pemF0aW9uLWxvYWRlciI7ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpOw=="
        />
      </head>
      <body>
        <ConditionalNavbar />
        <ConditionalPopup />
        {/* ✅ Google Tag Manager (NoScript Fallback) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KC6Q66XC"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        {/* ✅ Facebook Pixel NoScript */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=909380096123158&ev=PageView&noscript=1"
          />
        </noscript>
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
      </body>
    </html>
  );
}
