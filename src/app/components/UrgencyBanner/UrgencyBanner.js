"use client";
import styles from "./UrgencyBanner.module.css";

/**
 * UrgencyBanner — shown at the top of qualify pages
 * Reminds visitors of the legal deadline to increase form completion.
 */
export default function UrgencyBanner({ caseType = "this case" }) {
  return (
    <div className={styles.banner}>
      <span className={styles.icon}>⚠️</span>
      <span className={styles.text}>
        <strong>Statute of limitations may apply.</strong>{" "}
        Complete your free case evaluation today to protect your rights.
      </span>
    </div>
  );
}
