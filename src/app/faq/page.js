"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

const STRAPI = process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://login.louislawgroup.com";

const CATEGORIES = {
  ssdi: "Social Security Disability (SSDI/SSI)",
  "property-damage": "Property Damage Claims",
  "water-damage": "Water Damage & Restoration",
  mold: "Mold Damage",
  "insurance-litigation": "Insurance Litigation",
  statutes: "Florida Statutes & Deadlines",
  general: "General Legal Questions",
};

function getCategoryFromSlug(slug) {
  for (const key of Object.keys(CATEGORIES)) {
    if (slug.includes(`faq-${key}`)) return key;
  }
  return "general";
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    async function fetchFAQs() {
      try {
        const res = await fetch(
          `${STRAPI}/api/articles?filters[slug][$startsWith]=faq-&pagination[limit]=500&sort=updatedAt:desc&fields[0]=title&fields[1]=slug&fields[2]=description&fields[3]=updatedAt`,
          { next: { revalidate: 3600 } }
        );
        const data = await res.json();
        const items = (data?.data || []).map((item) => {
          const attrs = item?.attributes ?? item ?? {};
          return {
            id: item.id,
            question: attrs.title || "",
            answer: attrs.description || "",
            slug: attrs.slug || "",
            category: getCategoryFromSlug(attrs.slug || ""),
            updatedAt: attrs.updatedAt || "",
          };
        }).filter(f => f.question && f.answer);

        setFaqs(items);
        if (items.length > 0) {
          setLastUpdated(new Date(items[0].updatedAt));
        }
      } catch (e) {
        console.error("FAQ fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchFAQs();
  }, []);

  const categories = ["all", ...Object.keys(CATEGORIES).filter(k =>
    faqs.some(f => f.category === k)
  )];

  const filtered = activeCategory === "all"
    ? faqs
    : faqs.filter(f => f.category === activeCategory);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.badge}>Free Legal Answers</div>
          <h1 className={styles.heroTitle}>
            Frequently Asked Legal Questions
          </h1>
          <p className={styles.heroSub}>
            Answers to common questions about SSDI, property damage, insurance
            claims, water damage, mold, and Florida statutes. Updated continuously.
          </p>
          {lastUpdated && (
            <p className={styles.lastUpdated}>
              Last updated: {lastUpdated.toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric"
              })}
            </p>
          )}
          <Link href="tel:8336574812" className={styles.ctaBtn}>
            Speak with an Attorney — (833) 657-4812
          </Link>
        </div>
      </section>

      {/* Category Filter */}
      <section className={styles.filterBar}>
        <div className={styles.filterInner}>
          {categories.map(cat => (
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
          {loading && (
            <div className={styles.loading}>Loading answers...</div>
          )}

          {!loading && filtered.length === 0 && (
            <div className={styles.empty}>
              No FAQs in this category yet. Check back soon.
            </div>
          )}

          {!loading && filtered.map((faq, i) => (
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
                    <span>Have a similar situation?</span>
                    <Link href="tel:8336574812" className={styles.faqCtaLink}>
                      Get a free consultation →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={styles.bottomCta}>
        <div className={styles.bottomCtaInner}>
          <h2>Don't See Your Question?</h2>
          <p>
            Our attorneys answer questions about SSDI denials, insurance claim
            disputes, water damage, mold, and all Florida property litigation — free.
          </p>
          <div className={styles.ctaRow}>
            <Link href="tel:8336574812" className={styles.ctaBtnPrimary}>
              Call (833) 657-4812
            </Link>
            <Link href="/#contact" className={styles.ctaBtnSecondary}>
              Submit Your Question
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
