"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Clock,
  DollarSign,
  CheckCircle,
  Phone,
  ArrowRight,
  FileText,
  Users,
  Award,
  Star,
  ChevronDown
} from "lucide-react";
import { FaSpinner, FaTimesCircle } from "react-icons/fa";
import styles from "./page.module.css";

export default function KinInsuranceLanding() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    zipcode: "",
    claimStatus: "",
    damageType: "",
    description: "",
    consent: false,
  });
  const [formStatus, setFormStatus] = useState("idle");
  const [activeAccordion, setActiveAccordion] = useState(null);

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
      caseType: "Property Damage",
      filedCarrier: "KIN Insurance",
      claimStatus: formData.claimStatus,
      damageType: formData.damageType,
      description: formData.description,
      consent: formData.consent ? "Yes" : "No",
      page_source: "kin_insurance_landing",
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
        claimStatus: "",
        damageType: "",
        description: "",
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
      question: "Why was my KIN Insurance claim denied?",
      answer: "KIN Insurance may deny claims for various reasons including alleged policy exclusions, disputes over damage cause, or claims that damage was pre-existing. Many denials can be successfully challenged with proper legal representation."
    },
    {
      question: "How long do I have to dispute a denied claim?",
      answer: "In Florida, you typically have 5 years to file a breach of contract lawsuit against your insurance company. However, acting quickly is crucial as evidence can deteriorate and deadlines in your policy may apply."
    },
    {
      question: "What does it cost to hire Louis Law Group?",
      answer: "We work on a contingency fee basis for property damage claims. This means you pay nothing upfront, and we only get paid if we successfully recover compensation for you."
    },
    {
      question: "What types of damage does KIN Insurance cover?",
      answer: "KIN Insurance policies typically cover hurricane damage, wind damage, water damage, fire damage, and other covered perils. The specific coverage depends on your policy terms."
    }
  ];

  const stats = [
    { value: "$500M+", label: "Recovered for Clients" },
    { value: "15,000+", label: "Cases Handled" },
    { value: "98%", label: "Success Rate" },
    { value: "24/7", label: "Available Support" },
  ];

  const processSteps = [
    {
      icon: <FileText className={styles.stepIcon} />,
      title: "Free Consultation",
      description: "Tell us about your claim denial. We'll review your case at no cost."
    },
    {
      icon: <Users className={styles.stepIcon} />,
      title: "Case Evaluation",
      description: "Our experts analyze your policy and denial to build a strong case."
    },
    {
      icon: <Shield className={styles.stepIcon} />,
      title: "Fight for You",
      description: "We negotiate with KIN Insurance and litigate if necessary."
    },
    {
      icon: <DollarSign className={styles.stepIcon} />,
      title: "Get Paid",
      description: "Receive the compensation you deserve for your property damage."
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
                <Shield size={16} />
                <span>Florida's Trusted Insurance Claim Attorneys</span>
              </div>
              <h1 className={styles.heroTitle}>
                KIN Insurance <span className={styles.highlight}>Denied Your Claim?</span>
              </h1>
              <p className={styles.heroSubtitle}>
                Don't let KIN Insurance leave you without the coverage you paid for.
                Our experienced attorneys have recovered millions for Florida homeowners
                with denied or underpaid property damage claims.
              </p>
              <div className={styles.heroCtas}>
                <a href="tel:8336574812" className={styles.primaryCta}>
                  <Phone size={20} />
                  <span>Call Now: 833-657-4812</span>
                </a>
                <a href="#free-evaluation" className={styles.secondaryCta}>
                  <span>Free Case Review</span>
                  <ArrowRight size={20} />
                </a>
              </div>
              <div className={styles.trustIndicators}>
                <div className={styles.trustItem}>
                  <CheckCircle size={18} className={styles.trustIcon} />
                  <span>No Win, No Fee</span>
                </div>
                <div className={styles.trustItem}>
                  <CheckCircle size={18} className={styles.trustIcon} />
                  <span>Free Consultation</span>
                </div>
                <div className={styles.trustItem}>
                  <CheckCircle size={18} className={styles.trustIcon} />
                  <span>24/7 Availability</span>
                </div>
              </div>
            </div>
            <div className={styles.heroFormWrapper}>
              <div className={styles.formCard}>
                <div className={styles.formHeader}>
                  <h3>Get Your Free Case Review</h3>
                  <p>Find out what your claim is worth</p>
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
                    <p>Submitting your case...</p>
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
                        name="claimStatus"
                        value={formData.claimStatus}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled>What happened with your claim?</option>
                        <option value="denied">Claim was denied</option>
                        <option value="underpaid">Claim was underpaid</option>
                        <option value="delayed">Claim is delayed</option>
                        <option value="not-filed">Haven't filed yet</option>
                      </select>
                    </div>
                    <div className={styles.inputGroup}>
                      <select
                        name="damageType"
                        value={formData.damageType}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled>Type of damage</option>
                        <option value="hurricane">Hurricane / Wind</option>
                        <option value="water">Water Damage</option>
                        <option value="roof">Roof Damage</option>
                        <option value="fire">Fire Damage</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className={styles.inputGroup}>
                      <textarea
                        name="description"
                        placeholder="Briefly describe your situation..."
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                      />
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
                      Get My Free Case Review
                      <ArrowRight size={20} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statCard}>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className={styles.problemSection}>
        <div className="container">
          <div className={styles.problemGrid}>
            <div className={styles.problemContent}>
              <h2 className={styles.sectionTitle}>
                Is KIN Insurance <span className={styles.highlight}>Treating You Unfairly?</span>
              </h2>
              <p className={styles.problemText}>
                After a storm damages your home, you expect your insurance company to help.
                Unfortunately, KIN Insurance often denies valid claims, delays payments, or
                offers far less than what's needed to repair your property.
              </p>
              <ul className={styles.problemList}>
                <li>
                  <CheckCircle className={styles.listIcon} />
                  <span>Claim denied without proper investigation</span>
                </li>
                <li>
                  <CheckCircle className={styles.listIcon} />
                  <span>Settlement offer doesn't cover repair costs</span>
                </li>
                <li>
                  <CheckCircle className={styles.listIcon} />
                  <span>Endless delays and unreturned calls</span>
                </li>
                <li>
                  <CheckCircle className={styles.listIcon} />
                  <span>Damage blamed on "pre-existing conditions"</span>
                </li>
                <li>
                  <CheckCircle className={styles.listIcon} />
                  <span>Policy exclusions used unfairly</span>
                </li>
              </ul>
              <p className={styles.problemCta}>
                <strong>You have rights.</strong> Let us fight for the compensation you deserve.
              </p>
            </div>
            <div className={styles.problemImage}>
              <div className={styles.imageCard}>
                <Award className={styles.awardIcon} />
                <h4>Recognized Excellence</h4>
                <p>Top-rated insurance claim attorneys fighting for Florida homeowners</p>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={styles.star} fill="#ffb800" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className={styles.processSection} id="process">
        <div className="container">
          <h2 className={styles.sectionTitleCenter}>
            How We <span className={styles.highlight}>Win Your Case</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Our proven 4-step process has helped thousands of Florida homeowners
            get the insurance payouts they deserve.
          </p>
          <div className={styles.processGrid}>
            {processSteps.map((step, index) => (
              <div key={index} className={styles.processCard}>
                <div className={styles.processNumber}>{index + 1}</div>
                <div className={styles.processIconWrapper}>
                  {step.icon}
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
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
      <section className={styles.ctaSection} id="free-evaluation">
        <div className="container">
          <div className={styles.ctaContent}>
            <h2>Ready to Fight Back Against KIN Insurance?</h2>
            <p>
              Get your free, no-obligation case review today. Our team is standing by
              to help you get the compensation you deserve.
            </p>
            <div className={styles.ctaButtons}>
              <a href="tel:8336574812" className={styles.ctaPrimary}>
                <Phone size={20} />
                <span>Call 833-657-4812</span>
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={styles.ctaSecondary}>
                <span>Start Your Free Review</span>
                <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
