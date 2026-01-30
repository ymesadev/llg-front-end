"use client";

import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import styles from "./page.module.css";

export default function SignPage() {
  useEffect(() => {
    // Load DocuSeal script
    const script = document.createElement("script");
    script.src = "https://cdn.docuseal.com/js/form.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup
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
          <docuseal-form
            data-src="https://docuseal.com/d/XA1qkh69xekva3"
            data-email=""
          ></docuseal-form>
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
