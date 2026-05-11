"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import styles from "./page.module.css";
import { trackEvent, trackConversion } from "@/app/utils/analytics";
import useGclid, { getStoredGclid } from "@/app/utils/useGclid";

const DAMAGE_LABELS = [
  "Hurricane / Wind",
  "Water / Flood",
  "Roof Damage",
  "Fire / Smoke",
  "Plumbing Leak",
  "Mold",
  "Other",
];

// Flow: damage → owner → florida → contact → booking
const TOTAL_STEPS = 4;
const STEP_NAMES = ["damage_type", "owner_check", "florida_check", "contact_info", "book_consultation"];

// Cal.com embed config
const CAL_ORIGIN = "https://bookings.louislawgroup.com";
const CAL_LINK = "pierre-louislawgroup.com/property-insurance-claim-consultation";
const CAL_NAMESPACE = "llg-fpp-booker";

export default function PropertyDamageQualify() {
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [bookingEmbedded, setBookingEmbedded] = useState(false);
  const [contact, setContact] = useState({ name: "", email: "", phone: "", propertyAddress: "" });
  const [contactConsent, setContactConsent] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactError, setContactError] = useState("");
  const today = new Date();

  // Capture Google Ads click ID (gclid) from URL → localStorage on mount.
  // Forwarded with intake payloads to GHL (Ads GCLID custom field) so that
  // when the contact later signs the FPP retainer in DocuSeal, the daily
  // offline-conversion uploader can attribute the conversion to Google Ads.
  const gclid = useGclid();
  useEffect(() => {
    if (gclid) {
      trackEvent("gclid_captured", { gclid_short: gclid.slice(0, 12), case_type: "property-damage" });
    }
  }, [gclid]);

  useEffect(() => {
    trackEvent("qualify_page_view", { case_type: "property-damage" });
  }, []);

  useEffect(() => {
    if (cur <= TOTAL_STEPS) {
      trackEvent("qualify_step_viewed", {
        case_type: "property-damage",
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
          case_type: "property-damage",
          last_step: curRef.current,
          last_step_name: STEP_NAMES[curRef.current],
          answers_given: Object.keys(answersRef.current).length,
        });
      }
    };
    window.addEventListener("beforeunload", handleExit);
    return () => window.removeEventListener("beforeunload", handleExit);
  }, []);

  const progress = Math.min(((cur + 1) / (TOTAL_STEPS + 1)) * 100, 100);
  const setAnswer = (key, val) => setAnswers((a) => ({ ...a, [key]: val }));
  const next = () => setCur((c) => c + 1);
  const back = () => setCur((c) => Math.max(0, c - 1));

  const handleDamage = (idx) => {
    setAnswer("damage_type_idx", idx);
    trackEvent("qualify_step_answered", {
      case_type: "property-damage", step: 0, step_name: "damage_type", answer: DAMAGE_LABELS[idx],
    });
    // Retargeting pixels — Step 1 (damage type selected)
    if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyStep1Complete", { damage_type: DAMAGE_LABELS[idx] });
    if (typeof gtag !== "undefined") gtag("event", "qualify_step_1", { event_category: "Qualifier", damage_type: DAMAGE_LABELS[idx] });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "qualify_step_complete", step: 1, step_name: "damage_type", damage_type: DAMAGE_LABELS[idx] });
    setTimeout(next, 320);
  };

  const showDQ = (reason) => {
    trackEvent("qualify_disqualified", { case_type: "property-damage", reason });
    // Retargeting pixels — Disqualified
    if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyDQ", { reason });
    if (typeof gtag !== "undefined") gtag("event", "qualify_dq", { event_category: "Qualifier", reason });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "qualify_dq", reason });
    setResult({ dq: true, reason });
    setCur(TOTAL_STEPS + 1);
  };

  const handleOwner = (isOwner) => {
    setAnswer("owner", isOwner);
    trackEvent("qualify_step_answered", {
      case_type: "property-damage", step: 1, step_name: "owner_check",
      answer: isOwner ? "yes" : "no", disqualified: !isOwner,
    });
    // Retargeting pixels — Step 2 (owner confirmation)
    if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyStep2Complete", { is_owner: isOwner ? "yes" : "no" });
    if (typeof gtag !== "undefined") gtag("event", "qualify_step_2", { event_category: "Qualifier", is_owner: isOwner ? "yes" : "no" });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "qualify_step_complete", step: 2, step_name: "owner_check", is_owner: isOwner ? "yes" : "no" });
    if (!isOwner) { setTimeout(() => showDQ("not-owner"), 320); return; }
    setTimeout(next, 320);
  };

  const handleFlorida = (isFL) => {
    setAnswer("florida", isFL);
    trackEvent("qualify_step_answered", {
      case_type: "property-damage", step: 2, step_name: "florida_check",
      answer: isFL ? "yes" : "no", disqualified: !isFL,
    });
    // Retargeting pixels — Step 3 (Florida check)
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

    const damageIdx = answers.damage_type_idx;

    setContactSubmitting(true);

    // Persist contact in answers so the booking embed can read them
    setAnswers((a) => ({ ...a, name, email, phone, propertyAddress }));

    trackEvent("qualify_step_answered", {
      case_type: "property-damage", step: 3, step_name: "contact_info",
      sms_consent: contactConsent,
    });
    // Retargeting pixels — Step 4 (contact captured)
    if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyStep4Complete", { sms_consent: contactConsent ? "yes" : "no" });
    if (typeof gtag !== "undefined") gtag("event", "qualify_step_4", { event_category: "Qualifier", sms_consent: contactConsent ? "yes" : "no" });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "qualify_step_complete", step: 4, step_name: "contact_info" });

    const storedGclid = getStoredGclid();

    // Identify this session in OpenReplay so future replays are searchable by
    // email / name / gclid / damage type instead of being anonymous. The
    // __or_identify helper is exposed by src/app/components/OpenReplay/OpenReplay.js
    // once the tracker has started — guarded with typeof window check for safety.
    try {
      if (typeof window !== "undefined" && typeof window.__or_identify === "function") {
        window.__or_identify(email, {
          name,
          phone,
          property_address: propertyAddress,
          damage_type: DAMAGE_LABELS[damageIdx] || "",
          gclid: storedGclid || "",
          case_type: "property-damage",
          sms_consent: contactConsent ? "yes" : "no",
        });
      }
      if (typeof window !== "undefined" && typeof window.__or_event === "function") {
        window.__or_event("qualify_contact_submitted", {
          email,
          damage_type: DAMAGE_LABELS[damageIdx] || "",
          gclid: storedGclid || "",
        });
      }
    } catch (e) { /* OpenReplay tracker not ready yet — silent */ }

    const partialPayload = {
      name, phone, email, propertyAddress,
      damageType: damageIdx,
      caseType: "property-damage",
      smsConsent: contactConsent,
      gclid: storedGclid || undefined,
    };

    const fullPayload = {
      name, phone, email, propertyAddress,
      damageType: damageIdx,
      caseType: "property-damage",
      smsConsent: contactConsent,
      // Fields the qualify-intake route accepts but this short flow doesn't capture yet:
      carrier: "",
      dateOfLoss: "",
      insurerResponse: null,
      // Score: passed all DQ gates → automatic STRONG CANDIDATE
      score: 80,
      gclid: storedGclid || undefined,
    };

    // Fire both webhooks in parallel — partial captures the lead immediately
    // (so we have it even if they bail on the calendar), full sends to the
    // qualified-lead pipeline for Outlook + downstream automation.
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
      // Don't block the booking flow on webhook errors — the lead is still
      // valuable even if the intake POST failed; cal.com booking will be the backup.
      console.error("[qualify] contact webhook error:", err && err.message);
    }

    setContactSubmitting(false);
    setTimeout(next, 200);
  };

  // Mount cal.com inline embed when user reaches booking step
  useEffect(() => {
    if (cur !== TOTAL_STEPS || bookingEmbedded) return;

    const damageIdx = answersRef.current.damage_type_idx;
    const damageLabel = (damageIdx !== undefined ? DAMAGE_LABELS[damageIdx] : "") || "";

    trackEvent("qualify_booking_shown", {
      case_type: "property-damage",
      damage_type: damageLabel,
    });
    // Retargeting pixels — Booking shown (qualified, sees cal.com)
    if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyBookingShown", { damage_type: damageLabel });
    if (typeof gtag !== "undefined") gtag("event", "qualify_booking_shown", { event_category: "Qualifier", damage_type: damageLabel });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "qualify_booking_shown", damage_type: damageLabel });

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
      // Build calLink with URL query params — cal.com's inline embed `config` object
      // does NOT reliably prefill custom booking fields (like damage-type). URL params do.
      // Keys must match the exact field slugs on the event type.
      const prefill = new URLSearchParams();
      if (a.name) prefill.set("name", a.name);
      if (a.email) prefill.set("email", a.email);
      if (a.phone) prefill.set("smsReminderNumber", a.phone);
      if (a.phone) prefill.set("callback-phone", a.phone);
      if (damageLabel) prefill.set("damage-type", damageLabel);
      if (a.insurer) prefill.set("insurance-carrier", a.insurer);
      if (a.city) prefill.set("property-city", a.city);
      // Attach gclid to cal.com booking metadata so the cal → n8n → GHL pipeline
      // also has it; primary join is still GHL contact by email at retainer-sign time.
      const storedGclid = getStoredGclid();
      if (storedGclid) prefill.set("gclid", storedGclid);
      const qs = prefill.toString();
      const calLinkWithPrefill = qs ? `${CAL_LINK}?${qs}` : CAL_LINK;
      window.Cal.ns[CAL_NAMESPACE]("inline", {
        elementOrSelector: "#llg-cal-inline",
        calLink: calLinkWithPrefill,
        config: {
          theme: "light",
          layout: "month_view",
        },
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
      // Track booking success via cal.com event listener
      window.Cal.ns[CAL_NAMESPACE]("on", {
        action: "bookingSuccessful",
        callback: (e) => {
          trackEvent("qualify_submitted", {
            case_type: "property-damage",
            via: "cal_booking",
          });
          trackConversion("pd_qualify", { case_type: "property-damage", via: "cal_booking" });
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
      "not-owner": "Louis Law Group can only represent property owners in insurance disputes. Tenants, occupants, or third parties are not eligible to initiate a claim dispute on behalf of the insured.",
      "out-of-state": "Louis Law Group exclusively handles property insurance claims for properties located in Florida. We are unable to represent out-of-state claims.",
    };
    const titles = { "not-owner": "Not the property owner", "out-of-state": "Outside our practice area" };
    return (
      <div className={styles.wrapper}>
        <Script
          id="vtag-ai-js"
          strategy="afterInteractive"
          src="https://r2.leadsy.ai/tag.js"
          data-pid="1zt0dyt08LfDX6JhM"
          data-version="062024"
        />
        <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: "100%" }} /></div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div><div className={styles.badge}>Louis Law Group · Claim Qualifier</div><h1>Case Evaluation</h1></div>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.resultWrap}>
              <div className={`${styles.resultIcon} ${styles.iconRed}`}>✕</div>
              <div className={styles.dqBadge}>Disqualified</div>
              <div className={styles.resultTitle}>{titles[result.reason]}</div>
              <div className={styles.resultSub}>{msgs[result.reason]}</div>
              <div className={styles.resultSub} style={{ marginTop: "12px", fontWeight: 500 }}>
                {result.reason === "not-owner"
                  ? "Are you a spouse, family member, or authorized representative? Call us to discuss your situation."
                  : "We may be able to help or refer you to a qualified attorney in your state. Call us."}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px", alignItems: "center" }}>
                <a href="tel:+18336574812" className={styles.restartBtn} style={{ textDecoration: "none", textAlign: "center" }}>
                  Call (833) 657-4812
                </a>
                <button className={styles.restartBtn} onClick={() => { window.dispatchEvent(new Event('openSmileyChat')); }}>
                  Chat with us
                </button>
              </div>
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
      <Script
        id="vtag-ai-js"
        strategy="afterInteractive"
        src="https://r2.leadsy.ai/tag.js"
        data-pid="1zt0dyt08LfDX6JhM"
        data-version="062024"
      />
      <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${progress}%` }} /></div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.badge}>Louis Law Group · Claim Qualifier</div>
            <h1>Property Damage Case Evaluation</h1>
          </div>
        </div>

        <div className={styles.cardBody}>
          {cur < TOTAL_STEPS && (
            <div className={styles.urgencyBanner}>
              ⚠ Deadlines and statute of limitations may apply. Act now to protect your claim by completing this form.
            </div>
          )}

          {cur <= TOTAL_STEPS && (
            <div className={styles.trustBar}>
              <span>Free consultation</span>
              <span className={styles.trustDot} />
              <span>No fees unless we win</span>
              <span className={styles.trustDot} />
              <span>4,000+ claims filed</span>
            </div>
          )}

          {/* Step 0: Damage type */}
          {cur === 0 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 1 of 3</div>
              <div className={styles.question}>What type of damage occurred?</div>
              <div className={styles.hint}>Select the primary cause of loss</div>
              <div className={styles.optsGrid}>
                {DAMAGE_LABELS.map((label, i) => (
                  <button key={i} className={`${styles.opt} ${answers.damage_type_idx === i ? styles.selected : ""}`}
                    onClick={() => handleDamage(i)}>
                    <span className={styles.optKey}>{String.fromCharCode(65 + i)}</span> {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Owner check */}
          {cur === 1 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 2 of 3</div>
              <div className={styles.question}>Are you the owner of the damaged property?</div>
              <div className={styles.hint}>Only property owners can initiate an insurance claim dispute</div>
              <div className={styles.opts}>
                <button className={`${styles.opt} ${answers.owner === true ? styles.selected : ""}`} onClick={() => handleOwner(true)}>
                  <span className={styles.optKey}>A</span> Yes — I am the property owner
                </button>
                <button className={`${styles.opt} ${answers.owner === false ? styles.selected : ""}`} onClick={() => handleOwner(false)}>
                  <span className={styles.optKey}>B</span> No — I am a tenant or other party
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Florida check */}
          {cur === 2 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 3 of 3</div>
              <div className={styles.question}>Is the damaged property located in Florida?</div>
              <div className={styles.hint}>We exclusively handle Florida property insurance claims</div>
              <div className={styles.opts}>
                <button className={`${styles.opt} ${answers.florida === true ? styles.selected : ""}`} onClick={() => handleFlorida(true)}>
                  <span className={styles.optKey}>A</span> Yes — property is in Florida
                </button>
                <button className={`${styles.opt} ${answers.florida === false ? styles.selected : ""}`} onClick={() => handleFlorida(false)}>
                  <span className={styles.optKey}>B</span> No — property is outside Florida
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Contact info (captures lead before booking) */}
          {cur === 3 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Almost done</div>
              <div className={styles.question}>Where can our attorney reach you?</div>
              <div className={styles.hint}>
                We&rsquo;ll use this to confirm your consultation and prepare for your call.
              </div>
              <form onSubmit={handleContactSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Full name"
                  value={contact.name}
                  onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                  style={{ padding: "12px 14px", fontSize: "16px", border: "1px solid #d0d5dd", borderRadius: "8px", outline: "none", width: "100%", boxSizing: "border-box" }}
                />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Email address"
                  value={contact.email}
                  onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                  style={{ padding: "12px 14px", fontSize: "16px", border: "1px solid #d0d5dd", borderRadius: "8px", outline: "none", width: "100%", boxSizing: "border-box" }}
                />
                <input
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="Phone number"
                  value={contact.phone}
                  onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value.replace(/[^\d+\-() ]/g, "") }))}
                  maxLength={20}
                  style={{ padding: "12px 14px", fontSize: "16px", border: "1px solid #d0d5dd", borderRadius: "8px", outline: "none", width: "100%", boxSizing: "border-box" }}
                />
                <input
                  type="text"
                  autoComplete="street-address"
                  placeholder="Property address (optional)"
                  value={contact.propertyAddress}
                  onChange={(e) => setContact((c) => ({ ...c, propertyAddress: e.target.value }))}
                  style={{ padding: "12px 14px", fontSize: "16px", border: "1px solid #d0d5dd", borderRadius: "8px", outline: "none", width: "100%", boxSizing: "border-box" }}
                />
                <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#475467", lineHeight: 1.45 }}>
                  <input
                    type="checkbox"
                    checked={contactConsent}
                    onChange={(e) => setContactConsent(e.target.checked)}
                    style={{ marginTop: "3px", flexShrink: 0 }}
                  />
                  <span>
                    I agree to receive text messages from Louis Law Group about my case. Msg &amp; data rates may apply. Reply STOP to opt out.
                  </span>
                </label>
                {contactError && (
                  <div style={{ color: "#b42318", fontSize: "13px", padding: "8px 12px", background: "#fef3f2", borderRadius: "6px", border: "1px solid #fecdca" }}>
                    {contactError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={contactSubmitting}
                  style={{
                    padding: "14px 20px",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#1a2b49",
                    background: contactSubmitting ? "#e8c97a" : "#ffb800",
                    border: "none",
                    borderRadius: "8px",
                    cursor: contactSubmitting ? "wait" : "pointer",
                    marginTop: "4px",
                    transition: "background 0.2s",
                  }}
                >
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
                Based on your answers, your claim appears eligible. Your selected damage type
                ({answers.damage_type_idx !== undefined ? DAMAGE_LABELS[answers.damage_type_idx] : ""})
                will be passed to the consultation form.
              </div>
              <div id="llg-cal-inline" className={styles.calEmbed} />
              <div className={styles.hint} style={{ marginTop: "10px", fontSize: "12px" }}>
                🔒 Your information is confidential and protected by attorney-client privilege.
              </div>
            </div>
          )}
        </div>

        <div className={styles.cardFooter}>
          <button
            className={styles.backBtn}
            onClick={back}
            style={{ visibility: cur > 0 && cur <= TOTAL_STEPS ? "visible" : "hidden" }}
          >
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
            window.gtag('event', 'phone_click', { event_category: 'Conversion', event_label: 'qualifier_page' });
          }
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: 'phone_click', page: '/property-damage-claims/qualify' });
        }}>(833) 657-4812</a> for a free case review
      </div>
    </div>
  );
}
