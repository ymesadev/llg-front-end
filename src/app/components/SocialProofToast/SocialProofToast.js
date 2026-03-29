"use client";

import { useState, useEffect } from "react";
import styles from "./SocialProofToast.module.css";
import { trackEvent } from "@/app/utils/analytics";

export default function SocialProofToast() {
  const [show, setShow] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("proofToast")) return;

    const timer = setTimeout(() => {
      // Time-seeded count so it varies by hour but stays consistent within the hour
      const hour = new Date().getHours();
      const base = ((hour * 7 + 3) % 11) + 5; // 5–15
      setCount(base);
      setShow(true);
      sessionStorage.setItem("proofToast", "1");
      trackEvent("social_proof_shown", { count: base });
    }, 12000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!show) return;
    const hide = setTimeout(() => setShow(false), 7000);
    return () => clearTimeout(hide);
  }, [show]);

  if (!show) return null;

  return (
    <div className={styles.toast}>
      <div className={styles.dot} />
      <span className={styles.text}>
        {count} people checked their eligibility today
      </span>
      <button className={styles.close} onClick={() => setShow(false)} aria-label="Dismiss">
        &times;
      </button>
    </div>
  );
}
