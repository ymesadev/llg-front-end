"use client";

import { useState, useEffect, useRef } from "react";
import styles from "../qualify/page.module.css";
import { trackEvent } from "@/app/utils/analytics";

const TOTAL_STEPS = 9;

const DQ_MESSAGES = {
  benefits: {
    title: "Actualmente recibe beneficios",
    msg: "Usted actualmente recibe SSDI o SSI. Si cree que el monto de su beneficio es incorrecto o ha sido cancelado injustamente, llame a nuestra oficina directamente — esa situacion puede calificar para un tipo diferente de representacion.",
  },
  terminated_fraud: {
    title: "Beneficios cancelados — fraude o incumplimiento",
    msg: "Los beneficios de discapacidad del Seguro Social cancelados por fraude o incumplimiento del programa crean una barrera legal significativa para volver a solicitar. No podemos tomar este caso. Le recomendamos consultar directamente con un representante del SSA.",
  },
  working: {
    title: "Actualmente trabaja por encima del SGA",
    msg: "El SSA define la Actividad Lucrativa Sustancial (SGA) en aproximadamente $1,550/mes bruto. Ganar por encima de este umbral lo descalifica del SSDI. Debe reducir su trabajo por debajo del SGA antes de poder presentar una solicitud viable.",
  },
  age: {
    title: "Pasada la edad de jubilacion completa",
    msg: "A los 65 anos o mas, los beneficios de SSDI se convierten automaticamente en beneficios de jubilacion del Seguro Social. Las solicitudes de SSDI ya no estan disponibles en esta etapa. Contacte al SSA directamente al 1-800-772-1213 para discutir sus beneficios de jubilacion.",
  },
  credits: {
    title: "Creditos de trabajo insuficientes",
    msg: "SSDI requiere suficientes trimestres de trabajo — generalmente 5 de los ultimos 10 anos. Sin historial laboral o con historial minimo, SSDI no esta disponible. Sin embargo, podria calificar para SSI (Seguridad de Ingreso Suplementario), que no requiere creditos de trabajo. Le recomendamos contactar al SSA para explorar elegibilidad para SSI.",
  },
  nomedical: {
    title: "Sin documentacion medica",
    msg: "Los registros medicos de un proveedor tratante son la base de cualquier reclamo de SSDI. El SSA requiere evidencia documentada de su condicion incapacitante. Sin disposicion para buscar atencion medica, no podemos construir un caso viable en su nombre.",
  },
  duration: {
    title: "Duracion de discapacidad menor a 12 meses",
    msg: "SSDI requiere que su discapacidad haya durado o se espere que dure al menos 12 meses continuos, o sea terminal. Una condicion a corto plazo que no se espera que continue no cumple con el requisito de duracion del SSA. Puede volver a solicitar una vez que la condicion haya persistido por 12 meses.",
  },
  attorney: {
    title: "Abogado activo — sin carta de liberacion",
    msg: "Usted actualmente esta representado por un abogado en este reclamo de SSDI y no tiene una liberacion firmada. Estamos eticamente prohibidos de asumir representacion mientras otro abogado esta activamente en su caso. Por favor obtenga una liberacion por escrito de su abogado actual antes de contactarnos.",
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

export default function SSDICalificar() {
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState({});
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [scoreBarWidth, setScoreBarWidth] = useState(0);

  const SSDI_STEP_NAMES = { 0: "receiving_benefits", 1: "prior_terminated", 2: "currently_working", 3: "age", 4: "work_credits", 5: "medical_provider", "5b": "medical_commitment", 6: "disability_duration", 7: "current_attorney", "7b": "attorney_release", 8: "prior_denials", 9: "contact_info" };

  useEffect(() => {
    if (cur !== "result" && SSDI_STEP_NAMES[cur]) {
      trackEvent("qualify_step_viewed", { case_type: "ssdi_es", step: cur, step_name: SSDI_STEP_NAMES[cur] });
    }
  }, [cur]);

  const curRef = useRef(cur);
  const resultRef = useRef(result);
  const answersRef = useRef(answers);
  useEffect(() => { curRef.current = cur; }, [cur]);
  useEffect(() => { resultRef.current = result; }, [result]);
  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => {
    trackEvent("qualify_page_view", { case_type: "ssdi_es" });
    const handleExit = () => {
      if (!resultRef.current && curRef.current !== "result") {
        trackEvent("qualify_abandoned", {
          case_type: "ssdi_es",
          last_step: curRef.current,
          last_step_name: SSDI_STEP_NAMES[curRef.current],
          answers_given: Object.keys(answersRef.current).length,
        });
      }
    };
    window.addEventListener("beforeunload", handleExit);
    return () => window.removeEventListener("beforeunload", handleExit);
  }, []);

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
    trackEvent("qualify_step_answered", { case_type: "ssdi_es", step: cur, step_name: SSDI_STEP_NAMES[cur], answer_key: key, answer: val });
    setTimeout(() => go(next), delay);
  };

  const dq = (reason) => {
    trackEvent("qualify_step_answered", { case_type: "ssdi_es", step: cur, step_name: SSDI_STEP_NAMES[cur], answer: "disqualified", disqualified: true, dq_reason: reason });
    trackEvent("qualify_disqualified", { case_type: "ssdi_es", reason, step: cur, step_name: SSDI_STEP_NAMES[cur] });
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
        body: JSON.stringify({ ...contact, answers, score, source: "ssdi-calificar-es" }),
      });
    } catch {/* silent */}
    trackEvent("qualify_submitted", { case_type: "ssdi_es", score });
    if (window.__or_identify) {
      window.__or_identify(contact.email, { name: contact.name, phone: contact.phone, case_type: "ssdi_es", score });
    }
    setResult({ dq: false, score });
    setCur("result");
    setSubmitting(false);
  };

  const restart = () => {
    setAnswers({}); setContact({ name: "", phone: "", email: "" });
    setHistory([]); setResult(null); setScoreBarWidth(0); setCur(0);
  };

  const contactOk = contact.name.trim() && contact.phone.trim() && contact.email.includes("@");
  const contactStartedRef = useRef(false);
  const trackContactStart = () => {
    if (!contactStartedRef.current) {
      contactStartedRef.current = true;
      trackEvent("qualify_step_answered", { case_type: "ssdi_es", step: 9, step_name: "contact_info", answer: "started_typing" });
    }
  };

  // Result screen
  if (result && cur === "result") {
    if (result.dq) {
      const d = DQ_MESSAGES[result.reason] || { title: "No elegible", msg: "Basado en sus respuestas, no podemos tomar su caso en este momento." };
      return (
        <div className={styles.wrapper}>
          <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: "100%" }} /></div>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div><div className={styles.badge}>Louis Law Group · Calificador SSDI</div><h1>Evaluacion del Caso</h1></div>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.resultWrap}>
                <div className={`${styles.resultIcon} ${styles.iconRed}`}>&#10005;</div>
                <div className={styles.dqBadge}>Descalificado</div>
                <div className={styles.resultTitle}>{d.title}</div>
                <div className={styles.resultSub}>{d.msg}</div>
                <button className={styles.restartBtn} onClick={restart}>&larr; Empezar de nuevo</button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const { score } = result;
    const isStrong = score >= 68, isPossible = score >= 42;
    const iconClass = isStrong ? styles.iconGreen : isPossible ? styles.iconYellow : styles.iconRed;
    const iconChar = isStrong ? "\u2713" : isPossible ? "~" : "!";
    const title = isStrong ? "Candidato fuerte para SSDI" : isPossible ? "Caso potencialmente calificable" : "Puede enfrentar desafios de elegibilidad";
    const sub = isStrong
      ? "Hemos recibido su solicitud y la revisaremos lo antes posible. Para evitar demoras en la revision de su caso de SSDI, programe su consulta gratuita ahora — mientras mas rapido lo haga, mas rapido podremos comenzar a proteger su reclamo."
      : isPossible
      ? "Hemos recibido su solicitud y la revisaremos lo antes posible. Para evitar demoras en la revision de su caso, programe su consulta gratuita ahora para que nuestro equipo pueda comenzar a trabajar en su expediente de inmediato."
      : "Hemos recibido su solicitud. Para evitar demoras, programe su consulta gratuita ahora y un especialista revisara su expediente y se comunicara con usted para discutir sus opciones.";
    const barColor = isStrong ? "#4caf50" : isPossible ? "#ffb800" : "#e57373";

    const tags = [];
    const ageLabels = { under50: "Menor de 50", "50to59": "Edad 50-59", "60to64": "Edad 60-64" };
    if (answers.age) tags.push({ label: ageLabels[answers.age] || "Edad anotada", cls: styles.tagGreen });
    if (answers.credits === "strong") tags.push({ label: "Creditos laborales: fuertes", cls: styles.tagGreen });
    if (answers.credits === "limited") tags.push({ label: "Creditos laborales: limitados", cls: styles.tagYellow });
    if (answers.medical === "yes") tags.push({ label: "Atencion medica activa", cls: styles.tagGreen });
    if (answers.medical === "committed") tags.push({ label: "Buscara tratamiento", cls: styles.tagYellow });
    if (answers.duration === "12plus" || answers.duration === "terminal") tags.push({ label: "Duracion 12+ meses", cls: styles.tagGreen });
    if (answers.duration === "borderline") tags.push({ label: "Duracion limite", cls: styles.tagYellow });
    if (answers.terminated === "medical") tags.push({ label: "Cancelacion previa: medica", cls: styles.tagYellow });
    if (answers.denial === "denied_in_window") tags.push({ label: "Ventana de apelacion abierta", cls: styles.tagGreen });
    if (answers.denial === "multiple") tags.push({ label: "Multiples negaciones", cls: styles.tagYellow });
    if (answers.denial === "denied_expired") tags.push({ label: "Riesgo de plazo de apelacion", cls: styles.tagRed });
    if (answers.denial === "first_app") tags.push({ label: "Primera solicitud", cls: styles.tagGreen });
    if (answers.working === "below_sga") tags.push({ label: "Debajo del SGA", cls: styles.tagYellow });

    return (
      <div className={styles.wrapper}>
        <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: "100%" }} /></div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div><div className={styles.badge}>Louis Law Group · Calificador SSDI</div><h1>Evaluacion del Caso</h1></div>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.resultWrap}>
              <div className={`${styles.resultIcon} ${iconClass}`}>{iconChar}</div>
              <div className={styles.resultTitle}>{title}</div>
              <div className={styles.scoreLabel}>Puntuacion de calificacion: {score} / 100</div>
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
                href="https://api.leadconnectorhq.com/widget/booking/c0DwL4k89z31qsfAFmJv"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.btn} ${styles.btnGold}`}
                style={{ display: "block", textAlign: "center", textDecoration: "none" }}
              >
                Programar Consulta Gratuita &rarr;
              </a>
              <div className={styles.urgencyNote}>
                Actue ahora — los plazos de SSDI son estrictos. Las demoras pueden poner en riesgo su ventana de apelacion.
              </div>
              <button className={styles.restartBtn} onClick={restart}>Empezar de nuevo</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step renderer
  return (
    <div className={styles.wrapper}>
      <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${progress}%` }} /></div>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div><div className={styles.badge}>Louis Law Group · Calificador SSDI</div><h1>Evaluacion de Caso SSDI</h1></div>
        </div>

        <div className={styles.cardBody}>

          {/* Paso 0: Recibe beneficios actualmente */}
          {cur === 0 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Calificador de Reclamo SSDI — Louis Law Group</div>
              <div className={styles.question}>&iquest;Actualmente recibe beneficios de discapacidad del Seguro Social?</div>
              <div className={styles.hint}>SSDI o SSI — cualquiera aplica a esta pregunta</div>
              <div className={styles.opts}>
                <button className={styles.opt} onClick={() => { trackEvent("qualify_step_answered", { case_type: "ssdi_es", step: 0, step_name: "receiving_benefits", answer: "no" }); setTimeout(() => go(1), 320); }}>
                  <span className={styles.optKey}>A</span> No — actualmente no recibo beneficios
                </button>
                <button className={styles.opt} onClick={() => { setTimeout(() => dq("benefits"), 320); }}>
                  <span className={styles.optKey}>B</span> Si — actualmente recibo SSDI o SSI
                </button>
              </div>
            </div>
          )}

          {/* Paso 1: Beneficios cancelados previamente */}
          {cur === 1 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Pregunta 2 de 10</div>
              <div className={styles.question}>&iquest;Alguna vez le cancelaron los beneficios del Seguro Social?</div>
              <div className={styles.hint}>Beneficios previos de SSDI o SSI que fueron detenidos posteriormente</div>
              <div className={styles.opts}>
                <button className={styles.opt} onClick={() => pick("terminated", "none", 2)}>
                  <span className={styles.optKey}>A</span> No — nunca he recibido beneficios
                </button>
                <button className={styles.opt} onClick={() => pick("terminated", "medical", 2)}>
                  <span className={styles.optKey}>B</span> Si — cancelados por mejoria medica
                </button>
                <button className={styles.opt} onClick={() => { setTimeout(() => dq("terminated_fraud"), 320); }}>
                  <span className={styles.optKey}>C</span> Si — cancelados por fraude o incumplimiento
                </button>
                <button className={styles.opt} onClick={() => pick("terminated", "other", 2)}>
                  <span className={styles.optKey}>D</span> Si — cancelados por otra razon
                </button>
              </div>
            </div>
          )}

          {/* Paso 2: Trabaja actualmente */}
          {cur === 2 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Pregunta 3 de 10</div>
              <div className={styles.question}>&iquest;Actualmente esta trabajando?</div>
              <div className={styles.hint}>La Actividad Lucrativa Sustancial (SGA) es ~$1,550/mes bruto en 2024</div>
              <div className={styles.opts}>
                <button className={styles.opt} onClick={() => pick("working", "no", 3)}>
                  <span className={styles.optKey}>A</span> No — no estoy trabajando
                </button>
                <button className={styles.opt} onClick={() => pick("working", "below_sga", 3)}>
                  <span className={styles.optKey}>B</span> Si, pero gano por debajo del umbral SGA (medio tiempo / minimo)
                </button>
                <button className={styles.opt} onClick={() => { setTimeout(() => dq("working"), 320); }}>
                  <span className={styles.optKey}>C</span> Si — tiempo completo o por encima del limite SGA (~$1,550/mes)
                </button>
              </div>
            </div>
          )}

          {/* Paso 3: Edad */}
          {cur === 3 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Pregunta 4 de 10</div>
              <div className={styles.question}>&iquest;Cual es su edad actual?</div>
              <div className={styles.hint}>SSDI se convierte en beneficios de jubilacion a la edad de jubilacion completa (65)</div>
              <div className={styles.opts}>
                <button className={styles.opt} onClick={() => pick("age", "under50", 4)}>
                  <span className={styles.optKey}>A</span> Menor de 50
                </button>
                <button className={styles.opt} onClick={() => pick("age", "50to59", 4)}>
                  <span className={styles.optKey}>B</span> 50 – 59
                </button>
                <button className={styles.opt} onClick={() => pick("age", "60to64", 4)}>
                  <span className={styles.optKey}>C</span> 60 – 64
                </button>
                <button className={styles.opt} onClick={() => { setTimeout(() => dq("age"), 320); }}>
                  <span className={styles.optKey}>D</span> 65 o mayor
                </button>
              </div>
            </div>
          )}

          {/* Paso 4: Creditos de trabajo */}
          {cur === 4 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Pregunta 5 de 10</div>
              <div className={styles.question}>&iquest;Ha trabajado y contribuido al Seguro Social?</div>
              <div className={styles.hint}>SSDI generalmente requiere 5 de los ultimos 10 anos de creditos laborales</div>
              <div className={styles.opts}>
                <button className={styles.opt} onClick={() => pick("credits", "strong", 5)}>
                  <span className={styles.optKey}>A</span> Si — tengo un historial laboral consistente
                </button>
                <button className={styles.opt} onClick={() => pick("credits", "limited", 5)}>
                  <span className={styles.optKey}>B</span> Algo de historial laboral, pero limitado o interrumpido
                </button>
                <button className={styles.opt} onClick={() => { setTimeout(() => dq("credits"), 320); }}>
                  <span className={styles.optKey}>C</span> No — tengo poco o ningun historial laboral
                </button>
              </div>
            </div>
          )}

          {/* Paso 5: Proveedor medico */}
          {cur === 5 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Pregunta 6 de 10</div>
              <div className={styles.question}>&iquest;Actualmente ve a un proveedor medico por su condicion?</div>
              <div className={styles.hint}>Los registros medicos son la base de todo reclamo de SSDI</div>
              <div className={styles.opts}>
                <button className={styles.opt} onClick={() => pick("medical", "yes", 6)}>
                  <span className={styles.optKey}>A</span> Si — estoy viendo activamente a un doctor o especialista
                </button>
                <button className={styles.opt} onClick={() => pick("medical", "willing", "5b")}>
                  <span className={styles.optKey}>B</span> No — pero estoy dispuesto a comenzar tratamiento
                </button>
                <button className={styles.opt} onClick={() => { setTimeout(() => dq("nomedical"), 320); }}>
                  <span className={styles.optKey}>C</span> No — y no tengo intencion de ver a un proveedor
                </button>
              </div>
            </div>
          )}

          {/* Paso 5b: Seguimiento de intencion medica */}
          {cur === "5b" && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Pregunta 6b de 10</div>
              <div className={styles.question}>&iquest;Se compromete a ver a un proveedor medico antes o durante el reclamo?</div>
              <div className={styles.hint}>Sin historial medico documentado no podemos construir un caso viable</div>
              <div className={styles.opts}>
                <button className={styles.opt} onClick={() => pick("medical", "committed", 6)}>
                  <span className={styles.optKey}>A</span> Si — programare una cita
                </button>
                <button className={styles.opt} onClick={() => { setTimeout(() => dq("nomedical"), 320); }}>
                  <span className={styles.optKey}>B</span> No — prefiero no buscar tratamiento medico
                </button>
              </div>
            </div>
          )}

          {/* Paso 6: Duracion de la discapacidad */}
          {cur === 6 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Pregunta 7 de 10</div>
              <div className={styles.question}>&iquest;Cuanto tiempo ha estado sin poder trabajar debido a su condicion?</div>
              <div className={styles.hint}>SSDI requiere que la discapacidad dure 12+ meses o sea terminal</div>
              <div className={styles.opts}>
                <button className={styles.opt} onClick={() => { setTimeout(() => dq("duration"), 320); }}>
                  <span className={styles.optKey}>A</span> Menos de 12 meses — y no se espera que empeore o continue
                </button>
                <button className={styles.opt} onClick={() => pick("duration", "borderline", 7)}>
                  <span className={styles.optKey}>B</span> Menos de 12 meses — pero se espera que continue mas de 12 meses
                </button>
                <button className={styles.opt} onClick={() => pick("duration", "12plus", 7)}>
                  <span className={styles.optKey}>C</span> Mas de 12 meses
                </button>
                <button className={styles.opt} onClick={() => pick("duration", "terminal", 7)}>
                  <span className={styles.optKey}>D</span> Mi condicion es terminal o permanente
                </button>
              </div>
            </div>
          )}

          {/* Paso 7: Abogado actual */}
          {cur === 7 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Pregunta 8 de 10</div>
              <div className={styles.question}>&iquest;Actualmente tiene un abogado para este reclamo de SSDI?</div>
              <div className={styles.hint}>Un abogado activo requiere una liberacion firmada antes de poder representarlo</div>
              <div className={styles.opts}>
                <button className={styles.opt} onClick={() => pick("attorney", "none", 8)}>
                  <span className={styles.optKey}>A</span> No — no tengo abogado
                </button>
                <button className={styles.opt} onClick={() => pick("attorney", "active", "7b")}>
                  <span className={styles.optKey}>B</span> Si — actualmente tengo un abogado
                </button>
                <button className={styles.opt} onClick={() => pick("attorney", "former", 8)}>
                  <span className={styles.optKey}>C</span> Tenia un abogado pero esa relacion ha terminado
                </button>
              </div>
            </div>
          )}

          {/* Paso 7b: Liberacion del abogado */}
          {cur === "7b" && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Pregunta 8b de 10</div>
              <div className={styles.question}>&iquest;Tiene una liberacion firmada de su abogado actual?</div>
              <div className={styles.hint}>Estamos eticamente prohibidos de representar a un cliente sin una liberacion</div>
              <div className={styles.opts}>
                <button className={styles.opt} onClick={() => pick("release", "yes", 8)}>
                  <span className={styles.optKey}>A</span> Si — tengo una liberacion firmada
                </button>
                <button className={styles.opt} onClick={() => { setTimeout(() => dq("attorney"), 320); }}>
                  <span className={styles.optKey}>B</span> No — no tengo una liberacion
                </button>
              </div>
            </div>
          )}

          {/* Paso 8: Negaciones previas */}
          {cur === 8 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Pregunta 9 de 10</div>
              <div className={styles.question}>&iquest;Su reclamo de SSDI ha sido negado previamente?</div>
              <div className={styles.hint}>La mayoria de las aprobaciones ocurren en la etapa de apelacion — una negacion no es el final</div>
              <div className={styles.opts}>
                <button className={styles.opt} onClick={() => pick("denial", "first_app", 9)}>
                  <span className={styles.optKey}>A</span> No — esta es mi primera solicitud
                </button>
                <button className={styles.opt} onClick={() => pick("denial", "denied_in_window", 9)}>
                  <span className={styles.optKey}>B</span> Negado una vez — aun dentro de la ventana de 60 dias para apelar
                </button>
                <button className={styles.opt} onClick={() => pick("denial", "denied_expired", 9)}>
                  <span className={styles.optKey}>C</span> Negado una vez — la ventana de apelacion puede haber pasado
                </button>
                <button className={styles.opt} onClick={() => pick("denial", "multiple", 9)}>
                  <span className={styles.optKey}>D</span> Negado multiples veces / a nivel de audiencia
                </button>
                <button className={styles.opt} onClick={() => pick("denial", "pending", 9)}>
                  <span className={styles.optKey}>E</span> Pendiente — aun sin decision
                </button>
              </div>
            </div>
          )}

          {/* Paso 9: Informacion de contacto */}
          {cur === 9 && (
            <div className={styles.step}>
              <div className={styles.stepLabel}>Ultimo paso</div>
              <div className={styles.question}>&iquest;Como podemos comunicarnos con usted?</div>
              <div className={styles.hint}>Un especialista en revision de casos se comunicara con usted dentro de 24 horas</div>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Nombre completo</label>
                  <input className={styles.input} type="text" autoComplete="name" placeholder="Juan Perez" value={contact.name}
                    onChange={(e) => { trackContactStart(); setContact((c) => ({ ...c, name: e.target.value })); }} />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Numero de telefono</label>
                  <input className={styles.input} type="tel" inputMode="tel" autoComplete="tel" placeholder="(954) 555-0100" value={contact.phone}
                    onChange={(e) => { trackContactStart(); setContact((c) => ({ ...c, phone: e.target.value })); }} />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Correo electronico</label>
                  <input className={styles.input} type="email" inputMode="email" autoComplete="email" placeholder="juan@ejemplo.com" value={contact.email}
                    onChange={(e) => { trackContactStart(); setContact((c) => ({ ...c, email: e.target.value })); }} />
                </div>
              </div>
              <button className={`${styles.btn} ${styles.btnGold}`} onClick={handleSubmit}
                disabled={!contactOk || submitting}>
                {submitting ? "Enviando..." : "Enviar para revision \u2192"}
              </button>
            </div>
          )}

        </div>

        <div className={styles.cardFooter}>
          <button className={styles.backBtn} onClick={back}
            style={{ visibility: history.length > 0 && cur !== "result" ? "visible" : "hidden" }}>
            &larr; Atras
          </button>
          <span className={styles.stepCounter}>
            {cur !== "result" ? `Paso ${stepCount[cur] || ""} de 10` : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
