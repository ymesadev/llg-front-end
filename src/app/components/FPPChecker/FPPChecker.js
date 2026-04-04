"use client";
import { useState } from "react";
import styles from "./FPPChecker.module.css";

const STEPS = [
  {
    id: "timeline",
    question: "When did your property loss occur?",
    hint: "Florida law sets strict deadlines for insurers to respond.",
    options: [
      { label: "Less than 30 days ago", value: "u30", flags: 0 },
      { label: "30 to 90 days ago", value: "30to90", flags: 0 },
      { label: "90 days to 6 months ago", value: "90to180", flags: 1, risk: "warning" },
      { label: "6 months to 1 year ago", value: "6to12", flags: 2, risk: "high" },
      { label: "Over 1 year ago", value: "over1yr", flags: 2, risk: "high" },
    ],
  },
  {
    id: "adjuster",
    question: "Has your insurer assigned a claims adjuster?",
    hint: "Florida requires adjuster assignment within 7 days of filing.",
    options: [
      { label: "Yes — assigned within 7 days", value: "fast", flags: 0 },
      { label: "Yes — took more than 14 days", value: "slow", flags: 1, risk: "warning" },
      { label: "Only an independent adjuster (not insurer's own)", value: "ia", flags: 1, risk: "warning" },
      { label: "No adjuster assigned yet", value: "none", flags: 2, risk: "high" },
    ],
  },
  {
    id: "decision",
    question: "Have you received a written coverage decision?",
    hint: "Under Florida law, insurers must pay or deny within 60 days of receiving proof of loss.",
    options: [
      { label: "Yes — fully approved", value: "approved", flags: 0 },
      { label: "Yes — partially approved / partial denial", value: "partial", flags: 2, risk: "high" },
      { label: "Yes — fully denied", value: "denied", flags: 3, risk: "high" },
      { label: "No written decision yet", value: "pending", flags: 1, risk: "warning" },
    ],
  },
  {
    id: "offer",
    question: "How does your insurer's offer compare to your actual damage estimate?",
    hint: "Compare what your contractor or public adjuster said vs. what the insurer offered.",
    options: [
      { label: "No offer received yet", value: "none", flags: 1, risk: "warning" },
      { label: "Fair — within 10% of my estimate", value: "fair", flags: 0 },
      { label: "Low — 10 to 30% below my estimate", value: "low10", flags: 1, risk: "warning" },
      { label: "Very low — 30 to 50% below my estimate", value: "low30", flags: 2, risk: "high" },
      { label: "Severely low — over 50% below my estimate", value: "low50", flags: 3, risk: "high" },
      { label: "I don't have an independent estimate yet", value: "unknown", flags: 0 },
    ],
  },
  {
    id: "conduct",
    question: "Has your insurer done any of the following?",
    hint: "Select all that apply. These may indicate bad faith conduct.",
    multi: true,
    options: [
      { label: "Delayed my claim more than 90 days", value: "delay", flags: 2, risk: "high" },
      { label: "Requested excessive or repeated documentation", value: "docs", flags: 1, risk: "warning" },
      { label: "Changed adjusters multiple times", value: "adjusters", flags: 1, risk: "warning" },
      { label: "Made a partial payment without written explanation", value: "payment", flags: 1, risk: "warning" },
      { label: "Threatened to cancel my policy", value: "cancel", flags: 2, risk: "high" },
      { label: "Refused to communicate in writing", value: "nowrite", flags: 2, risk: "high" },
      { label: "None of the above", value: "none", flags: 0, exclusive: true },
    ],
  },
];

function countFlags(answers) {
  let f = 0;
  Object.entries(answers).forEach(([id, val]) => {
    const s = STEPS.find((x) => x.id === id);
    if (!s) return;
    if (s.multi) {
      (val || []).forEach((v) => {
        const o = s.options.find((x) => x.value === v);
        if (o) f += o.flags;
      });
    } else {
      const o = s.options.find((x) => x.value === val);
      if (o) f += o.flags;
    }
  });
  return f;
}

function getStatus(totalFlags) {
  if (totalFlags <= 1)
    return { label: "Claim appears healthy", sublabel: "No major red flags detected", color: "#16a34a", meterColor: "#22c55e" };
  if (totalFlags <= 4)
    return { label: "Claim at risk", sublabel: "Warning signs present", color: "#ea580c", meterColor: "#f97316" };
  return { label: "Claim in critical condition", sublabel: "Multiple red flags — act now", color: "#dc2626", meterColor: "#ef4444" };
}

function getRedFlags(answers) {
  const flags = [];
  Object.entries(answers).forEach(([id, val]) => {
    const s = STEPS.find((x) => x.id === id);
    if (!s) return;
    if (s.multi) {
      (val || []).forEach((v) => {
        const o = s.options.find((x) => x.value === v);
        if (o && o.flags > 0) flags.push({ answer: o.label, risk: o.risk, flags: o.flags });
      });
    } else {
      const o = s.options.find((x) => x.value === val);
      if (o && o.flags > 0) flags.push({ answer: o.label, risk: o.risk, flags: o.flags });
    }
  });
  return flags;
}

export default function FPPChecker() {
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [totalFlags, setTotalFlags] = useState(0);
  const [multiSel, setMultiSel] = useState([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [fading, setFading] = useState(false);

  const cur = step >= 0 && step < STEPS.length ? STEPS[step] : null;
  const isEmailStep = step === STEPS.length;
  const progress = step < 0 ? 0 : Math.round((step / STEPS.length) * 100);

  function goNext(newAnswers) {
    const f = countFlags(newAnswers);
    setTotalFlags(f);
    setFading(true);
    setTimeout(() => {
      setStep((s) => s + 1);
      setMultiSel([]);
      setFading(false);
    }, 180);
  }

  function pick(opt) {
    const newA = { ...answers, [cur.id]: opt.value };
    setAnswers(newA);
    goNext(newA);
  }

  function toggleMulti(opt) {
    if (opt.exclusive) {
      setMultiSel(["none"]);
      return;
    }
    setMultiSel((prev) => {
      const filtered = prev.filter((v) => v !== "none");
      return filtered.includes(opt.value) ? filtered.filter((v) => v !== opt.value) : [...filtered, opt.value];
    });
  }

  function submitMulti() {
    const vals = multiSel.length ? multiSel : ["none"];
    const newA = { ...answers, [cur.id]: vals };
    setAnswers(newA);
    goNext(newA);
  }

  async function handleSubmit() {
    if (!email.includes("@")) return;
    setSubmitted(true);
    try {
      await fetch("https://n8n.louislawgroup.com/webhook/fpp-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, answers, totalFlags, timestamp: new Date().toISOString() }),
      });
    } catch {}
  }

  function resetAll() {
    setStep(-1);
    setAnswers({});
    setTotalFlags(0);
    setMultiSel([]);
    setEmail("");
    setName("");
    setSubmitted(false);
  }

  const status = getStatus(totalFlags);
  const redFlags = getRedFlags(answers);
  const scorePercent = Math.min(100, Math.round((totalFlags / 10) * 100));

  const ShieldIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke="#ffb800" strokeWidth="1.5" />
    </svg>
  );

  // Intro
  if (step === -1) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.introCard}>
          <div className={styles.introBadge}>
            <ShieldIcon />
            <span className={styles.introBadgeText}>Louis Law Group · FPP Claim Analyzer</span>
          </div>
          <h3 className={styles.introTitle}>Is your insurance company handling your claim fairly?</h3>
          <p className={styles.introDesc}>
            Answer 5 questions. We&apos;ll analyze your claim against Florida property insurance law and show you exactly where you stand.
          </p>
          <div className={styles.introStats}>
            {[
              ["2 min", "to complete"],
              ["Free", "no obligation"],
              ["Instant", "results"],
            ].map(([val, lbl]) => (
              <div key={val} className={styles.introStatCard}>
                <div className={styles.introStatValue}>{val}</div>
                <div className={styles.introStatLabel}>{lbl}</div>
              </div>
            ))}
          </div>
          <button className={styles.startBtn} onClick={() => setStep(0)}>
            Check my claim status →
          </button>
        </div>
        <p className={styles.disclaimer}>General information only, not legal advice. Based on Florida insurance law and claim best practices.</p>
      </div>
    );
  }

  // Questions
  if (cur && !isEmailStep && !submitted) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.stepFade} style={{ opacity: fading ? 0 : 1 }}>
          <div>
            <div className={styles.progressRow}>
              <span>
                Question {step + 1} of {STEPS.length}
              </span>
              {totalFlags > 0 && (
                <span className={`${styles.flagCount} ${totalFlags >= 4 ? styles.flagCountDanger : styles.flagCountWarning}`}>
                  {totalFlags} flag{totalFlags !== 1 ? "s" : ""} found
                </span>
              )}
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
          </div>

          <h3 className={styles.questionTitle}>{cur.question}</h3>
          <p className={styles.questionHint}>{cur.hint}</p>

          <div className={styles.optionsList}>
            {cur.options.map((opt) => {
              const isSel = cur.multi ? multiSel.includes(opt.value) : false;
              return (
                <button
                  key={opt.value}
                  className={`${styles.optionBtn} ${isSel ? styles.optionBtnSelected : ""}`}
                  onClick={() => (cur.multi ? toggleMulti(opt) : pick(opt))}
                >
                  <span>{opt.label}</span>
                  {opt.risk && (
                    <span className={`${styles.riskBadge} ${opt.risk === "high" ? styles.riskHigh : styles.riskWarning}`}>
                      {opt.risk === "high" ? "red flag" : "warning"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {cur.multi && (
            <button className={styles.multiSubmitBtn} onClick={submitMulti}>
              {multiSel.length === 0 ? "None of the above — continue →" : `Continue with ${multiSel.length} selected →`}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Email capture
  if (isEmailStep && !submitted) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.stepFade} style={{ opacity: fading ? 0 : 1 }}>
          <div className={styles.emailCard}>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div className={styles.scoreCircle}>
                <svg viewBox="0 0 72 72" width="72" height="72" className={styles.scoreCircleSvg}>
                  <circle cx="36" cy="36" r="32" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <circle
                    cx="36"
                    cy="36"
                    r="32"
                    fill="none"
                    stroke={status.meterColor}
                    strokeWidth="3"
                    strokeDasharray={`${scorePercent * 2.01} 201`}
                    strokeLinecap="round"
                    transform="rotate(-90 36 36)"
                    style={{ transition: "stroke-dasharray 0.6s ease" }}
                  />
                </svg>
                <div className={styles.scoreCircleInner}>
                  <span className={styles.scoreNumber}>{totalFlags}</span>
                  <span className={styles.scoreLabel}>flags</span>
                </div>
              </div>
              <h3 className={styles.statusTitle}>{status.label}</h3>
              <p className={styles.statusDesc}>
                {totalFlags === 0
                  ? "Your claim appears to be on track. Enter your email for your full personalized report."
                  : `We identified ${totalFlags} issue${totalFlags !== 1 ? "s" : ""} with your claim. Enter your email to see the full breakdown and your recommended next steps.`}
              </p>
            </div>

            <div className={styles.formFields}>
              <div>
                <label className={styles.formLabel}>Your name</label>
                <input type="text" placeholder="First name" value={name} onChange={(e) => setName(e.target.value)} className={styles.formInput} />
              </div>
              <div>
                <label className={styles.formLabel}>Email address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.formInput}
                />
              </div>
            </div>

            <button
              className={`${styles.submitBtn} ${email.includes("@") ? styles.submitBtnActive : styles.submitBtnDisabled}`}
              onClick={handleSubmit}
            >
              Get my free claim report →
            </button>
          </div>
          <p className={styles.emailDisclaimer}>No spam. We&apos;ll send your report and relevant updates about your claim rights under Florida law.</p>
        </div>
      </div>
    );
  }

  // Results
  if (submitted) {
    const nextSteps =
      totalFlags <= 1
        ? [
            "Keep all claim communications in writing",
            "Document every interaction with dates and names",
            "Get a contractor's independent repair estimate",
            "Contact us if anything changes or you receive new communications",
          ]
        : totalFlags <= 4
          ? [
              "Do not accept any offer without an independent estimate",
              "Request written explanation for any underpayment",
              "Document all delays — you have legal rights",
              "A free attorney consultation is strongly recommended before responding to your insurer",
            ]
          : [
              "Do not sign or accept any settlement without legal review",
              "Your insurer's conduct may constitute bad faith under Florida §624.155",
              "You may be entitled to full policy limits, attorney fees, and additional damages",
              "Call Louis Law Group today — these cases are time-sensitive",
            ];

    return (
      <div className={styles.wrapper}>
        <div className={styles.resultCard}>
          <div className={styles.resultHeader}>
            <div className={styles.resultCircle} style={{ border: `2px solid ${status.meterColor}` }}>
              <span className={styles.resultCircleNumber} style={{ color: status.meterColor }}>
                {totalFlags}
              </span>
              <span className={styles.resultCircleLabel}>flags</span>
            </div>
            <div>
              <div className={styles.resultStatusLabel}>{status.label}</div>
              <div className={styles.resultStatusSub}>{status.sublabel}</div>
            </div>
          </div>
          {name && (
            <p className={styles.resultPersonal}>
              {name}, based on your answers,{" "}
              {totalFlags <= 1
                ? "your claim appears to be progressing normally under Florida law."
                : totalFlags <= 4
                  ? "your claim shows warning signs that warrant a closer look from an experienced property insurance attorney."
                  : "your claim shows multiple indicators consistent with insurance bad faith — you may be significantly undercompensated."}
            </p>
          )}
        </div>

        {redFlags.length > 0 && (
          <div>
            <p className={styles.sectionLabel}>Issues identified</p>
            <div className={styles.flagsList}>
              {redFlags.map((f, i) => (
                <div key={i} className={`${styles.flagItem} ${f.risk === "high" ? styles.flagItemHigh : styles.flagItemWarning}`}>
                  <div className={`${styles.flagDot} ${f.risk === "high" ? styles.flagDotHigh : styles.flagDotWarning}`} />
                  <span className={styles.flagText}>{f.answer}</span>
                  <span className={`${styles.flagSeverity} ${f.risk === "high" ? styles.flagSeverityHigh : styles.flagSeverityWarning}`}>
                    {f.risk === "high" ? "High risk" : "Warning"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className={styles.sectionLabel}>Recommended next steps</p>
          <div className={styles.nextStepsBox}>
            <ol className={styles.nextStepsList}>
              {nextSteps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>
        </div>

        <div className={styles.ctaCard}>
          <div className={styles.ctaBadge}>
            <ShieldIcon />
            <span className={styles.ctaBadgeText}>Louis Law Group</span>
          </div>
          <h3 className={styles.ctaTitle}>
            {totalFlags >= 4 ? "Your claim may be worth significantly more." : "Want a professional review?"}
          </h3>
          <p className={styles.ctaDesc}>Free case review. No fees unless we win. Licensed in Florida, DC, TX, and CO.</p>
          <div className={styles.ctaButtons}>
            <a href="https://louislawgroup.com/contact" target="_blank" rel="noopener noreferrer" className={styles.ctaBtnPrimary}>
              Free case review →
            </a>
            <a href="tel:+19545127069" className={styles.ctaBtnSecondary}>
              Call us now
            </a>
          </div>
        </div>

        <button className={styles.startOverBtn} onClick={resetAll}>
          Start over
        </button>
      </div>
    );
  }

  return null;
}
