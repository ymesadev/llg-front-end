"use client";

import Link from "next/link";
import { Scale, Home, ScrollText, Hammer, ShieldCheck, Lock, FileText } from "lucide-react";
import styles from "./RelatedArticles.module.css";

// Professional Lucide icons per article type (replaces emoji to match site-wide icon modernization)
const ICONS = {
  ssdi: Scale,
  "property-damage": Home,
  "case-law": ScrollText,
  "personal-injury": Scale,
  "contractor-damage": Hammer,
  "warranty": ShieldCheck,
  "privacy-tort": Lock,
  "ahs": ShieldCheck,
  "kin": Home,
  "slide": Home,
  "tower-hill": Home,
  "american-integrity": Home,
  default: FileText,
};

export default function RelatedArticles({ title, links, articleType }) {
  if (!links || links.length === 0) return null;

  const Icon = ICONS[articleType] || ICONS.default;
  const display = links.slice(0, 4);

  return (
    <section className={styles.section}>
      <h3 className={styles.heading}>{title}</h3>
      <div className={styles.grid}>
        {display.map((link, i) => (
          <Link href={link.href} key={i} className={styles.card}>
            <span className={styles.icon}><Icon size={20} strokeWidth={1.5} /></span>
            <span className={styles.label}>{link.label}</span>
            <span className={styles.arrow}>&rarr;</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
