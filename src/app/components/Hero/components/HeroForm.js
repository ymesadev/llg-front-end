"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaTimesCircle, FaSpinner } from "react-icons/fa";
import styles from "./HeroForm.module.css";

export default function FreeCaseEvaluationPage() {
  const router = useRouter();

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    zipcode: "",
    email: "",
    caseType: "",
    filedCarrier: "",
    description: "",
    consent: false,
  });

  // Focus states for custom placeholders (optional)
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isZipcodeFocused, setIsZipcodeFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  // Form status: "idle" | "submitting" | "success" | "error"
  const [formStatus, setFormStatus] = useState("idle");

  // ← no type annotations here
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Special case: Warranty Law + American Home Shield → redirect to retainer page
    if (formData.caseType === "Warranty Law" && formData.filedCarrier === "American Home Shield") {
      router.push("https://app.louislawgroup.com/american-home-shield-retainer");
      return;
    }

    setFormStatus("submitting");

    const payload = {
      name: formData.name,
      phone: formData.phone,
      zipcode: formData.zipcode,
      email: formData.email,
      caseType: formData.caseType,
      description: formData.description,
      consent: formData.consent ? "Yes" : "No",
      filedCarrier: formData.filedCarrier || null,
    };

    console.log("Form Data being submitted:", {
      payload,
      timestamp: new Date().toISOString(),
    });

    try {
      const response = await fetch(
        "https://dev-n8n.louislawgroup.com/webhook/forms",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      console.log("Raw API Response:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok (status ${response.status})`);
      }

      const data = await response.json();
      console.log("API Success Response:", {
        data,
        timestamp: new Date().toISOString(),
      });

      setFormStatus("success");
      // reset form if you like—user will be redirected immediately
      setFormData({
        name: "",
        phone: "",
        zipcode: "",
        email: "",
        caseType: "",
        filedCarrier: "",
        description: "",
        consent: false,
      });
    } catch (err) {
      console.error("API Error:", {
        error: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString(),
      });
      setFormStatus("error");
    }
  };

  // Log form data changes
  useEffect(() => {
    console.log("Form Data Updated:", {
      currentData: formData,
      timestamp: new Date().toISOString(),
    });
  }, [formData]);

  // Log form status changes
  useEffect(() => {
    console.log("Form Status Changed:", {
      status: formStatus,
      timestamp: new Date().toISOString(),
    });
  }, [formStatus]);

  // Redirect on success
  useEffect(() => {
    if (formStatus === "success") {
      router.push("https://www.louislawgroup.com/thank-you");
    }
  }, [formStatus, router]);

  // — error state —
  if (formStatus === "error") {
    return (
      <div className={styles.errorContainer}>
        <FaTimesCircle className={styles.errorIcon} />
        <p className={styles.errorMessage}>
          Oops! Something went wrong. Please try again.
        </p>
      </div>
    );
  }

  // — submitting state —
  if (formStatus === "submitting") {
    return (
      <div className={styles.spinnerContainer}>
        <FaSpinner className={styles.spinner} />
        <p>Submitting...</p>
      </div>
    );
  }

  // — default (idle) state: show form —
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
          <label>Name</label>
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
          <label>Phone</label>
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
          <label>Zip Code</label>
        </div>
      </div>

      {/* Case Type*/}
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
          <option value="Employment Law">Employment Law</option>
          <option value="Warranty Law">Warranty Law</option>
        </select>
      </div>

      {/* Filed Carrier (conditional for Warranty Law) */}
      {formData.caseType === "Warranty Law" && (
        <div className={styles.inputContainer}>
          <select
            name="filedCarrier"
            value={formData.filedCarrier}
            onChange={handleInputChange}
            className={formData.filedCarrier === "" ? styles.placeholder : ""}
            required
          >
            <option value="" disabled>
              Select Carrier
            </option>
            <option value="American Home Shield">American Home Shield</option>
            <option value="Other">Other</option>
          </select>
        </div>
      )}

      {/* Description */}
      <div className={styles.message}>
        <label>Message</label>
        <textarea
          name="description"
          placeholder="Tell us more about your case"
          className={styles.textarea}
          rows={4}
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
    By submitting this form, you consent to receive case updates, appointment reminders, and important legal notifications from Louis Law Group at the number provided. Msg &amp; data rates may apply. Message frequency may vary depending on your case status. You can unsubscribe at any time by replying STOP or clicking the unsubscribe link. Reply HELP for assistance. Your phone number will not be shared with third parties. Read our{' '}
    <a href="https://www.louislawgroup.com/privacy-policy" target="_blank" rel="noopener noreferrer">
      Privacy Policy
    </a>{' '}and{' '}
    <a href="https://www.louislawgroup.com/terms-of-use-agreement" target="_blank" rel="noopener noreferrer">
      Terms of Use Agreement
    </a>{' '}for more information.
  </label>
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