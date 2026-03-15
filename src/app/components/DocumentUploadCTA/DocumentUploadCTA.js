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

export default function DocumentUploadCTA({ articleType = "property-damage" }) {
  const config = INTAKE_MAP[articleType] || INTAKE_MAP["property-damage"];

  return (
    <div className={styles.ctaBox}>
      <div className={styles.inner}>
        <h3 className={styles.headline}>{config.headline}</h3>
        <p className={styles.subtitle}>{config.sub}</p>
        <Link href={config.href} className={styles.btn}>
          See If You Qualify — Free Eligibility Check →
        </Link>
        <p className={styles.disclaimer}>No fees unless we win · Takes under 2 minutes · No obligation</p>
      </div>
    </div>
  );
}
