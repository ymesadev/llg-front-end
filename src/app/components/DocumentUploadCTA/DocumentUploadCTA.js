"use client";
import { useState } from "react";
import styles from "./DocumentUploadCTA.module.css";

export default function DocumentUploadCTA({ articleType = "property-damage" }) {
  const isSSDI = articleType === "ssdi";
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const headline = isSSDI
    ? "Upload Your SSDI Denial Letter — Free Case Review"
    : "Upload Your Denial Letter & Insurance Policy — Free Review";

  const subtitle = isSSDI
    ? "Our SSDI attorneys will review your denial at no cost. Find out if you qualify to appeal."
    : "Our property damage attorneys will review your documents for free and tell you if you have a claim.";

  const fileLabel = isSSDI
    ? "Upload SSDI Denial Letter (PDF, JPG, PNG)"
    : "Upload Denial Letter & Insurance Policy (PDF, JPG, PNG)";

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("articleType", articleType);
    files.forEach((f) => data.append("files", f));

    try {
      const res = await fetch("/api/upload-documents", { method: "POST", body: data });
      const result = await res.json();
      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(result.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className={styles.ctaBox}>
        <div className={styles.successMsg}>
          <div className={styles.successIcon}>✅</div>
          <h3>Documents Received!</h3>
          <p>
            Thank you, <strong>{formData.name}</strong>. Our attorneys will
            review your documents and reach out within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.ctaBox}>
      <div className={styles.ctaInner}>
        <div className={styles.ctaHeader}>
          <span className={styles.ctaBadge}>Free Case Review</span>
          <h3 className={styles.headline}>{headline}</h3>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fields}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              required
              value={formData.phone}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          <label className={styles.fileUpload}>
            <div className={styles.fileUploadInner}>
              <span className={styles.uploadIcon}>📎</span>
              <span>{fileLabel}</span>
            </div>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className={styles.fileInput}
            />
          </label>
          {files.length > 0 && (
            <ul className={styles.fileList}>
              {files.map((f, i) => (
                <li key={i}>📄 {f.name}</li>
              ))}
            </ul>
          )}
          {errorMsg && <p className={styles.error}>{errorMsg}</p>}
          <button
            type="submit"
            disabled={status === "submitting"}
            className={styles.submitBtn}
          >
            {status === "submitting" ? "Uploading..." : "Submit Documents — Free Review"}
          </button>
        </form>
        <p className={styles.disclaimer}>
          🔒 Secure & Confidential — No fees unless we win your case.
        </p>
      </div>
    </div>
  );
}
