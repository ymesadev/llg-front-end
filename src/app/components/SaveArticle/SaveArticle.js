"use client";

import { useState } from "react";
import styles from "./SaveArticle.module.css";
import { trackEvent } from "@/app/utils/analytics";

export default function SaveArticle({ title, slug }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes("@") || sending) return;
    setSending(true);

    try {
      await fetch("/api/save-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, title, slug, url: window.location.href }),
      });
    } catch { /* silent */ }

    trackEvent("save_article_submitted", { slug });
    setSent(true);
    setSending(false);
  };

  if (!open) {
    return (
      <button
        className={styles.trigger}
        onClick={() => {
          setOpen(true);
          trackEvent("save_article_opened", { slug });
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        Save this article
      </button>
    );
  }

  if (sent) {
    return (
      <div className={styles.panel}>
        <div className={styles.check}>&#10003;</div>
        <p className={styles.confirmText}>Saved! Check your inbox for the link.</p>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <p className={styles.label}>Email yourself this article</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          autoFocus
        />
        <button type="submit" className={styles.send} disabled={!email.includes("@") || sending}>
          {sending ? "..." : "Send"}
        </button>
      </form>
      <button className={styles.cancel} onClick={() => setOpen(false)}>Cancel</button>
    </div>
  );
}
