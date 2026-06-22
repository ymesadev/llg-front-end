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
  // First-party visitor-intelligence emit (ships dark behind NEXT_PUBLIC_VI_ENABLED).
  emitFirstParty(eventName, properties);
}

/**
 * First-party visitor-intelligence bridge.
 *
 * Mirrors the existing qualify_* funnel events onto window.LLGTrack
 * (public/scripts/llg-vi.js), which POSTs behavior+timing to same-origin /collect.
 *
 * Gated on NEXT_PUBLIC_VI_ENABLED === "true" (default off) AND LLGTrack being loaded.
 * PRIVACY: answer/value text is NEVER forwarded. qualify_step_answered is reduced to
 * a had_value BOOLEAN. LLGTrack additionally scrubs any value-bearing meta key.
 *
 * Event mapping (see visitor-intel/ARCHITECTURE.md):
 *   qualify_step_viewed   -> step_enter
 *   qualify_step_answered -> field_filled{had_value} + step_complete
 *   qualify_submitted     -> submit{gate_passed:true}
 *   qualify_disqualified  -> submit{gate_passed:false}
 *   qualify_abandoned     -> step_abandon
 */
function emitFirstParty(eventName, properties = {}) {
  if (process.env.NEXT_PUBLIC_VI_ENABLED !== "true") return;
  const T = typeof window !== "undefined" && window.LLGTrack;
  if (!T) return;
  try {
    const q = properties.case_type || null;
    const step = properties.step ?? properties.step_name ?? null;
    switch (eventName) {
      case "qualify_step_viewed":
        T.stepEnter(q, step, properties.step_index ?? properties.step ?? null);
        break;
      case "qualify_step_answered": {
        // Derive a had_value BOOLEAN — never read or forward the answer text itself.
        // SSDI passes `answer`/`answer_key`; other qualifiers pass `field`/`value`.
        const rawAnswer = properties.answer ?? properties.value ?? properties.answer_value;
        const hadValue =
          rawAnswer !== undefined &&
          rawAnswer !== null &&
          String(rawAnswer).trim() !== "" &&
          rawAnswer !== "disqualified";
        const field = properties.answer_key || properties.field || properties.step_name || null;
        T.fieldFilled(q, step, field, hadValue);
        T.stepComplete(q, step);
        break;
      }
      case "qualify_submitted":
        T.submit(q, true, properties.utm || null);
        break;
      case "qualify_disqualified":
        T.submit(q, false, properties.utm || null);
        break;
      case "qualify_abandoned":
        T.stepAbandon(q, step, properties.last_field || properties.field || null);
        break;
      default:
        // page_view / prefilled / gclid_captured / booking_shown are not part of the
        // locked v1 funnel mapping — intentionally not forwarded.
        break;
    }
  } catch (e) {
    /* never let analytics break the qualifier */
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
