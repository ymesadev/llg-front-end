"use client";

/**
 * GCLID capture utility.
 *
 * Reads the `gclid` query param on page load and persists it in localStorage
 * for 90 days so that downstream form submissions (qualify-intake, partial-lead,
 * sms-optin, callback-request, cal.com booking) can attach it to the GHL
 * contact. The signed retainer (Google Ads conversion) is later matched back
 * to the contact by email, and the stored GCLID is uploaded as an offline
 * conversion.
 *
 * Storage keys:
 *   llg_gclid     — the click id
 *   llg_gclid_ts  — unix ms timestamp it was first stored
 *
 * Design rules:
 *   - No third-party scripts, no fingerprinting.
 *   - SSR-safe (guards every `window`/`localStorage` access).
 *   - Idempotent — safe to call on every render and from multiple components.
 */

import { useEffect, useState } from "react";

const STORAGE_KEY = "llg_gclid";
const TS_KEY = "llg_gclid_ts";
const TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 days

// Google click IDs typically start with these prefixes. Length-based check
// is the fallback — real GCLIDs are always > 50 chars in practice.
function looksLikeGclid(value) {
  if (!value || typeof value !== "string") return false;
  if (value.length > 50) return true;
  return /^(Cj0K|CjwK|EAIa)/.test(value);
}

/**
 * Read the currently stored GCLID, respecting TTL. Safe to call anywhere
 * (SSR-safe). Returns null if missing or expired.
 */
export function getStoredGclid() {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (!v) return null;
    const ts = parseInt(window.localStorage.getItem(TS_KEY) || "0", 10);
    if (!ts || Date.now() - ts > TTL_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(TS_KEY);
      return null;
    }
    return v;
  } catch {
    return null;
  }
}

/**
 * Capture GCLID from the current URL (if present and valid) and store it.
 * Returns the value that's now considered "current" — either the freshly
 * captured one or the previously stored one. Safe to call multiple times.
 */
export function captureGclid() {
  if (typeof window === "undefined") return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("gclid");
    if (fromUrl && looksLikeGclid(fromUrl)) {
      window.localStorage.setItem(STORAGE_KEY, fromUrl);
      window.localStorage.setItem(TS_KEY, String(Date.now()));
      return fromUrl;
    }
  } catch {/* silent — URL or storage unavailable */}
  return getStoredGclid();
}

/**
 * Append a `gclid` query param to a URL if one is stored. Returns the URL
 * unchanged if no gclid is available. Use this when sending users to the
 * retainer page (belt-and-suspenders backup; primary join is by email).
 */
export function appendGclidToUrl(url) {
  if (!url) return url;
  const gclid = getStoredGclid();
  if (!gclid) return url;
  try {
    const u = new URL(url, typeof window !== "undefined" ? window.location.origin : "https://louislawgroup.com");
    if (!u.searchParams.has("gclid")) {
      u.searchParams.set("gclid", gclid);
    }
    return u.toString();
  } catch {
    // url isn't parseable — fall back to a naive concat
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}gclid=${encodeURIComponent(gclid)}`;
  }
}

/**
 * React hook: capture GCLID on mount, return current value. Reactively
 * re-reads when the component remounts. Safe to call from any "use client"
 * component.
 */
export default function useGclid() {
  const [gclid, setGclid] = useState(null);
  useEffect(() => {
    const v = captureGclid();
    if (v) setGclid(v);
  }, []);
  return gclid;
}
