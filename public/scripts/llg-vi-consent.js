/*
 * llg-vi-consent.js — logged, named consent prompt for LLG first-party analytics.
 * Adapted from visitor-intel/assets/consent.js.
 *
 * Shows a named-tracking prompt, records the choice as a versioned consent event
 * via window.LLGTrack.consent(), and only then unlocks behavioral emission
 * (LLGTrack gates every behavioral send on localStorage llg_consent === "accept").
 *
 * Integration with existing Google Consent Mode v2 (defined inline in layout.js,
 * default-denied) and <ConditionalPopup/>:
 *   - This prompt governs FIRST-PARTY ANALYTICS consent only (analytics_storage).
 *   - On Accept it calls gtag('consent','update',{analytics_storage:'granted'}).
 *     It NEVER touches ad_storage / ad_user_data / ad_personalization — the
 *     existing ConditionalPopup owns the advertising-cookie banner.
 *   - On Decline it leaves Consent Mode at its default-denied state.
 *
 * COLLECTOR-GATED, FAIL-CLOSED: this script loads unconditionally but renders
 * the banner ONLY after /vi-config resolves {enabled:true}. It reuses the
 * single-flight window.__llgViConfig promise created by llg-vi.js (so
 * /vi-config is fetched ONCE per page). If the fetch fails or enabled is false,
 * no banner is shown and no consent cookie is written — completely dark.
 *
 * ⚠️ PLACEHOLDER COPY — the wording below names analytics/tracking explicitly but
 * is NOT final. Pierre approves the production text + the privacy-policy link.
 */
(function () {
  // Bump CONSENT_VERSION whenever the wording changes -> re-prompts every visitor.
  var CONSENT_VERSION = "v1";
  var POLICY_URL = "/privacy";
  var CONFIG_URL = "/vi-config"; // first-party origin — rewritten to the collector's /config

  // Shared, single-flight /vi-config probe (also created by llg-vi.js). Resolves
  // TRUE only when the collector returns {enabled:true}; fail-closed on any error.
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

  // Already decided THIS version? Do nothing (re-prompt only on a version bump).
  try {
    if (localStorage.getItem("llg_consent_version") === CONSENT_VERSION) return;
  } catch (e) {
    return; // storage blocked -> never prompt, never track
  }

  function decide(choice) {
    try {
      localStorage.setItem("llg_consent_version", CONSENT_VERSION);
      if (choice === "accept") localStorage.setItem("llg_consent", "accept");
    } catch (e) {
      /* ignore */
    }
    // Record the named-consent decision (versioned) to the collector.
    if (window.LLGTrack && window.LLGTrack.consent) {
      window.LLGTrack.consent(CONSENT_VERSION, choice);
    }
    // First-party analytics consent ONLY — never ad_* (ConditionalPopup owns those).
    if (choice === "accept" && typeof window.gtag === "function") {
      window.gtag("consent", "update", { analytics_storage: "granted" });
    }
    var el = document.getElementById("llg-vi-consent");
    if (el && el.parentNode) el.parentNode.removeChild(el);
    if (choice === "accept" && window.LLGTrack && window.LLGTrack.pageview) {
      window.LLGTrack.pageview();
    }
  }

  function build() {
    if (document.getElementById("llg-vi-consent")) return;
    var box = document.createElement("div");
    box.id = "llg-vi-consent";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", "First-party analytics consent");
    box.style.cssText =
      "position:fixed;left:0;right:0;bottom:0;z-index:2147483646;background:#0f2540;" +
      "color:#fff;padding:16px 20px;font:14px/1.5 system-ui,-apple-system,sans-serif;" +
      "display:flex;gap:16px;align-items:center;justify-content:center;flex-wrap:wrap;" +
      "box-shadow:0 -2px 12px rgba(0,0,0,.25)";

    // PLACEHOLDER COPY — Pierre approves final wording.
    // Built with safe DOM methods (textContent + real <a>), no innerHTML.
    var msg = document.createElement("span");
    msg.style.cssText = "max-width:780px";
    msg.appendChild(
      document.createTextNode(
        "We use first-party analytics to record how this site is used (pages viewed, " +
          "steps completed, and time spent on each step) so we can improve our intake " +
          "experience. This stays internal to Louis Law Group and is not shared with " +
          "advertisers. See our "
      )
    );
    var policyLink = document.createElement("a");
    policyLink.href = POLICY_URL;
    policyLink.textContent = "Privacy Policy";
    policyLink.style.cssText = "color:#7db6ff;text-decoration:underline";
    msg.appendChild(policyLink);
    msg.appendChild(document.createTextNode("."));

    var accept = document.createElement("button");
    accept.type = "button";
    accept.textContent = "Accept";
    accept.style.cssText =
      "background:#2e7d32;color:#fff;border:0;padding:8px 18px;border-radius:6px;cursor:pointer;font:inherit";
    accept.onclick = function () {
      decide("accept");
    };

    var decline = document.createElement("button");
    decline.type = "button";
    decline.textContent = "Decline";
    decline.style.cssText =
      "background:transparent;color:#fff;border:1px solid #fff;padding:8px 18px;border-radius:6px;cursor:pointer;font:inherit";
    decline.onclick = function () {
      decide("decline");
    };

    box.appendChild(msg);
    box.appendChild(accept);
    box.appendChild(decline);
    document.body.appendChild(box);
  }

  function maybeBuild() {
    if (document.body) build();
    else document.addEventListener("DOMContentLoaded", build);
  }

  // Gate everything behind the collector master switch (fail-closed): only
  // prompt for consent when /vi-config says enabled:true.
  window.__llgViConfig.then(function (enabled) {
    if (enabled) maybeBuild();
  });
})();
