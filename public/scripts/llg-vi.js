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
 * Browser only ever talks to same-origin /collect and /vi-config. Vercel
 * rewrites forward them server-side to the collector (see next.config.mjs).
 *
 * COLLECTOR-GATED, FAIL-CLOSED. This script loads unconditionally but, on load,
 * fetches /vi-config ONCE (shared with the consent prompt via the
 * window.__llgViConfig promise). window.LLGTrack is always created so callers
 * never throw, but every send() no-ops until /vi-config resolves {enabled:true}.
 * If that fetch fails OR enabled is false, the emitter stays completely dark:
 * no events, no cookies beyond any that already exist. The collector's /config
 * is the master on/off switch.
 */
(function () {
  var COLLECT_URL = "/collect"; // first-party origin — rewritten to the collector server-side
  var CONFIG_URL = "/vi-config"; // first-party origin — rewritten to the collector's /config
  var VID_KEY = "llg_vid";

  // Shared, single-flight /vi-config probe. Resolves to TRUE only when the
  // collector explicitly returns {enabled:true}; fail-closed on any error.
  // The consent prompt reuses this same promise so /vi-config is hit ONCE.
  if (!window.__llgViConfig) {
    window.__llgViConfig = fetch(CONFIG_URL, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "same-origin",
    })
      .then(function (r) {
        return r && r.ok ? r.json() : null;
      })
      .then(function (cfg) {
        return !!(cfg && cfg.enabled === true);
      })
      .catch(function () {
        return false; // fail CLOSED — any error ⇒ stay dark
      });
  }
  var viEnabledP = window.__llgViConfig;

  // Resolve the first-party visitor id. Reads the existing cookie if present.
  // MINTS a new llg_vid cookie ONLY when the collector is enabled — so a
  // disabled / fail-closed site sets no new cookie (privacy invariant: nothing
  // beyond what already exists). Called from dispatch(), which only runs when
  // enabled. session ids likewise are minted lazily inside dispatch().
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

  function getSid() {
    var s = sessionStorage.getItem("llg_sid");
    if (s) return s;
    s = window.crypto && crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    sessionStorage.setItem("llg_sid", s);
    return s;
  }

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

  function dispatch(type, qualifier, step, meta) {
    // vid/sid minted here (enabled-only path) — never on a dark/disabled load.
    var body = JSON.stringify({
      llg_vid: getVid(),
      session_id: getSid(),
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

  function send(type, qualifier, step, meta) {
    // Consent gate: emit nothing behavioral until accepted. consent events pass.
    if (type !== "consent" && !hasConsent()) return;
    // Collector master switch (fail-closed): defer the dispatch until /vi-config
    // resolves {enabled:true}. If it failed or is disabled, this never fires.
    // Snapshot ts here so deferred sends keep their true event time. sendBeacon
    // still works post-await (the page is alive — these aren't unload events;
    // unload events only fire after consent, by which point config has resolved).
    var snapshotMeta = meta;
    viEnabledP.then(function (enabled) {
      if (enabled) dispatch(type, qualifier, step, snapshotMeta);
    });
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

  // If the visitor previously accepted, log a pageview on load. send() still
  // defers this behind the /vi-config gate, so it stays dark if disabled.
  if (hasConsent()) window.LLGTrack.pageview();
})();
