"use client";
import Link from "next/link";
import styles from "./DocumentUploadCTA.module.css";

const INTAKE_MAP = {
  "ssdi":               { href: "/ssdi/qualify",                                   headline: "Find Out If You Qualify for SSDI Benefits",         sub: "Answer 10 quick questions and get your eligibility score instantly — free, no obligation." },
  "property-damage":    { href: "/property-damage-claims/qualify",                  headline: "See If You Have a Strong Insurance Claim",           sub: "Take our 2-minute qualifier and find out if you're a strong candidate for representation — at no cost." },
  "ahs":                { href: "/american-home-shield-privacy-torts/qualify",       headline: "See If You Qualify — American Home Shield Claim",    sub: "Find out in minutes if your American Home Shield warranty dispute qualifies for legal action." },
  "vuori":              { href: "/vuori-privacy-torts/qualify",                      headline: "See If You Qualify — Vuori Privacy Claim",           sub: "Check your eligibility for the Vuori data privacy lawsuit in under 2 minutes." },
  "kin":                { href: "/kin-insurance-privacy-torts/qualify",              headline: "See If You Qualify — Kin Insurance Claim",           sub: "Find out if your Kin Insurance dispute qualifies for legal representation — no upfront cost." },
  "slide":              { href: "/slide-insurance-privacy-torts/qualify",            headline: "See If You Qualify — Slide Insurance Claim",         sub: "Check your eligibility for the Slide Insurance case in under 2 minutes." },
  "tower-hill":         { href: "/tower-hill-insurance-privacy-torts/qualify",       headline: "See If You Qualify — Tower Hill Insurance Claim",    sub: "Find out if your Tower Hill Insurance dispute qualifies — free eligibility check." },
  "american-integrity": { href: "/american-integrity-insurance-privacy-torts/qualify", headline: "See If You Qualify — American Integrity Claim",   sub: "Check your eligibility for the American Integrity Insurance case — takes under 2 minutes." },
};

const INTAKE_MAP_ES = {
  "ssdi":            { href: "/ssdi/calificar",                headline: "Descubra Si Califica para Beneficios de SSDI",              sub: "Responda 10 preguntas rapidas y obtenga su puntuacion de elegibilidad al instante — gratis, sin compromiso." },
  "property-damage": { href: "/reclamos-propiedad/calificar",  headline: "Vea Si Tiene un Reclamo de Seguro Fuerte",                  sub: "Complete nuestro calificador de 2 minutos y descubra si es un candidato fuerte para representacion — sin costo." },
};

export default function DocumentUploadCTA({ articleType = "property-damage", lang = "en" }) {
  const isSpanish = lang === "es";
  const map = isSpanish ? INTAKE_MAP_ES : INTAKE_MAP;
  const config = map[articleType] || (isSpanish ? INTAKE_MAP_ES["property-damage"] : INTAKE_MAP["property-damage"]);

  const btnText = isSpanish
    ? "Vea Si Califica — Evaluacion Gratis \u2192"
    : "See If You Qualify — Free Eligibility Check \u2192";
  const disclaimer = isSpanish
    ? "Sin costo a menos que ganemos \u00B7 Toma menos de 2 minutos \u00B7 Sin compromiso"
    : "No fees unless we win \u00B7 Takes under 2 minutes \u00B7 No obligation";

  return (
    <Link href={config.href} className={styles.ctaBox}>
      <div className={styles.inner}>
        <h3 className={styles.headline}>{config.headline}</h3>
        <p className={styles.subtitle}>{config.sub}</p>
        <span className={styles.btn}>
          {btnText}
        </span>
        <p className={styles.disclaimer}>{disclaimer}</p>
      </div>
    </Link>
  );
}
