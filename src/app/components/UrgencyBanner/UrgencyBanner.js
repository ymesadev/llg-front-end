"use client";
import Link from "next/link";
import styles from "./UrgencyBanner.module.css";

const INTAKE_ROUTES = {
  "ssdi":               "/ssdi/qualify",
  "property-damage":    "/property-damage-claims/qualify",
  "ahs":                "/american-home-shield-privacy-torts/qualify",
  "vuori":              "/vuori-privacy-torts/qualify",
  "kin":                "/kin-insurance-privacy-torts/qualify",
  "slide":              "/slide-insurance-privacy-torts/qualify",
  "tower-hill":         "/tower-hill-insurance-privacy-torts/qualify",
  "american-integrity": "/american-integrity-insurance-privacy-torts/qualify",
};

export default function UrgencyBanner({ articleType = "property-damage", small = false }) {
  const href = INTAKE_ROUTES[articleType] || "/property-damage-claims/qualify";

  return (
    <Link href={href} className={`${styles.banner} ${small ? styles.small : ''}`}>
      <span className={styles.icon}>⚠️</span>
      <span className={styles.text}>
        <strong>Statute of limitations may apply.</strong>{" "}
        See if you qualify — free eligibility check, takes under 2 minutes.
      </span>
      <span className={styles.cta}>See If You Qualify →</span>
    </Link>
  );
}
