"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Check, X } from "lucide-react";
import styles from "./page.module.css";

const questions = [
  {
    id: "age",
    question: "Are you 18 years of age or older?",
    type: "yesno",
    required: true,
    disqualifyOn: "no"
  },
  {
    id: "visited",
    question: "Did you visit or interact with Kin Insurance's website (Kin.com) within the last 2 years?",
    type: "yesno",
    required: true,
    disqualifyOn: "no"
  },
  {
    id: "florida",
    question: "Were you located in Florida at the time you visited or interacted with Kin Insurance's website?",
    type: "yesno",
    required: true,
    disqualifyOn: "no"
  },
  {
    id: "submitted",
    question: "Did you request a quote, create an account, or submit personal information through Kin Insurance's website?",
    type: "yesno",
    required: true,
    disqualifyOn: "no"
  },
  {
    id: "usedEmail",
    question: "What email address did you use when interacting with Kin Insurance?",
    subtext: "This helps us verify your claim",
    type: "email",
    placeholder: "your@email.com",
    required: true
  },
  {
    id: "name",
    question: "What's your full name?",
    subtext: "We'll use this for your case file",
    type: "text",
    placeholder: "Full Name",
    required: true
  },
  {
    id: "phone",
    question: "What's the best phone number to reach you?",
    subtext: "We'll only call regarding your case",
    type: "tel",
    placeholder: "(555) 555-5555",
    required: true
  }
];

const steps = [
  { id: "eligibility", label: "Eligibility", questions: [0, 1, 2, 3] },
  { id: "contact", label: "Contact Info", questions: [4, 5, 6] }
];

export default function QualifyPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState("next");
  const [disqualified, setDisqualified] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const getCurrentStep = () => {
    for (let i = 0; i < steps.length; i++) {
      if (steps[i].questions.includes(currentQuestion)) {
        return i;
      }
    }
    return 0;
  };

  const handleAnswer = (answer) => {
    // Check for disqualification
    if (question.disqualifyOn && answer === question.disqualifyOn) {
      setDisqualified(true);
      return;
    }

    setAnswers({ ...answers, [question.id]: answer });
    goToNext();
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setAnswers({ ...answers, [question.id]: inputValue });
    setInputValue("");
    goToNext();
  };

  const goToNext = () => {
    if (currentQuestion < questions.length - 1) {
      setDirection("next");
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      // All questions answered, submit and redirect
      submitAndRedirect();
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setDirection("prev");
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1);
        setInputValue(answers[questions[currentQuestion - 1].id] || "");
        setIsAnimating(false);
      }, 300);
    }
  };

  const submitAndRedirect = async () => {
    // Submit data to webhook
    const payload = {
      ...answers,
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

    // Redirect to sign page
    router.push("/kin-insurance-claims/sign");
  };

  useEffect(() => {
    // Pre-fill input if going back
    if (question.type !== "yesno" && answers[question.id]) {
      setInputValue(answers[question.id]);
    }
  }, [currentQuestion]);

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
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.logo}>
            <img src="/images/logo.png" alt="Louis Law Group" />
          </div>
          <nav className={styles.stepNav}>
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`${styles.stepItem} ${getCurrentStep() === index ? styles.active : ''} ${getCurrentStep() > index ? styles.completed : ''}`}
              >
                <div className={styles.stepIndicator}>
                  {getCurrentStep() > index ? <Check size={14} /> : <span>{index + 1}</span>}
                </div>
                <span className={styles.stepLabel}>{step.label}</span>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className={styles.main}>
          <div className={styles.questionContainer}>
            <div className={`${styles.questionContent} ${isAnimating ? (direction === "next" ? styles.slideOutLeft : styles.slideOutRight) : styles.slideIn}`}>

              <p className={styles.questionNumber}>Question {currentQuestion + 1} of {questions.length}</p>
              <h2 className={styles.question}>{question.question}</h2>
              {question.subtext && <p className={styles.subtext}>{question.subtext}</p>}

              {question.type === "yesno" ? (
                <div className={styles.yesNoButtons}>
                  <button
                    className={`${styles.optionButton} ${answers[question.id] === "yes" ? styles.selected : ""}`}
                    onClick={() => handleAnswer("yes")}
                  >
                    <Check size={20} />
                    Yes
                  </button>
                  <button
                    className={`${styles.optionButton} ${answers[question.id] === "no" ? styles.selected : ""}`}
                    onClick={() => handleAnswer("no")}
                  >
                    <X size={20} />
                    No
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInputSubmit} className={styles.inputForm}>
                  <input
                    type={question.type}
                    placeholder={question.placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className={styles.textInput}
                    autoFocus
                    required={question.required}
                  />
                  <button
                    type="submit"
                    className={styles.continueButton}
                    disabled={!inputValue.trim()}
                  >
                    Continue
                    <ArrowRight size={20} />
                  </button>
                </form>
              )}
            </div>

            {/* Navigation */}
            <div className={styles.navigation}>
              {currentQuestion > 0 && (
                <button className={styles.backButton} onClick={goToPrevious}>
                  <ArrowLeft size={18} />
                  Back
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
