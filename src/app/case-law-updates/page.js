import styles from "./page.module.css";

export const metadata = {
  title: "Florida Property Insurance Case Law Updates | Louis Law Group",
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
    keywords: ["wind damage", "water damage", "roof claims", "hurricane"],
    desc: "Court rulings on first-party property claims — wind, water, roof, fire, and hurricane damage. How courts interpret policy language and coverage obligations.",
  },
  {
    icon: "⚖️",
    title: "Bad Faith Litigation",
    keywords: ["624.155", "unfair claims", "civil remedy"],
    desc: "F.S. 624.155 bad faith actions against carriers. How courts evaluate insurer conduct, damages, and standards for statutory and common law bad faith.",
  },
  {
    icon: "📋",
    title: "Public Adjuster Regulations",
    keywords: ["626.854", "PA licensing", "adjuster conduct"],
    desc: "Cases involving PA licensing, fee disputes, assignment of benefits, and regulatory actions. Judicial interpretations of F.S. 626.854 and related statutes.",
  },
  {
    icon: "🏛️",
    title: "Carrier Denial & Underpayment",
    keywords: ["claim denial", "underpayment", "coverage dispute"],
    desc: "Rulings on insurer denials, underpayments, and coverage exclusions. Disputes over appraisal, EUO requirements, and claims handling timelines.",
  },
  {
    icon: "📜",
    title: "Legislative & Regulatory",
    keywords: ["HB 837", "SB 2A", "insurance reform"],
    desc: "Judicial interpretations of recent Florida insurance reforms including HB 837, SB 2A, AOB limitations, and one-way attorney fee elimination.",
  },
  {
    icon: "🔍",
    title: "Appraisal & Dispute Resolution",
    keywords: ["appraisal", "arbitration", "umpire", "mediation"],
    desc: "Case law on appraisal invocation, umpire selection, scope of appraisal vs. coverage disputes, and when courts compel or deny proceedings.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "We Monitor the Courts",
    desc: "Our system pulls the latest property insurance rulings from Florida state and federal courts daily — filtering for decisions that matter to PAs.",
  },
  {
    num: "02",
    title: "AI-Powered Analysis",
    desc: "Each case is analyzed and summarized with plain-language takeaways — what happened, what the court decided, and what it means for your practice.",
  },
  {
    num: "03",
    title: "Delivered to You",
    desc: "New case summaries are published daily. Bookmark this page or subscribe to our newsletter to stay current on the law that affects your work.",
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
    a: "No. These summaries are provided for informational and educational purposes only. They are not legal advice and should not be relied upon as such. For specific legal questions, consult with a licensed attorney.",
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
    initial: "R",
    name: "Ricardo M.",
    type: "Licensed PA",
    outcome: "Client Won",
    text: "These daily case updates have completely changed how I prepare for carrier negotiations. When I cite a recent court ruling, adjusters take notice.",
  },
  {
    initial: "J",
    name: "James P.",
    type: "Public Adjuster",
    outcome: "Full Recovery",
    text: "I referred a denied hurricane claim to Louis Law Group after reading about a similar case on their updates page. The client recovered full policy limits plus bad faith damages.",
  },
  {
    initial: "S",
    name: "Sandra L.",
    type: "Claims Consultant",
    outcome: "Time Saved",
    text: "As a claims consultant, staying current on case law is essential. This resource saves me hours of legal research every week.",
  },
  {
    initial: "D",
    name: "David K.",
    type: "Licensed PA",
    outcome: "Bad Faith Win",
    text: "The bad faith case updates are invaluable. I now know exactly when a carrier's conduct crosses the line from underpayment to actionable bad faith.",
  },
  {
    initial: "M",
    name: "Maria G.",
    type: "Public Adjuster",
    outcome: "Claim Won",
    text: "I was about to accept a lowball offer on a water damage claim. Then I read a case summary here showing the court rejected the same exclusion the carrier was citing. We fought back and won.",
  },
  {
    initial: "T",
    name: "Thomas W.",
    type: "Senior PA",
    outcome: "Daily Reader",
    text: "Louis Law Group's case law page is the first thing I check every morning. It's like having a legal research team working for free.",
  },
];

export default function CaseLawUpdates() {
  return (
    <main className={styles.page}>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>For Public Adjusters &amp; Claims Professionals</div>
            <h1 className={styles.heroTitle}>
              Florida <span className={styles.gold}>Case Law Updates</span> for Property Insurance Professionals
            </h1>
            <p className={styles.heroSubtitle}>
              Daily curated court decisions on property insurance disputes, bad faith claims,
              PA regulations, and carrier tactics — essential intelligence for your practice.
            </p>
            <ul className={styles.heroBullets}>
              <li>✔ Property damage &amp; coverage disputes</li>
              <li>✔ Bad faith insurance litigation</li>
              <li>✔ Public adjuster regulatory cases</li>
              <li>✔ Carrier denial &amp; underpayment rulings</li>
              <li>✔ Updated daily — 100% free access</li>
            </ul>
            <a href={CTA_URL} className={styles.ctaPrimary}>
              Submit a Claim for Review →
            </a>
            <p className={styles.ctaNote}>Free policy review · No obligation · Available 24/7</p>
          </div>
          <div className={styles.heroCard}>
            <div className={styles.heroCardBadge}>Updated Daily</div>
            <h2 className={styles.heroCardTitle}>Florida Insurance Case Law Intelligence</h2>
            <p className={styles.heroCardBody}>
              We monitor Florida state and federal courts for property insurance decisions
              that affect your claims practice — so you don&apos;t have to.
            </p>
            <div className={styles.trustRow}>
              <div className={styles.trustStat}><strong>Daily</strong><span>Case Updates</span></div>
              <div className={styles.trustStat}><strong>1,785+</strong><span>FL Cases Tracked</span></div>
              <div className={styles.trustStat}><strong>6</strong><span>Court Systems</span></div>
              <div className={styles.trustStat}><strong>100%</strong><span>Free Access</span></div>
            </div>
            <a href="#categories" className={styles.ctaCard}>
              Browse Case Law Categories
            </a>
            <p className={styles.cardDisclaimer}>
              Covering DCA · Supreme Court · S.D. Fla · M.D. Fla · N.D. Fla · 11th Cir.
            </p>
          </div>
        </div>
      </section>

      {/* URGENCY BANNER */}
      <div className={styles.urgencyBanner}>
        <span className={styles.urgencyIcon}>⚖️</span>
        <span>
          <strong>Know the Law That Protects Your Clients.</strong> Florida property insurance
          law changes constantly. Court rulings can strengthen — or weaken — a
          policyholder&apos;s position overnight.{" "}
          <a href={CTA_URL} className={styles.urgencyLink}>Get a free claim review</a>.
        </span>
      </div>

      {/* CATEGORIES */}
      <section id="categories" className={styles.services}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>What We Cover</div>
          <h2 className={styles.sectionTitle}>
            Case Law <span className={styles.gold}>Categories</span> We Monitor
          </h2>
          <p className={styles.sectionSubtitle}>
            Our daily monitoring covers the key areas of Florida property insurance litigation
            that matter most to public adjusters and claims professionals.
          </p>
          <div className={styles.servicesGrid}>
            {CATEGORIES.map((c) => (
              <a href={CTA_URL} key={c.title} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>{c.icon}</div>
                <h3 className={styles.serviceTitle}>{c.title}</h3>
                <div className={styles.serviceKeywords}>
                  {c.keywords.map((k) => (
                    <span key={k} className={styles.kwTag}>{k}</span>
                  ))}
                </div>
                <p className={styles.serviceDesc}>{c.desc}</p>
                <span className={styles.serviceArrow}>View Cases →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* MID-PAGE CTA */}
      <section className={styles.midCta}>
        <div className={styles.midCtaInner}>
          <h2 className={styles.midCtaTitle}>Found a Case That Affects Your Claim?</h2>
          <p className={styles.midCtaBody}>
            Submit the policy for a free legal review. Louis Law Group partners with
            public adjusters to fight denied and underpaid property insurance claims.
          </p>
          <a href={CTA_URL} className={styles.ctaPrimary}>
            Submit Policy for Review — Free
          </a>
        </div>
      </section>

      {/* COURTS WE MONITOR (Day One section style) */}
      <section className={styles.dayOne}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>Comprehensive Coverage</div>
          <h2 className={styles.sectionTitle}>
            Courts We <span className={styles.gold}>Monitor</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            We track property insurance decisions from every Florida court that matters —
            state appellate courts, federal district courts, and the 11th Circuit.
          </p>
          <div className={styles.dayOneGrid}>
            <div className={styles.dayOneCard}>
              <div className={styles.dayOneIcon}>🏛️</div>
              <h3>FL District Courts of Appeal</h3>
              <p>Florida&apos;s five DCAs handle the bulk of property insurance appeals. Their rulings directly shape claims handling practices across the state.</p>
            </div>
            <div className={styles.dayOneCard}>
              <div className={styles.dayOneIcon}>⚖️</div>
              <h3>FL Supreme Court</h3>
              <p>The final word on Florida insurance law. Supreme Court decisions on bad faith, coverage, and regulatory authority bind all lower courts.</p>
            </div>
            <div className={styles.dayOneCard}>
              <div className={styles.dayOneIcon}>📍</div>
              <h3>Southern District of Florida</h3>
              <p>Federal court handling major insurance disputes in Miami-Dade, Broward, and Palm Beach — Florida&apos;s highest-volume property claims region.</p>
            </div>
            <div className={styles.dayOneCard}>
              <div className={styles.dayOneIcon}>🗺️</div>
              <h3>Middle District of Florida</h3>
              <p>Covers Orlando, Tampa, and Jacksonville. Key jurisdiction for hurricane and sinkhole litigation with significant property insurance caseload.</p>
            </div>
            <div className={styles.dayOneCard}>
              <div className={styles.dayOneIcon}>🌀</div>
              <h3>Northern District of Florida</h3>
              <p>Handles Panhandle region cases including Hurricane Michael and Hurricane Sally property claims and insurance disputes.</p>
            </div>
            <div className={styles.dayOneCard}>
              <div className={styles.dayOneIcon}>🔒</div>
              <h3>11th Circuit Court of Appeals</h3>
              <p>Federal appellate court covering Florida. Its rulings on insurance policy interpretation and federal diversity jurisdiction set important precedent.</p>
            </div>
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
            Subscribe to Updates — Free
          </a>
        </div>
      </section>

      {/* WHY LLG */}
      <section className={styles.why}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrowLight}>Why Louis Law Group</div>
          <h2 className={styles.sectionTitleLight}>
            Built for Claims Professionals
          </h2>
          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>⚖️</div>
              <h3>First-Party Property Focus</h3>
              <p>We exclusively handle Florida property insurance claims — it&apos;s all we do. Our legal team knows every carrier, every tactic, every statute.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>🤝</div>
              <h3>PA Partnership Model</h3>
              <p>We work alongside public adjusters, not against them. When a claim needs legal escalation, we step in without disrupting the PA-client relationship.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>💰</div>
              <h3>No Fee Unless We Win</h3>
              <p>Contingency fee representation means zero upfront cost to the policyholder or the referring PA. We only get paid when we recover.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>📊</div>
              <h3>Daily Legal Intelligence</h3>
              <p>This case law page is part of our commitment to keeping claims professionals informed. Knowledge of current law is a competitive advantage.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>📍</div>
              <h3>Statewide Coverage</h3>
              <p>From the Panhandle to the Keys, we handle property insurance claims in every Florida county and every federal district court in the state.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>🏆</div>
              <h3>Proven Track Record</h3>
              <p>Our attorneys have recovered millions for Florida policyholders on denied and underpaid property insurance claims.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={styles.testimonials}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>What Professionals Say</div>
          <h2 className={styles.sectionTitle}>Trusted by Florida Claims Professionals</h2>
          <p className={styles.sectionSubtitle}>Public adjusters and claims consultants across Florida rely on our case law updates and legal partnership.</p>
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
          <a href={CTA_URL} className={styles.ctaSecondary}>
            Partner With Us — Submit a Claim →
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faq}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>Common Questions</div>
          <h2 className={styles.sectionTitle}>Case Law Updates FAQs</h2>
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

      {/* FAQ SCHEMA */}
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

      {/* FINAL CTA */}
      <section className={styles.finalCta}>
        <div className={styles.finalCtaInner}>
          <h2 className={styles.finalCtaTitle}>
            Have a Claim That Needs Legal Backup?
          </h2>
          <p className={styles.finalCtaBody}>
            Louis Law Group partners with Florida public adjusters on denied and underpaid
            property insurance claims. Free policy review —
            <strong> no fees unless we win.</strong>
          </p>
          <a href={CTA_URL} className={styles.ctaFinal}>
            Submit Policy for Review →
          </a>
          <p className={styles.finalCtaNote}>
            Serving All Florida Counties · Available 24/7
          </p>
          <div className={styles.finalTrust}>
            <span>📞 (833) 657-4812</span>
            <span>·</span>
            <span>Licensed Florida Attorneys</span>
            <span>·</span>
            <span>No Win, No Fee</span>
          </div>
        </div>
      </section>

    </main>
  );
}
