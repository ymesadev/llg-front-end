"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./MobileExitIntent.module.css";
import { trackEvent } from "@/app/utils/analytics";

export default function MobileExitIntent({ intakeHref = "/ssdi/qualify", lang = "en", articleType = "property-damage" }) {
  const isES = lang === "es";
  const [show, setShow] = useState(false);
  const lastY = useRef(0);
  const lastT = useRef(0);
  const armed = useRef(false);
  const idleTimer = useRef(null);
  const returnPending = useRef(false);

  const headlines = {
    "ssdi": { en: "Wait — Don’t Leave Without Checking", es: "Espere — No se vaya sin verificar" },
    "property-damage": { en: "Your Claim Could Be Worth More", es: "Su reclamo podría valer más" },
    "personal-injury": { en: "Don’t Settle for Less Than You Deserve", es: "No acepte menos de lo que merece" },
    "contractor-damage": { en: "Contractor Did the Damage — They Should Pay", es: "El contratista causó el daño — deben pagar" },
    "warranty": { en: "Your Warranty Claim Doesn’t Have to Stay Denied", es: "Su reclamo de garantía puede ser apelado" },
    "case-law": { en: "Submit Your Policy for a Free Attorney Review", es: "Envíe su póliza para revisión gratuita" },
    "ahs": { en: "American Home Shield Claim Denied? You Have Options", es: "¿Le negaron su reclamo? Tiene opciones" },
    "privacy-tort": { en: "Your Privacy Rights May Have Been Violated", es: "Sus derechos de privacidad pueden haber sido violados" },
  };
  const subs = {
    "ssdi": { en: "67% of initial SSDI claims are denied. See if you qualify for benefits — free, takes 2 minutes.", es: "El 67% de las solicitudes iniciales son denegadas. Verifique si califica — gratis, toma 2 minutos." },
    "property-damage": { en: "Insurance companies underpay 8 out of 10 claims. A free case review takes 2 minutes and could recover thousands more.", es: "Las aseguradoras pagan menos en 8 de cada 10 reclamos. Una revisión gratuita toma 2 minutos." },
    "personal-injury": { en: "Injury victims with attorneys recover 3x more on average. Check if you have a case — free, 2 minutes.", es: "Las víctimas con abogados recuperan 3 veces más. Verifique si tiene un caso — gratis, 2 minutos." },
    "contractor-damage": { en: "Contractors carry liability insurance for exactly this. Free case review — takes 2 minutes.", es: "Los contratistas tienen seguro de responsabilidad para esto. Revisión gratuita en 2 minutos." },
    "warranty": { en: "Warranty companies routinely deny valid claims. An attorney can often reverse that denial — free review, 2 minutes.", es: "Las empresas de garantía niegan reclamos válidos. Revisión gratuita en 2 minutos." },
    "case-law": { en: "Our attorneys review insurance policies and denial letters free — response within 24 hours. Don’t leave without submitting yours.", es: "Revisamos pólizas y cartas de denegación gratis — respuesta en 24 horas." },
    "ahs": { en: "American Home Shield routinely denies valid warranty claims. An attorney review is free and takes 2 minutes.", es: "Las empresas de garantía niegan reclamos válidos. Revisión gratuita en 2 minutos." },
    "privacy-tort": { en: "Find out if your data privacy rights were violated and what compensation you may be owed — free, 2 minutes.", es: "Verifique si sus derechos de privacidad fueron violados y qué compensación puede recibir." },
  };

  const headline = (headlines[articleType] || headlines["property-damage"])[isES ? "es" : "en"];
  const sub = (subs[articleType] || subs["property-damage"])[isES ? "es" : "en"];

  useEffect(() => {
    if (sessionStorage.getItem("exitIntentShown")) return;

    // Arm after 5 seconds (was 8)
    const armTimer = setTimeout(() => { armed.current = true; }, 5000);

    const trigger = () => {
      if (sessionStorage.getItem("exitIntentShown")) return;
      sessionStorage.setItem("exitIntentShown", "1");
      setShow(true);
      trackEvent("exit_intent_shown", { type: "aggressive", articleType });
    };

    // ── MOBILE: rapid scroll-up (lowered threshold) ──
    const onScroll = () => {
      if (!armed.current) { lastY.current = window.scrollY; lastT.current = Date.now(); return; }
      const y = window.scrollY;
      const t = Date.now();
      const dy = lastY.current - y;
      const dt = t - lastT.current;
      // Trigger on 80px+ scroll-up in 500ms (was 150px in 400ms)
      if (dy > 80 && dt < 500 && lastY.current > 200) trigger();
      lastY.current = y;
      lastT.current = t;
    };

    // ── DESKTOP: mouse leaves viewport (top of screen) ──
    const onMouseLeave = (e) => {
      if (!armed.current) return;
      if (e.clientY <= 5) trigger();
    };

    // ── BOTH: idle for 30 seconds (user stopped engaging) ──
    const resetIdle = () => {
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        if (armed.current) trigger();
      }, 30000);
    };

    // ── BOTH: back button / tab switch ──
    const onVisibilityChange = () => {
      if (document.hidden && armed.current) {
        // Guard against duplicate listeners accumulating across multiple tab switches
        if (returnPending.current) return;
        returnPending.current = true;
        // User switched tabs or hit back — show when they return
        const onReturn = () => {
          returnPending.current = false;
          trigger();
          document.removeEventListener("visibilitychange", onReturn);
        };
        document.addEventListener("visibilitychange", onReturn);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("mousemove", resetIdle, { passive: true });
    window.addEventListener("touchstart", resetIdle, { passive: true });
    resetIdle();

    return () => {
      clearTimeout(armTimer);
      clearTimeout(idleTimer.current);
      returnPending.current = false;
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("touchstart", resetIdle);
    };
  }, [articleType]);

  if (!show) return null;

  const dismiss = () => {
    setShow(false);
    trackEvent("exit_intent_dismissed", { articleType });
  };

  return (
    <div className={styles.overlay} onClick={dismiss}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={dismiss} aria-label="Close">&times;</button>
        <div className={styles.badge}>Louis Law Group</div>
        <h2 className={styles.title}>{headline}</h2>
        <p className={styles.sub}>{sub}</p>
        <Link
          href={intakeHref}
          className={styles.cta}
          onClick={() => trackEvent("exit_intent_clicked", { href: intakeHref, articleType })}
        >
          {articleType === "case-law"
            ? (isES ? "Envíe Para Revisión Gratis \u2192" : "Submit for Review — Free \u2192")
            : (isES ? "Verifique Si Califica \u2192" : "See If You Qualify — Free \u2192")}
        </Link>
        <p className={styles.note}>{isES ? "Sin costo. Sin compromiso." : "No cost. No obligation. Takes 2 minutes."}</p>
        <button className={styles.dismiss} onClick={dismiss}>
          {isES ? "No gracias" : "No thanks, I'll figure it out myself"}
        </button>
      </div>
    </div>
  );
}
