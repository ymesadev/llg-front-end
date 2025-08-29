import "./globals.css";
import Script from "next/script";
import TrovoTracking from "./components/TrovoTracking"; // Ensure correct path
import CookieConsent from "./components/CookieConsent/CookieConsent";
import Popup from "./components/Popup/Popup";
import Navbar from "./components/Navbar/Navbar";
import ChatbotPopup from "./components/ChatBot/ChatBot";



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
        <Navbar />
        <Popup />
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
      </body>
    </html>
  );
}
