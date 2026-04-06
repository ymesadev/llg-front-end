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
        {/* Google Consent Mode v2 — must run before GTM/GA4 */}
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'granted',
            ad_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted',
            wait_for_update: 500
          });
        `}} />
        {/* Preconnect hints for third-party origins */}
        <link rel="preconnect" href="https://login.louislawgroup.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
      </head>
      <body>
        <ConditionalNavbar />
        <ConditionalPopup />
        <TrackingScripts />
        {children}
        <ConditionalFooter />


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
