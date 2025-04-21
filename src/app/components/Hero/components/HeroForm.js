"use client";
import { useState, useRef } from "react";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import ReCAPTCHA from 'react-google-recaptcha';
import styles from "./HeroForm.module.css";

export default function FreeCaseEvaluationPage() {
  // Form data
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    zipcode: "",
    email: "",
    caseType: "",
    description: "",
    consent: false,
  });

  // Focus states for custom placeholders (optional)
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isZipcodeFocused, setIsZipcodeFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const [formStatus, setFormStatus] = useState("idle");
  const [captchaValue, setCaptchaValue] = useState(null);
  const recaptchaRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("submitting");

    if (!captchaValue) {
      alert('Please verify that you are not a robot');
      return;
    }

    const payload = {
      name: formData.name,
      phone: formData.phone,
      zipcode: formData.zipcode,
      email: formData.email,
      caseType: formData.caseType,
      description: formData.description,
      consent: formData.consent ? "Yes" : "No",
      recaptchaToken: captchaValue
    };

    const ghlEndpoint =
      "https://services.leadconnectorhq.com/hooks/OpuRBif1UwDh1UMMiJ7o/webhook-trigger/52c60449-a7a0-42ca-b25a-6b1b93ed4f66";

    try {
      const response = await fetch(ghlEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "your-authorization-key",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("SUCCESS!", data);
      setFormStatus("success");
      setFormData({
        name: "",
        phone: "",
        zipcode: "",
        email: "",
        caseType: "",
        description: "",
        consent: false,
      });
      recaptchaRef.current.reset();
      setCaptchaValue(null);
    } catch (err) {
      console.error("FAILED...", err);
      setFormStatus("error");
    }
  };

  if (formStatus === "success") {
    return (
      <div className={styles.successContainer}>
        <FaCheckCircle className={styles.successIcon} />
        <p className={styles.successMessage}>
          Thank you! Your form has been submitted successfully.
        </p>
      </div>
    );
  }

  if (formStatus === "error")
    return (
      <div className={styles.errorContainer}>
        <FaTimesCircle className={styles.errorIcon} />
        <p className={styles.errorMessage}>
          Oops! Something went wrong. Please try again.
        </p>
      </div>
    );

  if (formStatus === "submitting") {
    return (
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
        <p>Submitting...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.heroForm}>
      <div className={styles.grid}>
        {/* Name */}
        <div className={styles.inputContainer}>
          <input
            placeholder=" "
            type="text"
            name="name"
            className={styles.input}
            value={formData.name}
            onChange={handleInputChange}
            onFocus={() => setIsNameFocused(true)}
            onBlur={() => setIsNameFocused(false)}
            required
          />
          <label> Name </label>
        </div>
        {/* Email */}
        <div className={styles.inputContainer}>
          <input
            placeholder=" "
            type="email"
            name="email"
            className={styles.input}
            value={formData.email}
            onChange={handleInputChange}
            onFocus={() => setIsEmailFocused(true)}
            onBlur={() => setIsEmailFocused(false)}
            required
          />
          <label>Email</label>
        </div>
        {/* Phone */}
        <div className={styles.inputContainer}>
          <input
            placeholder=" "
            type="tel"
            name="phone"
            className={styles.input}
            value={formData.phone}
            onChange={handleInputChange}
            onFocus={() => setIsPhoneFocused(true)}
            onBlur={() => setIsPhoneFocused(false)}
            required
          />
          <label> Phone </label>
        </div>

        {/* Zipcode */}
        <div className={styles.inputContainer}>
          <input
            placeholder=" "
            type="text"
            name="zipcode"
            className={styles.input}
            value={formData.zipcode}
            onChange={handleInputChange}
            onFocus={() => setIsZipcodeFocused(true)}
            onBlur={() => setIsZipcodeFocused(false)}
            required
          />
          <label> Zip Code </label>
        </div>
      </div>
      {/* Case Type */}
      <div className={styles.inputContainer}>
        <select
          name="caseType"
          value={formData.caseType}
          onChange={handleInputChange}
          className={formData.caseType === "" ? styles.placeholder : ""}
          required
        >
          <option value="" disabled>
            Select Case Type
          </option>
          <option value="Property Damage">Property Damage</option>
          <option value="Personal Injury">Personal Injury</option>
          <option value="SSDI">SSDI</option>
        </select>
      </div>

      {/* Description */}
      <div className={styles.message}>
        <label> Message </label>
        <textarea
          name="description"
          placeholder="Tell us more about your case"
          className={styles.textarea}
          rows="4"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </div>

      {/* Consent Checkbox */}
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

      {/* reCAPTCHA */}
      <div className={styles.recaptchaContainer}>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          onChange={handleCaptchaChange}
        />
      </div>

      {/* Submission Button */}
      <button type="submit" className={styles.submitButton}>
        Free Case Evaluation
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3.5 20.5 17-17M9.5 3.5h11v11"></path>
          </g>
        </svg>
      </button>
    </form>
  );
}
