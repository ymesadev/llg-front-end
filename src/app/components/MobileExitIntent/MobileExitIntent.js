"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./MobileExitIntent.module.css";
import { trackEvent } from "@/app/utils/analytics";

export default function MobileExitIntent({ intakeHref = "/ssdi/qualify" }) {
  const [show, setShow] = useState(false);
  const lastY = useRef(0);
  const lastT = useRef(0);
  const armed = useRef(false);

  useEffect(() => {
    // Mobile only
    if (!window.matchMedia("(max-width: 768px)").matches) return;
    // Once per session
    if (sessionStorage.getItem("exitIntentShown")) return;

    // Arm after 8 seconds on page
    const timer = setTimeout(() => { armed.current = true; }, 8000);

    const onScroll = () => {
      const y = window.scrollY;
      const t = Date.now();
      const dy = lastY.current - y; // positive = scrolling up
      const dt = t - lastT.current;

      // Rapid scroll-up: 150px+ in under 400ms, while past the fold
      if (armed.current && dy > 150 && dt < 400 && lastY.current > 300) {
        sessionStorage.setItem("exitIntentShown", "1");
        setShow(true);
        trackEvent("exit_intent_shown", { type: "mobile_scroll_up" });
      }

      lastY.current = y;
      lastT.current = t;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!show) return null;

  const dismiss = () => {
    setShow(false);
    trackEvent("exit_intent_dismissed");
  };

  return (
    <div className={styles.overlay} onClick={dismiss}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={dismiss} aria-label="Close">&times;</button>
        <div className={styles.badge}>Louis Law Group</div>
        <h2 className={styles.title}>Before you go...</h2>
        <p className={styles.sub}>
          Find out if you qualify for a free case review. Takes under 2 minutes — no obligation.
        </p>
        <Link
          href={intakeHref}
          className={styles.cta}
          onClick={() => trackEvent("exit_intent_clicked", { href: intakeHref })}
        >
          Check Your Eligibility &rarr;
        </Link>
        <p className={styles.note}>No fees unless we win your case.</p>
      </div>
    </div>
  );
}
