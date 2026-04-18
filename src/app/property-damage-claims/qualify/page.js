"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { trackEvent, trackConversion } from "@/app/utils/analytics";

const DAMAGE_LABELS = [
  "Hurricane / Wind",
  "Water / Flood",
  "Roof Damage",
  "Fire / Smoke",
  "Plumbing Leak",
  "Mold",
  "Other",
];

// Shortened flow: damage → owner → florida → booking
const TOTAL_STEPS = 3;
const STEP_NAMES = ["damage_type", "owner_check", "florida_check", "book_consultation"];

// Cal.com embed config
const CAL_ORIGIN = "https://bookings.louislawgroup.com";
const CAL_LINK = "pierre-louislawgroup.com/property-insurance-claim-consultation";
const CAL_NAMESPACE = "llg-fpp-booker";

export default function PropertyDamageQualify() {
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [bookingEmbedded, setBookingEmbedded] = useState(false);
  const today = new Date();

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
    setTimeout(next, 320);
  };

  const showDQ = (reason) => {
    trackEvent("qualify_disqualified", { case_type: "property-damage", reason });
    setResult({ dq: true, reason });
    setCur(TOTAL_STEPS + 1);
  };

  const handleOwner = (isOwner) => {
    setAnswer("owner", isOwner);
    trackEvent("qualify_step_answered", {
      case_type: "property-damage", step: 1, step_name: "owner_check",
      answer: isOwner ? "yes" : "no", disqualified: !isOwner,
    });
    if (!isOwner) { setTimeout(() => showDQ("not-owner"), 320); return; }
    setTimeout(next, 320);
  };

  const handleFlorida = (isFL) => {
    setAnswer("florida", isFL);
    trackEvent("qualify_step_answered", {
      case_type: "property-damage", step: 2, step_name: "florida_check",
      answer: isFL ? "yes" : "no", disqualified: !isFL,
    });
    if (!isFL) { setTimeout(() => showDQ("out-of-state"), 320); return; }
    setTimeout(next, 320);
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
      window.Cal.ns[CAL_NAMESPACE]("inline", {
        elementOrSelector: "#llg-cal-inline",
        calLink: CAL_LINK,
        config: {
          theme: "light",
          layout: "month_view",
          // Prefills — cal.com uses field slugs as keys
          "damage-type": damageLabel,
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

          {cur === 0 && (
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

          {/* Step 3: BOOKING (final step — cal.com inline embed) */}
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
        Prefer to talk? Call <a href="tel:8336574812">(833) 657-4812</a> for a free case review
      </div>
    </div>
  );
}
