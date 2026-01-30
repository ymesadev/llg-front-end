"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Check, X, Shield } from "lucide-react";
import styles from "./page.module.css";

const eligibilityQuestions = [
  {
    id: "age",
    question: "Are you 18 years of age or older?",
    required: true
  },
  {
    id: "visited",
    question: "Did you visit or interact with Kin Insurance's website (Kin.com) within the last 2 years?",
    required: true
  },
  {
    id: "florida",
    question: "Were you located in Florida at the time you visited or interacted with Kin Insurance's website?",
    required: true
  },
  {
    id: "submitted",
    question: "Did you request a quote, create an account, or submit personal information through Kin Insurance's website?",
    required: true
  }
];

export default function QualifyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0); // 0 = eligibility, 1 = contact
  const [eligibilityAnswers, setEligibilityAnswers] = useState({});
  const [contactInfo, setContactInfo] = useState({
    usedEmail: "",
    name: "",
    phone: ""
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState("next");
  const [disqualified, setDisqualified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allEligibilityAnswered = eligibilityQuestions.every(q => eligibilityAnswers[q.id] !== undefined);
  const allEligibilityYes = eligibilityQuestions.every(q => eligibilityAnswers[q.id] === true);
  const contactComplete = contactInfo.usedEmail && contactInfo.name && contactInfo.phone;

  const handleEligibilityAnswer = (questionId, answer) => {
    setEligibilityAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  const goToContact = () => {
    if (!allEligibilityYes) {
      setDisqualified(true);
      return;
    }
    setDirection("next");
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(1);
      setIsAnimating(false);
    }, 300);
  };

  const goBackToEligibility = () => {
    setDirection("prev");
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(0);
      setIsAnimating(false);
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contactComplete) return;

    setIsSubmitting(true);

    const payload = {
      ...eligibilityAnswers,
      ...contactInfo,
      email: contactInfo.usedEmail,
      page_source: "kin_qualify_form",
      campaign_type: "organic",
      caseType: "Privacy Violation",
      company: "KIN Insurance",
      qualified: true
    };

    try {
      await fetch("https://dev-n8n.louislawgroup.com/webhook/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error("Form submission error:", err);
    }

    router.push("/kin-insurance-claims/sign");
  };

  if (disqualified) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.disqualified}>
            <div className={styles.iconCircle}>
              <X size={32} />
            </div>
            <h2>We're Sorry</h2>
            <p>
              Based on your responses, you may not qualify for this particular case.
              However, you may have other legal options available to you.
            </p>
            <p>
              If you believe this is an error or have questions, please call us at{" "}
              <a href="tel:8336574812">833-657-4812</a>.
            </p>
            <button
              className={styles.primaryButton}
              onClick={() => router.push("/kin-insurance-claims")}
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: currentStep === 0 ? '50%' : '100%' }} />
      </div>

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.logo}>
            <img src="/images/logo.png" alt="Louis Law Group" />
          </div>
          <nav className={styles.stepNav}>
            <div className={`${styles.stepItem} ${currentStep === 0 ? styles.active : ''} ${currentStep > 0 ? styles.completed : ''}`}>
              <div className={styles.stepIndicator}>
                {currentStep > 0 ? <Check size={14} /> : <span>1</span>}
              </div>
              <span className={styles.stepLabel}>Eligibility</span>
            </div>
            <div className={`${styles.stepItem} ${currentStep === 1 ? styles.active : ''}`}>
              <div className={styles.stepIndicator}>
                <span>2</span>
              </div>
              <span className={styles.stepLabel}>Contact Info</span>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className={styles.main}>
          <div className={styles.questionContainer}>
            <div className={`${styles.questionContent} ${isAnimating ? (direction === "next" ? styles.slideOutLeft : styles.slideOutRight) : styles.slideIn}`}>

              {currentStep === 0 ? (
                <>
                  <div className={styles.stepHeader}>
                    <Shield className={styles.stepIcon} />
                    <h2>Let's Check Your Eligibility</h2>
                    <p>Please answer all questions below to see if you qualify.</p>
                  </div>

                  <div className={styles.questionsGrid}>
                    {eligibilityQuestions.map((q, index) => (
                      <div key={q.id} className={styles.questionCard}>
                        <p className={styles.questionText}>
                          <span className={styles.questionNumber}>{index + 1}.</span>
                          {q.question}
                        </p>
                        <div className={styles.yesNoButtons}>
                          <button
                            type="button"
                            className={`${styles.optionButton} ${eligibilityAnswers[q.id] === true ? styles.selectedYes : ''}`}
                            onClick={() => handleEligibilityAnswer(q.id, true)}
                          >
                            <Check size={18} />
                            Yes
                          </button>
                          <button
                            type="button"
                            className={`${styles.optionButton} ${eligibilityAnswers[q.id] === false ? styles.selectedNo : ''}`}
                            onClick={() => handleEligibilityAnswer(q.id, false)}
                          >
                            <X size={18} />
                            No
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.navigation}>
                    <button
                      className={styles.continueButton}
                      onClick={goToContact}
                      disabled={!allEligibilityAnswered}
                    >
                      Continue
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.stepHeader}>
                    <div className={styles.successBadge}>
                      <Check size={20} />
                      You Qualify!
                    </div>
                    <h2>Almost Done! Enter Your Contact Info</h2>
                    <p>We'll use this information to process your case.</p>
                  </div>

                  <form onSubmit={handleSubmit} className={styles.contactForm}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="usedEmail">Email address used with Kin Insurance</label>
                      <input
                        type="email"
                        id="usedEmail"
                        name="usedEmail"
                        placeholder="your@email.com"
                        value={contactInfo.usedEmail}
                        onChange={handleContactChange}
                        required
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={contactInfo.name}
                        onChange={handleContactChange}
                        required
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="(555) 555-5555"
                        value={contactInfo.phone}
                        onChange={handleContactChange}
                        required
                      />
                    </div>

                    <div className={styles.navigation}>
                      <button type="button" className={styles.backButton} onClick={goBackToEligibility}>
                        <ArrowLeft size={18} />
                        Back
                      </button>
                      <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={!contactComplete || isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit & Continue"}
                        <ArrowRight size={20} />
                      </button>
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
