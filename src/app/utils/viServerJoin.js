/*
 * viServerJoin.js — server-side visitor-intelligence join helper (Workstream C).
 *
 * Used by each intake API route to read the first-party `llg_vid` cookie so it
 * can be forwarded to the n8n webhook as an `llg_vid` field. n8n then calls the
 * collector's /link with the CRM contact id it creates, joining the visitor's
 * funnel to the eventual Vienta contact server-side.
 *
 * PRIVACY / CONTRACT NOTES (see visitor-intel/ARCHITECTURE.md decision #2):
 *   - The CANONICAL funnel `submit` event is emitted CLIENT-SIDE by the
 *     first-party emitter (public/scripts/llg-vi.js). The intake routes do NOT
 *     fire their own `submit` to the collector — a server-side submit carried no
 *     contact id (vienta_contact_id:null) and double-counted the funnel.
 *   - Instead the route passes `llg_vid` to n8n so the contact-id join happens
 *     downstream. NO PII is involved in the binding itself — just the opaque
 *     first-party visitor id.
 *
 * @param {Request} request the incoming Next.js Request (for cookies)
 * @returns {string|null} the llg_vid cookie value, or null if absent/unreadable
 */
export function getLlgVid(request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const m = cookieHeader.match(/(?:^|;\s*)llg_vid=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  } catch {
    return null;
  }
}
