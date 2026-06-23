"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import styles from "./page.module.css";
import { trackEvent, trackConversion } from "@/app/utils/analytics";
import useGclid, { getStoredGclid } from "@/app/utils/useGclid";
import { useDropoffBeacon, sendDropoff } from "@/app/utils/dropoffBeacon";

const CONTRACT_TYPE_LABELS = [
  "Business / Commercial Contract",
  "Employment Contract or Agreement",
  "Real Estate / Lease Agreement",
  "Construction / Services Contract",
  "Vendor / Supplier Agreement",
  "Other Written or Verbal Agreement",
];

const DISPUTE_NATURE_LABELS = [
  "The other party breached or didn't perform",
  "Non-payment — I'm owed money",
  "Defective work, goods, or services",
  "Anticipatory breach / repudiation (they said they won't perform)",
  "Wrongful termination of the contract",
  "Not sure / something else",
];

// Flow: contract type → dispute nature → florida (HARD GATE) → contact →
//       UPLOAD CONTRACT (HARD GATE — must upload before booking) → booking
const TOTAL_STEPS = 5;
const STEP_NAMES = [
  "contract_type",
  "dispute_nature",
  "florida_check",
  "contact_info",
  "upload_contract",
  "book_consultation",
];

// Cal.com embed config — contract-dispute event type, routed to Pierre's calendar
const CAL_ORIGIN = "https://bookings.louislawgroup.com";
const CAL_LINK = "pierre-louislawgroup.com/contract-dispute-consultation";
const CAL_NAMESPACE = "contract-dispute-consultation";

export default function ContractDisputeQualify() {
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [bookingEmbedded, setBookingEmbedded] = useState(false);
  const [contact, setContact] = useState({ name: "", email: "", phone: "", mailingAddress: "" });
  const [contactConsent, setContactConsent] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactError, setContactError] = useState("");

  // ── Upload gate state ──
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const fileInputRef = useRef(null);

  // Capture Google Ads click ID (gclid) for offline-conversion attribution.
  const gclid = useGclid();
  useEffect(() => {
    if (gclid) {
      trackEvent("gclid_captured", { gclid_short: gclid.slice(0, 12), case_type: "contract-dispute" });
    }
  }, [gclid]);

  useEffect(() => {
    trackEvent("qualify_page_view", { case_type: "contract-dispute" });
  }, []);

  useEffect(() => {
    if (cur <= TOTAL_STEPS) {
      trackEvent("qualify_step_viewed", {
        case_type: "contract-dispute",
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
          case_type: "contract-dispute",
          last_step: curRef.current,
          last_step_name: STEP_NAMES[curRef.current],
          answers_given: Object.keys(answersRef.current).length,
        });
      }
    };
    window.addEventListener("beforeunload", handleExit);
    return () => window.removeEventListener("beforeunload", handleExit);
  }, []);

  // ── Drop-off beacon ── notify Pierre the instant a client leaves un-booked.
  const contactRef = useRef(contact);
  const completedRef = useRef(false);
  useEffect(() => { contactRef.current = contact; }, [contact]);
  const buildQA = () => {
    const a = answersRef.current || {};
    const c = contactRef.current || {};
    const qa = [];
    if (a.contract_type_idx !== undefined) qa.push({ q: "Contract type", a: CONTRACT_TYPE_LABELS[a.contract_type_idx] });
    if (a.dispute_nature_idx !== undefined) qa.push({ q: "Dispute nature", a: DISPUTE_NATURE_LABELS[a.dispute_nature_idx] });
    if (a.florida !== undefined) qa.push({ q: "In Florida", a: a.florida ? "Yes" : "No" });
    if (a.contractUploaded) qa.push({ q: "Contract uploaded", a: "Yes" });
    const addr = a.mailingAddress || c.mailingAddress;
    if (addr) qa.push({ q: "Mailing address", a: addr });
    return qa;
  };
  useDropoffBeacon(() => {
    const a = answersRef.current || {};
    const c = contactRef.current || {};
    return {
      flow: "Contract Dispute",
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

  const handleContractType = (idx) => {
    setAnswer("contract_type_idx", idx);
    trackEvent("qualify_step_answered", {
      case_type: "contract-dispute", step: 0, step_name: "contract_type", answer: CONTRACT_TYPE_LABELS[idx],
    });
    if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyStep1Complete", { contract_type: CONTRACT_TYPE_LABELS[idx] });
    if (typeof gtag !== "undefined") gtag("event", "qualify_step_1", { event_category: "Qualifier", contract_type: CONTRACT_TYPE_LABELS[idx] });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "qualify_step_complete", step: 1, step_name: "contract_type", contract_type: CONTRACT_TYPE_LABELS[idx] });
    setTimeout(next, 320);
  };

  const handleDisputeNature = (idx) => {
    setAnswer("dispute_nature_idx", idx);
    trackEvent("qualify_step_answered", {
      case_type: "contract-dispute", step: 1, step_name: "dispute_nature", answer: DISPUTE_NATURE_LABELS[idx],
    });
    if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyStep2Complete", { dispute_nature: DISPUTE_NATURE_LABELS[idx] });
    if (typeof gtag !== "undefined") gtag("event", "qualify_step_2", { event_category: "Qualifier", dispute_nature: DISPUTE_NATURE_LABELS[idx] });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "qualify_step_complete", step: 2, step_name: "dispute_nature", dispute_nature: DISPUTE_NATURE_LABELS[idx] });
    setTimeout(next, 320);
  };

  const showDQ = (reason) => {
    trackEvent("qualify_disqualified", { case_type: "contract-dispute", reason });
    if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyDQ", { reason });
    if (typeof gtag !== "undefined") gtag("event", "qualify_dq", { event_category: "Qualifier", reason });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "qualify_dq", reason });
    setResult({ dq: true, reason });
    setCur(TOTAL_STEPS + 1);
    const a = answersRef.current || {};
    const c = contactRef.current || {};
    sendDropoff({
      flow: "Contract Dispute",
      status: "disqualified",
      engaged: true,
      completed: false,
      step: curRef.current,
      stepName: "florida_check",
      dqReason: reason,
      name: (c.name || a.name || "").trim(),
      email: (c.email || a.email || "").trim(),
      phone: (c.phone || a.phone || "").trim(),
      answers: buildQA(),
      gclid: getStoredGclid() || "",
    });
  };

  const handleFlorida = (isFL) => {
    setAnswer("florida", isFL);
    trackEvent("qualify_step_answered", {
      case_type: "contract-dispute", step: 2, step_name: "florida_check",
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
    const mailingAddress = contact.mailingAddress.trim();

    if (!name || name.length < 2) { setContactError("Please enter your full name."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setContactError("Please enter a valid email address."); return; }
    if (phone.replace(/\D/g, "").length < 10) { setContactError("Please enter a valid phone number."); return; }

    const typeIdx = answers.contract_type_idx;
    const contractType = (typeIdx !== undefined ? CONTRACT_TYPE_LABELS[typeIdx] : "") || "";
    const dnIdx = answers.dispute_nature_idx;
    const disputeNature = (dnIdx !== undefined ? DISPUTE_NATURE_LABELS[dnIdx] : "") || "";

    setContactSubmitting(true);

    // Persist contact so the upload + booking embed can read them
    setAnswers((a) => ({ ...a, name, email, phone, mailingAddress }));

    trackEvent("qualify_step_answered", {
      case_type: "contract-dispute", step: 3, step_name: "contact_info",
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
          contract_type: contractType,
          dispute_nature: disputeNature,
          gclid: storedGclid || "",
          case_type: "contract-dispute",
          sms_consent: contactConsent ? "yes" : "no",
        });
      }
      if (typeof window !== "undefined" && typeof window.__or_event === "function") {
        window.__or_event("qualify_contact_submitted", {
          email,
          contract_type: contractType,
          gclid: storedGclid || "",
        });
      }
    } catch (e) { /* OpenReplay tracker not ready yet — silent */ }

    const partialPayload = {
      name, phone, email, propertyAddress: mailingAddress,
      caseType: "contract-dispute",
      contractType,
      disputeNature,
      gclid: storedGclid || undefined,
    };

    const fullPayload = {
      name, phone, email, propertyAddress: mailingAddress,
      caseType: "contract-dispute",
      contractType,
      disputeNature,
      // Passed the Florida gate → strong candidate; contract upload confirms next.
      score: 75,
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
      console.error("[contract-dispute-qualify] contact webhook error:", err && err.message);
    }

    setContactSubmitting(false);
    setTimeout(next, 200);
  };

  // ── UPLOAD CONTRACT — HARD GATE before booking ──
  const MAX_FILE_MB = 25;
  const handleFilePick = (e) => {
    setUploadError("");
    const picked = Array.from(e.target.files || []);
    const tooBig = picked.find((f) => f.size > MAX_FILE_MB * 1024 * 1024);
    if (tooBig) {
      setUploadError(`"${tooBig.name}" is larger than ${MAX_FILE_MB}MB. Please upload a smaller file.`);
      return;
    }
    setUploadFiles(picked);
  };

  const handleUploadSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setUploadError("");
    if (!uploadFiles.length) {
      setUploadError("Please attach your contract or agreement to continue to scheduling.");
      return;
    }
    setUploading(true);

    const a = answersRef.current || {};
    const c = contactRef.current || {};
    const name = (c.name || a.name || "").trim();
    const email = (c.email || a.email || "").trim();
    const phone = (c.phone || a.phone || "").trim();

    const fd = new FormData();
    fd.append("name", name);
    fd.append("email", email);
    fd.append("phone", phone);
    fd.append("articleType", "contract-dispute");
    uploadFiles.forEach((f) => fd.append("files", f, f.name));

    try {
      const res = await fetch("/api/upload-documents", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("[contract-dispute-qualify] upload error:", err && err.message);
      setUploading(false);
      setUploadError("We couldn't upload your file just now. Please try again, or call (833) 657-4812.");
      return;
    }

    setUploading(false);
    setUploadDone(true);
    setAnswers((prev) => ({ ...prev, contractUploaded: true, contractFileCount: uploadFiles.length }));

    trackEvent("qualify_step_answered", {
      case_type: "contract-dispute", step: 4, step_name: "upload_contract", files: uploadFiles.length,
    });
    if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyContractUploaded", { files: uploadFiles.length });
    if (typeof gtag !== "undefined") gtag("event", "qualify_contract_uploaded", { event_category: "Qualifier", files: uploadFiles.length });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "qualify_step_complete", step: 5, step_name: "upload_contract", files: uploadFiles.length });

    setTimeout(next, 250); // advance to the booking embed
  };

  // Mount cal.com inline embed when user reaches booking step (only reachable
  // AFTER the contract upload hard gate).
  useEffect(() => {
    if (cur !== TOTAL_STEPS || bookingEmbedded) return;

    const a0 = answersRef.current;
    const typeIdx = a0.contract_type_idx;
    const contractType = (typeIdx !== undefined ? CONTRACT_TYPE_LABELS[typeIdx] : "") || "";
    const dnIdx = a0.dispute_nature_idx;
    const disputeNature = (dnIdx !== undefined ? DISPUTE_NATURE_LABELS[dnIdx] : "") || "";

    trackEvent("qualify_booking_shown", { case_type: "contract-dispute", contract_type: contractType });
    if (typeof fbq !== "undefined") fbq("trackCustom", "QualifyBookingShown", { contract_type: contractType });
    if (typeof gtag !== "undefined") gtag("event", "qualify_booking_shown", { event_category: "Qualifier", contract_type: contractType });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "qualify_booking_shown", contract_type: contractType });

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
      if (contractType) prefill.set("contract-type", contractType);
      if (disputeNature) prefill.set("dispute-nature", disputeNature);
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
          trackEvent("qualify_submitted", { case_type: "contract-dispute", via: "cal_booking" });
          trackConversion("contract_dispute_qualify", { case_type: "contract-dispute", via: "cal_booking" });
          // NOTE: add a dedicated Google Ads conversion send_to here once the
          // Contract Dispute conversion action is created in the Ads account.
        },
      });
    };
    mount();
    setBookingEmbedded(true);
  }, [cur, bookingEmbedded]);

  const restart = () => {
    setAnswers({}); setResult(null); setCur(0);
    setUploadFiles([]); setUploadDone(false); setUploadError("");
  };

  // ── DISQUALIFIED SCREEN ──
  if (result && result.dq) {
    const msgs = {
      "out-of-state": "Louis Law Group handles contract disputes for Florida residents and Florida-governed agreements. We're unable to represent out-of-state matters, but we may be able to refer you to an attorney in your state.",
    };
    const titles = {
      "out-of-state": "Outside our practice area",
    };
    return (
      <div className={styles.wrapper}>
        <Script id="vtag-ai-js" strategy="afterInteractive" src="https://r2.leadsy.ai/tag.js" data-pid="1zt0dyt08LfDX6JhM" data-version="062024" />
        <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: "100%" }} /></div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div><div className={styles.badge}>Louis Law Group · Contract Dispute Qualifier</div><h1>Case Evaluation</h1></div>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.resultWrap}>
              <div className={`${styles.resultIcon} ${styles.iconRed}`}>✕</div>
              <div className={styles.dqBadge}>We can&apos;t represent you for this matter</div>
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

  // ── QUALIFIER STEPS + UPLOAD GATE + BOOKING UI ──
  return (
    <div className={styles.wrapper}>
      <Script id="vtag-ai-js" strategy="afterInteractive" src="https://r2.leadsy.ai/tag.js" data-pid="1zt0dyt08LfDX6JhM" data-version="062024" />
      <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${progress}%` }} /></div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.badge}>Louis Law Group · Contract Dispute Qualifier</div>
            <h1>Breach of Contract Case Evaluation</h1>
          </div>
        </div>

        <div className={styles.cardBody}>
          {cur < TOTAL_STEPS && (
            <div className={styles.urgencyBanner}>
              ⚠ Florida limits how long you have to sue on a contract (5 years written, 4 years oral). Complete this short form to protect your claim.
            </div>
          )}

          {cur <= TOTAL_STEPS && (
            <div className={styles.trustBar}>
              <span>Free consultation</span>
              <span className={styles.trustDot} />
              <span>No fees unless we win</span>
              <span className={styles.trustDot} />
              <span>Florida contract disputes</span>
            </div>
          )}

          {/* Step 0: Contract type */}
          {cur === 0 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 1 of 3</div>
              <div className={styles.question}>What kind of contract or agreement is your dispute about?</div>
              <div className={styles.hint}>Select the option that best fits</div>
              <div className={styles.optsGrid}>
                {CONTRACT_TYPE_LABELS.map((label, i) => (
                  <button key={i} className={`${styles.opt} ${answers.contract_type_idx === i ? styles.selected : ""}`}
                    onClick={() => handleContractType(i)}>
                    <span className={styles.optKey}>{String.fromCharCode(65 + i)}</span> {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Dispute nature */}
          {cur === 1 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 2 of 3</div>
              <div className={styles.question}>What went wrong with the agreement?</div>
              <div className={styles.hint}>Tell us what the other party did</div>
              <div className={styles.opts}>
                {DISPUTE_NATURE_LABELS.map((label, i) => (
                  <button key={i} className={`${styles.opt} ${answers.dispute_nature_idx === i ? styles.selected : ""}`}
                    onClick={() => handleDisputeNature(i)}>
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
              <div className={styles.question}>Are you a Florida resident, or is your contract governed by Florida law?</div>
              <div className={styles.hint}>We handle Florida contract disputes</div>
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

          {/* Step 3: Contact info (captures lead before upload + booking) */}
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
                  value={contact.mailingAddress}
                  onChange={(e) => setContact((c) => ({ ...c, mailingAddress: e.target.value }))}
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
                  {contactSubmitting ? "Saving…" : "Continue →"}
                </button>
                <div style={{ fontSize: "12px", color: "#667085", textAlign: "center", marginTop: "4px" }}>
                  🔒 Confidential — protected by attorney-client privilege.
                </div>
              </form>
            </div>
          )}

          {/* Step 4: UPLOAD CONTRACT — HARD GATE before booking */}
          {cur === 4 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Required — Upload Your Contract</div>
              <div className={styles.question}>Upload the contract or agreement in dispute.</div>
              <div className={styles.hint}>
                Our attorneys review the actual agreement before your consultation, so we can give you
                real answers on the call. You&rsquo;ll be able to pick a time as soon as it&rsquo;s uploaded.
              </div>

              <form onSubmit={handleUploadSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
                <label
                  htmlFor="contract-file-input"
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    gap: "8px", padding: "28px 16px", textAlign: "center", cursor: "pointer",
                    border: "2px dashed #c3cad9", borderRadius: "12px",
                    background: uploadFiles.length ? "#f0fdf4" : "#f8fafc",
                    borderColor: uploadFiles.length ? "#6cc18e" : "#c3cad9",
                  }}
                >
                  <span style={{ fontSize: "26px" }}>{uploadFiles.length ? "✓" : "📄"}</span>
                  <span style={{ fontSize: "15px", fontWeight: 600, color: "#1a2b49" }}>
                    {uploadFiles.length
                      ? `${uploadFiles.length} file${uploadFiles.length > 1 ? "s" : ""} ready`
                      : "Tap to attach your contract"}
                  </span>
                  <span style={{ fontSize: "12px", color: "#667085" }}>
                    PDF, Word, or photos (JPG/PNG) · up to {MAX_FILE_MB}MB each
                  </span>
                </label>
                <input
                  id="contract-file-input"
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.heic,.txt,image/*,application/pdf"
                  onChange={handleFilePick}
                  style={{ display: "none" }}
                />

                {uploadFiles.length > 0 && (
                  <ul style={{ margin: 0, padding: "0 0 0 4px", listStyle: "none", display: "flex", flexDirection: "column", gap: "4px" }}>
                    {uploadFiles.map((f, i) => (
                      <li key={i} style={{ fontSize: "13px", color: "#344054", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>📎</span>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {uploadError && (
                  <div style={{ color: "#b42318", fontSize: "13px", padding: "8px 12px", background: "#fef3f2", borderRadius: "6px", border: "1px solid #fecdca" }}>
                    {uploadError}
                  </div>
                )}

                <button type="submit" disabled={uploading || !uploadFiles.length}
                  style={{
                    padding: "14px 20px", fontSize: "16px", fontWeight: 600, color: "#1a2b49",
                    background: uploading ? "#e8c97a" : (uploadFiles.length ? "#ffb800" : "#e9edf3"),
                    border: "none", borderRadius: "8px",
                    cursor: uploading ? "wait" : (uploadFiles.length ? "pointer" : "not-allowed"),
                    marginTop: "4px", transition: "background 0.2s",
                  }}>
                  {uploading ? "Uploading…" : "Upload & continue to scheduling →"}
                </button>

                <div style={{ fontSize: "12px", color: "#667085", textAlign: "center", marginTop: "2px" }}>
                  🔒 Your documents are confidential and protected by attorney-client privilege.
                </div>
                <div style={{ fontSize: "12px", color: "#98a2b3", textAlign: "center" }}>
                  Don&rsquo;t have a digital copy handy? Call <a href="tel:+18336574812" style={{ color: "#1a2b49", fontWeight: 600 }}>(833) 657-4812</a> and we&rsquo;ll help.
                </div>
              </form>
            </div>
          )}

          {/* Step 5: BOOKING (final step — cal.com inline embed, gated behind upload) */}
          {cur === TOTAL_STEPS && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Final Step — Book Your Free Consultation</div>
              <div className={styles.question}>Contract received. Pick a time that works for you.</div>
              <div className={styles.hint}>
                {uploadDone ? "Thanks — your contract is on file. " : ""}
                Based on your answers, your dispute appears eligible for a free attorney review.
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
            window.gtag('event', 'phone_click', { event_category: 'Conversion', event_label: 'contract_dispute_qualifier_page' });
          }
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: 'phone_click', page: '/contract-disputes/qualify' });
        }}>(833) 657-4812</a> for a free case review
      </div>
    </div>
  );
}
