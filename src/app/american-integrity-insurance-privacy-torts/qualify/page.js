"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Check, X, Shield } from "lucide-react";
import styles from "./page.module.css";
import { trackEvent } from "@/app/utils/analytics";
import UrgencyBanner from "@/app/components/UrgencyBanner/UrgencyBanner";

const eligibilityQuestions = [
  { id: "age", question: "Are you 18 years of age or older?", required: true },
  { id: "visited", question: "Did you visit or interact with American Integrity Insurance's website (aii.com) within the last 2 years?", required: true },
  { id: "florida", question: "Were you located in Florida at the time you visited or interacted with American Integrity Insurance's website?", required: true },
  { id: "submitted", question: "Did you request a quote, create an account, or submit personal information through American Integrity Insurance's website?", required: true }
];

export default function QualifyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [eligibilityAnswers, setEligibilityAnswers] = useState({});
  const [contactInfo, setContactInfo] = useState({ usedEmail: "", name: "", phone: "" });
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState("next");
  const [disqualified, setDisqualified] = useState(false);

  useEffect(() => {
    trackEvent("qualify_page_view", { case_type: "american_integrity" });
  }, []);

  const step1Questions = eligibilityQuestions.slice(0, 2);
  const step2Questions = eligibilityQuestions.slice(2, 4);
  const step1Answered = step1Questions.every(q => eligibilityAnswers[q.id] !== undefined);
  const step2Answered = step2Questions.every(q => eligibilityAnswers[q.id] !== undefined);
  const allEligibilityYes = eligibilityQuestions.every(q => eligibilityAnswers[q.id] === true);
  const contactComplete = contactInfo.usedEmail && contactInfo.name && contactInfo.phone;

  const handleEligibilityAnswer = (questionId, answer) => {
    setEligibilityAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  const goToNextStep = () => {
    const currentQuestions = currentStep === 0 ? step1Questions : step2Questions;
    const hasNo = currentQuestions.some(q => eligibilityAnswers[q.id] === false);
    if (hasNo) {
      trackEvent("qualify_disqualified", { case_type: "american_integrity", step: currentStep });
      setDisqualified(true);
      return;
    }
    if (currentStep === 1 && !allEligibilityYes) {
      trackEvent("qualify_disqualified", { case_type: "american_integrity", step: currentStep });
      setDisqualified(true);
      return;
    }
    trackEvent("qualify_step_complete", { case_type: "american_integrity", from_step: currentStep });
    setDirection("next");
    setIsAnimating(true);
    setTimeout(() => { setCurrentStep(currentStep + 1); setIsAnimating(false); }, 300);
  };

  const goToPrevStep = () => {
    setDirection("prev");
    setIsAnimating(true);
    setTimeout(() => { setCurrentStep(currentStep - 1); setIsAnimating(false); }, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contactComplete) return;
    localStorage.setItem('american-integrity-contact', JSON.stringify({ email: contactInfo.usedEmail, name: contactInfo.name, phone: contactInfo.phone }));
        trackEvent("qualify_contact_submitted", { case_type: "american_integrity" });
    router.push("/american-integrity-insurance-privacy-torts/sign");
  };

  if (disqualified) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.disqualified}>
            <div className={styles.iconCircle}><X size={32} /></div>
            <h2>We're Sorry</h2>
            <p>Based on your responses, you may not qualify for this particular case. However, you may have other legal options available to you.</p>
            <p>If you believe this is an error or have questions, please call us at{" "}<a href="tel:8336574812">833-657-4812</a>.</p>
            <button className={styles.primaryButton} onClick={() => router.push("/american-integrity-insurance-privacy-torts")} >Return to Homepage</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${((currentStep + 1) / 3) * 100}%` }} />
      </div>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <nav className={styles.stepNav}>
            <div className={`${styles.stepItem} ${currentStep < 2 ? styles.active : ''} ${currentStep >= 2 ? styles.completed : ''}`}>
              <div className={styles.stepIndicator}>{currentStep >= 2 ? <Check size={14} /> : <span>1</span>}</div>
              <span className={styles.stepLabel}>Eligibility</span>
            </div>
            <div className={`${styles.stepItem} ${currentStep === 2 ? styles.active : ''}`}>
              <div className={styles.stepIndicator}><span>2</span></div>
              <span className={styles.stepLabel}>Contact Info</span>
            </div>
          </nav>
        </aside>
        <main className={styles.main}>
          <UrgencyBanner />
          <div className={styles.questionContainer}>
            <div className={`${styles.questionContent} ${isAnimating ? (direction === "next" ? styles.slideOutLeft : styles.slideOutRight) : styles.slideIn}`}>
              {currentStep === 0 && (
                <>
                  <div className={styles.stepHeader}>
                    <Shield className={styles.stepIcon} />
                    <h2>Let's Check Your Eligibility</h2>
                    <p>Step 1 of 3 — Answer these questions</p>
                  </div>
                  <div className={styles.questionsGrid}>
                    {step1Questions.map((q, index) => (
                      <div key={q.id} className={styles.questionCard}>
                        <p className={styles.questionText}><span className={styles.questionNumber}>{index + 1}.</span>{q.question}</p>
                        <div className={styles.yesNoButtons}>
                          <button type="button" className={`${styles.optionButton} ${eligibilityAnswers[q.id] === true ? styles.selectedYes : ''}`} onClick={() => handleEligibilityAnswer(q.id, true)}><Check size={18} />Yes</button>
                          <button type="button" className={`${styles.optionButton} ${eligibilityAnswers[q.id] === false ? styles.selectedNo : ''}`} onClick={() => handleEligibilityAnswer(q.id, false)}><X size={18} />No</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.navigation}>
                    <button className={styles.continueButton} onClick={goToNextStep} disabled={!step1Answered}>Continue<ArrowRight size={20} /></button>
                  </div>
                </>
              )}
              {currentStep === 1 && (
                <>
                  <div className={styles.stepHeader}>
                    <Shield className={styles.stepIcon} />
                    <h2>Just a Couple More Questions</h2>
                    <p>Step 2 of 3 — Almost there!</p>
                  </div>
                  <div className={styles.questionsGrid}>
                    {step2Questions.map((q, index) => (
                      <div key={q.id} className={styles.questionCard}>
                        <p className={styles.questionText}><span className={styles.questionNumber}>{index + 3}.</span>{q.question}</p>
                        <div className={styles.yesNoButtons}>
                          <button type="button" className={`${styles.optionButton} ${eligibilityAnswers[q.id] === true ? styles.selectedYes : ''}`} onClick={() => handleEligibilityAnswer(q.id, true)}><Check size={18} />Yes</button>
                          <button type="button" className={`${styles.optionButton} ${eligibilityAnswers[q.id] === false ? styles.selectedNo : ''}`} onClick={() => handleEligibilityAnswer(q.id, false)}><X size={18} />No</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.navigation}>
                    <button type="button" className={styles.backButton} onClick={goToPrevStep}><ArrowLeft size={18} />Back</button>
                    <button className={styles.continueButton} onClick={goToNextStep} disabled={!step2Answered}>Continue<ArrowRight size={20} /></button>
                  </div>
                </>
              )}
              {currentStep === 2 && (
                <>
                  <div className={styles.stepHeader}>
                    <div className={styles.successBadge}><Check size={20} />You Qualify!</div>
                    <h2>Almost Done! Enter Your Contact Info</h2>
                    <p>Step 3 of 3 — We'll use this to process your case.</p>
                  </div>
                  <form onSubmit={handleSubmit} className={styles.contactForm}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="usedEmail">Email address used with American Integrity Insurance</label>
                      <input type="email" id="usedEmail" name="usedEmail" placeholder="your@email.com" value={contactInfo.usedEmail} onChange={handleContactChange} required />
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor="name">Full Name</label>
                      <input type="text" id="name" name="name" placeholder="John Doe" value={contactInfo.name} onChange={handleContactChange} required />
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor="phone">Phone Number</label>
                      <input type="tel" id="phone" name="phone" placeholder="(555) 555-5555" value={contactInfo.phone} onChange={handleContactChange} required />
                    </div>
                    <div className={styles.navigation}>
                      <button type="button" className={styles.backButton} onClick={goToPrevStep}><ArrowLeft size={18} />Back</button>
                      <button type="submit" className={styles.submitButton} disabled={!contactComplete}>Submit &amp; Continue<ArrowRight size={20} /></button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
