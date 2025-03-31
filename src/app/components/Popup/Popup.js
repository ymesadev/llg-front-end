"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Popup.module.css";
import Attorney from "../../../../public/images/transparent-pierre.webp";
import { IoMdChatboxes } from "react-icons/io";
import { CiMobile3 } from "react-icons/ci";
import ChatbotPopup from "../ChatBot/ChatBot";
import { ChatUsPopup, ClosePopup, TextUsPopup } from "../../../../public/icons";

const Popup = () => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const hasAgreed = localStorage.getItem("agreedToTerms");
    if (!hasAgreed) {
      setTimeout(() => setIsTermsOpen(true), 1000);
    }
  }, []);

  useEffect(() => {
    const consultationDismissed = sessionStorage.getItem(
      "consultationDismissed"
    );
    if (localStorage.getItem("agreedToTerms") && !consultationDismissed) {
      setTimeout(() => setIsConsultationOpen(true), 3000);
    }
  }, []);

  const agreeToTerms = () => {
    localStorage.setItem("agreedToTerms", "true");
    setIsTermsOpen(false);
  };

  const closeConsultation = () => {
    sessionStorage.setItem("consultationDismissed", "true");
    setIsConsultationOpen(false);
  };

  const handleMessageUs = () => {
    sessionStorage.setItem("consultationDismissed", "true");
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
      {/* Consultation Popup (After Navigation, Delayed by 3s) */}
      {isConsultationOpen && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContainer}>
            <div className={styles.popupHeader}>
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={100}
                height={100}
              />
            </div>
            <div className={styles.popupContent}>
              <ClosePopup
                className={styles.closeButton}
                onClick={closeConsultation}
              />
              <div className={styles.popupContentWrapper}>
                <h2 className={styles.needHelp}>NEED HELP?</h2>
                <span>
                  <h2>NO WIN,</h2>
                  <h2>NO FEE</h2>
                </span>
                <p>Call, Text or Chat 24/7</p>
                <p> Free Case Review!</p>
              </div>
              <div className={styles.chatButtonContainer}>
                <button className={styles.chatButton} onClick={handleMessageUs}>
                  <p>Let's Chat</p>
                  <ChatUsPopup className={styles.icon} />
                </button>
                <a href="sms:8336574812" className={styles.textUs}>
                  <p>Text Us</p>
                  <TextUsPopup className={styles.textUsIcon} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Floating SMS Button*/}
      <a href="sms:8336574812" className={styles.textUsButton}>
        <p>Text Us</p>
        <TextUsPopup className={styles.textUsIcon} />
      </a>

      <ChatbotPopup open={isChatOpen} />
    </>
  );
};

export default Popup;
