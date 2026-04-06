"use client";

import { useState, useRef } from "react";
import styles from "./caselaw.module.css";
import { trackGoogleConversion } from "@/app/utils/analytics";

export default function PolicyReviewForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    // Max 5 files, 10MB each
    const valid = selected.filter((f) => f.size <= 10 * 1024 * 1024).slice(0, 5);
    setFiles(valid);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") return; // prevent double submit
    setStatus("submitting");
    setErrorMsg("");

    try {
      const body = new FormData();
      body.append("fullName", formData.fullName);
      body.append("email", formData.email);
      body.append("phone", formData.phone);
      body.append("message", formData.message);
      files.forEach((f) => body.append("files", f));

      const res = await fetch("/api/policy-review", {
        method: "POST",
        body,
      });

      if (res.ok) {
        trackGoogleConversion();
        setStatus("success");
        setFormData({ fullName: "", email: "", phone: "", message: "" });
        setFiles([]);
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please call us at 833-657-4812.");
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
            rows={3}
            value={formData.message}
            onChange={handleChange}
            placeholder="Describe the claim, carrier involved, type of damage, and any relevant details..."
            className={styles.formTextarea}
          />
        </div>
        <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
          <label htmlFor="files" className={styles.formLabel}>
            Upload Policy or Denial Letter (optional)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            id="files"
            name="files"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.tiff,.tif"
            onChange={handleFileChange}
            className={styles.formFileInput}
          />
          <p className={styles.formHint}>PDF, DOC, DOCX, JPG, PNG, TIFF — max 10 MB per file, up to 5 files</p>
          {files.length > 0 && (
            <ul className={styles.fileList}>
              {files.map((f, i) => (
                <li key={i} className={styles.fileItem}>
                  <span>{f.name} ({(f.size / 1024).toFixed(0)} KB)</span>
                  <button type="button" onClick={() => removeFile(i)} className={styles.fileRemove}>Remove</button>
                </li>
              ))}
            </ul>
          )}
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
