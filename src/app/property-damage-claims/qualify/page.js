"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { trackEvent } from "@/app/utils/analytics";
import UrgencyBanner from "@/app/components/UrgencyBanner/UrgencyBanner";

const CARRIERS = [
  "Allstate Insurance","American Integrity Insurance","American Traditions Insurance",
  "Anchor Property & Casualty","Armed Forces Insurance","Avatar Property & Casualty",
  "Bankers Insurance Group","Centauri Insurance","Chubb Insurance",
  "Citizens Property Insurance","Edison Insurance","Federated National Insurance",
  "Florida Family Insurance","Florida Peninsula Insurance","Frontline Insurance",
  "GeoVera Insurance","Hartford Insurance","Heritage Property & Casualty",
  "Homeowners Choice","IAT Insurance Group","Kin Insurance",
  "Liberty Mutual","Lighthouse Property Insurance","Maison Insurance",
  "Monarch National Insurance","Nationwide Insurance","Olympus Insurance",
  "Palomar Insurance","Peoples Trust Insurance","Progressive Insurance",
  "Safepoint Insurance","Security First Financial","Slide Insurance",
  "Southern Fidelity Insurance","Southern Heritage Insurance","Southern Oak Insurance",
  "State Farm Florida","Swyfft Insurance","Tower Hill Insurance",
  "Travelers Insurance","TypTap Insurance","USAA",
  "Universal Property & Casualty","Vault Insurance","Weston Insurance",
  "Windsor Mount Hawley","Openly Insurance","Farmers Insurance","Other / Not listed"
].sort();

const DAMAGE_LABELS = ["Hurricane / Wind","Water / Flood","Roof Damage","Fire / Smoke","Plumbing Leak","Mold","Other"];
const RESPONSE_LABELS = ["Denied claim entirely","Underpaid / lowballed","Delaying or not responding","Claim pending — no decision yet","No claim filed yet"];
const TOTAL_STEPS = 6;

export default function PropertyDamageQualify() {
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState({});
  const [carrier, setCarrier] = useState("");
  const [ddQuery, setDdQuery] = useState("");
  const [ddOpen, setDdOpen] = useState(false);
  const [dateVal, setDateVal] = useState("");
  const [dateNote, setDateNote] = useState({ msg: "", warn: false });
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const ddRef = useRef(null);
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  useEffect(() => {
    trackEvent("qualify_page_view", { case_type: "property-damage" });
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const progress = Math.min((cur / TOTAL_STEPS) * 100, 100);

  const setAnswer = (key, val) => setAnswers((a) => ({ ...a, [key]: val }));

  const next = () => setCur((c) => c + 1);
  const back = () => setCur((c) => Math.max(0, c - 1));

  const handlePickAndNext = (key, val, delay = 320) => {
    setAnswer(key, val);
    setTimeout(next, delay);
  };

  const handleOwner = (isOwner) => {
    setAnswer(0, isOwner);
    if (!isOwner) { setTimeout(() => showDQ("not-owner"), 320); return; }
    setTimeout(next, 320);
  };

  const handleFlorida = (isFL) => {
    setAnswer(1, isFL);
    if (!isFL) { setTimeout(() => showDQ("out-of-state"), 320); return; }
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
    setAnswer(4, val);
    if (yrs > 5) setDateNote({ msg: "Warning: Over 5 years ago. Florida statute of limitations may bar your claim.", warn: true });
    else if (yrs > 3) setDateNote({ msg: "Note: Over 3 years ago. We will review applicable deadlines carefully.", warn: true });
    else setDateNote({ msg: `Date recorded: ${loss.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, warn: false });
  };

  const calcScore = () => {
    let s = 20;
    if (answers[4]) {
      const yrs = (today - new Date(answers[4])) / (365 * 86400000);
      if (yrs <= 0.5) s += 20; else if (yrs <= 1) s += 17; else if (yrs <= 3) s += 12; else if (yrs <= 5) s += 5;
    }
    const insMap = [22, 20, 15, 8, 3];
    s += insMap[answers[5]] !== undefined ? insMap[answers[5]] : 0;
    s += 18;
    return Math.min(Math.max(s, 0), 100);
  };

  const showDQ = (reason) => {
    trackEvent("qualify_disqualified", { case_type: "property-damage", reason });
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
          carrier,
          damageType: answers[3],
          dateOfLoss: answers[4] || dateVal,
          insurerResponse: answers[5],
          score,
        }),
      });
    } catch {/* silent — still show result */}
    trackEvent("qualify_submitted", { case_type: "property-damage", score });
    setResult({ dq: false, score });
    setCur(TOTAL_STEPS + 1);
    setSubmitted(true);
    setSubmitting(false);
  };

  const restart = () => {
    setAnswers({}); setCarrier(""); setDdQuery(""); setDdOpen(false);
    setDateVal(""); setDateNote({ msg: "", warn: false });
    setContact({ name: "", phone: "", email: "" });
    setResult(null); setSubmitted(false); setCur(0);
  };

  const filteredCarriers = ddQuery
    ? CARRIERS.filter((c) => c.toLowerCase().includes(ddQuery.toLowerCase()))
    : CARRIERS;

  const contactComplete = contact.name.trim() && contact.phone.trim() && contact.email.includes("@");

  // Result screen
  if (result) {
    if (result.dq) {
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

    const { score } = result;
    const isStrong = score >= 70, isPossible = score >= 45;
    const iconClass = isStrong ? styles.iconGreen : isPossible ? styles.iconYellow : styles.iconRed;
    const iconChar = isStrong ? "✓" : isPossible ? "~" : "!";
    const title = isStrong ? "Strong candidate for representation" : isPossible ? "Potentially qualifying case" : "May not qualify at this time";
    const sub = isStrong
      ? "Your case shows multiple strong indicators. A Louis Law Group attorney will review your file and reach out within 24 hours."
      : isPossible
      ? "Your case has some qualifying factors. Our intake team will follow up to discuss your options in detail."
      : "Based on your answers, there may be challenges. We still recommend a short call — options may exist that this form cannot capture.";
    const barColor = isStrong ? "#4caf50" : isPossible ? "#ffb800" : "#e57373";

    const tags = [];
    if (answers[3] !== undefined) tags.push({ label: DAMAGE_LABELS[answers[3]] || "Damage reported", cls: styles.tagGreen });
    if (carrier) tags.push({ label: carrier.replace(" Insurance","").replace(" Property & Casualty",""), cls: styles.tagYellow });
    if (answers[5] === 0) tags.push({ label: "Denial — strong case", cls: styles.tagGreen });
    if (answers[5] === 1) tags.push({ label: "Underpayment dispute", cls: styles.tagGreen });
    if (answers[5] === 2) tags.push({ label: "Bad faith potential", cls: styles.tagGreen });
    if (answers[5] === 4) tags.push({ label: "No claim filed yet", cls: styles.tagYellow });
    if (answers[4]) {
      const yrs = (today - new Date(answers[4])) / (365 * 86400000);
      tags.push(yrs > 3 ? { label: "Limitations risk", cls: styles.tagRed } : { label: "Within limitations", cls: styles.tagGreen });
    }

    return (
      <div className={styles.wrapper}>
        <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: "100%" }} /></div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div><div className={styles.badge}>Louis Law Group · Claim Qualifier</div><h1>Case Evaluation</h1></div>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.resultWrap}>
              <div className={`${styles.resultIcon} ${iconClass}`}>{iconChar}</div>
              <div className={styles.resultTitle}>{title}</div>
              <div className={styles.scoreLabel}>Qualification score: {score} / 100</div>
              <div className={styles.scoreBar}>
                <div className={styles.scoreBarFill} style={{ width: `${score}%`, background: barColor }} />
              </div>
              <div className={styles.resultSub}>{sub}</div>
              {tags.length > 0 && (
                <div className={styles.tagRow}>
                  {tags.map((t, i) => <span key={i} className={`${styles.tag} ${t.cls}`}>{t.label}</span>)}
                </div>
              )}
              <button className={`${styles.btn} ${styles.btnGold}`} onClick={() => window.location.href = "tel:9546764179"}>
                Schedule free consultation →
              </button>
              <button className={styles.restartBtn} onClick={restart}>Start over</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <UrgencyBanner />
      <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${progress}%` }} /></div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div><div className={styles.badge}>Louis Law Group · Claim Qualifier</div><h1>Property Damage Case Evaluation</h1></div>
        </div>

        <div className={styles.cardBody}>

          {/* Step 0: Owner check */}
          {cur === 0 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Louis Law Group · Claim Qualifier</div>
              <div className={styles.question}>Are you the owner of the damaged property?</div>
              <div className={styles.hint}>Only property owners can initiate an insurance claim dispute</div>
              <div className={styles.opts}>
                <button className={`${styles.opt} ${answers[0] === true ? styles.selected : ""}`} onClick={() => handleOwner(true)}>
                  <span className={styles.optKey}>A</span> Yes — I am the property owner
                </button>
                <button className={`${styles.opt} ${answers[0] === false ? styles.selected : ""}`} onClick={() => handleOwner(false)}>
                  <span className={styles.optKey}>B</span> No — I am a tenant or other party
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Florida check */}
          {cur === 1 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 2 of 7</div>
              <div className={styles.question}>Is the damaged property located in Florida?</div>
              <div className={styles.hint}>We exclusively handle Florida property insurance claims</div>
              <div className={styles.opts}>
                <button className={`${styles.opt} ${answers[1] === true ? styles.selected : ""}`} onClick={() => handleFlorida(true)}>
                  <span className={styles.optKey}>A</span> Yes — property is in Florida
                </button>
                <button className={`${styles.opt} ${answers[1] === false ? styles.selected : ""}`} onClick={() => handleFlorida(false)}>
                  <span className={styles.optKey}>B</span> No — property is outside Florida
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Insurance carrier */}
          {cur === 2 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 3 of 7</div>
              <div className={styles.question}>Who is your insurance company?</div>
              <div className={styles.hint}>Search or scroll to find your carrier</div>
              <div className={styles.ddWrap} ref={ddRef}>
                <input
                  className={styles.ddSearch}
                  placeholder="Type to search carriers..."
                  value={ddQuery}
                  onChange={(e) => setDdQuery(e.target.value)}
                  onFocus={() => setDdOpen(true)}
                  autoComplete="off"
                />
                <div className={`${styles.ddList} ${ddOpen ? styles.open : ""}`}>
                  {filteredCarriers.length === 0
                    ? <div className={styles.ddEmpty}>No carriers found</div>
                    : filteredCarriers.map((c) => (
                      <div key={c} className={`${styles.ddItem} ${carrier === c ? styles.ddItemActive : ""}`}
                        onClick={() => { setCarrier(c); setAnswer(2, c); setDdQuery(""); setDdOpen(false); }}>
                        {c}
                      </div>
                    ))
                  }
                </div>
                {carrier && (
                  <div className={`${styles.ddSelected} ${styles.show}`}>
                    <span>{carrier}</span>
                    <button className={styles.ddClear} onClick={() => { setCarrier(""); setAnswer(2, undefined); }}>×</button>
                  </div>
                )}
              </div>
              <button className={styles.btn} onClick={next} disabled={!carrier}>Continue →</button>
            </div>
          )}

          {/* Step 3: Type of damage */}
          {cur === 3 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 4 of 7</div>
              <div className={styles.question}>What type of damage occurred?</div>
              <div className={styles.hint}>Select the primary cause of loss</div>
              <div className={styles.optsGrid}>
                {["Hurricane / Wind","Water / Flood","Roof Damage","Fire / Smoke","Plumbing Leak","Mold","Other"].map((label, i) => (
                  <button key={i} className={`${styles.opt} ${answers[3] === i ? styles.selected : ""}`}
                    onClick={() => handlePickAndNext(3, i)}>
                    <span className={styles.optKey}>{String.fromCharCode(65 + i)}</span> {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Date of loss */}
          {cur === 4 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 5 of 7</div>
              <div className={styles.question}>When did the damage occur?</div>
              <div className={styles.hint}>Select the exact or approximate date of loss</div>
              <input type="date" className={styles.dateInput} value={dateVal} max={todayStr}
                onChange={(e) => handleDate(e.target.value)} />
              {dateNote.msg && <div className={`${styles.dateNote} ${dateNote.warn ? styles.dateWarn : ""}`}>{dateNote.msg}</div>}
              <button className={styles.btn} onClick={next} disabled={!dateVal || new Date(dateVal) > today}>Continue →</button>
            </div>
          )}

          {/* Step 5: Insurer response */}
          {cur === 5 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Question 6 of 7</div>
              <div className={styles.question}>What has your insurance company done with your claim?</div>
              <div className={styles.hint}>Select the option that best describes your situation</div>
              <div className={styles.opts}>
                {RESPONSE_LABELS.map((label, i) => (
                  <button key={i} className={`${styles.opt} ${answers[5] === i ? styles.selected : ""}`}
                    onClick={() => handlePickAndNext(5, i)}>
                    <span className={styles.optKey}>{String.fromCharCode(65 + i)}</span> {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Contact info */}
          {cur === 6 && (
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
                disabled={!contactComplete || submitting}>
                {submitting ? "Submitting..." : "Submit for review →"}
              </button>
            </div>
          )}

        </div>

        <div className={styles.cardFooter}>
          <button className={styles.backBtn} onClick={back} style={{ visibility: cur > 0 && cur <= TOTAL_STEPS ? "visible" : "hidden" }}>
            ← Back
          </button>
          <span className={styles.stepCounter}>{cur <= TOTAL_STEPS ? `Step ${cur + 1} of 7` : ""}</span>
        </div>
      </div>
    </div>
  );
}
