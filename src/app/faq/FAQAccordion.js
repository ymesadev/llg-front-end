"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const CATEGORIES = {
  ssdi: "Social Security Disability (SSDI/SSI)",
  "property-damage": "Property Damage Claims",
  "water-damage": "Water Damage & Restoration",
  mold: "Mold Damage",
  "insurance-litigation": "Insurance Litigation",
  statutes: "Florida Statutes & Deadlines",
  general: "General Legal Questions",
};

export default function FAQAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const presentCategories = ["all", ...Object.keys(CATEGORIES).filter(k =>
    faqs.some(f => f.category === k)
  )];

  const filtered = activeCategory === "all"
    ? faqs
    : faqs.filter(f => f.category === activeCategory);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <>
      {/* Category Filter */}
      <section className={styles.filterBar}>
        <div className={styles.filterInner}>
          {presentCategories.map(cat => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ""}`}
              onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
            >
              {cat === "all" ? `All (${faqs.length})` : CATEGORIES[cat] || cat}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className={styles.faqSection}>
        <div className={styles.faqInner}>
          {filtered.length === 0 && (
            <div className={styles.empty}>No FAQs in this category yet.</div>
          )}
          {filtered.map((faq, i) => (
            <div
              key={faq.id || i}
              className={`${styles.faqItem} ${openIndex === i ? styles.faqOpen : ""}`}
            >
              <button
                className={styles.faqQuestion}
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
              >
                <span>{faq.question}</span>
                <span className={styles.faqIcon}>{openIndex === i ? "−" : "+"}</span>
              </button>
              {openIndex === i && (
                <div className={styles.faqAnswer}>
                  <p>{faq.answer}</p>
                  <div className={styles.faqCta}>
                    <Link href="sms:+18336574812" className={styles.faqCtaTextUs}>
                      💬 Text Us Now
                    </Link>
                    <Link href="tel:+18336574812" className={styles.faqCtaCall}>
                      📞 Call Free
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
