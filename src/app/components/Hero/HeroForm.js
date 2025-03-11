"use client"; // Important if you're on Next.js 13 App Router

import { useState } from "react";
import styles from "./Hero.module.css";

export default function FreeCaseEvaluationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    zipcode: "",
    email: "",
    caseType: "",
    description: "",
    consent: false,
  });

  // Focus states for custom placeholders
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isZipcodeFocused, setIsZipcodeFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  // Form status tracking: 'idle' | 'submitting' | 'success' | 'error'
  const [formStatus, setFormStatus] = useState("idle");

  const steps = [
    { label: "What is your name?" },
    { label: "What is your phone number and zipcode?" },
    { label: "What is your email address?" },
    { label: "What type of case do you have?" },
    { label: "Tell us more about your case." },
    { label: "Do you consent to communications?" },
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Navigation
  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  // Final submission (to Go High Level)
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus("submitting");

    // Build the payload for Go High Level
    const payload = {
      name: formData.name,
      phone: formData.phone,
      zipcode: formData.zipcode,
      email: formData.email,
      caseType: formData.caseType,
      description: formData.description,
      consent: formData.consent ? "Yes" : "No",
    };

    // Replace with your actual Go High Level webhook/API endpoint
    const ghlEndpoint = "https://services.leadconnectorhq.com/hooks/OpuRBif1UwDh1UMMiJ7o/webhook-trigger/52c60449-a7a0-42ca-b25a-6b1b93ed4f66";

    fetch(ghlEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // If your endpoint requires an API key, add it here:
       "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6Ik9wdVJCaWYxVXdEaDFVTU1pSjdvIiwiY29tcGFueV9pZCI6Ik5PeVlnSFd0a0xqcVpLWllwcVV6IiwidmVyc2lvbiI6MSwiaWF0IjoxNzAxMjc0MjQ4NjcyLCJzdWIiOiJUdjBYcjRBVWdlQWZYWmdmMXdYSSJ9.mulKiJrZUZOnUgx7hKwI_wKMCd7ghNQtAou7Ux7_cQ8",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("SUCCESS!", data);
        setFormStatus("success");
        // Optionally reset the form data and step
        setFormData({
          name: "",
          phone: "",
          zipcode: "",
          email: "",
          caseType: "",
          description: "",
          consent: false,
        });
        setCurrentStep(0);
      })
      .catch((err) => {
        console.error("FAILED...", err);
        setFormStatus("error");
      });
  };

  // Render content for each step
  const renderStepContent = (index) => {
    switch (index) {
      case 0:
        return (
          <div className={styles.formGroup}>
            <div className={styles.inputContainer}>
              <input
                type="text"
                name="name"
                className={styles.input}
                value={formData.name}
                onChange={handleInputChange}
                onFocus={() => setIsNameFocused(true)}
                onBlur={() => setIsNameFocused(false)}
                required
              />
              {!isNameFocused && formData.name === "" && (
                <span className={styles.placeholderOverlay}>
                  begin by typing here…<span className={styles.caret}>|</span>
                </span>
              )}
            </div>
          </div>
        );
      case 1:
        return (
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <div className={styles.inputContainer}>
                <input
                  type="tel"
                  name="phone"
                  className={styles.input}
                  value={formData.phone}
                  onChange={handleInputChange}
                  onFocus={() => setIsPhoneFocused(true)}
                  onBlur={() => setIsPhoneFocused(false)}
                  required
                />
                {!isPhoneFocused && formData.phone === "" && (
                  <span className={styles.placeholderOverlay}>
                    Phone Number…<span className={styles.caret}>|</span>
                  </span>
                )}
              </div>
            </div>
            <div className={styles.formGroup}>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  name="zipcode"
                  className={styles.input}
                  value={formData.zipcode}
                  onChange={handleInputChange}
                  onFocus={() => setIsZipcodeFocused(true)}
                  onBlur={() => setIsZipcodeFocused(false)}
                  required
                />
                {!isZipcodeFocused && formData.zipcode === "" && (
                  <span className={styles.placeholderOverlay}>
                    Zipcode…<span className={styles.caret}>|</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className={styles.formGroup}>
            <div className={styles.inputContainer}>
              <input
                type="email"
                name="email"
                className={styles.input}
                value={formData.email}
                onChange={handleInputChange}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                required
              />
              {!isEmailFocused && formData.email === "" && (
                <span className={styles.placeholderOverlay}>
                  Email Address…<span className={styles.caret}>|</span>
                </span>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className={styles.formGroup}>
            <select
              name="caseType"
              className={styles.input}
              value={formData.caseType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Case Type</option>
              <option value="Property Damage">Property Damage</option>
              <option value="Personal Injury">Personal Injury</option>
              <option value="SSDI">SSDI</option>
            </select>
          </div>
        );
      case 4:
        return (
          <div className={styles.formGroup}>
            <textarea
              name="description"
              className={styles.input}
              rows="4"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
        );
      case 5:
        return (
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleInputChange}
              required
            />
            <label>
              I hereby expressly consent to receive automated communications
              including calls, texts, emails, and/or prerecorded messages.
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  // Render a small preview of the next step
  const renderStepPreview = (index) => (
    <div className={styles.previewContainer}>
      <div className={styles.previewHeader}>
        <div className={styles.previewCircle}>{index + 1}</div>
        <p className={styles.previewQuestion}>{steps[index].label}</p>
      </div>
      <div className={styles.previewContent}>{renderStepContent(index)}</div>
    </div>
  );

  return (
    <div>
      {formStatus !== "success" && (
        <form onSubmit={handleSubmit} className={styles.heroForm}>
          <div className={styles.stepHeader}>
            <div className={styles.stepCircle}>{currentStep + 1}</div>
            <p className={styles.stepQuestion}>{steps[currentStep].label}</p>
          </div>

          <div className={styles.stepContent}>
            {renderStepContent(currentStep)}
          </div>

          {currentStep < steps.length - 1 && (
            <div className={styles.nextStepPreview}>
              {renderStepPreview(currentStep + 1)}
            </div>
          )}

          <div className={styles.navigationButtons}>
            {currentStep > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className={styles.navButton}
                disabled={formStatus === "submitting"}
              >
                Back
              </button>
            )}
            {currentStep < steps.length - 1 && (
              <button
                type="button"
                onClick={nextStep}
                className={styles.navButton}
                disabled={formStatus === "submitting"}
              >
                Next
              </button>
            )}
            {currentStep === steps.length - 1 && (
              <button
                type="submit"
                className={styles.submitButton}
                disabled={formStatus === "submitting"}
              >
                {formStatus === "submitting" ? "Submitting..." : "Free Case Evaluation"}
              </button>
            )}
          </div>

          {formStatus === "error" && (
            <div className={styles.errorContainer}>
              <p className={styles.errorMessage}>
                Oops! Something went wrong. Please try again.
              </p>
            </div>
          )}
        </form>
      )}

      {formStatus === "success" && (
        <div className={styles.successContainer}>
          <p className={styles.successMessage}>
            Thank you! Your form has been submitted successfully.
          </p>
        </div>
      )}
    </div>
  );
}