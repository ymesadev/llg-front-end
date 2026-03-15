"use client";

import { useEffect, useState } from "react";
import { CheckCircle, FileSignature, PhoneCall, ShieldCheck, DollarSign, BadgeCheck } from "lucide-react";
import caseConfig, { DOCUSEAL_TEMPLATE } from "../../../config/cases";
import styles from "./page.module.css";

const config = caseConfig["kin-insurance-privacy-torts"];

export default function SignPage() {
  const [ready, setReady] = useState(false);
  const [contactInfo, setContactInfo] = useState({ email: "", name: "", phone: "" });
  const [adSource, setAdSource] = useState("");

  useEffect(() => {
    // Read contact info saved from the qualify form
    try {
      const stored = localStorage.getItem(config.localStorageKey);
      if (stored) {
        setContactInfo(JSON.parse(stored));
      }
    } catch {}

    // Build ad source string from lead attribution data
    try {
      const utmSource = localStorage.getItem("utm_source") || "";
      const utmMedium = localStorage.getItem("utm_medium") || "";
      const utmCampaign = localStorage.getItem("utm_campaign") || "";
      const utmContent = localStorage.getItem("utm_content") || "";
      const utmTerm = localStorage.getItem("utm_term") || "";
      const pageSource = localStorage.getItem("page_source") || "";
      const parts = [utmSource, utmMedium, utmCampaign, utmContent, utmTerm].filter(Boolean);
      setAdSource(parts.length > 0 ? parts.join(" / ") : pageSource || "organic");
    } catch {}

    // Load DocuSeal script, then mark ready so the form renders
    // with contact data attributes already set
    const script = document.createElement("script");
    script.src = "https://cdn.docuseal.com/js/form.js";
    script.async = true;
    script.onload = () => setReady(true);
    document.body.appendChild(script);

    // Fallback in case script is cached and onload fires before state update
    if (document.querySelector('script[src="https://cdn.docuseal.com/js/form.js"]')) {
      setTimeout(() => setReady(true), 500);
    }

    return () => {
      const existingScript = document.querySelector('script[src="https://cdn.docuseal.com/js/form.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <img src="/images/logo.png" alt="Louis Law Group" className={styles.logo} />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.heroBanner}>
          <div className={styles.heroLeft}>
            <div className={styles.qualifyBadge}>
              <CheckCircle size={18} />
              <span>You Qualify!</span>
            </div>
            <h1 className={styles.heroTitle}>Ready to get the money you're owed?</h1>
            <ul className={styles.heroSteps}>
              <li>
                <FileSignature size={18} className={styles.stepIcon} />
                <span>Sign below to start your free investigation.</span>
              </li>
              <li>
                <PhoneCall size={18} className={styles.stepIcon} />
                <span>Our team will contact you shortly.</span>
              </li>
            </ul>
          </div>
          <div className={styles.heroRight}>
            <h3 className={styles.guaranteeTitle}>
              <ShieldCheck size={20} />
              No-Win, No-Fee Guarantee
            </h3>
            <ul className={styles.guaranteeList}>
              <li>
                <BadgeCheck size={16} className={styles.guaranteeIcon} />
                <span>This agreement only authorizes us to work on your case.</span>
              </li>
              <li>
                <DollarSign size={16} className={styles.guaranteeIcon} />
                <span>We only get paid if we recover money for you.</span>
              </li>
              <li>
                <CheckCircle size={16} className={styles.guaranteeIcon} />
                <span>You pay nothing upfront.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.formContainer}>
          {ready && (
            <docuseal-form
              data-src={DOCUSEAL_TEMPLATE}
              data-email={contactInfo.email}
              data-name={contactInfo.name}
              data-values={JSON.stringify({
                Name: contactInfo.name,
                Phone: contactInfo.phone,
                Company: config.companyName,
                "Company Website": config.companyWebsite,
                Date: new Date().toLocaleDateString("en-US"),
                Source: adSource,
              })}
            ></docuseal-form>
          )}
        </div>

        <div className={styles.helpSection}>
          <p>
            Need help? Call us at <a href="tel:8336574812">833-657-4812</a>
          </p>
        </div>
      </div>
    </div>
  );
}
