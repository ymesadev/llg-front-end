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

  const headlines = {
    "ssdi": { en: "Wait — Don\u2019t Leave Without Checking", es: "Espere — No se vaya sin verificar" },
    "property-damage": { en: "Your Claim Could Be Worth More", es: "Su reclamo podr\u00eda valer m\u00e1s" },
    "personal-injury": { en: "Don\u2019t Settle for Less Than You Deserve", es: "No acepte menos de lo que merece" },
  };
  const subs = {
    "ssdi": { en: "67% of initial SSDI claims are denied. See if you qualify for benefits \u2014 free, takes 2 minutes.", es: "El 67% de las solicitudes iniciales son denegadas. Verifique si califica \u2014 gratis, toma 2 minutos." },
    "property-damage": { en: "Insurance companies underpay 8 out of 10 claims. A free case review takes 2 minutes and could recover thousands more.", es: "Las aseguradoras pagan menos en 8 de cada 10 reclamos. Una revisi\u00f3n gratuita toma 2 minutos." },
    "personal-injury": { en: "Injury victims with attorneys recover 3x more on average. Check if you have a case \u2014 free, 2 minutes.", es: "Las v\u00edctimas con abogados recuperan 3 veces m\u00e1s. Verifique si tiene un caso \u2014 gratis, 2 minutos." },
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
        // User switched tabs or hit back — show when they return
        const onReturn = () => {
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
          {isES ? "Verifique Si Califica \u2192" : "See If You Qualify — Free \u2192"}
        </Link>
        <p className={styles.note}>{isES ? "Sin costo. Sin compromiso." : "No cost. No obligation. Takes 2 minutes."}</p>
        <button className={styles.dismiss} onClick={dismiss}>
          {isES ? "No gracias" : "No thanks, I'll figure it out myself"}
        </button>
      </div>
    </div>
  );
}
