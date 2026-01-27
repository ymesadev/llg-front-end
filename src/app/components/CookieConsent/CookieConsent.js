"use client";
import { useState, useEffect } from "react";
import styles from "./CookieConsent.module.css";

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consentGiven = localStorage.getItem("cookieConsent");
    if (!consentGiven) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowConsent(false);
    window.dispatchEvent(new Event("consentUpdated"));
  };

  if (!showConsent) return null;

  return (
    <div className={styles.cookieConsent}>
        <div className={styles.cookieConsentContainer}>
      
      <p>
        This website uses cookies to ensure you get the best experience on our website.
        By using this website, you consent to the use of cookies as described in our{" "}
        <a href="/privacy-policy" className={styles.cookieLink}>Privacy Policy</a>.
      </p>
      <button className={styles.acceptButton} onClick={acceptCookies}>
        ACCEPT ALL COOKIES
      </button>
      </div>
    </div>
  );
}