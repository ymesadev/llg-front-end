"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { trackEvent, trackConversion } from "@/app/utils/analytics";

const INJURY_TYPES = [
  "Auto / Car Accident",
  "Slip, Trip & Fall",
  "Premises Liability",
  "Wrongful Death",
  "Dog Bite / Animal Attack",
  "Product Liability",
  "Other Injury",
];

const TREATMENT_LABELS = [
  "Yes — went to ER / urgent care",
  "Yes — saw a doctor within 14 days",
  "Yes — currently treating",
  "No — haven't seen a doctor yet",
  "No — injury didn't require treatment",
];

const FAULT_LABELS = [
  "Not my fault at all",
  "Mostly the other party's fault",
  "Shared fault — but mostly theirs",
  "I may have been partially at fault",
  "Not sure",
];

const INSURANCE_LABELS = [
  "Other party's insurance offered a settlement",
  "My insurance (PIP/UM) is involved",
  "No insurance contact yet",
  "Insurance denied or is disputing the claim",
  "Not sure / no insurance involved",
];

const TOTAL_STEPS = 7;
const STEP_NAMES = [
  "injury_type",
  "florida_check",
  "date_of_injury",
  "medical_treatment",
  "fault_assessment",
  "insurance_status",
  "injury_severity",
  "contact_info",
];

export default function PersonalInjuryQualify() {
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState({});
  const [dateVal, setDateVal] = useState("");
  const [dateNote, setDateNote] = useState({ msg: "", warn: false });
  const [contact, setContact] = useState({ name: "", phone: "", email: "", injuryDescription: "" });
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  useEffect(() => {
    trackEvent("qualify_page_view", { case_type: "personal-injury" });
  }, []);

  useEffect(() => {
    if (cur <= TOTAL_STEPS) {
      trackEvent("qualify_step_viewed", {
        case_type: "personal-injury",
        step: cur,
        step_name: STEP_NAMES[cur],
      });
    }
  }, [cur]);

  const curRef = useRef(cur);
  const submittedRef = useRef(submitted);
  const answersRef = useRef(answers);
  useEffect(() => { curRef.current = cur; }, [cur]);
  useEffect(() => { submittedRef.current = submitted; }, [submitted]);
  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => {
    const handleExit = () => {
      if (!submittedRef.current && curRef.current <= TOTAL_STEPS) {
        trackEvent("qualify_abandoned", {
          case_type: "personal-injury",
          last_step: curRef.current,
          last_step_name: STEP_NAMES[curRef.current],
          answers_given: Object.keys(answersRef.current).length,
        });
      }
    };
    window.addEventListener("beforeunload", handleExit);
    return () => window.removeEventListener("beforeunload", handleExit);
  }, []);

  const progress = Math.min((cur / TOTAL_STEPS) * 100, 100);
  const setAnswer = (key, val) => setAnswers((a) => ({ ...a, [key]: val }));
  const next = () => setCur((c) => c + 1);
  const back = () => setCur((c) => Math.max(0, c - 1));

  const handlePickAndNext = (key, val, delay = 320) => {
    setAnswer(key, val);
    const labelMap = {
      injury_type: INJURY_TYPES[val],
      medical_treatment: TREATMENT_LABELS[val],
      fault_assessment: FAULT_LABELS[val],
      insurance_status: INSURANCE_LABELS[val],
    };
    const label = labelMap[STEP_NAMES[cur]] || String(val);
    trackEvent("qualify_step_answered", {
      case_type: "personal-injury",
      step: cur,
      step_name: STEP_NAMES[cur],
      answer: label,
    });
    setTimeout(next, delay);
  };

  const handleFlorida = (isFL) => {
    setAnswer("florida", isFL);
    trackEvent("qualify_step_answered", {
      case_type: "personal-injury",
      step: cur,
      step_name: "florida_check",
      answer: isFL ? "yes" : "no",
      disqualified: !isFL,
    });
    if (!isFL) {
      setTimeout(() => showDQ("out-of-state"), 320);
      return;
    }
    setTimeout(next, 320);
  };

  const handleDate = (val) => {
    setDateVal(val);
    if (!val) { setDateNote({ msg: "", warn: false }); return; }
    const loss = new Date(val);
    const diffDays = Math.floor((today - loss) / 86400000);
    const yrs = diffDays / 365;
    if (diffDays < 0) {
      setDateNote({ msg: "Date appears to be in the future — please double-check.", warn: true });
      return;
    }
    setAnswer("date_of_injury", val);
    const bucket = yrs > 3 ? "over_3y" : yrs > 2 ? "2_to_3y" : yrs > 1 ? "1_to_2y" : "under_1y";
    trackEvent("qualify_step_answered", {
      case_type: "personal-injury",
      step: 2,
      step_name: "date_of_injury",
      answer: bucket,
      years_ago: Math.round(yrs * 10) / 10,
    });
    if (yrs > 3) setDateNote({ msg: "Warning: Over 3 years ago. Florida's 2-year statute of limitations has likely expired.", warn: true });
    else if (yrs > 2) setDateNote({ msg: "Warning: Over 2 years ago. The statute of limitations may have already passed.", warn: true });
    else if (yrs > 1.5) setDateNote({ msg: "Note: Approaching the 2-year deadline. Act quickly to protect your claim.", warn: true });
    else setDateNote({ msg: "Date recorded: " + loss.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), warn: false });
  };

  const SEVERITY_LABELS = [
    "Minor — bruises, sprains, minor cuts",
    "Moderate — fractures, stitches, concussion",
    "Serious — surgery, hospitalization, ongoing treatment",
    "Severe / Catastrophic — permanent injury, disability",
    "Fatal — wrongful death claim",
  ];

  const calcScore = () => {
    let s = 15;
    if (answers.date_of_injury) {
      const yrs = (today - new Date(answers.date_of_injury)) / (365 * 86400000);
      if (yrs <= 0.5) s += 15;
      else if (yrs <= 1) s += 12;
      else if (yrs <= 1.5) s += 8;
      else if (yrs <= 2) s += 4;
    }
    const treatMap = [20, 18, 20, 5, 2];
    s += treatMap[answers.medical_treatment] !== undefined ? treatMap[answers.medical_treatment] : 0;
    const faultMap = [20, 16, 10, 4, 8];
    s += faultMap[answers.fault_assessment] !== undefined ? faultMap[answers.fault_assessment] : 0;
    const sevMap = [5, 12, 18, 22, 20];
    s += sevMap[answers.injury_severity] !== undefined ? sevMap[answers.injury_severity] : 0;
    const insMap = [8, 6, 4, 10, 2];
    s += insMap[answers.insurance_status] !== undefined ? insMap[answers.insurance_status] : 0;
    return Math.min(Math.max(s, 0), 100);
  };

  const showDQ = (reason) => {
    trackEvent("qualify_disqualified", { case_type: "personal-injury", reason });
    setResult({ dq: true, reason });
    setCur(TOTAL_STEPS + 1);
  };

  const handleSubmit = async () => {
    if (!contact.name || !contact.phone || !contact.email.includes("@")) return;
    setSubmitting(true);
    const score = calcScore();
    try {
      await fetch("/api/qualify-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contact.name,
          phone: contact.phone,
          email: contact.email,
          injuryDescription: contact.injuryDescription,
          injuryType: answers.injury_type !== undefined ? INJURY_TYPES[answers.injury_type] : "",
          dateOfInjury: answers.date_of_injury || dateVal,
          medicalTreatment: answers.medical_treatment !== undefined ? TREATMENT_LABELS[answers.medical_treatment] : "",
          faultAssessment: answers.fault_assessment !== undefined ? FAULT_LABELS[answers.fault_assessment] : "",
          injurySeverity: answers.injury_severity !== undefined ? SEVERITY_LABELS[answers.injury_severity] : "",
          insuranceStatus: answers.insurance_status !== undefined ? INSURANCE_LABELS[answers.insurance_status] : "",
          score,
          caseType: "personal-injury",
        }),
      });
    } catch (e) {/* silent — still show result */}
    trackEvent("qualify_submitted", { case_type: "personal-injury", score });
    trackConversion("pi_qualify", { case_type: "personal-injury", score });
    if (window.__or_identify) {
      window.__or_identify(contact.email, {
        name: contact.name,
        phone: contact.phone,
        case_type: "personal-injury",
        score,
      });
    }
    setResult({ dq: false, score });
    setCur(TOTAL_STEPS + 1);
    setSubmitted(true);
    setSubmitting(false);
  };

  const restart = () => {
    setAnswers({});
    setDateVal("");
    setDateNote({ msg: "", warn: false });
    setContact({ name: "", phone: "", email: "", injuryDescription: "" });
    setResult(null);
    setSubmitted(false);
    setCur(0);
  };

  const contactComplete = contact.name.trim() && contact.phone.trim() && contact.email.includes("@");
  const contactStartedRef = useRef(false);
  const trackContactStart = () => {
    if (!contactStartedRef.current) {
      contactStartedRef.current = true;
      trackEvent("qualify_step_answered", {
        case_type: "personal-injury",
        step: 7,
        step_name: "contact_info",
        answer: "started_typing",
      });
    }
  };

  // Result screen
  if (result) {
    if (result.dq) {
      const msgs = {
        "out-of-state":
          "Louis Law Group exclusively handles personal injury claims for incidents that occurred in Florida. We are unable to represent out-of-state claims at this time.",
      };
      const titles = { "out-of-state": "Outside our practice area" };
      return (
        <div className={styles.wrapper}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: "100%" }} />
          </div>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.badge}>Louis Law Group &middot; Injury Qualifier</div>
                <h1>Case Evaluation</h1>
              </div>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.resultWrap}>
                <div className={`${styles.resultIcon} ${styles.iconRed}`}>&times;</div>
                <div className={styles.dqBadge}>Disqualified</div>
                <div className={styles.resultTitle}>{titles[result.reason]}</div>
                <div className={styles.resultSub}>{msgs[result.reason]}</div>
                <button className={styles.restartBtn} onClick={restart}>
                  &larr; Start over
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const { score } = result;
    const isStrong = score >= 65;
    const isPossible = score >= 40;
    const iconClass = isStrong ? styles.iconGreen : isPossible ? styles.iconYellow : styles.iconRed;
    const iconChar = isStrong ? "\u2713" : isPossible ? "~" : "!";
    const title = isStrong
      ? "Strong candidate for representation"
      : isPossible
      ? "Potentially qualifying case"
      : "May not qualify at this time";
    const sub = isStrong
      ? "We have received your submission and will review it as soon as possible. To avoid any delay in your case review, sign your retainer now \u2014 the sooner you do, the faster we can get started fighting for your compensation."
      : isPossible
      ? "We have received your submission and will review it as soon as possible. To avoid any delay in your case review, sign your retainer now so our team can begin investigating your claim immediately."
      : "We have received your submission. To avoid any delay, sign your retainer now and a case specialist will review your file and reach out to discuss your options.";
    const barColor = isStrong ? "#4caf50" : isPossible ? "#ffb800" : "#e57373";

    const tags = [];
    if (answers.injury_type !== undefined) tags.push({ label: INJURY_TYPES[answers.injury_type], cls: styles.tagGreen });
    if (answers.fault_assessment === 0) tags.push({ label: "Clear liability", cls: styles.tagGreen });
    if (answers.fault_assessment === 1) tags.push({ label: "Strong liability case", cls: styles.tagGreen });
    if (answers.fault_assessment === 3) tags.push({ label: "Comparative negligence risk", cls: styles.tagYellow });
    if (answers.medical_treatment === 0 || answers.medical_treatment === 2) tags.push({ label: "Documented treatment", cls: styles.tagGreen });
    if (answers.medical_treatment === 3) tags.push({ label: "No treatment yet \u2014 see a doctor", cls: styles.tagYellow });
    if (answers.injury_severity >= 2) tags.push({ label: "Significant injuries", cls: styles.tagGreen });
    if (answers.date_of_injury) {
      const yrs = (today - new Date(answers.date_of_injury)) / (365 * 86400000);
      tags.push(yrs > 2 ? { label: "Limitations risk", cls: styles.tagRed } : { label: "Within limitations", cls: styles.tagGreen });
    }

    return (
      <div className={styles.wrapper}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: "100%" }} />
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <div className={styles.badge}>Louis Law Group &middot; Injury Qualifier</div>
              <h1>Case Evaluation</h1>
            </div>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.resultWrap}>
              <div className={`${styles.resultIcon} ${iconClass}`}>{iconChar}</div>
              <div className={styles.resultTitle}>{title}</div>
              <div className={styles.scoreLabel}>Qualification score: {score} / 100</div>
              <div className={styles.scoreBar}>
                <div className={styles.scoreBarFill} style={{ width: score + "%", background: barColor }} />
              </div>
              <div className={styles.resultSub}>{sub}</div>
              {tags.length > 0 && (
                <div className={styles.tagRow}>
                  {tags.map((t, i) => (
                    <span key={i} className={`${styles.tag} ${t.cls}`}>{t.label}</span>
                  ))}
                </div>
              )}
              <a
                href="https://app.louislawgroup.com/personal-injury-retainer"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.btn} ${styles.btnGold}`}
                style={{ display: "block", textAlign: "center", textDecoration: "none" }}
              >
                Open Retainer &mdash; Secure Your Case Now &rarr;
              </a>
              <div className={styles.urgencyNote}>
                &#9889; Act now &mdash; Florida&apos;s 2-year statute of limitations means delays can destroy your case.
              </div>
              <button className={styles.restartBtn} onClick={restart}>Start over</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: progress + "%" }} />
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.badge}>Louis Law Group &middot; Injury Qualifier</div>
            <h1>Personal Injury Case Evaluation</h1>
          </div>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.urgencyBanner}>&#9888; Florida&apos;s statute of limitations may apply. Act now to protect your claim by completing this form.</div>

          {cur === 0 && (
            <div className={styles.trustBar}>
              <span>Free consultation</span>
              <span className={styles.trustDot} />
              <span>No fees unless we win</span>
              <span className={styles.trustDot} />
              <span>2-year deadline applies</span>
            </div>
          )}

          {/* Step 0: Type of injury */}
          {cur === 0 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 1 of 8</div>
              <div className={styles.question}>What type of injury did you suffer?</div>
              <div className={styles.hint}>Select the category that best describes your situation</div>
              <div className={styles.optsGrid}>
                {INJURY_TYPES.map((label, i) => (
                  <button
                    key={i}
                    className={`${styles.opt} ${answers.injury_type === i ? styles.selected : ""}`}
                    onClick={() => handlePickAndNext("injury_type", i)}
                  >
                    <span className={styles.optKey}>{String.fromCharCode(65 + i)}</span> {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Florida check */}
          {cur === 1 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 2 of 8</div>
              <div className={styles.question}>Did the injury occur in Florida?</div>
              <div className={styles.hint}>We exclusively handle Florida personal injury claims</div>
              <div className={styles.opts}>
                <button
                  className={`${styles.opt} ${answers.florida === true ? styles.selected : ""}`}
                  onClick={() => handleFlorida(true)}
                >
                  <span className={styles.optKey}>A</span> Yes &mdash; the injury happened in Florida
                </button>
                <button
                  className={`${styles.opt} ${answers.florida === false ? styles.selected : ""}`}
                  onClick={() => handleFlorida(false)}
                >
                  <span className={styles.optKey}>B</span> No &mdash; the injury happened outside Florida
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Date of injury */}
          {cur === 2 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 3 of 8</div>
              <div className={styles.question}>When did the injury occur?</div>
              <div className={styles.hint}>Select the exact or approximate date</div>
              <input
                type="date"
                className={styles.dateInput}
                value={dateVal}
                max={todayStr}
                onChange={(e) => handleDate(e.target.value)}
              />
              {dateNote.msg && (
                <div className={`${styles.dateNote} ${dateNote.warn ? styles.dateWarn : ""}`}>
                  {dateNote.msg}
                </div>
              )}
              <button className={styles.btn} onClick={next} disabled={!dateVal || new Date(dateVal) > today}>
                Continue &rarr;
              </button>
            </div>
          )}

          {/* Step 3: Medical treatment */}
          {cur === 3 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 4 of 8</div>
              <div className={styles.question}>Have you received medical treatment for your injury?</div>
              <div className={styles.hint}>Medical documentation strengthens your claim significantly</div>
              <div className={styles.opts}>
                {TREATMENT_LABELS.map((label, i) => (
                  <button
                    key={i}
                    className={`${styles.opt} ${answers.medical_treatment === i ? styles.selected : ""}`}
                    onClick={() => handlePickAndNext("medical_treatment", i)}
                  >
                    <span className={styles.optKey}>{String.fromCharCode(65 + i)}</span> {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Fault assessment */}
          {cur === 4 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 5 of 8</div>
              <div className={styles.question}>Who was at fault for the incident?</div>
              <div className={styles.hint}>Under Florida law, fault determines your recovery amount</div>
              <div className={styles.opts}>
                {FAULT_LABELS.map((label, i) => (
                  <button
                    key={i}
                    className={`${styles.opt} ${answers.fault_assessment === i ? styles.selected : ""}`}
                    onClick={() => handlePickAndNext("fault_assessment", i)}
                  >
                    <span className={styles.optKey}>{String.fromCharCode(65 + i)}</span> {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Insurance status */}
          {cur === 5 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 6 of 8</div>
              <div className={styles.question}>What is the current insurance situation?</div>
              <div className={styles.hint}>Select the option that best describes where things stand</div>
              <div className={styles.opts}>
                {INSURANCE_LABELS.map((label, i) => (
                  <button
                    key={i}
                    className={`${styles.opt} ${answers.insurance_status === i ? styles.selected : ""}`}
                    onClick={() => handlePickAndNext("insurance_status", i)}
                  >
                    <span className={styles.optKey}>{String.fromCharCode(65 + i)}</span> {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Injury severity */}
          {cur === 6 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 7 of 8</div>
              <div className={styles.question}>How severe is your injury?</div>
              <div className={styles.hint}>This helps us assess the potential value of your claim</div>
              <div className={styles.opts}>
                {SEVERITY_LABELS.map((label, i) => (
                  <button
                    key={i}
                    className={`${styles.opt} ${answers.injury_severity === i ? styles.selected : ""}`}
                    onClick={() => handlePickAndNext("injury_severity", i)}
                  >
                    <span className={styles.optKey}>{String.fromCharCode(65 + i)}</span> {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Contact info */}
          {cur === 7 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Last step</div>
              <div className={styles.question}>How should we reach you?</div>
              <div className={styles.hint}>A case review specialist will contact you within 24 hours</div>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Full name</label>
                  <input
                    className={styles.input}
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Smith"
                    value={contact.name}
                    onChange={(e) => { trackContactStart(); setContact((c) => ({ ...c, name: e.target.value })); }}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Phone number</label>
                  <input
                    className={styles.input}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="(954) 555-0100"
                    value={contact.phone}
                    onChange={(e) => { trackContactStart(); setContact((c) => ({ ...c, phone: e.target.value })); }}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Email address</label>
                  <input
                    className={styles.input}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="jane@example.com"
                    value={contact.email}
                    onChange={(e) => { trackContactStart(); setContact((c) => ({ ...c, email: e.target.value })); }}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Brief description of your injury (optional)</label>
                  <input
                    className={styles.input}
                    placeholder="e.g., Rear-ended at a red light, back and neck injury"
                    value={contact.injuryDescription}
                    onChange={(e) => { trackContactStart(); setContact((c) => ({ ...c, injuryDescription: e.target.value })); }}
                  />
                </div>
              </div>
              <button
                className={`${styles.btn} ${styles.btnGold}`}
                onClick={handleSubmit}
                disabled={!contactComplete || submitting}
              >
                {submitting ? "Submitting..." : "Submit for review \u2192"}
              </button>
            </div>
          )}
        </div>

        <div className={styles.cardFooter}>
          <button
            className={styles.backBtn}
            onClick={back}
            style={{ visibility: cur > 0 && cur <= TOTAL_STEPS ? "visible" : "hidden" }}
          >
            &larr; Back
          </button>
          <span className={styles.stepCounter}>
            {cur <= TOTAL_STEPS ? "Step " + (cur + 1) + " of 8" : ""}
          </span>
        </div>
      </div>

      <div className={styles.phoneCta}>
        Prefer to talk? Call <a href="tel:8336574812">(833) 657-4812</a> for a free case review
      </div>
    </div>
  );
}
