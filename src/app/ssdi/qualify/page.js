"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";

const TOTAL_STEPS = 9; // steps 0–9 (plus branches 5b, 7b)

const DQ_MESSAGES = {
  benefits: {
    title: "Currently receiving benefits",
    msg: "You are currently receiving SSDI or SSI. If you believe your benefit amount is incorrect or you have been wrongly terminated, please call our office directly — that situation may qualify for a different type of representation.",
  },
  terminated_fraud: {
    title: "Benefits terminated — fraud or non-compliance",
    msg: "Social Security disability benefits terminated due to fraud or program non-compliance create a significant legal barrier to reapplication. We are unable to take on this case. You may wish to consult directly with an SSA representative.",
  },
  working: {
    title: "Currently working above SGA",
    msg: "The SSA defines Substantial Gainful Activity (SGA) at approximately $1,550/month gross. Earning above this threshold disqualifies you from SSDI. You must reduce work below SGA before a viable application can be filed.",
  },
  age: {
    title: "Past full retirement age",
    msg: "At age 65 or older, SSDI benefits automatically convert to Social Security retirement benefits. SSDI applications are no longer available at this stage. Contact the SSA directly at 1-800-772-1213 to discuss your retirement benefits.",
  },
  credits: {
    title: "Insufficient work credits",
    msg: "SSDI requires sufficient work quarters — generally 5 of the last 10 years. With no or minimal work history, SSDI is not available. However, you may qualify for SSI (Supplemental Security Income), which has no work credit requirement. We recommend contacting the SSA to explore SSI eligibility.",
  },
  nomedical: {
    title: "No medical documentation",
    msg: "Medical records from a treating provider are the foundation of any SSDI claim. The SSA requires documented evidence of your disabling condition. Without a willingness to seek medical care, we cannot build a viable case on your behalf.",
  },
  duration: {
    title: "Disability duration under 12 months",
    msg: "SSDI requires that your disability has lasted or is expected to last at least 12 continuous months, or is terminal. A short-term condition not expected to continue does not meet the SSA's durational requirement. You may reapply once the condition has persisted for 12 months.",
  },
  attorney: {
    title: "Active attorney — no release on file",
    msg: "You are currently represented by an attorney on this SSDI claim and do not have a signed release. We are ethically prohibited from taking on representation while another attorney is actively on your case. Please obtain a written release from your current attorney before contacting us.",
  },
};

function calcScore(answers) {
  let s = 0;
  if (answers.terminated === "none") s += 5;
  else if (answers.terminated === "medical") s += 8;
  else if (answers.terminated === "other") s += 3;
  if (answers.working === "no") s += 15;
  else if (answers.working === "below_sga") s += 7;
  if (answers.age === "50to59") s += 12;
  else if (answers.age === "60to64") s += 10;
  else if (answers.age === "under50") s += 5;
  if (answers.credits === "strong") s += 18;
  else if (answers.credits === "limited") s += 8;
  if (answers.medical === "yes") s += 18;
  else if (answers.medical === "committed") s += 10;
  else if (answers.medical === "willing") s += 6;
  if (answers.duration === "terminal" || answers.duration === "12plus") s += 15;
  else if (answers.duration === "borderline") s += 7;
  if (answers.attorney === "none") s += 12;
  else if (answers.attorney === "former" || answers.release === "yes") s += 8;
  if (answers.denial === "denied_in_window") s += 10;
  else if (answers.denial === "multiple") s += 8;
  else if (answers.denial === "first_app") s += 5;
  return Math.min(Math.max(s, 0), 100);
}

export default function SSDIQualify() {
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState({});
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [scoreBarWidth, setScoreBarWidth] = useState(0);

  // Animate score bar after result renders
  useEffect(() => {
    if (result && !result.dq) {
      const t = setTimeout(() => setScoreBarWidth(result.score), 300);
      return () => clearTimeout(t);
    }
  }, [result]);

  const stepCount = { 0:1,1:2,2:3,3:4,4:5,5:6,"5b":"6b",6:7,7:8,"7b":"8b",8:9,9:10 };
  const progress = (() => {
    const numMap = { 0:0,1:1,2:2,3:3,4:4,5:5,"5b":5,6:6,7:7,"7b":7,8:8,9:9,result:10 };
    return Math.round(((numMap[cur] ?? 0) / 10) * 100);
  })();

  const setAns = (key, val) => setAnswers((a) => ({ ...a, [key]: val }));

  const go = (targetStep) => {
    setHistory((h) => [...h, cur]);
    setCur(targetStep);
  };

  const back = () => {
    if (!history.length) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setCur(prev);
  };

  const pick = (key, val, next, delay = 320) => {
    setAns(key, val);
    setTimeout(() => go(next), delay);
  };

  const dq = (reason) => {
    setHistory((h) => [...h, cur]);
    setResult({ dq: true, reason });
    setCur("result");
  };

  const handleSubmit = async () => {
    if (!contact.name || !contact.phone || !contact.email.includes("@")) return;
    setSubmitting(true);
    const score = calcScore(answers);
    try {
      await fetch("/api/ssdi-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...contact, answers, score }),
      });
    } catch {/* silent */}
    setResult({ dq: false, score });
    setCur("result");
    setSubmitting(false);
  };

  const restart = () => {
    setAnswers({}); setContact({ name: "", phone: "", email: "" });
    setHistory([]); setResult(null); setScoreBarWidth(0); setCur(0);
  };

  const contactOk = contact.name.trim() && contact.phone.trim() && contact.email.includes("@");

  // ── Result screen ──────────────────────────────────────────
  if (result && cur === "result") {
    if (result.dq) {
      const d = DQ_MESSAGES[result.reason] || { title: "Not eligible", msg: "Based on your answers, we are unable to take your case at this time." };
      return (
        <div className={styles.wrapper}>
          <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: "100%" }} /></div>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div><div className={styles.badge}>Louis Law Group · SSDI Qualifier</div><h1>Case Evaluation</h1></div>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.resultWrap}>
                <div className={`${styles.resultIcon} ${styles.iconRed}`}>✕</div>
                <div className={styles.dqBadge}>Disqualified</div>
                <div className={styles.resultTitle}>{d.title}</div>
                <div className={styles.resultSub}>{d.msg}</div>
                <button className={styles.restartBtn} onClick={restart}>← Start over</button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const { score } = result;
    const isStrong = score >= 68, isPossible = score >= 42;
    const iconClass = isStrong ? styles.iconGreen : isPossible ? styles.iconYellow : styles.iconRed;
    const iconChar = isStrong ? "✓" : isPossible ? "~" : "!";
    const title = isStrong ? "Strong SSDI candidate" : isPossible ? "Potentially qualifying case" : "May face eligibility challenges";
    const sub = isStrong
      ? "We have received your submission and will review it as soon as possible. To avoid any delay in your SSDI case review, sign your retainer now — the sooner you do, the faster we can start protecting your claim."
      : isPossible
      ? "We have received your submission and will review it as soon as possible. To avoid any delay in your case review, sign your retainer now so our team can begin working on your file immediately."
      : "We have received your submission. To avoid any delay, sign your retainer now and a case specialist will review your file and reach out to discuss your options.";
    const barColor = isStrong ? "#4caf50" : isPossible ? "#ffb800" : "#e57373";

    const tags = [];
    const ageLabels = { under50: "Under 50", "50to59": "Age 50–59", "60to64": "Age 60–64" };
    if (answers.age) tags.push({ label: ageLabels[answers.age] || "Age noted", cls: styles.tagGreen });
    if (answers.credits === "strong") tags.push({ label: "Work credits: strong", cls: styles.tagGreen });
    if (answers.credits === "limited") tags.push({ label: "Work credits: limited", cls: styles.tagYellow });
    if (answers.medical === "yes") tags.push({ label: "Active medical care", cls: styles.tagGreen });
    if (answers.medical === "committed") tags.push({ label: "Will seek treatment", cls: styles.tagYellow });
    if (answers.duration === "12plus" || answers.duration === "terminal") tags.push({ label: "12+ month duration", cls: styles.tagGreen });
    if (answers.duration === "borderline") tags.push({ label: "Duration borderline", cls: styles.tagYellow });
    if (answers.terminated === "medical") tags.push({ label: "Prior termination: medical", cls: styles.tagYellow });
    if (answers.denial === "denied_in_window") tags.push({ label: "Appeal window open", cls: styles.tagGreen });
    if (answers.denial === "multiple") tags.push({ label: "Multiple denials", cls: styles.tagYellow });
    if (answers.denial === "denied_expired") tags.push({ label: "Appeal deadline risk", cls: styles.tagRed });
    if (answers.denial === "first_app") tags.push({ label: "First application", cls: styles.tagGreen });
    if (answers.working === "below_sga") tags.push({ label: "Below SGA", cls: styles.tagYellow });

    return (
      <div className={styles.wrapper}>
        <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: "100%" }} /></div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div><div className={styles.badge}>Louis Law Group · SSDI Qualifier</div><h1>Case Evaluation</h1></div>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.resultWrap}>
              <div className={`${styles.resultIcon} ${iconClass}`}>{iconChar}</div>
              <div className={styles.resultTitle}>{title}</div>
              <div className={styles.scoreLabel}>Qualification score: {score} / 100</div>
              <div className={styles.scoreBar}>
                <div className={styles.scoreBarFill} style={{ width: `${scoreBarWidth}%`, background: barColor }} />
              </div>
              <div className={styles.resultSub}>{sub}</div>
              {tags.length > 0 && (
                <div className={styles.tagRow}>
                  {tags.map((t, i) => <span key={i} className={`${styles.tag} ${t.cls}`}>{t.label}</span>)}
                </div>
              )}
              <a
                href="https://app.louislawgroup.com/ssdi-retainer/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.btn} ${styles.btnGold}`}
                style={{ display: "block", textAlign: "center", textDecoration: "none" }}
              >
                Open Retainer — Secure Your Case Now →
              </a>
              <div className={styles.urgencyNote}>
                ⚡ Act now — SSDI deadlines are strict. Delays can jeopardize your appeal window.
              </div>
              <button className={styles.restartBtn} onClick={restart}>Start over</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Step renderer ──────────────────────────────────────────
  return (
    <div className={styles.wrapper}>
      <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${progress}%` }} /></div>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div><div className={styles.badge}>Louis Law Group · SSDI Qualifier</div><h1>SSDI Case Evaluation</h1></div>
        </div>

        <div className={styles.cardBody}>

          {/* Step 0: Currently receiving benefits */}
          {cur === 0 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>SSDI Claim Qualifier — Louis Law Group</div>
              <div className={styles.question}>Are you currently receiving Social Security disability benefits?</div>
              <div className={styles.hint}>SSDI or SSI — either applies to this question</div>
              <div className={styles.opts}>
                <button className={styles.opt} onClick={() => { setTimeout(() => go(1), 320); }}>
                  <span className={styles.optKey}>A</span> No — I am not currently receiving benefits
                </button>
                <button className={styles.opt} onClick={() => { setTimeout(() => dq("benefits"), 320); }}>
                  <span className={styles.optKey}>B</span> Yes — I currently receive SSDI or SSI
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Prior benefits terminated */}
          {cur === 1 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 2 of 10</div>
              <div className={styles.question}>Have you ever had Social Security benefits that were terminated?</div>
              <div className={styles.hint}>Prior SSDI or SSI awards that were later stopped</div>
              <div className={styles.opts}>
                <button className={styles.opt} onClick={() => pick("terminated", "none", 2)}>
                  <span className={styles.optKey}>A</span> No — I have never received benefits
                </button>
                <button className={styles.opt} onClick={() => pick("terminated", "medical", 2)}>
                  <span className={styles.optKey}>B</span> Yes — terminated due to medical improvement
                </button>
                <button className={styles.opt} onClick={() => { setTimeout(() => dq("terminated_fraud"), 320); }}>
                  <span className={styles.optKey}>C</span> Yes — terminated due to fraud or non-compliance
                </button>
                <button className={styles.opt} onClick={() => pick("terminated", "other", 2)}>
                  <span className={styles.optKey}>D</span> Yes — terminated for another reason
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Currently working */}
          {cur === 2 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 3 of 10</div>
              <div className={styles.question}>Are you currently working?</div>
              <div className={styles.hint}>Substantial Gainful Activity (SGA) is ~$1,550/month gross in 2024</div>
              <div className={styles.opts}>
                <button className={styles.opt} onClick={() => pick("working", "no", 3)}>
                  <span className={styles.optKey}>A</span> No — I am not working
                </button>
                <button className={styles.opt} onClick={() => pick("working", "below_sga", 3)}>
                  <span className={styles.optKey}>B</span> Yes, but earning below the SGA threshold (part-time / minimal)
                </button>
                <button className={styles.opt} onClick={() => { setTimeout(() => dq("working"), 320); }}>
                  <span className={styles.optKey}>C</span> Yes — full-time or above the SGA limit (~$1,550/mo)
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Age */}
          {cur === 3 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 4 of 10</div>
              <div className={styles.question}>What is your current age?</div>
              <div className={styles.hint}>SSDI converts to retirement benefits at full retirement age (65)</div>
              <div className={styles.opts}>
                <button className={styles.opt} onClick={() => pick("age", "under50", 4)}>
                  <span className={styles.optKey}>A</span> Under 50
                </button>
                <button className={styles.opt} onClick={() => pick("age", "50to59", 4)}>
                  <span className={styles.optKey}>B</span> 50 – 59
                </button>
                <button className={styles.opt} onClick={() => pick("age", "60to64", 4)}>
                  <span className={styles.optKey}>C</span> 60 – 64
                </button>
                <button className={styles.opt} onClick={() => { setTimeout(() => dq("age"), 320); }}>
                  <span className={styles.optKey}>D</span> 65 or older
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Work credits */}
          {cur === 4 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 5 of 10</div>
              <div className={styles.question}>Have you worked and paid into Social Security?</div>
              <div className={styles.hint}>SSDI generally requires 5 of the last 10 years of work credits</div>
              <div className={styles.opts}>
                <button className={styles.opt} onClick={() => pick("credits", "strong", 5)}>
                  <span className={styles.optKey}>A</span> Yes — I have a consistent work history
                </button>
                <button className={styles.opt} onClick={() => pick("credits", "limited", 5)}>
                  <span className={styles.optKey}>B</span> Some work history, but limited or interrupted
                </button>
                <button className={styles.opt} onClick={() => { setTimeout(() => dq("credits"), 320); }}>
                  <span className={styles.optKey}>C</span> No — I have little or no work history
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Medical provider */}
          {cur === 5 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 6 of 10</div>
              <div className={styles.question}>Are you currently seeing a medical provider for your condition?</div>
              <div className={styles.hint}>Medical records are the foundation of every SSDI claim</div>
              <div className={styles.opts}>
                <button className={styles.opt} onClick={() => pick("medical", "yes", 6)}>
                  <span className={styles.optKey}>A</span> Yes — I am actively seeing a doctor or specialist
                </button>
                <button className={styles.opt} onClick={() => pick("medical", "willing", "5b")}>
                  <span className={styles.optKey}>B</span> No — but I am willing to begin treatment
                </button>
                <button className={styles.opt} onClick={() => { setTimeout(() => dq("nomedical"), 320); }}>
                  <span className={styles.optKey}>C</span> No — and I do not intend to see a provider
                </button>
              </div>
            </div>
          )}

          {/* Step 5b: Medical intent follow-up */}
          {cur === "5b" && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 6b of 10</div>
              <div className={styles.question}>Will you commit to seeing a medical provider before or during the claim?</div>
              <div className={styles.hint}>Without documented medical history we cannot build a viable case</div>
              <div className={styles.opts}>
                <button className={styles.opt} onClick={() => pick("medical", "committed", 6)}>
                  <span className={styles.optKey}>A</span> Yes — I will schedule an appointment
                </button>
                <button className={styles.opt} onClick={() => { setTimeout(() => dq("nomedical"), 320); }}>
                  <span className={styles.optKey}>B</span> No — I prefer not to seek medical treatment
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Disability duration */}
          {cur === 6 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 7 of 10</div>
              <div className={styles.question}>How long have you been unable to work due to your condition?</div>
              <div className={styles.hint}>SSDI requires the disability to last 12+ months or be terminal</div>
              <div className={styles.opts}>
                <button className={styles.opt} onClick={() => { setTimeout(() => dq("duration"), 320); }}>
                  <span className={styles.optKey}>A</span> Less than 12 months — and not expected to worsen or continue
                </button>
                <button className={styles.opt} onClick={() => pick("duration", "borderline", 7)}>
                  <span className={styles.optKey}>B</span> Less than 12 months — but expected to continue beyond 12 months
                </button>
                <button className={styles.opt} onClick={() => pick("duration", "12plus", 7)}>
                  <span className={styles.optKey}>C</span> More than 12 months
                </button>
                <button className={styles.opt} onClick={() => pick("duration", "terminal", 7)}>
                  <span className={styles.optKey}>D</span> My condition is terminal or permanent
                </button>
              </div>
            </div>
          )}

          {/* Step 7: Current attorney */}
          {cur === 7 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 8 of 10</div>
              <div className={styles.question}>Do you currently have an attorney for this SSDI claim?</div>
              <div className={styles.hint}>An active attorney requires a signed release before we can represent you</div>
              <div className={styles.opts}>
                <button className={styles.opt} onClick={() => pick("attorney", "none", 8)}>
                  <span className={styles.optKey}>A</span> No — I do not have an attorney
                </button>
                <button className={styles.opt} onClick={() => pick("attorney", "active", "7b")}>
                  <span className={styles.optKey}>B</span> Yes — I currently have an attorney
                </button>
                <button className={styles.opt} onClick={() => pick("attorney", "former", 8)}>
                  <span className={styles.optKey}>C</span> I had an attorney but that relationship has ended
                </button>
              </div>
            </div>
          )}

          {/* Step 7b: Attorney release */}
          {cur === "7b" && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 8b of 10</div>
              <div className={styles.question}>Do you have a signed release from your current attorney?</div>
              <div className={styles.hint}>We are ethically prohibited from representing a client without a release</div>
              <div className={styles.opts}>
                <button className={styles.opt} onClick={() => pick("release", "yes", 8)}>
                  <span className={styles.optKey}>A</span> Yes — I have a signed release
                </button>
                <button className={styles.opt} onClick={() => { setTimeout(() => dq("attorney"), 320); }}>
                  <span className={styles.optKey}>B</span> No — I do not have a release
                </button>
              </div>
            </div>
          )}

          {/* Step 8: Prior denials */}
          {cur === 8 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 9 of 10</div>
              <div className={styles.question}>Has your SSDI claim been previously denied?</div>
              <div className={styles.hint}>Most approvals happen at the appeal stage — a denial is not the end</div>
              <div className={styles.opts}>
                <button className={styles.opt} onClick={() => pick("denial", "first_app", 9)}>
                  <span className={styles.optKey}>A</span> No — this is my first application
                </button>
                <button className={styles.opt} onClick={() => pick("denial", "denied_in_window", 9)}>
                  <span className={styles.optKey}>B</span> Denied once — still within the 60-day appeal window
                </button>
                <button className={styles.opt} onClick={() => pick("denial", "denied_expired", 9)}>
                  <span className={styles.optKey}>C</span> Denied once — appeal window may have passed
                </button>
                <button className={styles.opt} onClick={() => pick("denial", "multiple", 9)}>
                  <span className={styles.optKey}>D</span> Denied multiple times / at hearing level
                </button>
                <button className={styles.opt} onClick={() => pick("denial", "pending", 9)}>
                  <span className={styles.optKey}>E</span> Pending — no decision yet
                </button>
              </div>
            </div>
          )}

          {/* Step 9: Contact info */}
          {cur === 9 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Last step</div>
              <div className={styles.question}>How should we reach you?</div>
              <div className={styles.hint}>A case review specialist will contact you within 24 hours</div>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Full name</label>
                  <input className={styles.input} placeholder="Jane Smith" value={contact.name}
                    onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))} />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Phone number</label>
                  <input className={styles.input} placeholder="(954) 555-0100" value={contact.phone}
                    onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))} />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Email address</label>
                  <input className={styles.input} type="email" placeholder="jane@example.com" value={contact.email}
                    onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))} />
                </div>
              </div>
              <button className={`${styles.btn} ${styles.btnGold}`} onClick={handleSubmit}
                disabled={!contactOk || submitting}>
                {submitting ? "Submitting..." : "Submit for review →"}
              </button>
            </div>
          )}

        </div>

        <div className={styles.cardFooter}>
          <button className={styles.backBtn} onClick={back}
            style={{ visibility: history.length > 0 && cur !== "result" ? "visible" : "hidden" }}>
            ← Back
          </button>
          <span className={styles.stepCounter}>
            {cur !== "result" ? `Step ${stepCount[cur] || ""} of 10` : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
