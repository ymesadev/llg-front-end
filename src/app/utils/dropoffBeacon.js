"use client";
import { useEffect, useRef } from "react";

// Event-driven intake drop-off beacon.
// Fires ONE fire-and-forget signal to the n8n watcher the instant a client
// leaves a qualifier without finishing (pagehide) or is disqualified
// (immediate). No timers, no polling. The watcher alerts Pierre.
//
// Design notes:
//  - pagehide (not visibilitychange) is the leave signal -> no tab-switch
//    false positives. DQ is sent immediately because it is definitive.
//  - navigator.sendBeacon survives page teardown; fetch+keepalive is the
//    fallback. Both are best-effort and never block or throw into the UI.
//  - _sent dedupes to one beacon per page load (a DQ send suppresses the
//    later pagehide send).

const ENDPOINT = "https://n8n-new.louislawgroup.com/webhook/llg-dropoff-watch";
let _sent = false;

export function sendDropoff(snap) {
  try {
    if (_sent || !snap) return;
    if (snap.completed) return;            // booked -> not a drop-off
    if (!snap.engaged) return;             // never engaged -> a bounce, not a drop-off
    _sent = true;
    const body = JSON.stringify({ ...snap, sentAt: new Date().toISOString() });
    // text/plain is CORS-safelisted -> the cross-origin beacon is delivered
    // WITHOUT a preflight the webhook can't answer. n8n parses the JSON string.
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "text/plain;charset=UTF-8" }));
    } else if (typeof fetch !== "undefined") {
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body,
        keepalive: true,
        mode: "no-cors",
      }).catch(() => {});
    }
  } catch (e) {
    /* never let analytics break the funnel */
  }
}

// Registers the leave-time beacon once. getSnapshot() is called at fire time
// and must read refs (not stale state) so it reflects the latest step/answers.
export function useDropoffBeacon(getSnapshot) {
  const ref = useRef(getSnapshot);
  ref.current = getSnapshot;
  useEffect(() => {
    const onHide = () => {
      try { sendDropoff(ref.current && ref.current()); } catch (e) {}
    };
    window.addEventListener("pagehide", onHide);
    return () => window.removeEventListener("pagehide", onHide);
  }, []);
}
