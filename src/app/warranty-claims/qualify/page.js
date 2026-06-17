"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import styles from "./page.module.css";
import { trackEvent, trackConversion } from "@/app/utils/analytics";
import useGclid, { getStoredGclid } from "@/app/utils/useGclid";
import {
  WARRANTY_COMPANIES,
  NOT_LISTED_VALUE,
  isCoveredCompany,
  companyLabel,
} from "../data/warrantyCompanies";

const WARRANTY_TYPE_LABELS = [
  "Auto / Vehicle Service Contract",
  "Home Warranty (systems & appliances)",
  "Appliance / Electronics Protection",
  "New-Home / Builder Structural Warranty",
  "HVAC / Service Contract",
  "Other Warranty or Service Contract",
];

// Flow: type → company (HARD GATE) → florida → contact → booking
const TOTAL_STEPS = 4;
const STEP_NAMES = ["warranty_type", "warranty_company", "florida_check", "contact_info", "book_consultation"];

// Cal.com embed config — warranty-specific event type, routed to Pierre's calendar
const CAL_ORIGIN = "https://bookings.louislawgroup.com";
const CAL_LINK = "pierre-louislawgroup.com/warranty-claim-consultation";
const CAL_NAMESPACE = "warranty-consultation";

export default function WarrantyQualify() {
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [bookingEmbedded, setBookingEmbedded] = useState(false);
  const [contact, setContact] = useState({ name: "", email: "", phone: "", propertyAddress: "" });
  const [contactConsent, setContactConsent] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactError, setContactError] = useState("");
  const [companyError, setCompanyError] = useState("");

  // Capture Google Ads click ID (gclid) for offline-conversion attribution.
  const gclid = useGclid();
  useEffect(() => {
    if (gclid) {
      trackEvent("gclid_captured", { gclid_short: gclid.slice(0, 12), case_type: "warranty" });
    }
  }, [gclid]);

  useEffect(() => {
    trackEvent("qualify_page_view", { case_type: "warranty" });
  }, []);

  useEffect(() => {
    if (cur <= TOTAL_STEPS) {
      trackEvent("qualify_step_viewed", {
        case_type: "warranty",
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
          case_type: "warranty",
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

  const handleType = (idx) => {
    setAnswer("warranty_type_idx", idx);
    trackEvent("qualify_step_answered", {
      case_type: "warranty", step: 0, step_name: "warranty_type", answer: WARRANTY_TYPE_LABELS[idx],
    });
    if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyStep1Complete", { warranty_type: WARRANTY_TYPE_LABELS[idx] });
    if (typeof gtag !== "undefined") gtag("event", "qualify_step_1", { event_category: "Qualifier", warranty_type: WARRANTY_TYPE_LABELS[idx] });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "qualify_step_complete", step: 1, step_name: "warranty_type", warranty_type: WARRANTY_TYPE_LABELS[idx] });
    setTimeout(next, 320);
  };

  const showDQ = (reason) => {
    trackEvent("qualify_disqualified", { case_type: "warranty", reason });
    if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyDQ", { reason });
    if (typeof gtag !== "undefined") gtag("event", "qualify_dq", { event_category: "Qualifier", reason });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "qualify_dq", reason });
    setResult({ dq: true, reason });
    setCur(TOTAL_STEPS + 1);
  };

  // ── HARD GATE ── company must be on the covered list, or the form cannot advance.
  const handleCompanyContinue = () => {
    const v = answers.company;
    if (!v) { setCompanyError("Please select your warranty company to continue."); return; }
    setCompanyError("");
    const covered = isCoveredCompany(v);
    const label = covered ? companyLabel(v) : "not-listed";
    trackEvent("qualify_step_answered", {
      case_type: "warranty", step: 1, step_name: "warranty_company",
      answer: label, disqualified: !covered,
    });
    if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyStep2Complete", { company: label });
    if (typeof gtag !== "undefined") gtag("event", "qualify_step_2", { event_category: "Qualifier", company: label });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "qualify_step_complete", step: 2, step_name: "warranty_company", company: label });
    if (!covered) { setTimeout(() => showDQ("company-not-covered"), 200); return; }
    setTimeout(next, 200);
  };

  const handleFlorida = (isFL) => {
    setAnswer("florida", isFL);
    trackEvent("qualify_step_answered", {
      case_type: "warranty", step: 2, step_name: "florida_check",
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

    const companyVal = answers.company;
    const companyName = companyLabel(companyVal);
    const typeIdx = answers.warranty_type_idx;
    const warrantyType = (typeIdx !== undefined ? WARRANTY_TYPE_LABELS[typeIdx] : "") || "";

    setContactSubmitting(true);

    // Persist contact so the booking embed can read them
    setAnswers((a) => ({ ...a, name, email, phone, propertyAddress }));

    trackEvent("qualify_step_answered", {
      case_type: "warranty", step: 3, step_name: "contact_info",
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
          warranty_company: companyName,
          warranty_type: warrantyType,
          gclid: storedGclid || "",
          case_type: "warranty",
          sms_consent: contactConsent ? "yes" : "no",
        });
      }
      if (typeof window !== "undefined" && typeof window.__or_event === "function") {
        window.__or_event("qualify_contact_submitted", {
          email,
          warranty_company: companyName,
          gclid: storedGclid || "",
        });
      }
    } catch (e) { /* OpenReplay tracker not ready yet — silent */ }

    const partialPayload = {
      name, phone, email, propertyAddress,
      caseType: "warranty",
      warrantyCompany: companyName,
      warrantyType,
      gclid: storedGclid || undefined,
    };

    const fullPayload = {
      name, phone, email, propertyAddress,
      caseType: "warranty",
      warrantyCompany: companyName,
      warrantyCompanyValue: companyVal,
      warrantyType,
      // Passed all DQ gates (covered company + Florida) → automatic STRONG CANDIDATE
      score: 80,
      gclid: storedGclid || undefined,
    };

    // Fire both webhooks in parallel — partial captures the lead immediately,
    // full sends to the qualified-lead pipeline.
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
      console.error("[warranty-qualify] contact webhook error:", err && err.message);
    }

    setContactSubmitting(false);
    setTimeout(next, 200);
  };

  // Mount cal.com inline embed when user reaches booking step
  useEffect(() => {
    if (cur !== TOTAL_STEPS || bookingEmbedded) return;

    const a0 = answersRef.current;
    const companyName = companyLabel(a0.company);
    const typeIdx = a0.warranty_type_idx;
    const warrantyType = (typeIdx !== undefined ? WARRANTY_TYPE_LABELS[typeIdx] : "") || "";

    trackEvent("qualify_booking_shown", { case_type: "warranty", warranty_company: companyName });
    if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyBookingShown", { warranty_company: companyName });
    if (typeof gtag !== "undefined") gtag("event", "qualify_booking_shown", { event_category: "Qualifier", warranty_company: companyName });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "qualify_booking_shown", warranty_company: companyName });

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
      if (companyName) prefill.set("warranty-company", companyName);
      if (warrantyType) prefill.set("warranty-type", warrantyType);
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
          trackEvent("qualify_submitted", { case_type: "warranty", via: "cal_booking" });
          trackConversion("warranty_qualify", { case_type: "warranty", via: "cal_booking" });
        },
      });
    };
    mount();
    setBookingEmbedded(true);
  }, [cur, bookingEmbedded]);

  const restart = () => {
    setAnswers({}); setResult(null); setCur(0); setCompanyError("");
  };

  // ── DISQUALIFIED SCREEN ──
  if (result && result.dq) {
    const msgs = {
      "company-not-covered": "Based on the warranty provider you selected, Louis Law Group is not able to represent you for that company at this time. We currently handle Florida warranty and service-contract disputes against a specific list of providers. If your contract is actually with one of the listed companies, go back and select it — or call us and we'll point you in the right direction.",
      "out-of-state": "Louis Law Group handles warranty and service-contract claims for Florida residents and Florida-issued contracts. We are unable to represent out-of-state claims, but we may be able to refer you to an attorney in your state.",
    };
    const titles = {
      "company-not-covered": "Provider not currently covered",
      "out-of-state": "Outside our practice area",
    };
    return (
      <div className={styles.wrapper}>
        <Script id="vtag-ai-js" strategy="afterInteractive" src="https://r2.leadsy.ai/tag.js" data-pid="1zt0dyt08LfDX6JhM" data-version="062024" />
        <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: "100%" }} /></div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div><div className={styles.badge}>Louis Law Group · Warranty Qualifier</div><h1>Case Evaluation</h1></div>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.resultWrap}>
              <div className={`${styles.resultIcon} ${styles.iconRed}`}>✕</div>
              <div className={styles.dqBadge}>We can&apos;t represent you for this provider</div>
              <div className={styles.resultTitle}>{titles[result.reason]}</div>
              <div className={styles.resultSub}>{msgs[result.reason]}</div>
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
      <Script id="vtag-ai-js" strategy="afterInteractive" src="https://r2.leadsy.ai/tag.js" data-pid="1zt0dyt08LfDX6JhM" data-version="062024" />
      <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${progress}%` }} /></div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.badge}>Louis Law Group · Warranty Qualifier</div>
            <h1>Warranty Claim Case Evaluation</h1>
          </div>
        </div>

        <div className={styles.cardBody}>
          {cur < TOTAL_STEPS && (
            <div className={styles.urgencyBanner}>
              ⚠ Deadlines may apply to warranty disputes. Complete this short form to protect your claim.
            </div>
          )}

          {cur <= TOTAL_STEPS && (
            <div className={styles.trustBar}>
              <span>Free consultation</span>
              <span className={styles.trustDot} />
              <span>No fees unless we win</span>
              <span className={styles.trustDot} />
              <span>Florida warranty &amp; service contracts</span>
            </div>
          )}

          {/* Step 0: Warranty type */}
          {cur === 0 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 1 of 3</div>
              <div className={styles.question}>What kind of warranty or service contract is your claim about?</div>
              <div className={styles.hint}>Select the option that best fits</div>
              <div className={styles.optsGrid}>
                {WARRANTY_TYPE_LABELS.map((label, i) => (
                  <button key={i} className={`${styles.opt} ${answers.warranty_type_idx === i ? styles.selected : ""}`}
                    onClick={() => handleType(i)}>
                    <span className={styles.optKey}>{String.fromCharCode(65 + i)}</span> {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Warranty company — HARD GATE */}
          {cur === 1 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 2 of 3</div>
              <div className={styles.question}>Which company issued your warranty or service contract?</div>
              <div className={styles.hint}>Choose your provider from the list. We can only represent claims against the providers shown here.</div>
              <select
                aria-label="Warranty company"
                value={answers.company ?? ""}
                onChange={(e) => { setCompanyError(""); setAnswer("company", e.target.value); }}
                style={{
                  width: "100%", padding: "14px 14px", fontSize: "16px", marginTop: "8px",
                  border: "1px solid #d0d5dd", borderRadius: "8px", background: "#fff",
                  color: "#1a2b49", outline: "none", boxSizing: "border-box", appearance: "auto",
                }}
              >
                <option value="" disabled>— Select your warranty company —</option>
                {WARRANTY_COMPANIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
                <option value={NOT_LISTED_VALUE}>My provider isn&apos;t listed / I&apos;m not sure</option>
              </select>
              {companyError && (
                <div style={{ color: "#b42318", fontSize: "13px", padding: "8px 12px", background: "#fef3f2", borderRadius: "6px", border: "1px solid #fecdca", marginTop: "10px" }}>
                  {companyError}
                </div>
              )}
              <button
                onClick={handleCompanyContinue}
                style={{
                  width: "100%", padding: "14px 20px", fontSize: "16px", fontWeight: 600,
                  color: "#1a2b49", background: "#ffb800", border: "none", borderRadius: "8px",
                  cursor: "pointer", marginTop: "16px",
                }}
              >
                Continue →
              </button>
            </div>
          )}

          {/* Step 2: Florida check */}
          {cur === 2 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 3 of 3</div>
              <div className={styles.question}>Are you a Florida resident, or is your contract a Florida-issued warranty?</div>
              <div className={styles.hint}>We handle Florida warranty and service-contract claims</div>
              <div className={styles.opts}>
                <button className={`${styles.opt} ${answers.florida === true ? styles.selected : ""}`} onClick={() => handleFlorida(true)}>
                  <span className={styles.optKey}>A</span> Yes — Florida resident or Florida contract
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
                <input type="text" autoComplete="street-address" placeholder="Mailing address (optional)"
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
                Based on your answers, your claim appears eligible for a free review
                {answers.company ? ` (provider: ${companyLabel(answers.company)})` : ""}.
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
            window.gtag('event', 'phone_click', { event_category: 'Conversion', event_label: 'warranty_qualifier_page' });
          }
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: 'phone_click', page: '/warranty-claims/qualify' });
        }}>(833) 657-4812</a> for a free case review
      </div>
    </div>
  );
}
