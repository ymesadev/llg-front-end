"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, X } from "lucide-react";
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
  "personal-injury":    "/personal-injury/qualify",
  "warranty":           "/warranty-claims/qualify",
  "privacy-tort":       "/privacy-torts",
  "case-law":           "/case-law-updates#submit-policy",
  "contractor-damage":  "/contractor-damage-claims/qualify",
};

function getPersonalizedMessage({ articleType, insurer, damageType, city }) {
  // Insurer-specific messaging takes priority
  if (insurer && articleType === "property-damage") {
    const insurerMessages = {
      "State Farm": `${insurer} denied your claim? We've fought them before — and won.`,
      "Allstate": `${insurer} lowballing your claim? We know their tactics.`,
      "Citizens": `${insurer} delayed or denied your claim? Florida law is on your side.`,
      "USAA": `${insurer} denied your claim? Even military families deserve a fair payout.`,
      "Nationwide": `${insurer} not on your side? We can help you fight back.`,
      "Progressive": `${insurer} undervaluing your damage? Get what you're owed.`,
    };
    if (insurerMessages[insurer]) return insurerMessages[insurer];
    return `${insurer} denied or underpaid your claim? We can help.`;
  }

  // Damage-type-specific messaging
  if (damageType && articleType === "property-damage") {
    const damageMessages = {
      "roof": "Roof damage claims have strict deadlines in Florida. Don't wait.",
      "water damage": "Water damage gets worse every day. Act before the insurer uses delay against you.",
      "fire damage": "Fire damage claims are complex. Insurers know that — and use it against you.",
      "hurricane": "Hurricane claim denied? Florida has some of the strongest policyholder protections.",
      "flood": "Flood damage claims have tight filing deadlines. Check your eligibility now.",
      "mold": "Mold claims are routinely denied. A strong legal strategy changes that.",
      "wind damage": "Wind damage claims are time-sensitive under Florida law.",
      "hail": "Hail damage often looks minor but costs thousands. Don't settle for less.",
      "sinkhole": "Sinkhole claims require specialized expertise. We handle them.",
      "pipe burst": "Pipe burst damage adds up fast. Don't let the insurer minimize your loss.",
    };
    if (damageMessages[damageType]) return damageMessages[damageType];
  }

  // City-specific messaging
  if (city && articleType === "property-damage") {
    return `Serving ${city} homeowners with denied or underpaid claims.`;
  }

  // Default per article type
  if (articleType === "ssdi") return "SSDI claims have strict deadlines. See if you qualify before time runs out.";
  if (articleType === "personal-injury") return "Injury claims have a statute of limitations. Don't wait to find out your rights.";

  return null;
}

// Stronger default per article type — concrete deadline + loss framing beats a vague "statute may apply"
const DEFAULT_HEADLINES = {
  "property-damage": "Every day you wait, your insurer keeps money that may be yours.",
  "ssdi": "SSDI back pay accrues from your filing date — waiting can cost you months of benefits.",
  "personal-injury": "Florida injury claims have a hard filing deadline. Miss it and your case is gone for good.",
  "warranty": "A denied warranty claim doesn't have to be the final answer — but deadlines apply.",
  "contractor-damage": "The contractor's liability insurer is hoping you wait too long to act.",
};

export default function UrgencyBanner({ articleType = "property-damage", small = false, insurer = null, damageType = null, city = null }) {
  const href = INTAKE_ROUTES[articleType] || "/property-damage-claims/qualify";
  const personalizedMsg = getPersonalizedMessage({ articleType, insurer, damageType, city });

  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("urgencyBannerDismissed") === "1") setDismissed(true);
  }, []);

  if (dismissed) return null;

  const headline = personalizedMsg || DEFAULT_HEADLINES[articleType] || "Statute of limitations may apply — don't wait.";
  const subtext = personalizedMsg
    ? "Free eligibility check — takes under 2 minutes, no obligation."
    : "See if you qualify — free eligibility check, takes under 2 minutes.";

  const dismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    sessionStorage.setItem("urgencyBannerDismissed", "1");
    setDismissed(true);
  };

  return (
    <Link href={href} className={`${styles.banner} ${small ? styles.small : ''}`}>
      <span className={styles.icon}><AlertTriangle size={18} strokeWidth={2} /></span>
      <span className={styles.text}>
        <strong>{headline}</strong>{" "}
        {subtext}
      </span>
      <span className={styles.cta}>See If You Qualify →</span>
      <button className={styles.dismiss} onClick={dismiss} aria-label="Dismiss" type="button">
        <X size={16} />
      </button>
    </Link>
  );
}
