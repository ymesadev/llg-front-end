/**
 * Funnel Analytics Utility
 * Pushes events to GTM dataLayer (consent-gated via TrackingScripts).
 * Events queued before GTM loads are replayed automatically on GTM init.
 */

export function trackEvent(eventName, properties = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...properties,
    event_timestamp: new Date().toISOString(),
  });
  // Direct GA4 forwarding — ensures events reach GA4 regardless of GTM config
  if (window.gtag) {
    window.gtag('event', eventName, properties);
  }
  // Mirror to OpenReplay for session replay visibility
  if (window.__or_event) {
    window.__or_event(eventName, properties);
  }
}

/**
 * Fire a Google Ads conversion event.
 * Requires gtag to be loaded via TrackingScripts.
 */
export function trackGoogleConversion() {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: 'AW-658866049/QM4gCN6ypZUcEIH_lboC',
      value: 1.0,
      currency: 'USD',
    });
  }
}
