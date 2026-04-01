"use client";

import { useState, useEffect, useRef } from "react";
import styles from "../../property-damage-claims/qualify/page.module.css";
import { trackEvent } from "@/app/utils/analytics";

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
  "Windsor Mount Hawley","Openly Insurance","Farmers Insurance","Otra / No aparece"
].sort();

const DAMAGE_LABELS = ["Huracan / Viento","Agua / Inundacion","Dano al Techo","Incendio / Humo","Fuga de Plomeria","Moho","Otro"];
const RESPONSE_LABELS = ["Negaron el reclamo completamente","Pagaron menos de lo debido","Estan demorando o no responden","Reclamo pendiente — sin decision","No he presentado un reclamo todavia"];
const TOTAL_STEPS = 6;
const STEP_NAMES = ["damage_type","owner_check","florida_check","carrier_select","date_of_loss","insurer_response","contact_info"];

export default function ReclamosCalificar() {
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
    trackEvent("qualify_page_view", { case_type: "property-damage_es" });
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (cur <= TOTAL_STEPS) {
      trackEvent("qualify_step_viewed", { case_type: "property-damage_es", step: cur, step_name: STEP_NAMES[cur] });
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
          case_type: "property-damage_es",
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
    const label = key === 3 ? DAMAGE_LABELS[val] : key === 5 ? RESPONSE_LABELS[val] : String(val);
    trackEvent("qualify_step_answered", { case_type: "property-damage_es", step: cur, step_name: STEP_NAMES[cur], answer: label });
    setTimeout(next, delay);
  };

  const handleOwner = (isOwner) => {
    setAnswer(0, isOwner);
    trackEvent("qualify_step_answered", { case_type: "property-damage_es", step: cur, step_name: "owner_check", answer: isOwner ? "yes" : "no", disqualified: !isOwner });
    if (!isOwner) { setTimeout(() => showDQ("not-owner"), 320); return; }
    setTimeout(next, 320);
  };

  const handleFlorida = (isFL) => {
    setAnswer(1, isFL);
    trackEvent("qualify_step_answered", { case_type: "property-damage_es", step: cur, step_name: "florida_check", answer: isFL ? "yes" : "no", disqualified: !isFL });
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
      setDateNote({ msg: "La fecha parece estar en el futuro — por favor verifique.", warn: true });
      return;
    }
    setAnswer(4, val);
    const bucket = yrs > 5 ? "over_5y" : yrs > 3 ? "3_to_5y" : yrs > 1 ? "1_to_3y" : "under_1y";
    trackEvent("qualify_step_answered", { case_type: "property-damage_es", step: 4, step_name: "date_of_loss", answer: bucket, years_ago: Math.round(yrs * 10) / 10 });
    if (yrs > 5) setDateNote({ msg: "Advertencia: Hace mas de 5 anos. El estatuto de limitaciones de Florida puede impedir su reclamo.", warn: true });
    else if (yrs > 3) setDateNote({ msg: "Nota: Hace mas de 3 anos. Revisaremos los plazos aplicables cuidadosamente.", warn: true });
    else setDateNote({ msg: `Fecha registrada: ${loss.toLocaleDateString("es-US", { year: "numeric", month: "long", day: "numeric" })}`, warn: false });
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
    trackEvent("qualify_disqualified", { case_type: "property-damage_es", reason });
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
          source: "reclamos-propiedad-calificar-es",
        }),
      });
    } catch {/* silent */}
    trackEvent("qualify_submitted", { case_type: "property-damage_es", score });
    if (window.__or_identify) {
      window.__or_identify(contact.email, { name: contact.name, phone: contact.phone, case_type: "property-damage_es", score });
    }
    if (window.__or_event) {
      window.__or_event("form_submitted", { form: "pd_qualify_es", score, name: contact.name });
    }
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
  const contactStartedRef = useRef(false);
  const trackContactStart = () => {
    if (!contactStartedRef.current) {
      contactStartedRef.current = true;
      trackEvent("qualify_step_answered", { case_type: "property-damage_es", step: 6, step_name: "contact_info", answer: "started_typing" });
    }
  };

  // Result screen
  if (result) {
    if (result.dq) {
      const msgs = {
        "not-owner": "Louis Law Group solo puede representar a propietarios de inmuebles en disputas de seguros. Inquilinos, ocupantes o terceros no son elegibles para iniciar una disputa de reclamo en nombre del asegurado.",
        "out-of-state": "Louis Law Group maneja exclusivamente reclamos de seguros de propiedad para inmuebles ubicados en Florida. No podemos representar reclamos fuera del estado.",
      };
      const titles = { "not-owner": "No es el propietario del inmueble", "out-of-state": "Fuera de nuestra area de practica" };
      return (
        <div className={styles.wrapper}>
          <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: "100%" }} /></div>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div><div className={styles.badge}>Louis Law Group · Calificador de Reclamos</div><h1>Evaluacion del Caso</h1></div>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.resultWrap}>
                <div className={`${styles.resultIcon} ${styles.iconRed}`}>&#10005;</div>
                <div className={styles.dqBadge}>Descalificado</div>
                <div className={styles.resultTitle}>{titles[result.reason]}</div>
                <div className={styles.resultSub}>{msgs[result.reason]}</div>
                <button className={styles.restartBtn} onClick={restart}>&larr; Empezar de nuevo</button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const { score } = result;
    const isStrong = score >= 70, isPossible = score >= 45;
    const iconClass = isStrong ? styles.iconGreen : isPossible ? styles.iconYellow : styles.iconRed;
    const iconChar = isStrong ? "\u2713" : isPossible ? "~" : "!";
    const title = isStrong ? "Candidato fuerte para representacion" : isPossible ? "Caso potencialmente calificable" : "Puede no calificar en este momento";
    const sub = isStrong
      ? "Hemos recibido su solicitud y la revisaremos lo antes posible. Para evitar demoras en la revision de su caso, firme su contrato ahora — mientras mas rapido lo haga, mas rapido podremos comenzar a proteger su reclamo."
      : isPossible
      ? "Hemos recibido su solicitud y la revisaremos lo antes posible. Para evitar demoras en la revision de su caso, firme su contrato ahora para que nuestro equipo pueda comenzar a trabajar en su expediente de inmediato."
      : "Hemos recibido su solicitud. Para evitar demoras, firme su contrato ahora y un especialista revisara su expediente y se comunicara con usted para discutir sus opciones.";
    const barColor = isStrong ? "#4caf50" : isPossible ? "#ffb800" : "#e57373";

    const tags = [];
    if (answers[3] !== undefined) tags.push({ label: DAMAGE_LABELS[answers[3]] || "Dano reportado", cls: styles.tagGreen });
    if (carrier) tags.push({ label: carrier.replace(" Insurance","").replace(" Property & Casualty",""), cls: styles.tagYellow });
    if (answers[5] === 0) tags.push({ label: "Negacion — caso fuerte", cls: styles.tagGreen });
    if (answers[5] === 1) tags.push({ label: "Disputa de pago insuficiente", cls: styles.tagGreen });
    if (answers[5] === 2) tags.push({ label: "Potencial mala fe", cls: styles.tagGreen });
    if (answers[5] === 4) tags.push({ label: "No se ha presentado reclamo", cls: styles.tagYellow });
    if (answers[4]) {
      const yrs = (today - new Date(answers[4])) / (365 * 86400000);
      tags.push(yrs > 3 ? { label: "Riesgo de limitaciones", cls: styles.tagRed } : { label: "Dentro del plazo", cls: styles.tagGreen });
    }

    return (
      <div className={styles.wrapper}>
        <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: "100%" }} /></div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div><div className={styles.badge}>Louis Law Group · Calificador de Reclamos</div><h1>Evaluacion del Caso</h1></div>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.resultWrap}>
              <div className={`${styles.resultIcon} ${iconClass}`}>{iconChar}</div>
              <div className={styles.resultTitle}>{title}</div>
              <div className={styles.scoreLabel}>Puntuacion de calificacion: {score} / 100</div>
              <div className={styles.scoreBar}>
                <div className={styles.scoreBarFill} style={{ width: `${score}%`, background: barColor }} />
              </div>
              <div className={styles.resultSub}>{sub}</div>
              {tags.length > 0 && (
                <div className={styles.tagRow}>
                  {tags.map((t, i) => <span key={i} className={`${styles.tag} ${t.cls}`}>{t.label}</span>)}
                </div>
              )}
              <a
                href="https://app.louislawgroup.com/first-party-property-retainer-25"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.btn} ${styles.btnGold}`}
                style={{ display: "block", textAlign: "center", textDecoration: "none" }}
              >
                Abrir Contrato — Asegure Su Caso Ahora &rarr;
              </a>
              <div className={styles.urgencyNote}>
                Actue ahora — las demoras pueden afectar la elegibilidad de su reclamo y el monto de recuperacion.
              </div>
              <button className={styles.restartBtn} onClick={restart}>Empezar de nuevo</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${progress}%` }} /></div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div><div className={styles.badge}>Louis Law Group · Calificador de Reclamos</div><h1>Evaluacion de Danos a Propiedad</h1></div>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.urgencyBanner}>Plazos y estatutos de limitaciones pueden aplicar. Actue ahora para proteger su reclamo completando este formulario.</div>

          {cur === 0 && (
            <div className={styles.trustBar}>
              <span>Consulta gratis</span>
              <span className={styles.trustDot} />
              <span>Sin costo a menos que ganemos</span>
              <span className={styles.trustDot} />
              <span>4,000+ reclamos presentados</span>
            </div>
          )}

          {/* Paso 0: Tipo de dano */}
          {cur === 0 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Pregunta 1 de 7</div>
              <div className={styles.question}>&iquest;Que tipo de dano ocurrio?</div>
              <div className={styles.hint}>Seleccione la causa principal de la perdida</div>
              <div className={styles.optsGrid}>
                {DAMAGE_LABELS.map((label, i) => (
                  <button key={i} className={`${styles.opt} ${answers[3] === i ? styles.selected : ""}`}
                    onClick={() => handlePickAndNext(3, i)}>
                    <span className={styles.optKey}>{String.fromCharCode(65 + i)}</span> {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Paso 1: Verificacion de propietario */}
          {cur === 1 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Pregunta 2 de 7</div>
              <div className={styles.question}>&iquest;Es usted el propietario del inmueble danado?</div>
              <div className={styles.hint}>Solo los propietarios pueden iniciar una disputa de reclamo de seguro</div>
              <div className={styles.opts}>
                <button className={`${styles.opt} ${answers[0] === true ? styles.selected : ""}`} onClick={() => handleOwner(true)}>
                  <span className={styles.optKey}>A</span> Si — soy el propietario
                </button>
                <button className={`${styles.opt} ${answers[0] === false ? styles.selected : ""}`} onClick={() => handleOwner(false)}>
                  <span className={styles.optKey}>B</span> No — soy inquilino u otra parte
                </button>
              </div>
            </div>
          )}

          {/* Paso 2: Verificacion Florida */}
          {cur === 2 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Pregunta 3 de 7</div>
              <div className={styles.question}>&iquest;El inmueble danado esta ubicado en Florida?</div>
              <div className={styles.hint}>Manejamos exclusivamente reclamos de seguros de propiedad en Florida</div>
              <div className={styles.opts}>
                <button className={`${styles.opt} ${answers[1] === true ? styles.selected : ""}`} onClick={() => handleFlorida(true)}>
                  <span className={styles.optKey}>A</span> Si — la propiedad esta en Florida
                </button>
                <button className={`${styles.opt} ${answers[1] === false ? styles.selected : ""}`} onClick={() => handleFlorida(false)}>
                  <span className={styles.optKey}>B</span> No — la propiedad esta fuera de Florida
                </button>
              </div>
            </div>
          )}

          {/* Paso 3: Compania de seguros */}
          {cur === 3 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Pregunta 4 de 7</div>
              <div className={styles.question}>&iquest;Cual es su compania de seguros?</div>
              <div className={styles.hint}>Busque o desplacese para encontrar su aseguradora</div>
              <div className={styles.ddWrap} ref={ddRef}>
                <input
                  className={styles.ddSearch}
                  placeholder="Escriba para buscar aseguradoras..."
                  value={ddQuery}
                  onChange={(e) => setDdQuery(e.target.value)}
                  onFocus={() => setDdOpen(true)}
                  autoComplete="off"
                />
                <div className={`${styles.ddList} ${ddOpen ? styles.open : ""}`}>
                  {filteredCarriers.length === 0
                    ? <div className={styles.ddEmpty}>No se encontraron aseguradoras</div>
                    : filteredCarriers.map((c) => (
                      <div key={c} className={`${styles.ddItem} ${carrier === c ? styles.ddItemActive : ""}`}
                        onClick={() => { setCarrier(c); setAnswer(2, c); setDdQuery(""); setDdOpen(false); trackEvent("qualify_step_answered", { case_type: "property-damage_es", step: 3, step_name: "carrier_select", answer: c }); }}>
                        {c}
                      </div>
                    ))
                  }
                </div>
                {carrier && (
                  <div className={`${styles.ddSelected} ${styles.show}`}>
                    <span>{carrier}</span>
                    <button className={styles.ddClear} onClick={() => { setCarrier(""); setAnswer(2, undefined); }}>&times;</button>
                  </div>
                )}
              </div>
              <button className={styles.btn} onClick={next} disabled={!carrier}>Continuar &rarr;</button>
            </div>
          )}

          {/* Paso 4: Fecha de perdida */}
          {cur === 4 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Pregunta 5 de 7</div>
              <div className={styles.question}>&iquest;Cuando ocurrio el dano?</div>
              <div className={styles.hint}>Seleccione la fecha exacta o aproximada de la perdida</div>
              <input type="date" className={styles.dateInput} value={dateVal} max={todayStr}
                onChange={(e) => handleDate(e.target.value)} />
              {dateNote.msg && <div className={`${styles.dateNote} ${dateNote.warn ? styles.dateWarn : ""}`}>{dateNote.msg}</div>}
              <button className={styles.btn} onClick={next} disabled={!dateVal || new Date(dateVal) > today}>Continuar &rarr;</button>
            </div>
          )}

          {/* Paso 5: Respuesta del asegurador */}
          {cur === 5 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Pregunta 6 de 7</div>
              <div className={styles.question}>&iquest;Que ha hecho su compania de seguros con su reclamo?</div>
              <div className={styles.hint}>Seleccione la opcion que mejor describe su situacion</div>
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

          {/* Paso 6: Informacion de contacto */}
          {cur === 6 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Ultimo paso</div>
              <div className={styles.question}>&iquest;Como podemos comunicarnos con usted?</div>
              <div className={styles.hint}>Un especialista en revision de casos se comunicara con usted dentro de 24 horas</div>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Nombre completo</label>
                  <input className={styles.input} placeholder="Juan Perez" value={contact.name}
                    onChange={(e) => { trackContactStart(); setContact((c) => ({ ...c, name: e.target.value })); }} />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Numero de telefono</label>
                  <input className={styles.input} placeholder="(954) 555-0100" value={contact.phone}
                    onChange={(e) => { trackContactStart(); setContact((c) => ({ ...c, phone: e.target.value })); }} />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Correo electronico</label>
                  <input className={styles.input} type="email" placeholder="juan@ejemplo.com" value={contact.email}
                    onChange={(e) => { trackContactStart(); setContact((c) => ({ ...c, email: e.target.value })); }} />
                </div>
              </div>
              <button className={`${styles.btn} ${styles.btnGold}`} onClick={handleSubmit}
                disabled={!contactComplete || submitting}>
                {submitting ? "Enviando..." : "Enviar para revision \u2192"}
              </button>
            </div>
          )}

        </div>

        <div className={styles.cardFooter}>
          <button className={styles.backBtn} onClick={back} style={{ visibility: cur > 0 && cur <= TOTAL_STEPS ? "visible" : "hidden" }}>
            &larr; Atras
          </button>
          <span className={styles.stepCounter}>{cur <= TOTAL_STEPS ? `Paso ${cur + 1} de 7` : ""}</span>
        </div>
      </div>

      <div className={styles.phoneCta}>
        &iquest;Prefiere hablar? Llame al <a href="tel:8336574812">(833) 657-4812</a> para una revision gratuita de su caso
      </div>
    </div>
  );
}
