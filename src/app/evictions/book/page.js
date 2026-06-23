"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

const CAL_NAMESPACE = "eviction-consultation";
const CAL_LINK = "pierre-louislawgroup.com/eviction-consultation";
const CAL_ORIGIN = "https://bookings.louislawgroup.com";

export default function BookEvictionConsultation() {
  useEffect(() => {
    // Cal.com embed initializer — runs once on mount
    (function (C, A, L) {
      let p = function (a, ar) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, `${CAL_ORIGIN}/embed/embed.js`, "init");

    if (window.Cal) {
      window.Cal("init", CAL_NAMESPACE, { origin: CAL_ORIGIN });
      window.Cal.ns[CAL_NAMESPACE]("inline", {
        elementOrSelector: "#llg-cal-inline",
        calLink: CAL_LINK,
        config: { theme: "light", layout: "month_view" },
      });
      window.Cal.ns[CAL_NAMESPACE]("ui", {
        hideEventTypeDetails: false,
        theme: "light",
        cssVarsPerTheme: {
          light: {
            "cal-brand": "#1a2b49",
            "cal-brand-emphasis": "#ffb800",
            "cal-text-emphasis": "#1a2b49",
          },
        },
      });
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.badge}>Louis Law Group · Book Consultation</div>
            <h1>Florida Eviction Consultation</h1>
          </div>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.urgencyBanner}>
            ⚠ Florida evictions follow strict notice and filing rules. Act now to start the process the right way by scheduling your free landlord consultation.
          </div>

          <p className={styles.leadCopy}>
            Free consultation with <strong>Louis Law Group</strong> to review your
            Florida rental situation, the notice you&apos;ve given so far, and how to
            remove a non-paying or holdover tenant lawfully and quickly.{" "}
            <em>For landlords and property owners. No obligation.</em>
          </p>

          <div className={styles.trustBar}>
            <span className={styles.trustDot} /> Florida Bar Admitted
            <span className={styles.trustDot} /> We Represent Landlords
            <span className={styles.trustDot} /> Free Case Review
          </div>

          <div id="llg-cal-inline" className={styles.calEmbed} />

          <div className={styles.phoneCta}>
            Prefer to talk? Call <a href="tel:+18336574812">(833) 657-4812</a> for a free case review.
          </div>
        </div>
      </div>
    </div>
  );
}
