import Link from "next/link";
import styles from "./page.module.css";
import FAQAccordion from "./FAQAccordion";

// ISR: regenerate every hour
export const revalidate = 3600;

export const metadata = {
  title: "Insurance & SSDI Legal FAQ | Louis Law Group",
  description: "Answers to common questions about property damage claims, SSDI, insurance claim process, ACV vs RCV, EUO, recorded statements, and Florida deadlines.",
  alternates: { canonical: "https://www.louislawgroup.com/faq" },
};

const STRAPI = process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://login.louislawgroup.com";

function getCategoryFromSlug(slug) {
  const KEYS = ["ssdi", "property-damage", "water-damage", "mold", "insurance-litigation", "statutes"];
  for (const key of KEYS) {
    if (slug.includes(`faq-${key}`)) return key;
  }
  return "general";
}

async function fetchFAQs() {
  try {
    const res = await fetch(
      `${STRAPI}/api/articles?filters[slug][$startsWith]=faq-&pagination[limit]=500&sort=updatedAt:desc&fields[0]=title&fields[1]=slug&fields[2]=description&fields[3]=updatedAt`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.data || []).map((item) => {
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
  } catch {
    return [];
  }
}

export default async function FAQPage() {
  const faqs = await fetchFAQs();
  const lastUpdated = faqs.length > 0
    ? new Date(faqs[0].updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  // FAQPage schema — use top 20 for structured data (keeps payload reasonable)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.slice(0, 20).map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer }
    }))
  };

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.badge}>Free Legal Answers</div>
          <h1 className={styles.heroTitle}>
            Frequently Asked Legal Questions
          </h1>
          <p className={styles.heroSub}>
            Answers to common questions about property damage claims, SSDI, insurance
            claim process, ACV vs RCV, EUO, recorded statements, and Florida deadlines.
            Updated continuously.
          </p>
          {lastUpdated && (
            <p className={styles.lastUpdated}>Last updated: {lastUpdated}</p>
          )}
          <Link href="tel:8336574812" className={styles.ctaBtn}>
            Speak with an Attorney — (833) 657-4812
          </Link>
        </div>
      </section>

      {/* Client component handles filter + accordion interactivity */}
      <FAQAccordion faqs={faqs} />

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
