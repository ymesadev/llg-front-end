"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import styles from "../../qualify/page.module.css";
import { trackEvent, trackConversion } from "@/app/utils/analytics";
import useGclid, { getStoredGclid } from "@/app/utils/useGclid";
import { useDropoffBeacon, sendDropoff } from "@/app/utils/dropoffBeacon";
import {
  WARRANTY_COMPANIES,
  NOT_LISTED_VALUE,
  isCoveredCompany,
  companyLabel,
  COMPANY_TYPE_IDX,
} from "../../data/arbitrationCompanies";

const WARRANTY_TYPE_LABELS = [
  "Auto / Vehicle Service Contract",
  "Home Warranty (systems & appliances)",
  "Appliance / Electronics Protection",
  "New-Home / Builder Structural Warranty",
  "HVAC / Service Contract",
  "Other Warranty or Service Contract",
];

const DISPUTE_STATUS_LABELS = [
  "Denied — claim was refused",
  "Delayed — no decision yet",
  "Underpaid — paid less than owed",
  "Not sure",
];

// Flow: type → company (HARD GATE) → dispute status → florida → contact → booking
const TOTAL_STEPS = 5;
const STEP_NAMES = ["warranty_type", "warranty_company", "dispute_status", "florida_check", "contact_info", "book_consultation"];

const CAL_ORIGIN = "https://bookings.louislawgroup.com";
const CAL_LINK = "pierre-louislawgroup.com/warranty-claim-consultation";
const CAL_NAMESPACE = "warranty-arb-consultation";

export default function WarrantyArbitrationQualify() {
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [bookingEmbedded, setBookingEmbedded] = useState(false);
  const [contact, setContact] = useState({ name: "", email: "", phone: "", propertyAddress: "" });
  const [contactConsent, setContactConsent] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactError, setContactError] = useState("");
  const [companyError, setCompanyError] = useState("");
  const [heroCompany, setHeroCompany] = useState("");
  const [started, setStarted] = useState(false);

  const gclid = useGclid();
  useEffect(() => {
    if (gclid) trackEvent("gclid_captured", { gclid_short: gclid.slice(0, 12), case_type: "warranty-arbitration" });
  }, [gclid]);

  useEffect(() => {
    trackEvent("qualify_page_view", { case_type: "warranty-arbitration" });
  }, []);

  // ── Ad / article prefill ── carry the provider from the click; preselect the
  // company step. Hard gate preserved: only prefill values that pass isCoveredCompany().
  useEffect(() => {
    try {
      const company = new URLSearchParams(window.location.search).get("company");
      if (!company || !isCoveredCompany(company)) return;
      setHeroCompany(company);
      const typeIdx = COMPANY_TYPE_IDX[company];
      setAnswers((a) => {
        const nextA = { ...a, company };
        if (typeIdx !== undefined && a.warranty_type_idx === undefined) nextA.warranty_type_idx = typeIdx;
        return nextA;
      });
      const companyStep = STEP_NAMES.indexOf("warranty_company");
      setCur(companyStep === -1 ? 1 : companyStep);
      setStarted(true);
      trackEvent("qualify_prefilled", {
        case_type: "warranty-arbitration",
        company: companyLabel(company),
        warranty_type: typeIdx !== undefined ? WARRANTY_TYPE_LABELS[typeIdx] : "",
        source: "ad_click",
      });
    } catch (e) { /* prefill is best-effort */ }
  }, []);

  useEffect(() => {
    if (cur <= TOTAL_STEPS) {
      trackEvent("qualify_step_viewed", { case_type: "warranty-arbitration", step: cur, step_name: STEP_NAMES[cur] });
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
          case_type: "warranty-arbitration",
          last_step: curRef.current,
          last_step_name: STEP_NAMES[curRef.current],
          answers_given: Object.keys(answersRef.current).length,
        });
      }
    };
    window.addEventListener("beforeunload", handleExit);
    return () => window.removeEventListener("beforeunload", handleExit);
  }, []);

  const contactRef = useRef(contact);
  const completedRef = useRef(false);
  useEffect(() => { contactRef.current = contact; }, [contact]);
  const buildQA = () => {
    const a = answersRef.current || {};
    const c = contactRef.current || {};
    const qa = [];
    if (a.warranty_type_idx !== undefined) qa.push({ q: "Warranty type", a: WARRANTY_TYPE_LABELS[a.warranty_type_idx] });
    if (a.company) qa.push({ q: "Warranty company", a: companyLabel(a.company) });
    if (a.dispute_status_idx !== undefined) qa.push({ q: "Dispute status", a: DISPUTE_STATUS_LABELS[a.dispute_status_idx] });
    if (a.florida !== undefined) qa.push({ q: "Florida resident / contract", a: a.florida ? "Yes" : "No" });
    const addr = a.propertyAddress || c.propertyAddress;
    if (addr) qa.push({ q: "Mailing address", a: addr });
    return qa;
  };
  useDropoffBeacon(() => {
    const a = answersRef.current || {};
    const c = contactRef.current || {};
    return {
      flow: "Warranty Arbitration",
      status: "abandoned",
      engaged: curRef.current >= 1,
      completed: completedRef.current === true,
      step: curRef.current,
      stepName: STEP_NAMES[Math.min(curRef.current, STEP_NAMES.length - 1)],
      name: (c.name || a.name || "").trim(),
      email: (c.email || a.email || "").trim(),
      phone: (c.phone || a.phone || "").trim(),
      warrantyCompany: a.company ? companyLabel(a.company) : "",
      answers: buildQA(),
      gclid: getStoredGclid() || "",
    };
  });

  const progress = Math.min(((cur + 1) / (TOTAL_STEPS + 1)) * 100, 100);
  const setAnswer = (key, val) => setAnswers((a) => ({ ...a, [key]: val }));
  const next = () => setCur((c) => c + 1);
  const back = () => setCur((c) => Math.max(0, c - 1));

  const handleType = (idx) => {
    setAnswer("warranty_type_idx", idx);
    trackEvent("qualify_step_answered", { case_type: "warranty-arbitration", step: 0, step_name: "warranty_type", answer: WARRANTY_TYPE_LABELS[idx] });
    if (typeof gtag !== "undefined") gtag("event", "qualify_step_1", { event_category: "Qualifier", warranty_type: WARRANTY_TYPE_LABELS[idx] });
    setTimeout(next, 320);
  };

  const showDQ = (reason) => {
    trackEvent("qualify_disqualified", { case_type: "warranty-arbitration", reason });
    if (typeof gtag !== "undefined") gtag("event", "qualify_dq", { event_category: "Qualifier", reason });
    setResult({ dq: true, reason });
    setCur(TOTAL_STEPS + 1);
    const a = answersRef.current || {};
    const c = contactRef.current || {};
    sendDropoff({
      flow: "Warranty Arbitration", status: "disqualified", engaged: true, completed: false,
      step: curRef.current, stepName: reason === "out-of-state" ? "florida_check" : "warranty_company",
      dqReason: reason, name: (c.name || a.name || "").trim(), email: (c.email || a.email || "").trim(),
      phone: (c.phone || a.phone || "").trim(), warrantyCompany: a.company ? companyLabel(a.company) : "",
      answers: buildQA(), gclid: getStoredGclid() || "",
    });
  };

  // ── HARD GATE ── company must be on the covered arbitration list.
  const handleCompanyContinue = () => {
    const v = answers.company;
    if (!v) { setCompanyError("Please select your warranty company to continue."); return; }
    setCompanyError("");
    const covered = isCoveredCompany(v);
    const label = covered ? companyLabel(v) : "not-listed";
    trackEvent("qualify_step_answered", { case_type: "warranty-arbitration", step: 1, step_name: "warranty_company", answer: label, disqualified: !covered });
    if (typeof gtag !== "undefined") gtag("event", "qualify_step_2", { event_category: "Qualifier", company: label });
    if (!covered) { setTimeout(() => showDQ("company-not-covered"), 200); return; }
    setTimeout(next, 200);
  };

  const handleDisputeStatus = (idx) => {
    setAnswer("dispute_status_idx", idx);
    trackEvent("qualify_step_answered", { case_type: "warranty-arbitration", step: 2, step_name: "dispute_status", answer: DISPUTE_STATUS_LABELS[idx] });
    if (typeof gtag !== "undefined") gtag("event", "qualify_dispute_status", { event_category: "Qualifier", dispute_status: DISPUTE_STATUS_LABELS[idx] });
    setTimeout(next, 320);
  };

  const handleFlorida = (isFL) => {
    setAnswer("florida", isFL);
    trackEvent("qualify_step_answered", { case_type: "warranty-arbitration", step: 3, step_name: "florida_check", answer: isFL ? "yes" : "no", disqualified: !isFL });
    if (typeof gtag !== "undefined") gtag("event", "qualify_step_3", { event_category: "Qualifier", in_florida: isFL ? "yes" : "no" });
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
    const dsIdx = answers.dispute_status_idx;
    const disputeStatus = (dsIdx !== undefined ? DISPUTE_STATUS_LABELS[dsIdx] : "") || "";

    setContactSubmitting(true);
    setAnswers((a) => ({ ...a, name, email, phone, propertyAddress }));
    trackEvent("qualify_step_answered", { case_type: "warranty-arbitration", step: 4, step_name: "contact_info", sms_consent: contactConsent });
    if (typeof gtag !== "undefined") gtag("event", "qualify_step_4", { event_category: "Qualifier", sms_consent: contactConsent ? "yes" : "no" });

    const storedGclid = getStoredGclid();
    try {
      if (typeof window !== "undefined" && typeof window.__or_identify === "function") {
        window.__or_identify(email, { name, phone, warranty_company: companyName, warranty_type: warrantyType, dispute_status: disputeStatus, gclid: storedGclid || "", case_type: "warranty-arbitration", sms_consent: contactConsent ? "yes" : "no" });
      }
    } catch (e) { /* tracker not ready */ }

    const base = {
      name, phone, email, propertyAddress,
      caseType: "warranty",
      matterPath: "arbitration",
      arbitration: true,
      warrantyCompany: companyName,
      warrantyType,
      disputeStatus,
      gclid: storedGclid || undefined,
    };
    const partialPayload = { ...base };
    const fullPayload = { ...base, warrantyCompanyValue: companyVal, score: 80 };

    try {
      await Promise.allSettled([
        fetch("/api/qualify-intake-partial", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(partialPayload) }),
        fetch("/api/qualify-intake", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fullPayload) }),
      ]);
    } catch (err) {
      console.error("[warranty-arb-qualify] contact webhook error:", err && err.message);
    }

    setContactSubmitting(false);
    setTimeout(next, 200);
  };

  useEffect(() => {
    if (cur !== TOTAL_STEPS || bookingEmbedded) return;
    const a0 = answersRef.current;
    const companyName = companyLabel(a0.company);
    const typeIdx = a0.warranty_type_idx;
    const warrantyType = (typeIdx !== undefined ? WARRANTY_TYPE_LABELS[typeIdx] : "") || "";
    const dsIdx = a0.dispute_status_idx;
    const disputeStatus = (dsIdx !== undefined ? DISPUTE_STATUS_LABELS[dsIdx] : "") || "";

    trackEvent("qualify_booking_shown", { case_type: "warranty-arbitration", warranty_company: companyName });
    if (typeof gtag !== "undefined") gtag("event", "qualify_booking_shown", { event_category: "Qualifier", warranty_company: companyName });
    if (typeof gtag !== "undefined") gtag("event", "conversion", { send_to: "AW-658866049/vkM8CLv2tcEcEIH_lboC", value: 25.0, currency: "USD" });

    (function (C, A, L) {
      let p = function (a, ar) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal; let ar = arguments;
        if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1]; api.q = api.q || [];
          if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar);
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
      if (disputeStatus) prefill.set("dispute-status", disputeStatus);
      const storedGclid = getStoredGclid();
      if (storedGclid) prefill.set("gclid", storedGclid);
      const qs = prefill.toString();
      const calLinkWithPrefill = qs ? `${CAL_LINK}?${qs}` : CAL_LINK;
      window.Cal.ns[CAL_NAMESPACE]("inline", { elementOrSelector: "#llg-cal-inline", calLink: calLinkWithPrefill, config: { theme: "light", layout: "month_view" } });
      window.Cal.ns[CAL_NAMESPACE]("ui", { hideEventTypeDetails: false, theme: "light", cssVarsPerTheme: { light: { "cal-brand": "#1a2b49", "cal-brand-emphasis": "#ffb800", "cal-text-emphasis": "#1a2b49" } } });
      window.Cal.ns[CAL_NAMESPACE]("on", {
        action: "bookingSuccessful",
        callback: () => {
          completedRef.current = true;
          trackEvent("qualify_submitted", { case_type: "warranty-arbitration", via: "cal_booking" });
          trackConversion("warranty_qualify", { case_type: "warranty-arbitration", via: "cal_booking" });
          if (typeof gtag !== "undefined") gtag("event", "conversion", { send_to: "AW-658866049/1DHHCL72tcEcEIH_lboC", value: 200.0, currency: "USD" });
        },
      });
    };
    mount();
    setBookingEmbedded(true);
  }, [cur, bookingEmbedded]);

  const restart = () => { setAnswers({}); setResult(null); setCur(0); setCompanyError(""); };

  const heroLabel = heroCompany ? companyLabel(heroCompany) : "";

  // ── DISQUALIFIED SCREEN ──
  if (result && result.dq) {
    const msgs = {
      "company-not-covered": "Louis Law Group focuses on arbitration claims against a specific list of warranty and service-contract providers. Based on the provider you selected, we are not able to take your matter at this time. If your contract is actually with one of the listed companies, go back and select it — or call us and we will point you in the right direction.",
      "out-of-state": "Louis Law Group handles warranty and service-contract arbitration for Florida residents and Florida-issued contracts. We are unable to represent out-of-state claims, but we may be able to refer you to an attorney in your state.",
    };
    const titles = { "company-not-covered": "Provider not currently covered", "out-of-state": "Outside our practice area" };
    return (
      <div className={styles.wrapper}>
        <Script id="vtag-ai-js" strategy="afterInteractive" src="https://r2.leadsy.ai/tag.js" data-pid="1zt0dyt08LfDX6JhM" data-version="062024" />
        <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: "100%" }} /></div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div><div className={styles.badge}>Louis Law Group · Warranty Arbitration</div><h1>Case Evaluation</h1></div>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.resultWrap}>
              <div className={`${styles.resultIcon} ${styles.iconRed}`}>✕</div>
              <div className={styles.dqBadge}>We can&apos;t represent you for this provider</div>
              <div className={styles.resultTitle}>{titles[result.reason]}</div>
              <div className={styles.resultSub}>{msgs[result.reason]}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px", alignItems: "center" }}>
                <a href="tel:+18336574812" className={styles.restartBtn} style={{ textDecoration: "none", textAlign: "center" }}>Call (833) 657-4812</a>
                <button className={styles.restartBtn} onClick={() => { window.dispatchEvent(new Event('openSmileyChat')); }}>Chat with us</button>
              </div>
              <button className={styles.restartBtn} onClick={restart}>← Start over</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Script id="vtag-ai-js" strategy="afterInteractive" src="https://r2.leadsy.ai/tag.js" data-pid="1zt0dyt08LfDX6JhM" data-version="062024" />
      <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${progress}%` }} /></div>

      {/* ── ARBITRATION HERO ── always-visible value prop / message match */}
      <div style={{ maxWidth: "680px", margin: "0 auto 18px", padding: "0 4px", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(22px,4vw,32px)", lineHeight: 1.2, color: "#1a2b49", margin: "0 0 10px", fontWeight: 800 }}>
          {heroLabel ? `Denied by ${heroLabel}? You can still fight it.` : "Warranty claim denied? You can still fight it."}
        </h1>
        <p style={{ fontSize: "16px", lineHeight: 1.5, color: "#475467", margin: "0 0 14px" }}>
          {heroLabel ? `${heroLabel}’s` : "Your"} contract may force <strong>arbitration</strong> instead of court — but under the contract and AAA/JAMS consumer rules, <strong>the company pays the arbitration costs</strong>. Louis Law Group files your arbitration for you.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px 18px", fontSize: "14px", color: "#1a2b49", fontWeight: 600 }}>
          <span>① Forced into arbitration</span>
          <span>② They pay the costs</span>
          <span>③ We file for you</span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.badge}>Louis Law Group · Warranty Arbitration Qualifier</div>
            <h1>Warranty Arbitration Case Evaluation</h1>
          </div>
        </div>

        <div className={styles.cardBody}>
          {cur < TOTAL_STEPS && (
            <div className={styles.urgencyBanner}>
              ⚠ Arbitration deadlines may apply. Complete this short form to protect your claim.
            </div>
          )}

          {cur <= TOTAL_STEPS && (
            <div className={styles.trustBar}>
              <span>Free consultation</span>
              <span className={styles.trustDot} />
              <span>No fee to start</span>
              <span className={styles.trustDot} />
              <span>Florida warranty &amp; service contracts</span>
            </div>
          )}

          {cur === 0 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 1 of 4</div>
              <div className={styles.question}>What kind of warranty or service contract is your claim about?</div>
              <div className={styles.hint}>Select the option that best fits</div>
              <div className={styles.optsGrid}>
                {WARRANTY_TYPE_LABELS.map((label, i) => (
                  <button key={i} className={`${styles.opt} ${answers.warranty_type_idx === i ? styles.selected : ""}`} onClick={() => handleType(i)}>
                    <span className={styles.optKey}>{String.fromCharCode(65 + i)}</span> {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {cur === 1 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 2 of 4</div>
              <div className={styles.question}>Which company issued your warranty or service contract?</div>
              <div className={styles.hint}>Choose your provider from the list. We handle arbitration claims against the providers shown here.</div>
              <select
                aria-label="Warranty company"
                value={answers.company ?? ""}
                onChange={(e) => { setCompanyError(""); setAnswer("company", e.target.value); }}
                style={{ width: "100%", padding: "14px 14px", fontSize: "16px", marginTop: "8px", border: "1px solid #d0d5dd", borderRadius: "8px", background: "#fff", color: "#1a2b49", outline: "none", boxSizing: "border-box", appearance: "auto" }}
              >
                <option value="" disabled>— Select your warranty company —</option>
                {WARRANTY_COMPANIES.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
                <option value={NOT_LISTED_VALUE}>My provider isn&apos;t listed / I&apos;m not sure</option>
              </select>
              {companyError && (
                <div style={{ color: "#b42318", fontSize: "13px", padding: "8px 12px", background: "#fef3f2", borderRadius: "6px", border: "1px solid #fecdca", marginTop: "10px" }}>{companyError}</div>
              )}
              <button onClick={handleCompanyContinue} style={{ width: "100%", padding: "14px 20px", fontSize: "16px", fontWeight: 600, color: "#1a2b49", background: "#ffb800", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "16px" }}>Continue →</button>
            </div>
          )}

          {cur === 2 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 3 of 4</div>
              <div className={styles.question}>What&rsquo;s the status of your dispute?</div>
              <div className={styles.hint}>Tell us where things stand with the company</div>
              <div className={styles.opts}>
                {DISPUTE_STATUS_LABELS.map((label, i) => (
                  <button key={i} className={`${styles.opt} ${answers.dispute_status_idx === i ? styles.selected : ""}`} onClick={() => handleDisputeStatus(i)}>
                    <span className={styles.optKey}>{String.fromCharCode(65 + i)}</span> {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {cur === 3 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 4 of 4</div>
              <div className={styles.question}>Are you a Florida resident, or is your contract a Florida-issued warranty?</div>
              <div className={styles.hint}>We handle Florida warranty and service-contract claims</div>
              <div className={styles.opts}>
                <button className={`${styles.opt} ${answers.florida === true ? styles.selected : ""}`} onClick={() => handleFlorida(true)}><span className={styles.optKey}>A</span> Yes — Florida resident or Florida contract</button>
                <button className={`${styles.opt} ${answers.florida === false ? styles.selected : ""}`} onClick={() => handleFlorida(false)}><span className={styles.optKey}>B</span> No — outside Florida</button>
              </div>
            </div>
          )}

          {cur === 4 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Almost done</div>
              <div className={styles.question}>Where can our team reach you?</div>
              <div className={styles.hint}>We&rsquo;ll use this to confirm your consultation and prepare for your call.</div>
              <form onSubmit={handleContactSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
                <input type="text" required autoComplete="name" placeholder="Full name" value={contact.name} onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))} style={{ padding: "12px 14px", fontSize: "16px", border: "1px solid #d0d5dd", borderRadius: "8px", outline: "none", width: "100%", boxSizing: "border-box" }} />
                <input type="email" required autoComplete="email" placeholder="Email address" value={contact.email} onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))} style={{ padding: "12px 14px", fontSize: "16px", border: "1px solid #d0d5dd", borderRadius: "8px", outline: "none", width: "100%", boxSizing: "border-box" }} />
                <input type="tel" required autoComplete="tel" placeholder="Phone number" value={contact.phone} onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value.replace(/[^\d+\-() ]/g, "") }))} maxLength={20} style={{ padding: "12px 14px", fontSize: "16px", border: "1px solid #d0d5dd", borderRadius: "8px", outline: "none", width: "100%", boxSizing: "border-box" }} />
                <input type="text" autoComplete="street-address" placeholder="Mailing address (optional)" value={contact.propertyAddress} onChange={(e) => setContact((c) => ({ ...c, propertyAddress: e.target.value }))} style={{ padding: "12px 14px", fontSize: "16px", border: "1px solid #d0d5dd", borderRadius: "8px", outline: "none", width: "100%", boxSizing: "border-box" }} />
                <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#475467", lineHeight: 1.45 }}>
                  <input type="checkbox" checked={contactConsent} onChange={(e) => setContactConsent(e.target.checked)} style={{ marginTop: "3px", flexShrink: 0 }} />
                  <span>I agree to receive text messages from Louis Law Group about my case. Msg &amp; data rates may apply. Reply STOP to opt out.</span>
                </label>
                {contactError && (<div style={{ color: "#b42318", fontSize: "13px", padding: "8px 12px", background: "#fef3f2", borderRadius: "6px", border: "1px solid #fecdca" }}>{contactError}</div>)}
                <button type="submit" disabled={contactSubmitting} style={{ padding: "14px 20px", fontSize: "16px", fontWeight: 600, color: "#1a2b49", background: contactSubmitting ? "#e8c97a" : "#ffb800", border: "none", borderRadius: "8px", cursor: contactSubmitting ? "wait" : "pointer", marginTop: "4px", transition: "background 0.2s" }}>{contactSubmitting ? "Saving…" : "Continue to scheduling →"}</button>
                <div style={{ fontSize: "12px", color: "#667085", textAlign: "center", marginTop: "4px" }}>🔒 Confidential — protected by attorney-client privilege.</div>
              </form>
            </div>
          )}

          {cur === TOTAL_STEPS && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Final Step — Book Your Free Consultation</div>
              <div className={styles.question}>You qualify. Pick a time that works for you.</div>
              <div className={styles.hint}>Based on your answers, your claim appears eligible for a free review{answers.company ? ` (provider: ${companyLabel(answers.company)})` : ""}.</div>
              <div id="llg-cal-inline" className={styles.calEmbed} />
              <div className={styles.hint} style={{ marginTop: "10px", fontSize: "12px" }}>🔒 Your information is confidential and protected by attorney-client privilege.</div>
            </div>
          )}
        </div>

        <div className={styles.cardFooter}>
          <button className={styles.backBtn} onClick={back} style={{ visibility: cur > 0 && cur <= TOTAL_STEPS ? "visible" : "hidden" }}>← Back</button>
          <span className={styles.stepCounter}>{cur < TOTAL_STEPS ? `Step ${cur + 1} of ${TOTAL_STEPS + 1}` : `Step ${TOTAL_STEPS + 1} of ${TOTAL_STEPS + 1}`}</span>
        </div>
      </div>

      <div className={styles.phoneCta}>
        Prefer to talk? Call <a href="tel:8336574812" onClick={() => { if (typeof window !== 'undefined' && window.gtag) { window.gtag('event', 'phone_click', { event_category: 'Conversion', event_label: 'warranty_arbitration_qualifier' }); } }}>(833) 657-4812</a> for a free case review
      </div>
    </div>
  );
}
