/*
 * llg-vi.js — first-party visitor-intelligence event emitter for LLG qualifiers.
 * Adapted from visitor-intel/assets/collect-snippet.js.
 *
 * PRIVACY INVARIANTS (non-negotiable — see visitor-intel/ARCHITECTURE.md):
 *   - Behavior + timing ONLY. NEVER sends field VALUES.
 *   - had_value is a BOOLEAN; the actual answer text is never read or sent.
 *   - Any meta key matching value|input|text|content|answer|... is stripped
 *     client-side as defense-in-depth before the body is built.
 *   - Consent-gated client-side: nothing behavioral is sent until the visitor
 *     has accepted (localStorage llg_consent === "accept").
 *
 * Browser only ever talks to same-origin /collect. A Vercel rewrite forwards
 * /collect server-side to COLLECTOR_ORIGIN (see next.config.mjs).
 *
 * This file ships DARK. window.LLGTrack is created here, but analytics.js only
 * calls it when NEXT_PUBLIC_VI_ENABLED === "true". Loading the script alone
 * emits nothing except (optionally) a consent-gated pageview.
 */
(function () {
  var COLLECT_URL = "/collect"; // first-party origin — rewritten to COLLECTOR_ORIGIN server-side
  var VID_KEY = "llg_vid";

  function getVid() {
    var m = document.cookie.match(/(?:^|;\s*)llg_vid=([^;]+)/);
    if (m) return m[1];
    var v =
      (window.crypto && crypto.randomUUID && crypto.randomUUID()) ||
      (Date.now() + "-" + Math.random().toString(16).slice(2));
    // 1-year first-party cookie, path=/ so the server-side intake routes can read it too.
    document.cookie =
      "llg_vid=" + v + ";path=/;max-age=" + 60 * 60 * 24 * 365 + ";samesite=lax;secure";
    return v;
  }
  var vid = getVid();
  var sessionId =
    sessionStorage.getItem("llg_sid") ||
    (window.crypto && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
  sessionStorage.setItem("llg_sid", sessionId);

  function hasConsent() {
    return localStorage.getItem("llg_consent") === "accept";
  }

  // Hard client-side guard: never let a value-bearing key leave the browser.
  var FORBIDDEN = /value|input|text|content|answer|keystroke|payload|name|phone|email|address/i;

  function scrub(meta) {
    var clean = {};
    if (meta)
      Object.keys(meta).forEach(function (k) {
        if (!FORBIDDEN.test(k)) clean[k] = meta[k];
      });
    return clean;
  }

  function send(type, qualifier, step, meta) {
    // Consent gate: emit nothing behavioral until accepted. consent events pass.
    if (type !== "consent" && !hasConsent()) return;
    var body = JSON.stringify({
      llg_vid: vid,
      session_id: sessionId,
      type: type,
      qualifier: qualifier || null,
      step: step == null ? null : step,
      ts: new Date().toISOString(),
      meta: scrub(meta),
    });
    try {
      if (navigator.sendBeacon) {
        // sendBeacon survives navigation (beforeunload/abandon).
        navigator.sendBeacon(COLLECT_URL, new Blob([body], { type: "application/json" }));
      } else {
        fetch(COLLECT_URL, {
          method: "POST",
          body: body,
          keepalive: true,
          headers: { "Content-Type": "application/json" },
        });
      }
    } catch (e) {
      /* never throw into the host page */
    }
  }

  function secs() {
    return window.__llgStepT ? Math.round((Date.now() - window.__llgStepT) / 1000) : null;
  }

  // Public API. analytics.js maps the existing qualify_* events onto these.
  window.LLGTrack = {
    pageview: function () {
      send("pageview", null, null, {
        url: location.pathname,
        referrer: document.referrer,
        // NOTE: document.title intentionally omitted — qualifier titles are generic,
        // and "title" is close enough to content that we keep meta minimal.
      });
    },
    stepEnter: function (q, step, idx) {
      window.__llgStepT = Date.now();
      send("step_enter", q, step, { step_index: idx == null ? null : idx });
    },
    stepComplete: function (q, step) {
      send("step_complete", q, step, { seconds: secs() });
    },
    stepAbandon: function (q, step, lastField) {
      // lastField is a field NAME/identifier, never its value.
      send("step_abandon", q, step, { seconds: secs(), last_field: lastField || null });
    },
    fieldFocus: function (q, step, field) {
      send("field_focus", q, step, { field: field || null });
    },
    // had_value is a BOOLEAN. We never read or send the value itself.
    fieldFilled: function (q, step, field, hadValue) {
      send("field_filled", q, step, { field: field || null, had_value: !!hadValue });
    },
    // gate_passed boolean. utm is non-PII campaign metadata. No phone/email/lead text.
    submit: function (q, gatePassed, utm) {
      send("submit", q, null, { gate_passed: !!gatePassed, utm: utm || null });
    },
    consent: function (version, choice) {
      if (choice === "accept") localStorage.setItem("llg_consent", "accept");
      send("consent", null, null, { version: version, choice: choice });
    },
  };

  // If the visitor previously accepted, log a pageview on load.
  if (hasConsent()) window.LLGTrack.pageview();
})();
