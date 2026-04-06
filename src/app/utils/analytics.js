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
 * Fire a Lead conversion across all pixels: GA4, GTM, FB, TikTok, OpenReplay.
 * Call this on every successful form submission.
 */
export function trackConversion(formName, properties = {}) {
  if (typeof window === "undefined") return;
  // GA4 + GTM + OpenReplay via trackEvent
  trackEvent("form_submitted", { form: formName, ...properties });
  // Google Ads conversions (both accounts)
  if (window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: 'AW-722091953',
      event_category: 'Lead',
      event_label: formName,
    });
    window.gtag('event', 'conversion', {
      send_to: 'AW-658866049/QM4gCN6ypZUcEIH_lboC',
      value: 1.0,
      currency: 'USD',
    });
  }
  // Facebook Pixel — Lead event
  if (window.fbq) {
    window.fbq('track', 'Lead', { content_name: formName, ...properties });
  }
  // TikTok Pixel — SubmitForm event
  if (window.ttq) {
    window.ttq.track('SubmitForm', { content_name: formName });
  }
}

/**
 * Track phone click across all pixels.
 */
export function trackPhoneClick(phoneNumber) {
  if (typeof window === "undefined") return;
  trackEvent("phone_click", { number: phoneNumber, page: window.location.pathname });
  if (window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: 'AW-722091953',
      event_category: 'Lead',
      event_label: 'phone_click',
    });
  }
  if (window.fbq) {
    window.fbq('track', 'Contact', { content_name: 'phone_click' });
  }
  if (window.ttq) {
    window.ttq.track('Contact', { content_name: 'phone_click' });
  }
}

/**
 * Fire a Google Ads conversion event (AW-658866049).
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
