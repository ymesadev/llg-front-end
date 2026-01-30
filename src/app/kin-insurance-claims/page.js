"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import useEmblaCarousel from "embla-carousel-react";
import {
  Shield,
  Eye,
  Lock,
  CheckCircle,
  Phone,
  ArrowRight,
  AlertTriangle,
  UserCheck,
  FileText,
  DollarSign,
  ChevronDown,
  ShieldAlert,
  Database,
  Share2
} from "lucide-react";
import { FaSpinner, FaTimesCircle } from "react-icons/fa";
import styles from "./page.module.css";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import step1Animation from "../../../public/lottie/step1.json";
import step2Animation from "../../../public/lottie/step2.json";
import step3Animation from "../../../public/lottie/step3.json";

export default function KinPrivacyLanding() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    zipcode: "",
    state: "",
    visitedWebsite: "",
    timeframe: "",
    consent: false,
  });
  const [formStatus, setFormStatus] = useState("idle");
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [progress, setProgress] = useState(0);

  const updateProgress = () => {
    if (!emblaApi) return;
    const scrollProgress = emblaApi.scrollProgress();
    setProgress(scrollProgress * 100);
  };

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("scroll", updateProgress);
    updateProgress();
  }, [emblaApi]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("submitting");

    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      zipcode: formData.zipcode,
      state: formData.state,
      caseType: "Privacy Violation",
      company: "KIN Insurance",
      visitedWebsite: formData.visitedWebsite,
      timeframe: formData.timeframe,
      consent: formData.consent ? "Yes" : "No",
      page_source: "kin_privacy_landing",
      campaign_type: "organic",
    };

    try {
      const response = await fetch(
        "https://dev-n8n.louislawgroup.com/webhook/forms",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok (status ${response.status})`);
      }

      setFormStatus("success");
      setFormData({
        name: "",
        phone: "",
        email: "",
        zipcode: "",
        state: "",
        visitedWebsite: "",
        timeframe: "",
        consent: false,
      });
    } catch (err) {
      console.error("Form submission error:", err);
      setFormStatus("error");
    }
  };

  useEffect(() => {
    if (formStatus === "success") {
      router.push("https://www.louislawgroup.com/thank-you");
    }
  }, [formStatus, router]);

  const faqs = [
    {
      question: "What is this privacy case about?",
      answer: "This case alleges that KIN Insurance embedded hidden tracking technology on their website that monitored your online activity—including clicks, pages viewed, and personal information—without your knowledge or proper consent, potentially violating state and federal privacy laws."
    },
    {
      question: "Who is eligible to file a claim?",
      answer: "You may be eligible if you visited the KIN Insurance website within the past 24 months. Certain state residents, particularly those in California, Florida, and other states with strong privacy laws, may have additional protections."
    },
    {
      question: "How much does it cost to file a claim?",
      answer: "There is no upfront cost to you. Our attorneys work on a contingency fee basis, meaning we only get paid if we successfully recover compensation on your behalf."
    },
    {
      question: "What kind of compensation could I receive?",
      answer: "Compensation varies by case and depends on factors such as the extent of tracking, your state of residence, and applicable laws. Privacy violation cases can result in statutory damages, actual damages, and other remedies."
    },
    {
      question: "How does hidden tracking violate my privacy?",
      answer: "When companies track your online behavior without disclosure or consent, they may violate laws like the California Invasion of Privacy Act (CIPA), the Florida Security of Communications Act, federal wiretapping laws, and other consumer protection statutes."
    }
  ];

  const trackingIssues = [
    {
      icon: <Eye className={styles.issueIcon} />,
      title: "Behavior Monitoring",
      description: "Your clicks, scrolls, and page visits may have been secretly recorded"
    },
    {
      icon: <Database className={styles.issueIcon} />,
      title: "Data Collection",
      description: "Personal information and browsing habits captured without consent"
    },
    {
      icon: <Share2 className={styles.issueIcon} />,
      title: "Third-Party Sharing",
      description: "Your data potentially shared with advertisers and other companies"
    }
  ];

  const processSteps = [
    {
      number: 1,
      title: "Your Data Was Tracked",
      description: "When you visited KIN Insurance's website, hidden tracking technology may have recorded your clicks, browsing behavior, and personal data without consent.",
      animation: step1Animation
    },
    {
      number: 2,
      title: "Privacy Laws Were Violated",
      description: "This secret tracking may violate federal wiretapping laws, the California Invasion of Privacy Act, and other state privacy statutes.",
      animation: step2Animation
    },
    {
      number: 3,
      title: "You May Be Owed Compensation",
      description: "If you visited their website in the past 24 months, you could be entitled to compensation for this privacy violation.",
      animation: step3Animation
    }
  ];

  return (
    <div className={styles.landingPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroOverlay}></div>
        </div>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroGrid}>
            <div className={styles.heroText}>
              <div className={styles.badge}>
                <ShieldAlert size={16} />
                <span>Privacy Violation Alert</span>
              </div>
              <h1 className={styles.heroTitle}>
                Visited KIN Insurance's Website?
                <span className={styles.highlight}>Your Data May Have Been Secretly Tracked.</span>
              </h1>
              <p className={styles.heroSubtitle}>
                KIN Insurance may have embedded hidden tracking technology on their website
                to monitor your online activity—including your clicks, browsing behavior,
                and personal information—without your knowledge or consent.
              </p>
              <div className={styles.alertBox}>
                <AlertTriangle className={styles.alertIcon} />
                <p>
                  <strong>You may be entitled to compensation</strong> if you visited
                  kininsurance.com in the past 24 months.
                </p>
              </div>
              <div className={styles.heroCtas}>
                <a href="#check-eligibility" className={styles.primaryCta}>
                  <span>Check Your Eligibility Now</span>
                  <ArrowRight size={20} />
                </a>
                <a href="tel:8336574812" className={styles.secondaryCta}>
                  <Phone size={20} />
                  <span>833-657-4812</span>
                </a>
              </div>
              <div className={styles.trustIndicators}>
                <div className={styles.trustItem}>
                  <CheckCircle size={18} className={styles.trustIcon} />
                  <span>No Upfront Cost</span>
                </div>
                <div className={styles.trustItem}>
                  <CheckCircle size={18} className={styles.trustIcon} />
                  <span>Free Case Review</span>
                </div>
                <div className={styles.trustItem}>
                  <CheckCircle size={18} className={styles.trustIcon} />
                  <span>Confidential</span>
                </div>
              </div>
            </div>
            <div className={styles.heroFormWrapper} id="check-eligibility">
              <div className={styles.formCard}>
                <div className={styles.formHeader}>
                  <Lock className={styles.formLockIcon} />
                  <h3>Check Your Eligibility</h3>
                  <p>Free & Confidential Case Review</p>
                </div>
                {formStatus === "error" ? (
                  <div className={styles.errorContainer}>
                    <FaTimesCircle className={styles.errorIcon} />
                    <p>Something went wrong. Please try again.</p>
                    <button onClick={() => setFormStatus("idle")} className={styles.retryButton}>
                      Try Again
                    </button>
                  </div>
                ) : formStatus === "submitting" ? (
                  <div className={styles.spinnerContainer}>
                    <FaSpinner className={styles.spinner} />
                    <p>Checking your eligibility...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className={styles.heroForm}>
                    <div className={styles.formGrid}>
                      <div className={styles.inputGroup}>
                        <input
                          type="text"
                          name="name"
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <input
                          type="text"
                          name="zipcode"
                          placeholder="Zip Code"
                          value={formData.zipcode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className={styles.inputGroup}>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled>Select Your State</option>
                        <option value="FL">Florida</option>
                        <option value="CA">California</option>
                        <option value="TX">Texas</option>
                        <option value="NY">New York</option>
                        <option value="other">Other State</option>
                      </select>
                    </div>
                    <div className={styles.inputGroup}>
                      <select
                        name="visitedWebsite"
                        value={formData.visitedWebsite}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled>Did you visit KIN Insurance's website?</option>
                        <option value="yes">Yes, I visited their website</option>
                        <option value="yes-quote">Yes, I got a quote online</option>
                        <option value="yes-purchased">Yes, I purchased a policy online</option>
                        <option value="not-sure">I'm not sure</option>
                      </select>
                    </div>
                    <div className={styles.inputGroup}>
                      <select
                        name="timeframe"
                        value={formData.timeframe}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled>When did you visit their website?</option>
                        <option value="6-months">Within the last 6 months</option>
                        <option value="1-year">Within the last year</option>
                        <option value="2-years">Within the last 2 years</option>
                        <option value="longer">More than 2 years ago</option>
                      </select>
                    </div>
                    <div className={styles.checkboxGroup}>
                      <input
                        type="checkbox"
                        name="consent"
                        id="consent"
                        checked={formData.consent}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="consent">
                        I agree to receive communications and understand the{" "}
                        <Link href="/privacy-policy">Privacy Policy</Link>.
                      </label>
                    </div>
                    <button type="submit" className={styles.submitButton}>
                      Check My Eligibility
                      <ArrowRight size={20} />
                    </button>
                    <p className={styles.formDisclaimer}>
                      Your information is secure and confidential.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Happened Section */}
      <section className={styles.problemSection}>
        <div className="container">
          <div className={styles.problemHeader}>
            <h2 className={styles.sectionTitleCenter}>
              What <span className={styles.highlight}>Happened?</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Companies like KIN Insurance may be using hidden tracking technology
              to monitor your every move online—without telling you.
            </p>
          </div>
          <div className={styles.issuesGrid}>
            {trackingIssues.map((issue, index) => (
              <div key={index} className={styles.issueCard}>
                <div className={styles.issueIconWrapper}>
                  {issue.icon}
                </div>
                <h3>{issue.title}</h3>
                <p>{issue.description}</p>
              </div>
            ))}
          </div>
          <div className={styles.violationBox}>
            <div className={styles.violationContent}>
              <h3>This May Violate Your Privacy Rights</h3>
              <p>
                When companies secretly track your online activity without proper disclosure
                or consent, they may be violating state and federal laws including:
              </p>
              <ul>
                <li>California Invasion of Privacy Act (CIPA)</li>
                <li>Florida Security of Communications Act</li>
                <li>Federal Wiretap Act</li>
                <li>State Consumer Protection Laws</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section - Matching Homepage Steps */}
      <section className={styles.stepsSection}>
        <div className="container">
          <div className={styles.stepsGrid}>
            {/* Left Column */}
            <div className={styles.stepsLeftColumn}>
              <h2 className={styles.stepsTitle}>What Happened?</h2>
              <h3 className={styles.stepsSubtitle}>Your Privacy<span className={styles.noFeeHighlight}> At Risk</span></h3>
              <p className={styles.stepsDescription}>
                When you visited KIN Insurance's website to get a quote, compare coverage options, or purchase a policy, hidden tracking technology may have been secretly monitoring your every move. This software, often called "session replay" or "pixel tracking," records detailed information about your browsing session—including mouse movements, clicks, scrolls, keystrokes, and the pages you viewed.
              </p>
              <p className={styles.stepsDescription2}>
                What makes this particularly concerning is that this tracking likely occurred without your knowledge or meaningful consent. The data collected may have been shared with third-party advertising companies, analytics firms, and other organizations—all without you ever being informed. This type of covert surveillance may violate federal wiretapping laws, the California Invasion of Privacy Act (CIPA), the Florida Security of Communications Act, and other state consumer protection statutes designed to protect your digital privacy.
              </p>
              <a href="#check-eligibility" className={styles.stepsButton}>
                Check Your Eligibility
                <ArrowRight size={20} />
              </a>
            </div>

            {/* Right Column: Slider */}
            <div className={styles.stepsRightColumn}>
              <div className={styles.carouselWrapper}>
                <button
                  className={`${styles.navButton} ${styles.prevButton}`}
                  onClick={() => emblaApi && emblaApi.scrollPrev()}
                >
                  ‹
                </button>
                <div className={styles.carousel} ref={emblaRef}>
                  <div className={styles.emblaContainer}>
                    {processSteps.map((step) => (
                      <div key={step.number} className={styles.emblaSlide}>
                        <div className={styles.stepBox}>
                          <Lottie
                            animationData={step.animation}
                            loop
                            className={styles.lottieAnimation}
                          />
                          <h4 className={styles.stepBoxTitle}>
                            Step {step.number}: {step.title}
                          </h4>
                          <p className={styles.stepBoxDescription}>
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  className={`${styles.navButton} ${styles.nextButton}`}
                  onClick={() => emblaApi && emblaApi.scrollNext()}
                >
                  ›
                </button>
              </div>

              {/* Progress Bar */}
              <div className={styles.progressBarWrapper}>
                <div
                  className={styles.progressBar}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section className={styles.eligibilitySection}>
        <div className="container">
          <div className={styles.eligibilityGrid}>
            <div className={styles.eligibilityContent}>
              <h2 className={styles.sectionTitle}>
                Are You <span className={styles.highlight}>Eligible?</span>
              </h2>
              <p className={styles.eligibilityText}>
                You may qualify for this privacy case if:
              </p>
              <ul className={styles.eligibilityList}>
                <li>
                  <CheckCircle className={styles.checkIcon} />
                  <span>You visited the KIN Insurance website</span>
                </li>
                <li>
                  <CheckCircle className={styles.checkIcon} />
                  <span>You got a quote or purchased insurance online from KIN</span>
                </li>
                <li>
                  <CheckCircle className={styles.checkIcon} />
                  <span>Your visit occurred within the past 24 months</span>
                </li>
                <li>
                  <CheckCircle className={styles.checkIcon} />
                  <span>You are a resident of the United States</span>
                </li>
              </ul>
              <a href="#check-eligibility" className={styles.eligibilityCta}>
                Check Your Eligibility Now
                <ArrowRight size={20} />
              </a>
            </div>
            <div className={styles.eligibilityImage}>
              <div className={styles.noFeeCard}>
                <DollarSign className={styles.noFeeIcon} />
                <h4>No Upfront Fees</h4>
                <p>
                  You pay nothing unless we win your case. Our attorneys work on
                  a contingency basis—we only get paid if you do.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className="container">
          <h2 className={styles.sectionTitleCenter}>
            Frequently Asked <span className={styles.highlight}>Questions</span>
          </h2>
          <div className={styles.faqContainer}>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`${styles.faqItem} ${activeAccordion === index ? styles.active : ''}`}
              >
                <button
                  className={styles.faqQuestion}
                  onClick={() => setActiveAccordion(activeAccordion === index ? null : index)}
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={styles.faqChevron} />
                </button>
                <div className={styles.faqAnswer}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaContent}>
            <ShieldAlert className={styles.ctaIcon} />
            <h2>Your Privacy Matters. Take Action Today.</h2>
            <p>
              Don't let companies get away with secretly tracking your online activity.
              Check your eligibility now—it's free, fast, and confidential.
            </p>
            <div className={styles.ctaButtons}>
              <a href="#check-eligibility" className={styles.ctaPrimary}>
                <span>Check Eligibility Now</span>
                <ArrowRight size={20} />
              </a>
              <a href="tel:8336574812" className={styles.ctaSecondary}>
                <Phone size={20} />
                <span>Call 833-657-4812</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
