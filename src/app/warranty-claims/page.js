import styles from "./page.module.css";

export const revalidate = 3600;

export const metadata = {
  title: "Florida Warranty Claim Attorney | Denied Warranty & Service Contract Lawyers | Louis Law Group",
  description:
    "Florida warranty claim attorneys fighting denied, underpaid & delayed warranty and service-contract claims — auto, home, appliance & builder warranties. Free case review: (833) 657-4812.",
  keywords:
    "warranty claim attorney florida, denied warranty claim lawyer, extended warranty lawsuit florida, vehicle service contract attorney, home warranty denial lawyer, service contract dispute florida, warranty company won't pay",
  alternates: { canonical: "https://www.louislawgroup.com/warranty-claims" },
  openGraph: {
    title: "Florida Warranty Claim Attorney | Louis Law Group",
    description:
      "Denied or underpaid warranty or service-contract claim? Florida warranty attorneys at Louis Law Group fight the warranty companies. Free case review — no fees unless we win.",
    url: "https://www.louislawgroup.com/warranty-claims",
  },
};

const CTA_URL = "/warranty-claims/qualify";

const SERVICES = [
  {
    icon: "🚗",
    title: "Auto & Vehicle Service Contracts",
    desc: "Denied engine, transmission, or covered-component repairs. When your extended warranty or vehicle service contract company refuses to authorize a repair it should cover, we hold them to the contract.",
  },
  {
    icon: "🏠",
    title: "Home Warranty Claims",
    desc: "AC, plumbing, electrical, and appliance failures denied as 'pre-existing' or 'improper maintenance.' We push back on bad-faith home warranty denials and demand the coverage you paid for.",
  },
  {
    icon: "🧰",
    title: "Appliance & Electronics Protection",
    desc: "Refrigerators, laptops, phones, and TVs — protection plans that deny, delay, or endlessly 'process' your claim. We force a real decision and fair repair or replacement.",
  },
  {
    icon: "🏗️",
    title: "New-Home & Builder Structural",
    desc: "Structural warranties on a newly built home that the builder or warranty administrator won't honor. We fight for the repairs your structural warranty actually promises.",
  },
  {
    icon: "❄️",
    title: "HVAC & Service Contracts",
    desc: "Annual parts-and-labor service contracts where the company won't honor covered repairs. We make service-contract providers live up to their agreements.",
  },
  {
    icon: "📋",
    title: "Denied, Underpaid & Delayed",
    desc: "Any warranty or service-contract claim that was denied, lowballed, or stalled. A denial is not the final word — we review your contract and fight for what it covers.",
  },
];

const STATS = [
  {
    number: "Non-Binding",
    label: "In Florida, many warranty contracts make arbitration non-binding — you keep your right to take the company to court.",
    icon: "⚖️",
  },
  {
    number: "$200M+",
    label: "recovered for clients in insurance and claim disputes across Louis Law Group's practice.",
    icon: "💰",
  },
  {
    number: "$0",
    label: "upfront cost — we work on contingency. No recovery, no fee.",
    icon: "🛡️",
  },
  {
    number: "Ch. 634",
    label: "Florida regulates service-warranty associations under state law — and that gives consumers leverage.",
    icon: "📜",
  },
  {
    number: "Day 1",
    label: "a licensed attorney on your warranty claim from the start — not a call-center adjuster.",
    icon: "⚖️",
  },
  {
    number: "Free",
    label: "no-cost, no-obligation review of your warranty or service-contract dispute.",
    icon: "✅",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Free Qualification Check",
    desc: "Answer a few questions about your warranty, the company, and what happened with your claim. Takes about 2 minutes to see if you have a case.",
  },
  {
    num: "02",
    title: "Attorney Review of Your Contract",
    desc: "Our attorneys review your warranty or service contract, the denial, and the company's conduct — and identify exactly where they breached the agreement.",
  },
  {
    num: "03",
    title: "We Fight — You Get Paid",
    desc: "We demand the company honor your contract, and litigate if they won't. You pay nothing unless we recover for you.",
  },
];

const FAQS = [
  {
    q: "Can I sue my extended warranty or service-contract company?",
    a: "Often, yes. If a warranty or service-contract company breaches your agreement by wrongly denying or underpaying a covered claim, you may have a breach-of-contract claim. Importantly, many Florida warranty contracts make arbitration non-binding — meaning you keep your right to take the dispute to court. An attorney can review your specific contract and explain your options.",
  },
  {
    q: "Is arbitration binding in Florida warranty contracts?",
    a: "Not always. A common pattern in Florida warranty and service-contract agreements is a clause stating that while arbitration may be required, its outcome is non-binding — so either party can still go to court. Some contracts have no arbitration clause at all. We review the actual language in your contract, including any Florida-specific amendment, to determine your path.",
  },
  {
    q: "What types of warranties does Louis Law Group handle?",
    a: "We handle disputes involving vehicle service contracts (extended auto warranties), home warranties, appliance and electronics protection plans, new-home and builder structural warranties, and HVAC and other service contracts — when the company denies, underpays, or delays a covered claim.",
  },
  {
    q: "How much does a warranty claim attorney cost?",
    a: "Nothing upfront. We review your warranty dispute for free and work on a contingency basis for qualifying cases. Our fee comes from what we recover for you — if we don't recover, you owe us no attorney's fee.",
  },
  {
    q: "The company says my problem is 'pre-existing' or 'wear and tear.' Is that the final answer?",
    a: "No. 'Pre-existing condition,' 'improper maintenance,' and 'normal wear and tear' are among the most common denial tactics. We examine your contract's actual coverage and exclusions and gather documentation to challenge an improper denial — what the company calls 'excluded' is often, in fact, covered.",
  },
  {
    q: "How long do I have to act on a denied warranty claim in Florida?",
    a: "Deadlines vary by contract and by the type of claim, and breach-of-contract claims in Florida are subject to a statute of limitations. Because some warranty contracts also impose their own shorter deadlines for disputing a decision, you should speak with an attorney promptly to protect your rights.",
  },
];

const TESTIMONIALS = [
  {
    initial: "E",
    name: "Edwin M.",
    type: "Verified Client",
    outcome: "Google Review",
    text: "Very professional attorneys with outstanding attention to detail. They will not stop fighting for their clients.",
  },
  {
    initial: "E",
    name: "Elizabeth M.",
    type: "Verified Client",
    outcome: "Google Review",
    text: "Pierre and his team are amazing. They truly cater to their clients and help you get the most from your claim.",
  },
  {
    initial: "T",
    name: "Tee T.",
    type: "Verified Client",
    outcome: "Google Review",
    text: "Louis Law Group got results much faster than we expected. Excellent service and great communication.",
  },
  {
    initial: "H",
    name: "Helen F.",
    type: "Verified Client",
    outcome: "Google Review",
    text: "They accomplished exactly what they set out to do and kept me informed every step of the way.",
  },
];

async function getLatestWarrantyArticles() {
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  if (!strapiURL) return [];
  const kws = ["warranty", "vehicle-service-contract", "home-warranty", "service-contract"];
  const filters = kws.map((kw, i) => `filters[$or][${i}][slug][$containsi]=${kw}`).join("&");
  const url =
    `${strapiURL}/api/articles?${filters}` +
    `&fields[]=title&fields[]=slug&fields[]=description` +
    `&publicationState=live&sort[0]=publishedAt:desc&pagination[pageSize]=3`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function WarrantyClaimsPage() {
  const articles = await getLatestWarrantyArticles();

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: "Louis Law Group — Florida Warranty Claim Attorneys",
    url: "https://www.louislawgroup.com/warranty-claims",
    telephone: "+1-833-657-4812",
    areaServed: { "@type": "State", name: "Florida" },
    description:
      "Florida attorneys representing consumers in denied, underpaid, and delayed warranty and service-contract claims — auto, home, appliance, and builder warranties.",
    priceRange: "No fee unless we win",
  };

  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>Florida Warranty Claim Attorneys</div>
            <h1 className={styles.heroTitle}>
              <span className={styles.gold}>Warranty</span> Lawyers{" "}
              Who <span className={styles.gold}>Fight the Warranty Companies</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Paid for a warranty or service contract, then got denied when you needed it?
              Florida warranty companies routinely deny, underpay, and stall legitimate claims.
              We hold them to their contracts — and you pay nothing unless we win.
            </p>
            <ul className={styles.heroBullets}>
              <li>✔ Auto, home, appliance &amp; builder warranties</li>
              <li>✔ Denied, underpaid &amp; delayed claims</li>
              <li>✔ Many FL warranty contracts = non-binding arbitration</li>
              <li>✔ No upfront fees — contingency only</li>
              <li>✔ Free, no-obligation case review</li>
            </ul>
            <a href={CTA_URL} className={styles.ctaPrimary}>
              See If You Qualify — Free →
            </a>
            <p className={styles.ctaNote}>Takes 2 minutes · No obligation · No upfront cost</p>
          </div>
          <div className={styles.heroCard}>
            <div className={styles.heroCardBadge}>Free Case Review</div>
            <h2 className={styles.heroCardTitle}>Did Your Warranty Company Deny Your Claim?</h2>
            <p className={styles.heroCardBody}>
              A denial or runaround is not the end. Warranty and service-contract companies count on
              consumers giving up. Our attorneys read the fine print, find the coverage they owe you,
              and fight to make them pay.
            </p>
            <div className={styles.trustRow}>
              <div className={styles.trustStat}><strong>$200M+</strong><span>Recovered</span></div>
              <div className={styles.trustStat}><strong>$0</strong><span>Upfront Cost</span></div>
              <div className={styles.trustStat}><strong>Day 1</strong><span>Lawyer on Your Case</span></div>
              <div className={styles.trustStat}><strong>No Win</strong><span>No Fee</span></div>
            </div>
            <a href={CTA_URL} className={styles.ctaCard}>
              See If You Qualify — Free
            </a>
            <p className={styles.cardDisclaimer}>
              Licensed Attorneys · No Win, No Fee
            </p>
          </div>
        </div>
      </section>

      {/* URGENCY BANNER */}
      <div className={styles.urgencyBanner}>
        <span className={styles.urgencyIcon}>⚠️</span>
        <span>
          <strong>Don&apos;t wait:</strong> warranty contracts can impose short deadlines to dispute a denial.{" "}
          <a href={CTA_URL} className={styles.urgencyLink}>
            Check your options before your window closes
          </a>.
        </span>
      </div>

      {/* STATS */}
      <section className={styles.services}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>Why It Matters</div>
          <h2 className={styles.sectionTitle}>
            Why Legal Representation <span className={styles.gold}>Changes Everything</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Warranty companies have teams built to say no. Florida law — and the fine print of your own
            contract — often says yes. We know the difference.
          </p>
          <div className={styles.servicesGrid}>
            {STATS.map((s) => (
              <a href={CTA_URL} key={s.label} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>{s.icon}</div>
                <h3 className={styles.statNumber}>{s.number}</h3>
                <p className={styles.serviceDesc}>{s.label}</p>
                <span className={styles.serviceArrow}>See If You Qualify →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* MID-PAGE CTA */}
      <section className={styles.midCta}>
        <div className={styles.midCtaInner}>
          <h2 className={styles.midCtaTitle}>Denied or Stalled? The Warranty Company Isn&apos;t on Your Side.</h2>
          <p className={styles.midCtaBody}>
            Warranty and service-contract companies have adjusters and lawyers working to minimize what they pay.
            You deserve someone fighting just as hard for you. Our attorneys level the playing field.
          </p>
          <a href={CTA_URL} className={styles.ctaPrimary}>
            Check If You Have a Case — Free
          </a>
        </div>
      </section>

      {/* WHAT WE HANDLE */}
      <section className={styles.dayOne}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>What We Handle</div>
          <h2 className={styles.sectionTitle}>
            Every Type of <span className={styles.gold}>Warranty &amp; Service-Contract Dispute</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            From extended auto warranties to home warranties and builder structural coverage — we fight for
            Florida consumers whose warranty companies won&apos;t pay.
          </p>
          <div className={styles.dayOneGrid}>
            {SERVICES.map((s) => (
              <div key={s.title} className={styles.dayOneCard}>
                <div className={styles.dayOneIcon}>{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className={styles.dayOneCta}>
            <p className={styles.dayOneCtaNote}>
              The sooner you get an attorney involved, the more leverage you have — and the better your odds of a full recovery.
            </p>
            <a href={CTA_URL} className={styles.ctaPrimary}>
              Get an Attorney on Your Claim — Free
            </a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.steps}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>Simple Process</div>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <div className={styles.stepsGrid}>
            {STEPS.map((s) => (
              <div key={s.num} className={styles.stepCard}>
                <div className={styles.stepNum}>{s.num}</div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
          <a href={CTA_URL} className={styles.ctaPrimary} style={{ marginTop: "2.5rem" }}>
            Start Step 01 Now — It&apos;s Free
          </a>
        </div>
      </section>

      {/* WHY LLG */}
      <section className={styles.why}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrowLight}>Why Louis Law Group</div>
          <h2 className={styles.sectionTitleLight}>
            Warranty Attorneys Who Fight for You
          </h2>
          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>⚖️</div>
              <h3>Licensed Trial Attorneys</h3>
              <p>We are licensed Florida attorneys — not a claims-consulting service. We can take a warranty company to court and litigate if they refuse to honor your contract.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>💰</div>
              <h3>Zero Upfront Cost</h3>
              <p>We work on contingency for qualifying cases. You pay nothing unless we recover for you. Our interests are aligned with yours.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>🔍</div>
              <h3>We Read the Fine Print</h3>
              <p>Warranty and service contracts are dense and full of exclusions. We know how to find the coverage the company is trying to avoid paying.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>📜</div>
              <h3>Florida Contract &amp; Consumer Law</h3>
              <p>From Chapter 634 service-warranty regulation to non-binding arbitration clauses, we use Florida law to keep your case in front of a judge when it counts.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>🏛️</div>
              <h3>Courtroom Ready</h3>
              <p>Many disputes settle once the company sees we&apos;re prepared to litigate. We build every case to be trial-ready — which is exactly why warranty companies pay more.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>📍</div>
              <h3>Serving Florida Consumers</h3>
              <p>We represent warranty and service-contract holders across Florida — auto, home, appliance, HVAC, and builder warranties alike.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={styles.testimonials}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>★★★★★ 4.7 · 67 Google Reviews</div>
          <h2 className={styles.sectionTitle}>What Clients Say About Louis Law Group</h2>
          <p className={styles.sectionSubtitle}>Real reviews from Florida clients who trusted Louis Law Group to fight for them.</p>
          <div className={styles.testimonialsGrid}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className={styles.testimonialCard}>
                <div className={styles.testimonialTop}>
                  <div className={styles.testimonialAvatar}>{t.initial}</div>
                  <div>
                    <div className={styles.testimonialName}>{t.name}</div>
                    <div className={styles.testimonialLocation}>{t.type}</div>
                  </div>
                  <div className={styles.outcomeBadge}>{t.outcome}</div>
                </div>
                <div className={styles.stars}>★★★★★</div>
                <p className={styles.testimonialText}>&ldquo;{t.text}&rdquo;</p>
              </div>
            ))}
          </div>
          <p className={styles.testimonialDisclaimer}>* Reviews from Google. Reviews reflect the firm generally; results may vary by case.</p>
          <a href={CTA_URL} className={styles.ctaSecondary}>
            Start Your Free Case Review →
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faq}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>Common Questions</div>
          <h2 className={styles.sectionTitle}>
            Warranty Claim FAQs
          </h2>
          <div className={styles.faqGrid}>
            {FAQS.map((f) => (
              <div key={f.q} className={styles.faqItem}>
                <h3 className={styles.faqQ}>{f.q}</h3>
                <p className={styles.faqA}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESOURCES / BLOG */}
      <section className={styles.services}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>Warranty Resources</div>
          <h2 className={styles.sectionTitle}>
            Learn Your <span className={styles.gold}>Rights</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Guides on denied warranty claims, vehicle service contracts, and your legal options in Florida.
          </p>
          {articles.length > 0 ? (
            <div className={styles.dayOneGrid}>
              {articles.map((post) => (
                <a key={post.id} href={`/${post.slug}`} className={styles.dayOneCard} style={{ textDecoration: "none" }}>
                  <div className={styles.dayOneIcon}>📄</div>
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                  <span className={styles.serviceArrow}>Read more →</span>
                </a>
              ))}
            </div>
          ) : (
            <p className={styles.sectionSubtitle} style={{ marginTop: "0" }}>
              New warranty guides are publishing soon.
            </p>
          )}
          <div className={styles.dayOneCta}>
            <a href="/warranty-claims/resources" className={styles.ctaSecondary}>
              Browse All Warranty Resources →
            </a>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.finalCta}>
        <div className={styles.finalCtaInner}>
          <h2 className={styles.finalCtaTitle}>
            Don&apos;t Let the Warranty Company Win
          </h2>
          <p className={styles.finalCtaBody}>
            Warranty and service-contract companies have adjusters, lawyers, and a playbook for saying no.
            You deserve someone fighting just as hard for you. Whether your claim was denied, underpaid,
            or delayed — we review your case for free and fight for what your contract covers.{" "}
            <strong>No fees unless we win your case.</strong>
          </p>
          <a href={CTA_URL} className={styles.ctaFinal}>
            See If You Qualify Now — Free →
          </a>
          <p className={styles.finalCtaNote}>
            Free Case Review · No Obligation · No Upfront Cost
          </p>
          <div className={styles.finalTrust}>
            <span>📞 (833) 657-4812</span>
            <span>·</span>
            <span>Licensed Attorneys</span>
            <span>·</span>
            <span>No Win, No Fee</span>
          </div>
        </div>
      </section>

    </main>
  );
}
