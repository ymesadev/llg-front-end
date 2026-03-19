import styles from "./page.module.css";
import Link from "next/link";

export const metadata = {
  title:
    "Florida Property Insurance Case Law Updates | Louis Law Group",
  description:
    "Daily case law updates on Florida property insurance litigation, public adjuster regulations, bad faith claims, and carrier disputes. Curated for public adjusters and claims professionals.",
  keywords:
    "florida property insurance case law, insurance litigation updates, public adjuster case law, bad faith insurance florida, property insurance court decisions, florida insurance disputes, carrier denial case law, first party property claims",
  openGraph: {
    title: "Florida Property Insurance Case Law Updates | Louis Law Group",
    description:
      "Daily curated case law updates covering Florida property insurance disputes, PA regulations, bad faith claims, and carrier tactics. Essential reading for claims professionals.",
    url: "https://www.louislawgroup.com/case-law-updates",
  },
};

const CTA_URL = "https://forms.louislawgroup.com";

const CATEGORIES = [
  {
    icon: "🏠",
    title: "Property Damage Claims",
    keywords: [
      "property damage",
      "wind damage",
      "water damage",
      "roof claims",
      "hurricane",
    ],
    desc: "Court rulings on first-party property claims — wind, water, roof, fire, and hurricane damage. Understand how Florida courts interpret policy language and coverage obligations.",
  },
  {
    icon: "⚖️",
    title: "Bad Faith Litigation",
    keywords: [
      "bad faith insurance",
      "624.155",
      "unfair claims practices",
      "civil remedy",
    ],
    desc: "F.S. 624.155 bad faith actions against carriers. Track how courts evaluate insurer conduct, damages, and the evolving standards for statutory and common law bad faith.",
  },
  {
    icon: "📋",
    title: "Public Adjuster Regulations",
    keywords: [
      "public adjuster",
      "626.854",
      "PA licensing",
      "adjuster conduct",
    ],
    desc: "Cases involving PA licensing, fee disputes, assignment of benefits, and regulatory actions. Stay current on judicial interpretations of F.S. 626.854 and related statutes.",
  },
  {
    icon: "🏛️",
    title: "Carrier Denial & Underpayment",
    keywords: [
      "claim denial",
      "underpayment",
      "coverage dispute",
      "policy exclusion",
    ],
    desc: "Rulings on insurer denials, underpayments, and coverage exclusions. See how courts handle disputes over appraisal, EUO requirements, and claims handling timelines.",
  },
  {
    icon: "📜",
    title: "Legislative & Regulatory Changes",
    keywords: [
      "HB 837",
      "SB 2A",
      "insurance reform",
      "AOB reform",
      "one-way attorney fees",
    ],
    desc: "Judicial interpretations of recent Florida insurance reforms including HB 837, SB 2A, AOB limitations, and the elimination of one-way attorney fees.",
  },
  {
    icon: "🔍",
    title: "Appraisal & Dispute Resolution",
    keywords: [
      "appraisal",
      "alternative dispute",
      "arbitration",
      "umpire",
      "mediation",
    ],
    desc: "Case law on appraisal invocation, umpire selection, scope of appraisal vs. coverage disputes, and when courts compel or deny appraisal proceedings.",
  },
];

const STATS = [
  { value: "Daily", label: "Case Updates" },
  { value: "1,785+", label: "FL Property Cases Tracked" },
  { value: "262+", label: "PA-Related Decisions" },
  { value: "26K+", label: "Bad Faith Rulings" },
  { value: "100%", label: "Free Access" },
  { value: "2026", label: "Current Through" },
];

const KEY_COURTS = [
  {
    name: "FL District Courts of Appeal",
    abbr: "DCA",
    desc: "Florida's five DCAs handle the bulk of property insurance appeals. Their rulings directly shape claims handling practices across the state.",
  },
  {
    name: "FL Supreme Court",
    abbr: "FLSC",
    desc: "The final word on Florida insurance law. Supreme Court decisions on bad faith, coverage, and regulatory authority bind all lower courts.",
  },
  {
    name: "Southern District of Florida",
    abbr: "S.D. Fla.",
    desc: "Federal court handling major insurance disputes in Miami-Dade, Broward, and Palm Beach — Florida's highest-volume property claims region.",
  },
  {
    name: "Middle District of Florida",
    abbr: "M.D. Fla.",
    desc: "Covers Orlando, Tampa, and Jacksonville. Key jurisdiction for hurricane and sinkhole litigation with significant property insurance caseload.",
  },
  {
    name: "Northern District of Florida",
    abbr: "N.D. Fla.",
    desc: "Handles Panhandle region cases including Hurricane Michael and Hurricane Sally property claims and insurance disputes.",
  },
  {
    name: "11th Circuit Court of Appeals",
    abbr: "11th Cir.",
    desc: "Federal appellate court covering Florida. Its rulings on insurance policy interpretation and federal diversity jurisdiction cases set important precedent.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "We Monitor the Courts",
    desc: "Our system pulls the latest property insurance rulings from Florida state and federal courts daily — filtering for decisions that matter to PAs and claims professionals.",
  },
  {
    num: "02",
    title: "AI-Powered Analysis",
    desc: "Each case is analyzed and summarized with plain-language takeaways — what happened, what the court decided, and what it means for your claims practice.",
  },
  {
    num: "03",
    title: "Delivered to You",
    desc: "New case summaries are published daily. Bookmark this page, subscribe to our newsletter, or check back regularly to stay current on the law that affects your work.",
  },
];

const FAQS = [
  {
    q: "What types of cases are covered?",
    a: "We focus on Florida property insurance litigation including first-party claims (wind, water, fire, hurricane), bad faith actions under F.S. 624.155, public adjuster regulations under F.S. 626.854, carrier denials and underpayments, appraisal disputes, and judicial interpretations of recent insurance reform legislation.",
  },
  {
    q: "How often are case law updates published?",
    a: "New case summaries are published daily, Monday through Friday. Our system monitors CourtListener for new Florida property insurance decisions and publishes summaries by 9 AM EST each morning.",
  },
  {
    q: "Are these case summaries legal advice?",
    a: "No. These summaries are provided for informational and educational purposes only. They are not legal advice and should not be relied upon as such. For specific legal questions about a case or claim, consult with a licensed attorney.",
  },
  {
    q: "Can I use these summaries in my claims work?",
    a: "Yes. Public adjusters and claims professionals frequently reference case law when advocating for policyholders. Our summaries provide citations and key holdings that can inform your understanding of current legal standards.",
  },
  {
    q: "How far back do the case law updates go?",
    a: "Our automated system tracks cases from 2025 forward. For historical case law research, we recommend using CourtListener.com directly or consulting with an attorney who specializes in Florida property insurance law.",
  },
  {
    q: "I found a case that affects my client's claim. What should I do?",
    a: "If a recent ruling impacts a claim you are handling, Louis Law Group offers free policy reviews. Submit the claim details and we will evaluate whether legal action may strengthen the policyholder's position.",
  },
];

const TESTIMONIALS = [
  {
    text: "These daily case updates have completely changed how I prepare for carrier negotiations. When I cite a recent court ruling, adjusters take notice.",
    author: "Licensed PA, Miami-Dade County",
  },
  {
    text: "I referred a denied hurricane claim to Louis Law Group after reading about a similar case on their updates page. The client recovered full policy limits plus bad faith damages.",
    author: "Public Adjuster, Fort Lauderdale",
  },
  {
    text: "As a claims consultant, staying current on case law is essential. This resource saves me hours of legal research every week.",
    author: "Claims Consultant, Tampa",
  },
  {
    text: "The bad faith case updates are invaluable. I now know exactly when a carrier's conduct crosses the line from underpayment to actionable bad faith.",
    author: "Licensed PA, Orlando",
  },
  {
    text: "I was about to accept a lowball offer on a water damage claim. Then I read a case summary here showing the court rejected the same exclusion the carrier was citing. We fought back and won.",
    author: "Public Adjuster, Palm Beach County",
  },
  {
    text: "Louis Law Group's case law page is the first thing I check every morning. It's like having a legal research team working for free.",
    author: "Senior PA, Jacksonville",
  },
];

export default function CaseLawUpdates() {
  return (
    <div className={styles.page}>
      {/* ───── HERO ───── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroTag}>
            Case Law Updates &bull; Updated Daily
          </span>
          <h1 className={styles.heroTitle}>
            Florida Property Insurance
            <br />
            <span className={styles.heroGold}>Case Law Updates</span>
          </h1>
          <p className={styles.heroSub}>
            Daily curated court decisions on property insurance disputes, public
            adjuster regulations, bad faith claims, and carrier tactics —
            essential intelligence for Florida PAs and claims professionals.
          </p>
          <div className={styles.heroCtas}>
            <Link href={CTA_URL} className={styles.btnPrimary}>
              Submit a Claim for Review
            </Link>
            <Link href="/contact" className={styles.btnOutline}>
              Ask a Lawyer
            </Link>
          </div>
        </div>
      </section>

      {/* ───── URGENCY BANNER ───── */}
      <section className={styles.urgency}>
        <p>
          <strong>Know the Law That Protects Your Clients.</strong> Florida
          property insurance law changes constantly. Court rulings can
          strengthen — or weaken — a policyholder&apos;s position overnight.
          Staying current isn&apos;t optional.
        </p>
      </section>

      {/* ───── STATS GRID ───── */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {STATS.map((s) => (
            <div key={s.label} className={styles.statCard}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ───── CATEGORIES ───── */}
      <section className={styles.servicesSection}>
        <h2 className={styles.sectionTitle}>What We Cover</h2>
        <p className={styles.sectionSub}>
          Our case law monitoring covers the key areas of Florida property
          insurance litigation that matter most to public adjusters and claims
          professionals.
        </p>
        <div className={styles.servicesGrid}>
          {CATEGORIES.map((c) => (
            <div key={c.title} className={styles.serviceCard}>
              <span className={styles.serviceIcon}>{c.icon}</span>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── MID CTA ───── */}
      <section className={styles.midCta}>
        <h2>Found a Case That Affects Your Claim?</h2>
        <p>
          Submit the policy for a free legal review. Louis Law Group partners
          with public adjusters to fight denied and underpaid claims.
        </p>
        <div className={styles.heroCtas}>
          <Link href={CTA_URL} className={styles.btnPrimary}>
            Submit Policy for Review
          </Link>
          <Link href="/contact" className={styles.btnOutline}>
            Ask a Question
          </Link>
        </div>
      </section>

      {/* ───── KEY COURTS ───── */}
      <section className={styles.servicesSection}>
        <h2 className={styles.sectionTitle}>Courts We Monitor</h2>
        <p className={styles.sectionSub}>
          We track property insurance decisions from every Florida court that
          matters — state appellate courts, federal district courts, and the
          11th Circuit.
        </p>
        <div className={styles.servicesGrid}>
          {KEY_COURTS.map((c) => (
            <div key={c.abbr} className={styles.serviceCard}>
              <span className={styles.serviceIcon}>🏛️</span>
              <h3>
                {c.name} <small>({c.abbr})</small>
              </h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section className={styles.stepsSection}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <div className={styles.stepsGrid}>
          {STEPS.map((s) => (
            <div key={s.num} className={styles.stepCard}>
              <span className={styles.stepNum}>{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── WHY LLG ───── */}
      <section className={styles.whySection}>
        <h2 className={styles.sectionTitle}>
          Why Louis Law Group for Claims Professionals
        </h2>
        <div className={styles.whyGrid}>
          {[
            {
              t: "First-Party Property Focus",
              d: "We exclusively handle Florida property insurance claims — it's all we do. Our legal team knows every carrier, every tactic, and every statute.",
            },
            {
              t: "PA Partnership Model",
              d: "We work alongside public adjusters, not against them. When a claim needs legal escalation, we step in without disrupting the PA-client relationship.",
            },
            {
              t: "No Fee Unless We Win",
              d: "Contingency fee representation means zero upfront cost to the policyholder or the referring PA. We only get paid when we recover.",
            },
            {
              t: "Daily Legal Intelligence",
              d: "This case law updates page is part of our commitment to keeping claims professionals informed. Knowledge of current law is a competitive advantage.",
            },
            {
              t: "Statewide Coverage",
              d: "From the Panhandle to the Keys, we handle property insurance claims in every Florida county and every federal district court in the state.",
            },
            {
              t: "Proven Track Record",
              d: "Our attorneys have recovered millions for Florida policyholders on denied and underpaid property insurance claims.",
            },
          ].map((w) => (
            <div key={w.t} className={styles.whyCard}>
              <h3>{w.t}</h3>
              <p>{w.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── TESTIMONIALS ───── */}
      <section className={styles.testimonialsSection}>
        <h2 className={styles.sectionTitle}>
          What Claims Professionals Say
        </h2>
        <div className={styles.testimonialsGrid}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={styles.testimonialCard}>
              <p className={styles.testimonialText}>
                &ldquo;{t.text}&rdquo;
              </p>
              <span className={styles.testimonialAuthor}>— {t.author}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section className={styles.faqSection}>
        <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
        <div className={styles.faqGrid}>
          {FAQS.map((f, i) => (
            <details key={i} className={styles.faqItem}>
              <summary className={styles.faqQuestion}>{f.q}</summary>
              <p className={styles.faqAnswer}>{f.a}</p>
            </details>
          ))}
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQS.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />
      </section>

      {/* ───── FINAL CTA ───── */}
      <section className={styles.finalCta}>
        <h2>
          Have a Claim That Needs Legal Backup?
        </h2>
        <p>
          Louis Law Group partners with Florida public adjusters on denied and
          underpaid property insurance claims. Free policy review — no fees
          unless we win.
        </p>
        <div className={styles.heroCtas}>
          <Link href={CTA_URL} className={styles.btnPrimary}>
            Submit Policy for Review
          </Link>
          <Link href="tel:8336574812" className={styles.btnOutline}>
            Call 833-657-4812
          </Link>
        </div>
      </section>
    </div>
  );
}
