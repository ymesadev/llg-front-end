"use client";
import styles from "./UrgencyBanner.module.css";

/**
 * UrgencyBanner — shown at the top of qualify pages
 * Reminds visitors of the legal deadline to increase form completion.
 */
export default function UrgencyBanner({ caseType = "this case", small = false }) {
  return (
    <a href="sms:8336574812" className={`${styles.banner} ${small ? styles.small : ''}`}>
      <span className={styles.icon}>⚠️</span>
      <span className={styles.text}>
        <strong>Statute of limitations may apply.</strong>{" "}
        Text us now for a free case evaluation — protect your rights today.
      </span>
    </a>
  );
}
