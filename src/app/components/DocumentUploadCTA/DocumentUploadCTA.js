"use client";
import Link from "next/link";
import styles from "./DocumentUploadCTA.module.css";

const INTAKE_MAP = {
  "ssdi":               { href: "/ssdi/qualify",                                   headline: "Find Out If You Qualify for SSDI Benefits",         sub: "Answer 10 quick questions and get your eligibility score instantly — free, no obligation." },
  "property-damage":    { href: "/property-damage-claims/qualify",                  headline: "See If You Have a Strong Insurance Claim",           sub: "Take our 2-minute qualifier and find out if you're a strong candidate for representation — at no cost." },
  "personal-injury":    { href: "/personal-injury/qualify",                           headline: "Were You Injured? See If You Have a Case",           sub: "Take our 2-minute qualifier and find out if you may have a valid personal injury claim — at no cost." },
  "ahs":                { href: "/american-home-shield-privacy-torts/qualify",       headline: "See If You Qualify — American Home Shield Claim",    sub: "Find out in minutes if your American Home Shield warranty dispute qualifies for legal action." },
  "vuori":              { href: "/vuori-privacy-torts/qualify",                      headline: "See If You Qualify — Vuori Privacy Claim",           sub: "Check your eligibility for the Vuori data privacy lawsuit in under 2 minutes." },
  "kin":                { href: "/kin-insurance-privacy-torts/qualify",              headline: "See If You Qualify — Kin Insurance Claim",           sub: "Find out if your Kin Insurance dispute qualifies for legal representation — no upfront cost." },
  "slide":              { href: "/slide-insurance-privacy-torts/qualify",            headline: "See If You Qualify — Slide Insurance Claim",         sub: "Check your eligibility for the Slide Insurance case in under 2 minutes." },
  "tower-hill":         { href: "/tower-hill-insurance-privacy-torts/qualify",       headline: "See If You Qualify — Tower Hill Insurance Claim",    sub: "Find out if your Tower Hill Insurance dispute qualifies — free eligibility check." },
  "american-integrity": { href: "/american-integrity-insurance-privacy-torts/qualify", headline: "See If You Qualify — American Integrity Claim",   sub: "Check your eligibility for the American Integrity Insurance case — takes under 2 minutes." },
  "warranty":           { href: "/warranty-claims/qualify",                            headline: "Warranty Claim Denied? See If You Qualify",         sub: "Take our 2-minute qualifier and find out if your denied warranty or service-contract claim qualifies for representation — at no cost." },
  "privacy-tort":       { href: "/privacy-torts",                                       headline: "Your Privacy May Have Been Violated — Learn Your Rights", sub: "Find out if your data-privacy claim qualifies for legal action — review your options at no cost." },
  "contractor-damage":  { href: "/contractor-damage-claims/qualify",                    headline: "Contractor Damaged Your Property? See If You Have a Case", sub: "Take our 2-minute qualifier and find out if you qualify for compensation against a negligent contractor — free, no obligation." },
};

const INTAKE_MAP_ES = {
  "ssdi":            { href: "/ssdi/calificar",                headline: "Descubra Si Califica para Beneficios de SSDI",              sub: "Responda 10 preguntas rapidas y obtenga su puntuacion de elegibilidad al instante — gratis, sin compromiso." },
  "property-damage": { href: "/reclamos-propiedad/calificar",  headline: "Vea Si Tiene un Reclamo de Seguro Fuerte",                  sub: "Complete nuestro calificador de 2 minutos y descubra si es un candidato fuerte para representacion — sin costo." },
  "warranty":        { href: "/warranty-claims/qualify",       headline: "¿Le Negaron su Reclamo de Garantía? Vea Si Califica",       sub: "Complete nuestro calificador de 2 minutos y descubra si su reclamo de garantía negado califica para representación — sin costo." },
};

function getPersonalizedHeadline({ insurer, damageType, city, baseHeadline }) {
  if (insurer) {
    return `${insurer} Denied Your Claim? See If You Have a Case`;
  }
  if (damageType) {
    const dt = damageType.charAt(0).toUpperCase() + damageType.slice(1);
    return `${dt} Claim Denied or Underpaid? Check Your Options`;
  }
  if (city) {
    return `${city} Homeowner? See If You Have a Strong Claim`;
  }
  return baseHeadline;
}

function getPersonalizedSub({ insurer, damageType, city, baseSub }) {
  if (insurer) {
    return `We've handled hundreds of ${insurer} disputes. Find out in 2 minutes if you qualify for representation — at no cost.`;
  }
  if (damageType) {
    return `${damageType.charAt(0).toUpperCase() + damageType.slice(1)} claims require fast action. Take our 2-minute qualifier — free, no obligation.`;
  }
  if (city) {
    return `We represent ${city} homeowners against insurance companies. See if you qualify — free, takes under 2 minutes.`;
  }
  return baseSub;
}

export default function DocumentUploadCTA({ articleType = "property-damage", lang = "en", insurer = null, damageType = null, city = null }) {
  const isSpanish = lang === "es";
  const map = isSpanish ? INTAKE_MAP_ES : INTAKE_MAP;
  const config = map[articleType] || (isSpanish ? INTAKE_MAP_ES["property-damage"] : INTAKE_MAP["property-damage"]);

  // Personalize headline/sub for property-damage English articles
  const shouldPersonalize = !isSpanish && articleType === "property-damage" && (insurer || damageType || city);
  const headline = shouldPersonalize
    ? getPersonalizedHeadline({ insurer, damageType, city, baseHeadline: config.headline })
    : config.headline;
  const sub = shouldPersonalize
    ? getPersonalizedSub({ insurer, damageType, city, baseSub: config.sub })
    : config.sub;

  const btnText = isSpanish
    ? "Vea Si Califica — Evaluacion Gratis \u2192"
    : "See If You Qualify — Free Eligibility Check \u2192";
  const disclaimer = isSpanish
    ? "Sin costo a menos que ganemos \u00B7 Toma menos de 2 minutos \u00B7 Sin compromiso"
    : "No fees unless we win \u00B7 Takes under 2 minutes \u00B7 No obligation";

  return (
    <Link href={config.href} className={styles.ctaBox}>
      <div className={styles.inner}>
        <h3 className={styles.headline}>{headline}</h3>
        <p className={styles.subtitle}>{sub}</p>
        <span className={styles.btn}>
          {btnText}
        </span>
        <p className={styles.disclaimer}>{disclaimer}</p>
      </div>
    </Link>
  );
}
