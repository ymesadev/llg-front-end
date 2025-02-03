"use client";
import { useState } from "react";
import styles from "./Hero.module.css";
import emailjs from "@emailjs/browser";

// 1) Import the Lottie component and your JSON animation
import Lottie from "lottie-react";
import successAnimation from "../../../../public/lottie/success.json";

export default function HeroForm() {
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

  // Focus states for inputs
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isZipcodeFocused, setIsZipcodeFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  // Track form status to handle success / error states
  const [formStatus, setFormStatus] = useState("idle"); 
  // 'idle' | 'submitting' | 'success' | 'error'

  const steps = [
    { label: "What is your name?" },
    { label: "What is your phone number and zipcode?" },
    { label: "What is your email address?" },
    { label: "What type of case do you have?" },
    { label: "Tell us more about your case." },
    { label: "Do you consent to communications?" },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus("submitting");

    // Your EmailJS credentials
    const serviceID = "service_1nkcxkl";
    const templateID = "template_ni4v0do";
    const publicKey = "bQdrcK7Eju1NykCqt";

    const templateParams = {
      name: formData.name,
      phone: formData.phone,
      zipcode: formData.zipcode,
      email: formData.email,
      caseType: formData.caseType,
      description: formData.description,
      consent: formData.consent ? "Yes" : "No",
    };

    emailjs
      .send(serviceID, templateID, templateParams, publicKey)
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);
        setFormStatus("success");
        // Optionally reset the form data and steps
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
                  begin by typing here…..<span className={styles.caret}>|</span>
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
            ></textarea>
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
      {/* 
        Only show the FORM if not successful yet. 
        If 'error', we still show it (so user can retry). 
      */}
      {formStatus !== "success" && (
        <form onSubmit={handleSubmit} className={styles.heroForm}>
          <div className={styles.stepHeader}>
            <div className={styles.stepCircle}>{currentStep + 1}</div>
            <p className={styles.stepQuestion}>{steps[currentStep].label}</p>
          </div>
          <div className={styles.stepContent}>{renderStepContent(currentStep)}</div>

          {/* Show the next step preview only if not on last step */}
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
                {formStatus === "submitting"
                  ? "Submitting..."
                  : "Free Case Evaluation"}
              </button>
            )}
          </div>

          {/* Show an error message if submission failed */}
          {formStatus === "error" && (
            <div className={styles.errorContainer}>
              <p className={styles.errorMessage}>
                Oops! Something went wrong. Please try again.
              </p>
            </div>
          )}
        </form>
      )}

      {/* If submission is successful, show Lottie animation + success message */}
      {formStatus === "success" && (
        <div className={styles.successContainer}>
          <Lottie 
            animationData={successAnimation} 
            loop={false}  
            className={styles.lottieAnimation} 
          />
          <p className={styles.successMessage}>
            Thank you! Your form has been submitted successfully.
          </p>
        </div>
      )}
    </div>
  );
}