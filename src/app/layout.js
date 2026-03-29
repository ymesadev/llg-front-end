import "./globals.css";
import { Anton, Montserrat, Work_Sans } from "next/font/google";
import Script from "next/script";
import CookieConsent from "./components/CookieConsent/CookieConsent";
import TrackingScripts from "./components/TrackingScripts/TrackingScripts";
import ConditionalPopup from "./components/ConditionalPopup/ConditionalPopup";
import ConditionalNavbar from "./components/ConditionalNavbar/ConditionalNavbar";
import ConditionalFooter from "./components/ConditionalFooter/ConditionalFooter";
import ClientDynamics from "./components/ClientDynamics/ClientDynamics";
import { Analytics } from "@vercel/analytics/next";

const anton = Anton({ weight: "400", subsets: ["latin"], display: "swap", variable: "--font-anton" });
const montserrat = Montserrat({ subsets: ["latin"], display: "swap", variable: "--font-montserrat" });
const workSans = Work_Sans({ subsets: ["latin"], display: "swap", variable: "--font-work-sans" });

export const metadata = {
  title: "Louis Law Group | Florida Property Damage & SSDI Attorneys",
  description: "Louis Law Group helps Florida residents fight denied insurance claims and win SSDI/SSI benefits. Free consultation — no fees unless we win.",
  alternates: { canonical: "https://www.louislawgroup.com" },
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
    <html lang="en" className={`${anton.variable} ${montserrat.variable} ${workSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(legalServiceSchema) }}
        />
        {/* Preconnect hints for third-party origins */}
        <link rel="preconnect" href="https://login.louislawgroup.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://us.i.posthog.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ConditionalNavbar />
        <ConditionalPopup />
        <TrackingScripts />
        {children}
        <ConditionalFooter />

        {/* PostHog Analytics — lazy-loaded to reduce main thread impact */}
        <Script id="posthog-init" strategy="lazyOnload" dangerouslySetInnerHTML={{ __html: `
          !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+" (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
          posthog.init('POSTHOG_PROJECT_API_KEY', {api_host:'https://us.i.posthog.com', person_profiles: 'identified_only'})
        `}} />

        {/* Lead Attribution — extracted to external file, deferred */}
        <Script src="/scripts/lead-attribution.js" strategy="afterInteractive" />

        <ClientDynamics />
        <CookieConsent />
        {/* Vercel Analytics — cookieless, fires for ALL visitors regardless of consent */}
        <Analytics />

        {/* Visitor beacon — deferred to lazyOnload */}
        <Script src="/scripts/visitor-beacon.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
