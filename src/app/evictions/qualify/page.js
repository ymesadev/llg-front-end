"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import styles from "./page.module.css";
import { trackEvent, trackConversion } from "@/app/utils/analytics";
import useGclid, { getStoredGclid } from "@/app/utils/useGclid";
import { useDropoffBeacon, sendDropoff } from "@/app/utils/dropoffBeacon";

const EVICTION_REASON_LABELS = [
  "Non-payment of rent",
  "Lease violation (other than rent)",
  "Holdover — tenant won't leave after the lease ended",
  "No written lease / month-to-month removal",
  "Property damage, nuisance, or illegal activity",
  "Other landlord-tenant issue",
];

// Flow: role (HARD GATE — tenants DQ) → eviction reason → florida (HARD GATE) →
//       contact → booking. LLG represents LANDLORDS ONLY.
const TOTAL_STEPS = 4;
const STEP_NAMES = ["role_check", "eviction_reason", "florida_check", "contact_info", "book_consultation"];

// Cal.com embed config — eviction-specific event type, routed to Pierre's calendar
const CAL_ORIGIN = "https://bookings.louislawgroup.com";
const CAL_LINK = "pierre-louislawgroup.com/eviction-consultation";
const CAL_NAMESPACE = "eviction-consultation";

export default function EvictionQualify() {
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [bookingEmbedded, setBookingEmbedded] = useState(false);
  const [contact, setContact] = useState({ name: "", email: "", phone: "", propertyAddress: "" });
  const [contactConsent, setContactConsent] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactError, setContactError] = useState("");

  // Capture Google Ads click ID (gclid) for offline-conversion attribution.
  const gclid = useGclid();
  useEffect(() => {
    if (gclid) {
      trackEvent("gclid_captured", { gclid_short: gclid.slice(0, 12), case_type: "eviction" });
    }
  }, [gclid]);

  useEffect(() => {
    trackEvent("qualify_page_view", { case_type: "eviction" });
  }, []);

  useEffect(() => {
    if (cur <= TOTAL_STEPS) {
      trackEvent("qualify_step_viewed", {
        case_type: "eviction",
        step: cur,
        step_name: STEP_NAMES[cur],
      });
    }
  }, [cur]);

  const curRef = useRef(cur);
  const answersRef = useRef(answers);
  useEffect(() => { curRef.current = cur; }, [cur]);
  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => {
    const handleExit = () => {
      if (curRef.current < TOTAL_STEPS) {
        trackEvent("qualify_abandoned", {
          case_type: "eviction",
          last_step: curRef.current,
          last_step_name: STEP_NAMES[curRef.current],
          answers_given: Object.keys(answersRef.current).length,
        });
      }
    };
    window.addEventListener("beforeunload", handleExit);
    return () => window.removeEventListener("beforeunload", handleExit);
  }, []);

  // ── Drop-off beacon ── notify Pierre the instant a landlord leaves un-booked.
  const contactRef = useRef(contact);
  const completedRef = useRef(false);
  useEffect(() => { contactRef.current = contact; }, [contact]);
  const buildQA = () => {
    const a = answersRef.current || {};
    const c = contactRef.current || {};
    const qa = [];
    if (a.role) qa.push({ q: "Role", a: a.role === "landlord" ? "Landlord / owner" : "Tenant" });
    if (a.eviction_reason_idx !== undefined) qa.push({ q: "Eviction reason", a: EVICTION_REASON_LABELS[a.eviction_reason_idx] });
    if (a.florida !== undefined) qa.push({ q: "Property in Florida", a: a.florida ? "Yes" : "No" });
    const addr = a.propertyAddress || c.propertyAddress;
    if (addr) qa.push({ q: "Property address", a: addr });
    return qa;
  };
  useDropoffBeacon(() => {
    const a = answersRef.current || {};
    const c = contactRef.current || {};
    return {
      flow: "Eviction",
      status: "abandoned",
      engaged: curRef.current >= 1,
      completed: completedRef.current === true,
      step: curRef.current,
      stepName: STEP_NAMES[Math.min(curRef.current, STEP_NAMES.length - 1)],
      name: (c.name || a.name || "").trim(),
      email: (c.email || a.email || "").trim(),
      phone: (c.phone || a.phone || "").trim(),
      answers: buildQA(),
      gclid: getStoredGclid() || "",
    };
  });

  const progress = Math.min(((cur + 1) / (TOTAL_STEPS + 1)) * 100, 100);
  const setAnswer = (key, val) => setAnswers((a) => ({ ...a, [key]: val }));
  const next = () => setCur((c) => c + 1);
  const back = () => setCur((c) => Math.max(0, c - 1));

  const showDQ = (reason) => {
    trackEvent("qualify_disqualified", { case_type: "eviction", reason });
    if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyDQ", { reason });
    if (typeof gtag !== "undefined") gtag("event", "qualify_dq", { event_category: "Qualifier", reason });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "qualify_dq", reason });
    setResult({ dq: true, reason });
    setCur(TOTAL_STEPS + 1);
    const a = answersRef.current || {};
    const c = contactRef.current || {};
    sendDropoff({
      flow: "Eviction",
      status: "disqualified",
      engaged: true,
      completed: false,
      step: curRef.current,
      stepName: reason === "tenant" ? "role_check" : "florida_check",
      dqReason: reason,
      name: (c.name || a.name || "").trim(),
      email: (c.email || a.email || "").trim(),
      phone: (c.phone || a.phone || "").trim(),
      answers: buildQA(),
      gclid: getStoredGclid() || "",
    });
  };

  // ── HARD GATE — LLG represents LANDLORDS ONLY. Tenants are disqualified. ──
  const handleRole = (role) => {
    setAnswer("role", role);
    trackEvent("qualify_step_answered", {
      case_type: "eviction", step: 0, step_name: "role_check",
      answer: role, disqualified: role === "tenant",
    });
    if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyStep1Complete", { role });
    if (typeof gtag !== "undefined") gtag("event", "qualify_step_1", { event_category: "Qualifier", role });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "qualify_step_complete", step: 1, step_name: "role_check", role });
    if (role === "tenant") { setTimeout(() => showDQ("tenant"), 320); return; }
    setTimeout(next, 320);
  };

  const handleReason = (idx) => {
    setAnswer("eviction_reason_idx", idx);
    trackEvent("qualify_step_answered", {
      case_type: "eviction", step: 1, step_name: "eviction_reason", answer: EVICTION_REASON_LABELS[idx],
    });
    if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyStep2Complete", { eviction_reason: EVICTION_REASON_LABELS[idx] });
    if (typeof gtag !== "undefined") gtag("event", "qualify_step_2", { event_category: "Qualifier", eviction_reason: EVICTION_REASON_LABELS[idx] });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "qualify_step_complete", step: 2, step_name: "eviction_reason", eviction_reason: EVICTION_REASON_LABELS[idx] });
    setTimeout(next, 320);
  };

  const handleFlorida = (isFL) => {
    setAnswer("florida", isFL);
    trackEvent("qualify_step_answered", {
      case_type: "eviction", step: 2, step_name: "florida_check",
      answer: isFL ? "yes" : "no", disqualified: !isFL,
    });
    if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyStep3Complete", { in_florida: isFL ? "yes" : "no" });
    if (typeof gtag !== "undefined") gtag("event", "qualify_step_3", { event_category: "Qualifier", in_florida: isFL ? "yes" : "no" });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "qualify_step_complete", step: 3, step_name: "florida_check", in_florida: isFL ? "yes" : "no" });
    if (!isFL) { setTimeout(() => showDQ("out-of-state"), 320); return; }
    setTimeout(next, 320);
  };

  const handleContactSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setContactError("");

    const name = contact.name.trim();
    const email = contact.email.trim();
    const phone = contact.phone.trim();
    const propertyAddress = contact.propertyAddress.trim();

    if (!name || name.length < 2) { setContactError("Please enter your full name."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setContactError("Please enter a valid email address."); return; }
    if (phone.replace(/\D/g, "").length < 10) { setContactError("Please enter a valid phone number."); return; }

    const reasonIdx = answers.eviction_reason_idx;
    const evictionReason = (reasonIdx !== undefined ? EVICTION_REASON_LABELS[reasonIdx] : "") || "";

    setContactSubmitting(true);

    // Persist contact so the booking embed can read them
    setAnswers((a) => ({ ...a, name, email, phone, propertyAddress }));

    trackEvent("qualify_step_answered", {
      case_type: "eviction", step: 3, step_name: "contact_info",
      sms_consent: contactConsent,
    });
    if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyStep4Complete", { sms_consent: contactConsent ? "yes" : "no" });
    if (typeof gtag !== "undefined") gtag("event", "qualify_step_4", { event_category: "Qualifier", sms_consent: contactConsent ? "yes" : "no" });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "qualify_step_complete", step: 4, step_name: "contact_info" });

    const storedGclid = getStoredGclid();

    try {
      if (typeof window !== "undefined" && typeof window.__or_identify === "function") {
        window.__or_identify(email, {
          name,
          phone,
          eviction_reason: evictionReason,
          property_address: propertyAddress,
          gclid: storedGclid || "",
          case_type: "eviction",
          role: "landlord",
          sms_consent: contactConsent ? "yes" : "no",
        });
      }
      if (typeof window !== "undefined" && typeof window.__or_event === "function") {
        window.__or_event("qualify_contact_submitted", {
          email,
          eviction_reason: evictionReason,
          gclid: storedGclid || "",
        });
      }
    } catch (e) { /* OpenReplay tracker not ready yet — silent */ }

    const partialPayload = {
      name, phone, email, propertyAddress,
      caseType: "eviction",
      role: "landlord",
      evictionReason,
      gclid: storedGclid || undefined,
    };

    const fullPayload = {
      name, phone, email, propertyAddress,
      caseType: "eviction",
      role: "landlord",
      evictionReason,
      // Passed both gates (landlord + Florida) → strong candidate
      score: 80,
      gclid: storedGclid || undefined,
    };

    try {
      await Promise.allSettled([
        fetch("/api/qualify-intake-partial", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(partialPayload),
        }),
        fetch("/api/qualify-intake", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fullPayload),
        }),
      ]);
    } catch (err) {
      console.error("[eviction-qualify] contact webhook error:", err && err.message);
    }

    setContactSubmitting(false);
    setTimeout(next, 200);
  };

  // Mount cal.com inline embed when the landlord reaches the booking step
  useEffect(() => {
    if (cur !== TOTAL_STEPS || bookingEmbedded) return;

    const a0 = answersRef.current;
    const reasonIdx = a0.eviction_reason_idx;
    const evictionReason = (reasonIdx !== undefined ? EVICTION_REASON_LABELS[reasonIdx] : "") || "";

    trackEvent("qualify_booking_shown", { case_type: "eviction", eviction_reason: evictionReason });
    if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyBookingShown", { eviction_reason: evictionReason });
    if (typeof gtag !== "undefined") gtag("event", "qualify_booking_shown", { event_category: "Qualifier", eviction_reason: evictionReason });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "qualify_booking_shown", eviction_reason: evictionReason });

    (function (C, A, L) {
      let p = function (a, ar) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, `${CAL_ORIGIN}/embed/embed.js`, "init");

    const mount = () => {
      if (!window.Cal) { setTimeout(mount, 120); return; }
      window.Cal("init", CAL_NAMESPACE, { origin: CAL_ORIGIN });
      const a = answersRef.current;
      const prefill = new URLSearchParams();
      if (a.name) prefill.set("name", a.name);
      if (a.email) prefill.set("email", a.email);
      if (a.phone) prefill.set("smsReminderNumber", a.phone);
      if (a.phone) prefill.set("callback-phone", a.phone);
      if (a.propertyAddress) prefill.set("property-address", a.propertyAddress);
      if (evictionReason) prefill.set("eviction-reason", evictionReason);
      const storedGclid = getStoredGclid();
      if (storedGclid) prefill.set("gclid", storedGclid);
      const qs = prefill.toString();
      const calLinkWithPrefill = qs ? `${CAL_LINK}?${qs}` : CAL_LINK;
      window.Cal.ns[CAL_NAMESPACE]("inline", {
        elementOrSelector: "#llg-cal-inline",
        calLink: calLinkWithPrefill,
        config: { theme: "light", layout: "month_view" },
      });
      window.Cal.ns[CAL_NAMESPACE]("ui", {
        hideEventTypeDetails: false,
        theme: "light",
        cssVarsPerTheme: {
          light: {
            "cal-brand": "#1a2b49",
            "cal-brand-emphasis": "#ffb800",
            "cal-text-emphasis": "#1a2b49",
          },
        },
      });
      window.Cal.ns[CAL_NAMESPACE]("on", {
        action: "bookingSuccessful",
        callback: () => {
          completedRef.current = true; // booked -> suppress any drop-off beacon
          trackEvent("qualify_submitted", { case_type: "eviction", via: "cal_booking" });
          trackConversion("eviction_qualify", { case_type: "eviction", via: "cal_booking" });
          // NOTE: add a dedicated Google Ads conversion send_to here once the
          // Eviction conversion action is created in the Ads account.
        },
      });
    };
    mount();
    setBookingEmbedded(true);
  }, [cur, bookingEmbedded]);

  const restart = () => {
    setAnswers({}); setResult(null); setCur(0);
  };

  // ── DISQUALIFIED SCREEN ──
  if (result && result.dq) {
    const msgs = {
      "tenant": "Louis Law Group represents landlords and property owners in Florida eviction matters — we are not able to represent tenants. If you're a tenant facing eviction, Florida Rural Legal Services, Bay Area Legal Services, and your local legal aid office offer free or low-cost help. You can also call 2-1-1 to be connected with tenant resources in your county.",
      "out-of-state": "Louis Law Group handles eviction matters for properties located in Florida. We are unable to represent out-of-state matters, but we may be able to refer you to an attorney in your state.",
    };
    const titles = {
      "tenant": "We represent landlords, not tenants",
      "out-of-state": "Outside our practice area",
    };
    return (
      <div className={styles.wrapper}>
        <Script id="vtag-ai-js" strategy="afterInteractive" src="https://r2.leadsy.ai/tag.js" data-pid="1zt0dyt08LfDX6JhM" data-version="062024" />
        <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: "100%" }} /></div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div><div className={styles.badge}>Louis Law Group · Eviction Qualifier</div><h1>Case Evaluation</h1></div>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.resultWrap}>
              <div className={`${styles.resultIcon} ${styles.iconRed}`}>✕</div>
              <div className={styles.dqBadge}>{result.reason === "tenant" ? "We can't represent tenants" : "Outside our service area"}</div>
              <div className={styles.resultTitle}>{titles[result.reason]}</div>
              <div className={styles.resultSub}>{msgs[result.reason]}</div>
              {result.reason === "out-of-state" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px", alignItems: "center" }}>
                  <a href="tel:+18336574812" className={styles.restartBtn} style={{ textDecoration: "none", textAlign: "center" }}>
                    Call (833) 657-4812
                  </a>
                </div>
              )}
              <button className={styles.restartBtn} onClick={restart}>← Start over</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── QUALIFIER STEPS + BOOKING UI ──
  return (
    <div className={styles.wrapper}>
      <Script id="vtag-ai-js" strategy="afterInteractive" src="https://r2.leadsy.ai/tag.js" data-pid="1zt0dyt08LfDX6JhM" data-version="062024" />
      <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${progress}%` }} /></div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.badge}>Louis Law Group · Eviction Qualifier</div>
            <h1>Florida Eviction Case Evaluation</h1>
          </div>
        </div>

        <div className={styles.cardBody}>
          {cur < TOTAL_STEPS && (
            <div className={styles.urgencyBanner}>
              ⚠ Florida evictions move on strict timelines and notice rules. Complete this short form to start the process the right way.
            </div>
          )}

          {cur <= TOTAL_STEPS && (
            <div className={styles.trustBar}>
              <span>Free consultation</span>
              <span className={styles.trustDot} />
              <span>We represent Florida landlords</span>
              <span className={styles.trustDot} />
              <span>Fast, lawful removals</span>
            </div>
          )}

          {/* Step 0: Role — HARD GATE (tenants disqualified) */}
          {cur === 0 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 1 of 3</div>
              <div className={styles.question}>First — are you the property owner, or the tenant?</div>
              <div className={styles.hint}>Louis Law Group represents landlords and property owners in eviction matters.</div>
              <div className={styles.opts}>
                <button className={`${styles.opt} ${answers.role === "landlord" ? styles.selected : ""}`} onClick={() => handleRole("landlord")}>
                  <span className={styles.optKey}>A</span> I&rsquo;m the landlord / property owner / manager
                </button>
                <button className={`${styles.opt} ${answers.role === "tenant" ? styles.selected : ""}`} onClick={() => handleRole("tenant")}>
                  <span className={styles.optKey}>B</span> I&rsquo;m the tenant
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Eviction reason */}
          {cur === 1 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 2 of 3</div>
              <div className={styles.question}>What&rsquo;s the reason you need to evict?</div>
              <div className={styles.hint}>Pick the closest fit</div>
              <div className={styles.optsGrid}>
                {EVICTION_REASON_LABELS.map((label, i) => (
                  <button key={i} className={`${styles.opt} ${answers.eviction_reason_idx === i ? styles.selected : ""}`}
                    onClick={() => handleReason(i)}>
                    <span className={styles.optKey}>{String.fromCharCode(65 + i)}</span> {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Florida check — HARD GATE */}
          {cur === 2 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 3 of 3</div>
              <div className={styles.question}>Is the rental property located in Florida?</div>
              <div className={styles.hint}>We handle Florida eviction matters</div>
              <div className={styles.opts}>
                <button className={`${styles.opt} ${answers.florida === true ? styles.selected : ""}`} onClick={() => handleFlorida(true)}>
                  <span className={styles.optKey}>A</span> Yes — the property is in Florida
                </button>
                <button className={`${styles.opt} ${answers.florida === false ? styles.selected : ""}`} onClick={() => handleFlorida(false)}>
                  <span className={styles.optKey}>B</span> No — outside Florida
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Contact info (captures lead before booking) */}
          {cur === 3 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Almost done</div>
              <div className={styles.question}>Where can our team reach you?</div>
              <div className={styles.hint}>
                We&rsquo;ll use this to confirm your consultation and prepare for your call.
              </div>
              <form onSubmit={handleContactSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
                <input type="text" required autoComplete="name" placeholder="Full name"
                  value={contact.name}
                  onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                  style={{ padding: "12px 14px", fontSize: "16px", border: "1px solid #d0d5dd", borderRadius: "8px", outline: "none", width: "100%", boxSizing: "border-box" }} />
                <input type="email" required autoComplete="email" placeholder="Email address"
                  value={contact.email}
                  onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                  style={{ padding: "12px 14px", fontSize: "16px", border: "1px solid #d0d5dd", borderRadius: "8px", outline: "none", width: "100%", boxSizing: "border-box" }} />
                <input type="tel" required autoComplete="tel" placeholder="Phone number"
                  value={contact.phone}
                  onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value.replace(/[^\d+\-() ]/g, "") }))}
                  maxLength={20}
                  style={{ padding: "12px 14px", fontSize: "16px", border: "1px solid #d0d5dd", borderRadius: "8px", outline: "none", width: "100%", boxSizing: "border-box" }} />
                <input type="text" autoComplete="street-address" placeholder="Rental property address (optional)"
                  value={contact.propertyAddress}
                  onChange={(e) => setContact((c) => ({ ...c, propertyAddress: e.target.value }))}
                  style={{ padding: "12px 14px", fontSize: "16px", border: "1px solid #d0d5dd", borderRadius: "8px", outline: "none", width: "100%", boxSizing: "border-box" }} />
                <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#475467", lineHeight: 1.45 }}>
                  <input type="checkbox" checked={contactConsent} onChange={(e) => setContactConsent(e.target.checked)} style={{ marginTop: "3px", flexShrink: 0 }} />
                  <span>I agree to receive text messages from Louis Law Group about my case. Msg &amp; data rates may apply. Reply STOP to opt out.</span>
                </label>
                {contactError && (
                  <div style={{ color: "#b42318", fontSize: "13px", padding: "8px 12px", background: "#fef3f2", borderRadius: "6px", border: "1px solid #fecdca" }}>
                    {contactError}
                  </div>
                )}
                <button type="submit" disabled={contactSubmitting}
                  style={{ padding: "14px 20px", fontSize: "16px", fontWeight: 600, color: "#1a2b49", background: contactSubmitting ? "#e8c97a" : "#ffb800", border: "none", borderRadius: "8px", cursor: contactSubmitting ? "wait" : "pointer", marginTop: "4px", transition: "background 0.2s" }}>
                  {contactSubmitting ? "Saving…" : "Continue to scheduling →"}
                </button>
                <div style={{ fontSize: "12px", color: "#667085", textAlign: "center", marginTop: "4px" }}>
                  🔒 Confidential — protected by attorney-client privilege.
                </div>
              </form>
            </div>
          )}

          {/* Step 4: BOOKING (final step — cal.com inline embed) */}
          {cur === TOTAL_STEPS && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Final Step — Book Your Free Consultation</div>
              <div className={styles.question}>You qualify. Pick a time that works for you.</div>
              <div className={styles.hint}>
                Based on your answers, your matter appears eligible for a free landlord consultation
                {answers.eviction_reason_idx !== undefined ? ` (${EVICTION_REASON_LABELS[answers.eviction_reason_idx]})` : ""}.
              </div>
              <div id="llg-cal-inline" className={styles.calEmbed} />
              <div className={styles.hint} style={{ marginTop: "10px", fontSize: "12px" }}>
                🔒 Your information is confidential and protected by attorney-client privilege.
              </div>
            </div>
          )}
        </div>

        <div className={styles.cardFooter}>
          <button className={styles.backBtn} onClick={back}
            style={{ visibility: cur > 0 && cur <= TOTAL_STEPS ? "visible" : "hidden" }}>
            ← Back
          </button>
          <span className={styles.stepCounter}>
            {cur < TOTAL_STEPS ? `Step ${cur + 1} of ${TOTAL_STEPS + 1}` : `Step ${TOTAL_STEPS + 1} of ${TOTAL_STEPS + 1}`}
          </span>
        </div>
      </div>

      <div className={styles.phoneCta}>
        Prefer to talk? Call <a href="tel:8336574812" onClick={() => {
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'phone_click', { event_category: 'Conversion', event_label: 'eviction_qualifier_page' });
          }
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: 'phone_click', page: '/evictions/qualify' });
        }}>(833) 657-4812</a> for a free case review
      </div>
    </div>
  );
}
