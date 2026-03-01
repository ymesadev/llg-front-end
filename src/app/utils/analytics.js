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
}
