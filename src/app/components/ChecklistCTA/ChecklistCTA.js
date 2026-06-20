"use client";
import { useState } from "react";
import styles from "./ChecklistCTA.module.css";
import { ClipboardList, Home, Scale } from "lucide-react";

const CONFIG = {
  ssdi: {
    title: "Get Your Free SSDI Checklist",
    subtitle: "28-step approval guide with deadlines, documents, and pro tips",
    buttonText: "Get Free SSDI Checklist →",
    checklistUrl: "/checklist-ssdi.html",
    emoji: "📋",
  },
  "property-damage": {
    title: "Get Your Free Property Damage Checklist",
    subtitle: "24-step claim guide — protect your rights after damage to your home",
    buttonText: "Get Free FPP Checklist →",
    checklistUrl: "/checklist-fpp.html",
    emoji: "🏠",
  },
  "personal-injury": {
    title: "Get Your Free Personal Injury Checklist",
    subtitle: "23 critical steps to protect your rights after an accident in Florida",
    buttonText: "Get Free PI Checklist →",
    checklistUrl: "/checklist-pi.html",
    emoji: "⚖️",
  },
};

const EMOJI_MAP = { "📋": ClipboardList, "🏠": Home, "⚖️": Scale };

export default function ChecklistCTA({ articleType = "property-damage" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!CONFIG[articleType]) return null;
  const config = CONFIG[articleType];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.includes("@")) return;
    setSubmitting(true);

    try {
      // Send to GHL via n8n webhook
      await fetch("https://n8n.louislawgroup.com/webhook/llg-checklist-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          checklistType: articleType,
          source: "checklist-cta",
          page: typeof window !== "undefined" ? window.location.pathname : "",
        }),
      });
    } catch {
      // Silent — still show checklist
    }

    // Track event
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "checklist_download", {
        checklist_type: articleType,
        page: window.location.pathname,
      });
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className={styles.wrap}>
        <div className={styles.card}>
          <div className={styles.successIcon}>✓</div>
          <div className={styles.successText}>Your checklist is ready!</div>
          <a
            href={config.checklistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.downloadBtn}
          >
            Open Your {articleType === "ssdi" ? "SSDI" : articleType === "personal-injury" ? "PI" : "FPP"} Checklist →
          </a>
          <p className={styles.hint}>
            Opens in a new tab. Bookmark it — your progress saves automatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.emoji}>{(() => { const C = EMOJI_MAP[config.emoji]; return C ? <C size={22} strokeWidth={1.5} /> : <span>{config.emoji}</span>; })()}</div>
        <h3 className={styles.title}>{config.title}</h3>
        <p className={styles.subtitle}>{config.subtitle}</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          <button type="submit" className={styles.btn} disabled={submitting}>
            {submitting ? "Sending..." : config.buttonText}
          </button>
        </form>
        <p className={styles.disclaimer}>Free. No spam. Unsubscribe anytime.</p>
      </div>
    </div>
  );
}
