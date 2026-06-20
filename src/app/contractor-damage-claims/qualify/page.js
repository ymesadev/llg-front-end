"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import styles from "./page.module.css";
import { trackEvent, trackConversion } from "@/app/utils/analytics";
import useGclid, { getStoredGclid } from "@/app/utils/useGclid";
import { useDropoffBeacon, sendDropoff } from "@/app/utils/dropoffBeacon";

const TRADE_LABELS = [
  "HVAC / Air Conditioning",
  "Plumbing",
  "Roofing",
  "Electrical",
  "General Contractor",
  "Other / Not Listed",
];

const DAMAGE_TYPE_LABELS = [
  "Water Damage / Flooding",
  "Roof Leak / Failure",
  "Structural Damage",
  "Mold Growth",
  "Fire / Electrical Damage",
  "Other",
];

const CONTRACTOR_INTENT_LABELS = [
  "I want to hold them legally accountable and get compensated",
  "They denied fault — I need someone to fight for me",
  "They're ignoring my calls or refusing to respond",
  "I'm still negotiating with them directly",
  "I haven't decided yet — I want to understand my options",
];

const DAMAGE_VALUE_LABELS = [
  "Under $5,000",
  "$5,000 – $25,000",
  "$25,000 – $100,000",
  "Over $100,000",
  "Unknown / Not sure yet",
];

// Flow: trade → contractor_name → damage_type → damage_date → insurance_status → damage_value → florida_check → contact_info → book_consultation
const TOTAL_STEPS = 8; // booking step index
const STEP_NAMES = ["trade", "contractor_name", "damage_type", "damage_date", "insurance_status", "damage_value", "florida_check", "contact_info", "book_consultation"];

// Cal.com embed config
const CAL_ORIGIN = "https://bookings.louislawgroup.com";
const CAL_LINK = "pierre-louislawgroup.com/property-insurance-claim-consultation";
const CAL_NAMESPACE = "llg-tpl-booker";

export default function ContractorDamageQualify() {
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [bookingEmbedded, setBookingEmbedded] = useState(false);
  const [contact, setContact] = useState({ name: "", email: "", phone: "", propertyAddress: "" });
  const [contactConsent, setContactConsent] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactError, setContactError] = useState("");

  // Contractor search state (Step 1)
  const [contractorSearch, setContractorSearch] = useState("");
  const [contractorPickerOpen, setContractorPickerOpen] = useState(false);
  const [contractorSelected, setContractorSelected] = useState("");
  const [contractorManual, setContractorManual] = useState(false);
  const [contractorManualName, setContractorManualName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimer = useRef(null);

  // Damage date state (Step 3)
  const [damageDate, setDamageDate] = useState("");

  const gclid = useGclid();
  useEffect(() => {
    if (gclid) {
      trackEvent("gclid_captured", { gclid_short: gclid.slice(0, 12), case_type: "contractor-tpl" });
    }
  }, [gclid]);

  useEffect(() => {
    trackEvent("qualify_page_view", { case_type: "contractor-tpl" });
  }, []);

  useEffect(() => {
    if (cur <= TOTAL_STEPS) {
      trackEvent("qualify_step_viewed", {
        case_type: "contractor-tpl",
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
          case_type: "contractor-tpl",
          last_step: curRef.current,
          last_step_name: STEP_NAMES[curRef.current],
          answers_given: Object.keys(answersRef.current).length,
        });
      }
    };
    window.addEventListener("beforeunload", handleExit);
    return () => window.removeEventListener("beforeunload", handleExit);
  }, []);

  // ── Drop-off beacon ──
  const contactRef = useRef(contact);
  const completedRef = useRef(false);
  useEffect(() => { contactRef.current = contact; }, [contact]);

  const buildQA = () => {
    const a = answersRef.current || {};
    const c = contactRef.current || {};
    const qa = [];
    if (a.trade) qa.push({ q: "Trade", a: a.trade });
    if (a.contractorName) qa.push({ q: "Contractor name", a: a.contractorName });
    if (a.damageType) qa.push({ q: "Damage type", a: a.damageType });
    if (a.damageDate) qa.push({ q: "Damage date", a: a.damageDate });
    if (a.insuranceStatus) qa.push({ q: "Contractor intent", a: a.insuranceStatus });
    if (a.damageValue) qa.push({ q: "Estimated damage value", a: a.damageValue });
    if (a.florida !== undefined) qa.push({ q: "Property in Florida", a: a.florida ? "Yes" : "No" });
    const addr = a.propertyAddress || c.propertyAddress;
    if (addr) qa.push({ q: "Property address", a: addr });
    return qa;
  };

  useDropoffBeacon(() => {
    const a = answersRef.current || {};
    const c = contactRef.current || {};
    return {
      flow: "Contractor TPL",
      status: "abandoned",
      engaged: curRef.current >= 1,
      completed: completedRef.current === true,
      step: curRef.current,
      stepName: STEP_NAMES[Math.min(curRef.current, STEP_NAMES.length - 1)],
      name: (c.name || a.name || "").trim(),
      email: (c.email || a.email || "").trim(),
      phone: (c.phone || a.phone || "").trim(),
      trade: a.trade || "",
      contractorName: a.contractorName || "",
      answers: buildQA(),
      gclid: getStoredGclid() || "",
    };
  });

  const progress = Math.min(((cur + 1) / (TOTAL_STEPS + 1)) * 100, 100);
  const setAnswer = (key, val) => setAnswers((a) => ({ ...a, [key]: val }));
  const next = () => setCur((c) => c + 1);
  const back = () => setCur((c) => Math.max(0, c - 1));

  const showDQ = (reason) => {
    trackEvent("qualify_disqualified", { case_type: "contractor-tpl", reason });
    if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyDQ", { reason });
    if (typeof gtag !== "undefined") gtag("event", "qualify_dq", { event_category: "Qualifier", reason });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "qualify_dq", reason });
    setResult({ dq: true, reason });
    setCur(TOTAL_STEPS + 1);
    const a = answersRef.current || {};
    const c = contactRef.current || {};
    sendDropoff({
      flow: "Contractor TPL",
      status: "disqualified",
      engaged: true,
      completed: false,
      step: curRef.current,
      stepName: reason === "out-of-state" ? "florida_check" : reason === "below-threshold" ? "damage_value" : reason === "statute-expired" ? "damage_date" : STEP_NAMES[curRef.current] || "",
      dqReason: reason,
      name: (c.name || a.name || "").trim(),
      email: (c.email || a.email || "").trim(),
      phone: (c.phone || a.phone || "").trim(),
      trade: a.trade || "",
      contractorName: a.contractorName || "",
      answers: buildQA(),
      gclid: getStoredGclid() || "",
    });
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

    setContactSubmitting(true);

    setAnswers((a) => ({ ...a, name, email, phone, propertyAddress }));

    trackEvent("qualify_step_answered", {
      case_type: "contractor-tpl", step: 7, step_name: "contact_info",
      sms_consent: contactConsent,
    });
    if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyStep8Complete", { sms_consent: contactConsent ? "yes" : "no" });
    if (typeof gtag !== "undefined") gtag("event", "qualify_step_8", { event_category: "Qualifier", sms_consent: contactConsent ? "yes" : "no" });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "qualify_step_complete", step: 8, step_name: "contact_info" });

    const storedGclid = getStoredGclid();

    // OpenReplay identify
    try {
      if (typeof window !== "undefined" && typeof window.__or_identify === "function") {
        window.__or_identify(email, {
          name,
          phone,
          property_address: propertyAddress,
          trade: answersRef.current.trade || "",
          contractor_name: answersRef.current.contractorName || "",
          damage_type: answersRef.current.damageType || "",
          gclid: storedGclid || "",
          case_type: "contractor-tpl",
          sms_consent: contactConsent ? "yes" : "no",
        });
      }
      if (typeof window !== "undefined" && typeof window.__or_event === "function") {
        window.__or_event("qualify_contact_submitted", {
          email,
          trade: answersRef.current.trade || "",
          gclid: storedGclid || "",
        });
      }
    } catch (e) { /* OpenReplay tracker not ready yet — silent */ }

    // Score formula
    let score = 20;
    if (answers.damageValue === "Over $100,000") score += 40;
    else if (answers.damageValue === "$25,000 – $100,000") score += 30;
    else if (answers.damageValue === "$5,000 – $25,000") score += 15;
    else if (answers.damageValue === "Under $5,000") score += 5;
    if (answers.insuranceStatus === "I want to hold them legally accountable and get compensated") score += 25;
    else if (answers.insuranceStatus === "They denied fault — I need someone to fight for me") score += 20;
    else if (answers.insuranceStatus === "They're ignoring my calls or refusing to respond") score += 20;
    else if (answers.insuranceStatus === "I'm still negotiating with them directly") score += 15;
    else if (answers.insuranceStatus === "I haven't decided yet — I want to understand my options") score += 10;
    if (answers.contractorOnList) score += 10;
    score = Math.min(score, 95);

    const partialPayload = {
      name, phone, email, propertyAddress,
      caseType: "contractor-tpl",
      trade: answers.trade,
      contractorName: answers.contractorName,
      smsConsent: contactConsent,
      gclid: storedGclid || undefined,
    };

    const fullPayload = {
      name, phone, email, propertyAddress,
      caseType: "contractor-tpl",
      trade: answers.trade,
      contractorName: answers.contractorName,
      contractorOnList: answers.contractorOnList,
      damageType: answers.damageType,
      damageDate: answers.damageDate,
      insuranceStatus: answers.insuranceStatus,
      damageValue: answers.damageValue,
      score,
      smsConsent: contactConsent,
      gclid: storedGclid || undefined,
    };

    try {
      await Promise.allSettled([
        fetch("/api/qualify-intake-partial", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(partialPayload),
        }),
        fetch("/api/qualify-intake-tpl", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fullPayload),
        }),
      ]);
    } catch (err) {
      console.error("[qualify-tpl] contact webhook error:", err && err.message);
    }

    setContactSubmitting(false);
    setTimeout(next, 200);
  };

  // Mount cal.com inline embed when user reaches booking step
  useEffect(() => {
    if (cur !== TOTAL_STEPS || bookingEmbedded) return;

    trackEvent("qualify_booking_shown", { case_type: "contractor-tpl" });
    if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyBookingShown", { case_type: "contractor-tpl" });
    if (typeof gtag !== "undefined") gtag("event", "qualify_booking_shown", { event_category: "Qualifier", case_type: "contractor-tpl" });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "qualify_booking_shown", case_type: "contractor-tpl" });

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
      if (a.trade) prefill.set("trade", a.trade);
      if (a.contractorName) prefill.set("contractor-name", a.contractorName);
      if (a.damageType) prefill.set("damage-type", a.damageType);
      if (a.damageValue) prefill.set("damage-value", a.damageValue);
      if (a.insuranceStatus) prefill.set("insurance-status", a.insuranceStatus);
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
      window.Cal.ns[CAL_NAMESPACE]("on", {
        action: "bookingSuccessful",
        callback: (e) => {
          completedRef.current = true;
          trackEvent("qualify_submitted", {
            case_type: "contractor-tpl",
            via: "cal_booking",
          });
          trackConversion("tpl_qualify", { case_type: "contractor-tpl", via: "cal_booking" });
        },
      });
    };
    mount();
    setBookingEmbedded(true);
  }, [cur, bookingEmbedded]);

  const restart = () => {
    setAnswers({});
    setResult(null);
    setCur(0);
    setContractorSearch("");
    setContractorPickerOpen(false);
    setContractorSelected("");
    setContractorManual(false);
    setContractorManualName("");
    setSearchResults([]);
    setDamageDate("");
  };

  // ── DISQUALIFIED SCREEN ──
  if (result && result.dq) {
    const msgs = {
      "out-of-state": "Louis Law Group handles contractor damage claims for Florida properties only.",
      "below-threshold": "We typically handle contractor damage claims with estimated repair costs over $5,000. For smaller claims, filing a complaint with Florida's Department of Business & Professional Regulation (DBPR) may be your best path.",
      "statute-expired": "Florida's statute of limitations for contractor damage is generally 4 years from discovery. Your claim may be time-barred.",
    };
    const titles = {
      "out-of-state": "Outside our practice area",
      "below-threshold": "Below our minimum claim value",
      "statute-expired": "Potential statute of limitations issue",
    };
    const subs = {
      "out-of-state": "We may be able to refer you to a qualified attorney in your state.",
      "below-threshold": "Call us — we can advise on your options at no cost.",
      "statute-expired": "Call (833) 657-4812 immediately — there may be tolling arguments or exceptions that preserve your claim.",
    };
    const urgencyNotes = {
      "out-of-state": null,
      "below-threshold": "DBPR complaint + a demand letter often resolves smaller contractor disputes. Call us for a free 5-minute consult.",
      "statute-expired": "Do not wait — even a day can matter. Call (833) 657-4812 now.",
    };
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
            <div><div className={styles.badge}>Louis Law Group · Claim Qualifier</div><h1>Contractor Damage Case Evaluation</h1></div>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.resultWrap}>
              <div className={`${styles.resultIcon} ${styles.iconRed}`}>✕</div>
              <div className={styles.dqBadge}>Disqualified</div>
              <div className={styles.resultTitle}>{titles[result.reason]}</div>
              <div className={styles.resultSub}>{msgs[result.reason]}</div>
              <div className={styles.resultSub} style={{ marginTop: "12px", fontWeight: 500 }}>
                {subs[result.reason]}
              </div>
              {urgencyNotes[result.reason] && (
                <div className={styles.urgencyNote}>{urgencyNotes[result.reason]}</div>
              )}
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

  // ── Damage date warnings ──
  const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
  const yearsAgo = damageDate ? (Date.now() - new Date(damageDate).getTime()) / msPerYear : 0;

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
            <h1>Contractor Damage Case Evaluation</h1>
          </div>
        </div>

        <div className={styles.cardBody}>
          {cur < TOTAL_STEPS && (
            <div className={styles.urgencyBanner}>
              ⚠ Florida contractors carry insurance for exactly this damage — but you must act before the 4-year statute expires. Protect your claim now.
            </div>
          )}

          {cur <= TOTAL_STEPS && (
            <div className={styles.trustBar}>
              <span>Free consultation</span>
              <span className={styles.trustDot} />
              <span>No fees unless we win</span>
              <span className={styles.trustDot} />
              <span>4-year statute deadline</span>
            </div>
          )}

          {/* Step 0: Trade */}
          {cur === 0 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 1 of 7</div>
              <div className={styles.question}>What type of contractor caused the damage?</div>
              <div className={styles.hint}>Select the trade that performed the work</div>
              <div className={styles.optsGrid}>
                {TRADE_LABELS.map((label, i) => (
                  <button
                    key={i}
                    className={`${styles.opt} ${answers.trade === label ? styles.selected : ""}`}
                    onClick={() => {
                      setAnswer("trade", TRADE_LABELS[i]);
                      trackEvent("qualify_step_answered", { case_type: "contractor-tpl", step: 0, step_name: "trade", answer: TRADE_LABELS[i] });
                      if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyStep1Complete", { trade: TRADE_LABELS[i] });
                      if (typeof gtag !== "undefined") gtag("event", "qualify_step_1", { event_category: "Qualifier", trade: TRADE_LABELS[i] });
                      window.dataLayer = window.dataLayer || [];
                      window.dataLayer.push({ event: "qualify_step_complete", step: 1, step_name: "trade", trade: TRADE_LABELS[i] });
                      setTimeout(next, 320);
                    }}
                  >
                    <span className={styles.optKey}>{String.fromCharCode(65 + i)}</span> {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Contractor name (search dropdown) */}
          {cur === 1 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 2 of 7</div>
              <div className={styles.question}>Which company performed the work?</div>
              <div className={styles.hint}>Search by name — powered by Florida DBPR license database</div>

              {!contractorSelected && !contractorManual && (
                <div className={styles.ddWrap}>
                  <input
                    type="text"
                    className={styles.ddSearch}
                    placeholder="Search contractor name…"
                    value={contractorSearch}
                    autoComplete="off"
                    onFocus={() => setContractorPickerOpen(true)}
                    onChange={(e) => {
                      const val = e.target.value;
                      setContractorSearch(val);
                      setContractorPickerOpen(true);
                      if (searchTimer.current) clearTimeout(searchTimer.current);
                      if (val.length >= 2) {
                        setSearchLoading(true);
                        searchTimer.current = setTimeout(async () => {
                          try {
                            const res = await fetch(`/api/contractor-search?q=${encodeURIComponent(val)}&trade=${encodeURIComponent(answers.trade || '')}`);
                            const data = await res.json();
                            setSearchResults(data.results || []);
                          } catch(e) { setSearchResults([]); }
                          setSearchLoading(false);
                        }, 300);
                      } else {
                        setSearchResults([]);
                        setSearchLoading(false);
                      }
                    }}
                  />
                  <div className={`${styles.ddList} ${contractorPickerOpen ? styles.open : ""}`}>
                    {searchLoading && (
                      <div className={styles.ddEmpty}>Searching DBPR database…</div>
                    )}
                    {!searchLoading && contractorSearch.length >= 2 && searchResults.length === 0 && (
                      <div className={styles.ddEmpty}>No licensed contractor found — enter name manually below</div>
                    )}
                    {!searchLoading && searchResults.map((c, i) => (
                      <div key={i} className={styles.ddItem} onClick={() => {
                        setContractorSelected(c.name);
                        setContractorSearch(c.name);
                        setContractorPickerOpen(false);
                        setSearchResults([]);
                      }}>
                        <span style={{fontWeight:500}}>{c.name}</span>
                        {c.city && <span style={{color:'#667085', fontSize:'12px', marginLeft:'8px'}}>{c.city}</span>}
                        {c.license_number && <span style={{color:'#98a2b3', fontSize:'11px', marginLeft:'6px'}}>#{c.license_number}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {contractorSelected && (
                <div className={`${styles.ddSelected} ${styles.show}`}>
                  <span>{contractorSelected}</span>
                  <button
                    className={styles.ddClear}
                    onClick={() => { setContractorSelected(""); setContractorSearch(""); setSearchResults([]); setContractorPickerOpen(false); }}
                  >×</button>
                </div>
              )}

              {!contractorSelected && !contractorManual && (
                <div style={{ marginTop: "12px" }}>
                  <button
                    className={styles.opt}
                    style={{ marginTop: "4px" }}
                    onClick={() => { setContractorManual(true); setContractorPickerOpen(false); }}
                  >
                    <span className={styles.optKey}>+</span> Other / Enter name manually
                  </button>
                </div>
              )}

              {contractorManual && !contractorSelected && (
                <div style={{ marginTop: "12px" }}>
                  <input
                    type="text"
                    className={styles.ddSearch}
                    placeholder="Enter contractor name…"
                    value={contractorManualName}
                    autoComplete="off"
                    onChange={(e) => setContractorManualName(e.target.value)}
                  />
                  <button
                    className={styles.restartBtn}
                    style={{ marginTop: "8px", display: "inline-block" }}
                    onClick={() => { setContractorManual(false); setContractorManualName(""); }}
                  >
                    ← Back to search
                  </button>
                </div>
              )}

              <button
                className={`${styles.btn} ${styles.btnGold}`}
                style={{ marginTop: "20px" }}
                disabled={!contractorSelected && !contractorManualName.trim()}
                onClick={() => {
                  const finalName = contractorSelected || contractorManualName.trim();
                  const onList = !!contractorSelected; // selected from DBPR live search = licensed
                  setAnswer("contractorName", finalName);
                  setAnswer("contractorOnList", onList);
                  trackEvent("qualify_step_answered", { case_type: "contractor-tpl", step: 1, step_name: "contractor_name", answer: finalName, on_list: onList });
                  if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyStep2Complete", { contractor: finalName });
                  if (typeof gtag !== "undefined") gtag("event", "qualify_step_2", { event_category: "Qualifier", contractor: finalName });
                  window.dataLayer = window.dataLayer || [];
                  window.dataLayer.push({ event: "qualify_step_complete", step: 2, step_name: "contractor_name", contractor: finalName });
                  next();
                }}
              >
                Continue →
              </button>
            </div>
          )}

          {/* Step 2: Damage type */}
          {cur === 2 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 3 of 7</div>
              <div className={styles.question}>What type of damage did the contractor cause?</div>
              <div className={styles.hint}>Select the primary type of damage</div>
              <div className={styles.opts}>
                {DAMAGE_TYPE_LABELS.map((label, i) => (
                  <button
                    key={i}
                    className={`${styles.opt} ${answers.damageType === label ? styles.selected : ""}`}
                    onClick={() => {
                      setAnswer("damageType", DAMAGE_TYPE_LABELS[i]);
                      trackEvent("qualify_step_answered", { case_type: "contractor-tpl", step: 2, step_name: "damage_type", answer: DAMAGE_TYPE_LABELS[i] });
                      if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyStep3Complete", { damage_type: DAMAGE_TYPE_LABELS[i] });
                      if (typeof gtag !== "undefined") gtag("event", "qualify_step_3", { event_category: "Qualifier", damage_type: DAMAGE_TYPE_LABELS[i] });
                      window.dataLayer = window.dataLayer || [];
                      window.dataLayer.push({ event: "qualify_step_complete", step: 3, step_name: "damage_type", damage_type: DAMAGE_TYPE_LABELS[i] });
                      setTimeout(next, 320);
                    }}
                  >
                    <span className={styles.optKey}>{String.fromCharCode(65 + i)}</span> {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Damage date */}
          {cur === 3 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 4 of 7</div>
              <div className={styles.question}>When did the damage occur?</div>
              <div className={styles.hint}>Approximate date is fine — enter your best estimate</div>
              <input
                type="date"
                className={styles.dateInput}
                value={damageDate}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDamageDate(e.target.value)}
              />
              {damageDate && yearsAgo > 4 && (
                <div className={`${styles.dateNote} ${styles.dateWarn}`} style={{ color: "#b42318" }}>
                  Florida&rsquo;s 4-year statute may have expired. Call us immediately — there may be exceptions.
                </div>
              )}
              {damageDate && yearsAgo > 3.5 && yearsAgo <= 4 && (
                <div className={`${styles.dateNote} ${styles.dateWarn}`}>
                  ⚠ Warning: Your claim may be approaching the 4-year statute of limitations. Act immediately.
                </div>
              )}
              <button
                className={`${styles.btn} ${styles.btnGold}`}
                disabled={!damageDate}
                onClick={() => {
                  if (yearsAgo > 4) {
                    showDQ("statute-expired");
                    return;
                  }
                  setAnswer("damageDate", damageDate);
                  trackEvent("qualify_step_answered", { case_type: "contractor-tpl", step: 3, step_name: "damage_date", years_ago: Math.round(yearsAgo * 10) / 10 });
                  if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyStep4Complete", {});
                  if (typeof gtag !== "undefined") gtag("event", "qualify_step_4", { event_category: "Qualifier" });
                  window.dataLayer = window.dataLayer || [];
                  window.dataLayer.push({ event: "qualify_step_complete", step: 4, step_name: "damage_date" });
                  next();
                }}
              >
                Continue →
              </button>
            </div>
          )}

          {/* Step 4: Contractor intent */}
          {cur === 4 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 5 of 7</div>
              <div className={styles.question}>What is your intent with the contractor?</div>
              <div className={styles.hint}>Select the option closest to your current situation</div>
              <div className={styles.opts}>
                {CONTRACTOR_INTENT_LABELS.map((label, i) => (
                  <button
                    key={i}
                    className={`${styles.opt} ${answers.insuranceStatus === label ? styles.selected : ""}`}
                    onClick={() => {
                      setAnswer("insuranceStatus", CONTRACTOR_INTENT_LABELS[i]);
                      trackEvent("qualify_step_answered", { case_type: "contractor-tpl", step: 4, step_name: "contractor_intent", answer: CONTRACTOR_INTENT_LABELS[i] });
                      if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyStep5Complete", { contractor_intent: CONTRACTOR_INTENT_LABELS[i] });
                      if (typeof gtag !== "undefined") gtag("event", "qualify_step_5", { event_category: "Qualifier", contractor_intent: CONTRACTOR_INTENT_LABELS[i] });
                      window.dataLayer = window.dataLayer || [];
                      window.dataLayer.push({ event: "qualify_step_complete", step: 5, step_name: "contractor_intent", contractor_intent: CONTRACTOR_INTENT_LABELS[i] });
                      setTimeout(next, 320);
                    }}
                  >
                    <span className={styles.optKey}>{String.fromCharCode(65 + i)}</span> {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Damage value */}
          {cur === 5 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 6 of 7</div>
              <div className={styles.question}>What is the estimated cost to repair the damage?</div>
              <div className={styles.hint}>A rough estimate is fine</div>
              <div className={styles.opts}>
                {DAMAGE_VALUE_LABELS.map((label, i) => (
                  <button
                    key={i}
                    className={`${styles.opt} ${answers.damageValue === label ? styles.selected : ""}`}
                    onClick={() => {
                      setAnswer("damageValue", DAMAGE_VALUE_LABELS[i]);
                      trackEvent("qualify_step_answered", { case_type: "contractor-tpl", step: 5, step_name: "damage_value", answer: DAMAGE_VALUE_LABELS[i] });
                      if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyStep6Complete", { damage_value: DAMAGE_VALUE_LABELS[i] });
                      if (typeof gtag !== "undefined") gtag("event", "qualify_step_6", { event_category: "Qualifier", damage_value: DAMAGE_VALUE_LABELS[i] });
                      window.dataLayer = window.dataLayer || [];
                      window.dataLayer.push({ event: "qualify_step_complete", step: 6, step_name: "damage_value", damage_value: DAMAGE_VALUE_LABELS[i] });
                      setTimeout(next, 320);
                    }}
                  >
                    <span className={styles.optKey}>{String.fromCharCode(65 + i)}</span> {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Florida check */}
          {cur === 6 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 7 of 7</div>
              <div className={styles.question}>Is the damaged property located in Florida?</div>
              <div className={styles.hint}>We exclusively handle Florida contractor damage claims</div>
              <div className={styles.opts}>
                <button
                  className={`${styles.opt} ${answers.florida === true ? styles.selected : ""}`}
                  onClick={() => {
                    setAnswer("florida", true);
                    trackEvent("qualify_step_answered", { case_type: "contractor-tpl", step: 6, step_name: "florida_check", answer: "yes" });
                    if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyStep7Complete", { in_florida: "yes" });
                    if (typeof gtag !== "undefined") gtag("event", "qualify_step_7", { event_category: "Qualifier", in_florida: "yes" });
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({ event: "qualify_step_complete", step: 7, step_name: "florida_check", in_florida: "yes" });
                    setTimeout(next, 320);
                  }}
                >
                  <span className={styles.optKey}>A</span> Yes — property is in Florida
                </button>
                <button
                  className={`${styles.opt} ${answers.florida === false ? styles.selected : ""}`}
                  onClick={() => {
                    setAnswer("florida", false);
                    trackEvent("qualify_step_answered", { case_type: "contractor-tpl", step: 6, step_name: "florida_check", answer: "no", disqualified: true });
                    setTimeout(() => showDQ("out-of-state"), 320);
                  }}
                >
                  <span className={styles.optKey}>B</span> No — property is outside Florida
                </button>
              </div>
            </div>
          )}

          {/* Step 7: Contact info */}
          {cur === 7 && (
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

          {/* Step 8: BOOKING (final step — cal.com inline embed) */}
          {cur === TOTAL_STEPS && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Final Step — Book Your Free Consultation</div>
              <div className={styles.question}>You qualify. Pick a time that works for you.</div>
              <div className={styles.hint}>
                Based on your answers, your contractor damage claim appears eligible. An attorney will review your specific situation.
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
          if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "phone_click", { event_category: "Conversion", event_label: "qualifier_page" });
          }
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: "phone_click", page: "/contractor-damage-claims/qualify" });
        }}>(833) 657-4812</a> for a free case review
      </div>
    </div>
  );
}
