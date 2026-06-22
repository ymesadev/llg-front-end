/*
 * viServerJoin.js — server-side visitor-intelligence submit beacon (Workstream C).
 *
 * Called from each intake API route AFTER the lead has been forwarded downstream.
 * Reads the first-party `llg_vid` cookie (sent automatically on the same-origin
 * intake fetch) and POSTs a `submit` event to the collector so the visitor's
 * funnel can be joined to the eventual CRM contact server-side.
 *
 * PRIVACY / CONTRACT NOTES (see visitor-intel/ARCHITECTURE.md decision #2):
 *   - NO PII leaves the form to us here. No name/phone/email/address is sent —
 *     only the llg_vid binding + a gate_passed boolean + the qualifier name.
 *   - These LLG intake routes forward to n8n webhooks and DO NOT receive a Vienta
 *     contact id back, so `vienta_contact_id` is null. We flag
 *     meta.join_method="phone_fallback" so the collector resolves the Vienta
 *     contact via its server-side phone-search fallback (the phone is passed to
 *     the collector ONLY transiently by Workstream A's own pipeline and never by
 *     this route, and is never stored).
 *   - Fire-and-forget: never awaited by the caller, never blocks the user response,
 *     fully guarded so a collector outage cannot 500 the intake.
 *   - Guarded on COLLECTOR_ORIGIN — a complete no-op until cutover.
 *
 * @param {Request} request  the incoming Next.js Request (for cookies)
 * @param {Object}  opts
 * @param {string}  opts.qualifier      case_type, e.g. "ssdi" | "property-damage" | ...
 * @param {boolean} opts.gatePassed     did the lead pass the qualifier gate
 * @param {string=} opts.viennaContactId optional Vienta contact id if ever available
 */
export function fireViSubmit(request, { qualifier, gatePassed = true, viennaContactId = null } = {}) {
  try {
    const origin = process.env.COLLECTOR_ORIGIN;
    if (!origin) return; // dark until cutover

    // Read the first-party visitor id from the request cookies.
    let llgVid = null;
    try {
      // Next.js Request exposes a standard Headers cookie string.
      const cookieHeader = request.headers.get("cookie") || "";
      const m = cookieHeader.match(/(?:^|;\s*)llg_vid=([^;]+)/);
      if (m) llgVid = decodeURIComponent(m[1]);
    } catch {
      /* ignore */
    }
    if (!llgVid) return; // no first-party id -> nothing to join

    // session_id is not available server-side (sessionStorage is client-only) -> null.
    const body = JSON.stringify({
      type: "submit",
      llg_vid: llgVid,
      session_id: null,
      qualifier: qualifier || null,
      meta: {
        gate_passed: !!gatePassed,
        vienta_contact_id: viennaContactId || null,
        join_method: viennaContactId ? "contact_id" : "phone_fallback",
        source: "server_intake",
      },
    });

    // Fire-and-forget. keepalive lets it survive the response returning.
    // Intentionally NOT awaited.
    fetch(`${origin}/collect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      /* swallow — never affects the user response */
    });
  } catch {
    /* never throw out of a fire-and-forget join */
  }
}
