"use client";

import { useState } from "react";
import styles from "./caselaw.module.css";

export default function PolicyReviewForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch(
        "https://n8n.louislawgroup.com/webhook/policy-review-submit",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        setStatus("success");
        setFormData({ fullName: "", email: "", phone: "", message: "" });
      } else {
        setStatus("error");
        setErrorMsg("Something went wrong. Please call us at 833-657-4812.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please call us at 833-657-4812.");
    }
  };

  if (status === "success") {
    return (
      <div className={styles.formSuccess}>
        <h3>Thank You!</h3>
        <p>
          Your policy review request has been submitted. Our attorneys will
          contact you within 24 hours.
        </p>
        <button
          className={styles.formButton}
          onClick={() => setStatus("idle")}
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="fullName" className={styles.formLabel}>
            Full Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            className={styles.formInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.formLabel}>
            Email <span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={styles.formInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.formLabel}>
            Phone Number <span className={styles.required}>*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="(555) 123-4567"
            className={styles.formInput}
          />
        </div>
        <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
          <label htmlFor="message" className={styles.formLabel}>
            Brief Description of the Claim (optional)
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            placeholder="Describe the claim, carrier involved, type of damage, and any relevant details..."
            className={styles.formTextarea}
          />
        </div>
      </div>
      {status === "error" && (
        <p className={styles.formError}>{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className={styles.formButton}
      >
        {status === "submitting" ? "Submitting..." : "Submit for Review"}
      </button>
    </form>
  );
}
