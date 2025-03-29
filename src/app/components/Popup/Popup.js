"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Detect route changes
import Image from "next/image";
import Link from "next/link";
import styles from "./Popup.module.css";
import Attorney from "../../../../public/images/transparent-pierre.webp";
import { IoMdChatboxes } from "react-icons/io";
import ChatbotPopup from "../ChatBot/ChatBot";

const Popup = () => {
  const pathname = usePathname();
  const [showCookiesConsent, setShowCookiesConsent] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [lastVisitedPath, setLastVisitedPath] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const hasAgreed = localStorage.getItem("agreedToTerms");
    const cookieConsent = localStorage.getItem("cookieConsent");

    if (!hasAgreed) {
      setTimeout(() => setIsTermsOpen(true), 1000);
    } else if (!cookieConsent) {
      setTimeout(() => setShowCookiesConsent(true), 2000);
    }
  }, []);

  useEffect(() => {
    const consultationDismissed = localStorage.getItem("consultationDismissed");
    if (
      lastVisitedPath &&
      lastVisitedPath !== pathname &&
      localStorage.getItem("agreedToTerms") &&
      localStorage.getItem("cookieConsent") &&
      !consultationDismissed
    ) {
      setTimeout(() => setIsConsultationOpen(true), 3000); // Delay Consultation popup by 3 secs
    }
    setLastVisitedPath(pathname);
  }, [pathname, lastVisitedPath]);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowCookiesConsent(false);
  };

  const agreeToTerms = () => {
    localStorage.setItem("agreedToTerms", "true");
    setIsTermsOpen(false);
    setTimeout(() => setShowCookiesConsent(true), 2000);
  };

  const closeConsultation = () => {
    localStorage.setItem("consultationDismissed", "true");
    setIsConsultationOpen(false);
  };

  const handleMessageUs = () => {
    localStorage.setItem("consultationDismissed", "true");
    setIsConsultationOpen(false);
    setIsChatOpen(true);
  };

  return (
    <>
      {/* Terms Agreement Popup */}
      {isTermsOpen && (
        <div className={styles.popupOverlay}>
          <div className={styles.termsContainer}>
            <div className={styles.termsContent}>
              <h2>We've updated our terms</h2>
              <p>
                To enhance your experience, we've made important updates to our{" "}
                <Link href="/terms-of-use-agreement">Terms of Service</Link> and{" "}
                <Link href="/privacy-policy">Privacy Policy</Link>. By
                continuing, you agree to the updated terms.
              </p>
              <button onClick={agreeToTerms} className={styles.ctaButton}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Cookie Consent Popup */}
      {showCookiesConsent && (
        <div className={styles.cookieConsent}>
          <div className={styles.cookieConsentContainer}>
            <p>
              This website uses cookies to ensure you get the best experience.
              By using this website, you consent to the use of cookies as
              described in our{" "}
              <Link href="/privacy-policy" className={styles.cookieLink}>
                Privacy Policy
              </Link>
              .
            </p>
            <button className={styles.acceptButton} onClick={acceptCookies}>
              ACCEPT ALL COOKIES
            </button>
          </div>
        </div>
      )}
      {/* Consultation Popup (After Navigation, Delayed by 3s) */}
      {isConsultationOpen && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContainer}>
            <div className={styles.popupContent}>
              <button
                className={styles.closeButton}
                onClick={closeConsultation}
              >
                ✕
              </button>
              <h2>Need Legal Help?</h2>
              <div className={styles.chatImageContainer}>
                <Image
                  src={Attorney}
                  alt="Attorney"
                  width={500}
                  height={500}
                  className={styles.attorneyImage}
                />
              </div>
              <p>Message us. 24/7 Free Case Review</p>
            </div>
            <div className={styles.chatButtonContainer}>
              <button className={styles.chatButton} onClick={handleMessageUs}>
                <IoMdChatboxes className={styles.icon} />
                <p>Let's Chat</p>
              </button>
            </div>
          </div>
        </div>
      )}
      <ChatbotPopup open={isChatOpen} />
    </>
  );
};

export default Popup;
