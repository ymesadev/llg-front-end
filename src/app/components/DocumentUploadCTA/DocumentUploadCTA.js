"use client";
import { useState } from "react";
import styles from "./DocumentUploadCTA.module.css";

export default function DocumentUploadCTA({ articleType = "property-damage" }) {
  const isSSdi = articleType === "ssdi";
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const headline = isSSdi
    ? "Upload Your SSDI Denial — Free Attorney Review"
    : "Upload Your Denial Letter & Insurance Policy — Free Review";
  const subtitle = isSSdi
    ? "Our SSDI attorneys will review your denial letter and tell you if you have an appeal case — at no charge."
    : "Our property damage attorneys will review your documents and advise you on your claim — at no charge.";
  const fileLabel = isSSdi
    ? "Attach SSDI Denial Letter (PDF, JPG, PNG)"
    : "Attach Denial Letter & Insurance Policy (PDF, JPG, PNG)";

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
      let result;
      try { result = await res.json(); } catch { result = { success: false }; }
      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(result.error || "Submission failed. Please call us at (833) 657-4812.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Could not submit. Please call us at (833) 657-4812 or try again.");
    }
  };

  if (status === "success") {
    return (
      <div className={styles.ctaBox}>
        <div className={styles.success}>
          <h3 className={styles.successTitle}>✅ Documents Received</h3>
          <p>Thank you, {formData.name}. An attorney will review your documents and contact you within 24 hours.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.ctaBox}>
      <div className={styles.inner}>
        <h3 className={styles.headline}>{headline}</h3>
        <p className={styles.subtitle}>{subtitle}</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fields}>
            <input
              type="text" placeholder="Full Name" required
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              className={styles.input}
            />
            <input
              type="email" placeholder="Email Address" required
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              className={styles.input}
            />
            <input
              type="tel" placeholder="Phone Number" required
              value={formData.phone}
              onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
              className={styles.input}
            />
          </div>
          <label className={styles.fileArea}>
            <span className={styles.fileBtn}>📎 {fileLabel}</span>
            <input
              type="file" multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className={styles.fileInput}
            />
          </label>
          {files.length > 0 && (
            <ul className={styles.fileList}>
              {files.map((f, i) => <li key={i}>📄 {f.name}</li>)}
            </ul>
          )}
          {errorMsg && <p className={styles.error}>{errorMsg}</p>}
          <button type="submit" disabled={status === "submitting"} className={styles.btn}>
            {status === "submitting" ? "Uploading…" : "Submit for Free Attorney Review →"}
          </button>
        </form>
        <p className={styles.disclaimer}>🔒 Confidential · No fees unless we win · Available 24/7</p>
      </div>
    </div>
  );
}
