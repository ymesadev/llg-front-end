"use client";

import { useState, useEffect } from "react";
import styles from "./ReadingProgress.module.css";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const article = document.querySelector("article") || document.querySelector('[class*="articleBody"]');
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const total = article.scrollHeight;
      const scrolled = -rect.top;
      const pct = Math.min(Math.max((scrolled / (total - window.innerHeight)) * 100, 0), 100);
      setProgress(pct);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (progress <= 0) return null;

  return (
    <div className={styles.container}>
      <div className={styles.bar} style={{ width: `${progress}%` }} />
    </div>
  );
}
