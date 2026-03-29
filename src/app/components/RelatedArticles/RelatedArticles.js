"use client";

import Link from "next/link";
import styles from "./RelatedArticles.module.css";

const ICONS = {
  ssdi: "\u2696\uFE0F",
  "property-damage": "\uD83C\uDFE0",
  "case-law": "\uD83D\uDCDC",
  default: "\uD83D\uDCC4",
};

export default function RelatedArticles({ title, links, articleType }) {
  if (!links || links.length === 0) return null;

  const icon = ICONS[articleType] || ICONS.default;
  const display = links.slice(0, 4);

  return (
    <section className={styles.section}>
      <h3 className={styles.heading}>{title}</h3>
      <div className={styles.grid}>
        {display.map((link, i) => (
          <Link href={link.href} key={i} className={styles.card}>
            <span className={styles.icon}>{icon}</span>
            <span className={styles.label}>{link.label}</span>
            <span className={styles.arrow}>&rarr;</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
