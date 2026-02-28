"use client";

import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import caseConfig, { DOCUSEAL_TEMPLATE } from "../../../config/cases";
import styles from "./page.module.css";

const config = caseConfig["american-integrity-insurance-privacy-torts"];

export default function SignPage() {
  const [ready, setReady] = useState(false);
  const [contactInfo, setContactInfo] = useState({ email: "", name: "", phone: "" });

  useEffect(() => {
    // Read contact info saved from the qualify form
    try {
      const stored = localStorage.getItem(config.localStorageKey);
      if (stored) {
        setContactInfo(JSON.parse(stored));
      }
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
        <div className={styles.successBanner}>
          <CheckCircle size={24} />
          <div>
            <strong>You Qualify!</strong>
            <span>Please complete and sign the agreement below to proceed with your case.</span>
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
