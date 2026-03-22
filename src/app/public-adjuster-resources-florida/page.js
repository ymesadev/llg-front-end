import styles from "./page.module.css";
import Link from "next/link";

export const metadata = {
  title: "Florida Public Adjuster Resources | Louis Law Group",
  description:
    "Essential resources for Florida public adjusters: regulatory updates, carrier actions, claims data, statutes, and legal support. Submit a policy for review or ask our attorneys a question.",
  keywords:
    "public adjuster resources, florida public adjuster, PA resources florida, property claim resources, insurance claim adjuster, public adjuster attorney, florida OIR, 626.854, 627.70131",
  openGraph: {
    title: "Florida Public Adjuster Resources | Louis Law Group",
    description:
      "Regulatory updates, carrier intelligence, and legal support for Florida's public adjusters. Property damage attorneys who fight alongside PAs.",
    url: "https://www.louislawgroup.com/public-adjuster-resources-florida",
  },
};


const SERVICES = [
  {
    icon: "📋",
    title: "OIR Regulatory Updates",
    keywords: ["florida OIR", "insurance regulation", "rate decisions"],
    desc: "Rate decisions, commissioner memoranda, and regulatory orders that directly impact how carriers handle property claims in Florida.",
    link: "https://floir.gov/newsroom/archives",
  },
  {
    icon: "⚖️",
    title: "Carrier Actions & Enforcement",
    keywords: ["carrier penalty", "consent order", "license revocation"],
    desc: "Insurer penalties, consent orders, and license actions. Know which carriers are under scrutiny — it strengthens your negotiating position.",
    link: "https://floir.gov/resources-and-reports/recent-company-actions",
  },
  {
    icon: "🏠",
    title: "New Market Entrants",
    keywords: ["new carriers florida", "insurance market", "depopulation"],
    desc: "New carriers entering the Florida market. PAs need to know who they're filing against — unfamiliar carriers mean unfamiliar claims processes.",
    link: "https://floir.gov/resources-and-reports/new-entities-to-the-market",
  },
  {
    icon: "🌀",
    title: "Catastrophe Claims Data",
    keywords: ["hurricane claims", "catastrophe reporting", "storm data"],
    desc: "Post-storm claims data by carrier — total claims, payment rates, average payouts, and denial rates. Use this to identify underpayment patterns.",
    link: "https://floir.gov/tools-and-data/catastrophe-reporting",
  },
  {
    icon: "📊",
    title: "Market Share & Premium Data",
    keywords: ["carrier market share", "average premium", "residential insurance"],
    desc: "Monthly carrier market share and average premium data. Track which carriers dominate your county and how premium trends affect claim valuations.",
    link: "https://floir.gov/tools-and-data/residential-market-share-reports",
  },
  {
    icon: "📰",
    title: "DFS Insurance Insights",
    keywords: ["DFS updates", "PA licensing", "insurance insights"],
    desc: "PA contract rules, advertising compliance, licensing updates, and the Homeowner Claims Bill of Rights — straight from the Florida DFS.",
    link: "https://myfloridacfo.com/division/agents/insurance-insights",
  },
  {
    icon: "📈",
    title: "Monthly MIR Dashboard",
    keywords: ["MIR data", "claims pending", "litigation trends"],
    desc: "Interactive dashboard with carrier performance, claims activity, litigation outcomes, and ADR trends — built from FL OIR Monthly MIR data.",
    link: "/reports/florida-insurance-market-january-2026",
  },
  {
    icon: "⚖️",
    title: "Pre-Suit Notice Intelligence",
    keywords: ["PIITIL", "pre-suit notices", "carrier disputes", "denial rates"],
    desc: "29,624 pre-suit notices analyzed — carrier dispute patterns, denial rates, financial stakes, and geographic hotspots from FL DFS PIITIL data.",
    link: "/reports/florida-presuit-notice-intelligence-report",
  },
];

const STATS = [
  {
    number: "$200M+",
    label: "recovered for Florida policyholders in property damage claims",
    icon: "💰",
  },
  {
    number: "90 Days",
    label: "max time carriers have to pay or deny under F.S. 627.70131",
    icon: "⏱️",
  },
  {
    number: "$0",
    label: "upfront cost — we work on contingency",
    icon: "🛡️",
  },
  {
    number: "14 Days",
    label: "carrier must acknowledge receipt of claim under Florida law",
    icon: "📬",
  },
  {
    number: "24/7",
    label: "available for urgent claim questions and policy reviews",
    icon: "📞",
  },
];

const STATUTES = [
  {
    statute: "F.S. 626.854",
    title: "Public Adjuster Requirements",
    desc: "Governs PA contracts, fee caps (10% during emergencies, 20% otherwise for residential), 3-day cancellation period, and prohibited conduct. The statute every PA must know by heart.",
  },
  {
    statute: "F.S. 627.70131",
    title: "Insurer Claims Handling Deadlines",
    desc: "Carriers must acknowledge claims within 14 days and pay or deny within 90 days. Failure to meet these deadlines can constitute bad faith — refer to an attorney immediately.",
  },
  {
    statute: "F.S. 627.7011",
    title: "Homeowner Claims Bill of Rights",
    desc: "Policyholders must receive this document upon filing. It outlines rights to timely acknowledgment, coverage decisions within 90 days, written denial explanations, and DFS complaint filing.",
  },
  {
    statute: "F.S. 624.155",
    title: "Insurance Bad Faith",
    desc: "The statute that triggers litigation. Bad faith occurs when carriers fail to settle in good faith, unreasonably delay, misrepresent policy terms, or deny without investigation. When you see it, bring in an attorney.",
  },
  {
    statute: "F.S. 627.70132",
    title: "Hurricane Deductible Rules",
    desc: "Separate hurricane deductibles (typically 2-5% of dwelling coverage) only trigger for named storms declared by the National Hurricane Center. Critical for post-storm claim calculations.",
  },
  {
    statute: "F.S. 627.7142",
    title: "Mediation of Claims",
    desc: "Policyholders can request mediation through DFS for disputed residential claims. PAs should know when mediation is appropriate vs. when litigation is the better path.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Submit Policy for Review",
    desc: "Send us the policyholder's policy and claim documentation. Our attorneys review coverage, identify issues, and advise on the best path forward — at no cost.",
  },
  {
    num: "02",
    title: "Attorney Review & Strategy",
    desc: "We analyze the policy language, carrier behavior, and claim history. If litigation or a bad faith claim is warranted, we build the case alongside your PA work.",
  },
  {
    num: "03",
    title: "We Fight — Policyholder Wins",
    desc: "We handle litigation, bad faith claims, and coverage disputes. You keep adjusting. Together, we maximize the policyholder's recovery.",
  },
];

const REFERRAL_TRIGGERS = [
  {
    icon: "🚫",
    title: "Claim Denied After PA Involvement",
    desc: "If the carrier issues a final denial after your estimate and supplement, litigation is the next step. PAs cannot file lawsuits — an attorney can handle that.",
  },
  {
    icon: "⚠️",
    title: "Bad Faith by the Carrier",
    desc: "Unreasonable delays, lowball offers after supplements, refusal to re-inspect, or misrepresenting coverage. F.S. 624.155 claims can result in significant additional recovery.",
  },
  {
    icon: "📄",
    title: "Coverage Disputes",
    desc: "Concurrent causation issues, wear and tear vs. storm damage arguments, or policy exclusion disputes — these are legal questions that require attorney interpretation.",
  },
  {
    icon: "🎤",
    title: "Examination Under Oath (EUO)",
    desc: "If the carrier demands an EUO from your policyholder, they need legal representation. EUOs are adversarial — missteps can result in claim denial.",
  },
  {
    icon: "🔍",
    title: "Appraisal Disputes",
    desc: "Disputed appraisals requiring umpire selection or legal enforcement benefit from attorney involvement to protect the policyholder's interests.",
  },
  {
    icon: "🕳️",
    title: "Sinkhole Claims",
    desc: "Sinkhole claims require geological testing, engineering reports, and specialized legal knowledge. These are best handled by an attorney from day one.",
  },
];

const FAQS = [
  {
    q: "Can a public adjuster and an attorney work on the same claim?",
    a: "Yes. Florida law allows policyholders to hire both a PA and an attorney. The PA handles damage assessment and estimating, while the attorney handles legal disputes, bad faith claims, and litigation. This combination often produces the best outcomes for policyholders.",
  },
  {
    q: "When should a public adjuster involve an attorney?",
    a: "If the carrier denies the claim, acts in bad faith, requests an Examination Under Oath, or if there is a coverage dispute, it is time to involve a property damage attorney. PAs cannot practice law or file lawsuits on behalf of policyholders.",
  },
  {
    q: "How does Louis Law Group work with public adjusters?",
    a: "When a claim requires legal action, we handle litigation, bad faith claims, and coverage disputes. PAs can submit policies for review or ask our attorneys questions directly through this page.",
  },
  {
    q: "What are the PA contract requirements under Florida law?",
    a: "Under F.S. 626.854, PA contracts must include specific disclosures, cannot exceed fee caps (10% during declared emergencies, 20% otherwise for residential claims), and must allow a 3-business-day cancellation period.",
  },
  {
    q: "How can I stay updated on Florida insurance regulatory changes?",
    a: "Monitor the Florida OIR website (floir.gov) for rate decisions and carrier actions, the DFS Insurance Insights newsletter for PA-specific updates, and Insurance Journal's Southeast section for market trends. All resources are linked on this page.",
  },
  {
    q: "Does it cost anything for a PA to work with Louis Law Group?",
    a: "No. We work on contingency — the policyholder pays nothing unless we recover. There is no cost to the PA for submitting a policy for review. Our goal is the same as yours: maximum recovery for the policyholder.",
  },
];


export default function PublicAdjusterResourcesPage() {
  return (
    <main className={styles.page}>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>Property Damage Attorneys — Florida</div>
            <h1 className={styles.heroTitle}>
              <span className={styles.gold}>Public Adjuster</span> Resources{" "}
              for <span className={styles.gold}>Florida</span> PAs
            </h1>
            <p className={styles.heroSubtitle}>
              Regulatory updates, carrier intelligence, key statutes, and legal support —
              everything Florida public adjusters need to maximize policyholder recoveries.
            </p>
            <ul className={styles.heroBullets}>
              <li>✔ OIR &amp; DFS regulatory updates for PAs</li>
              <li>✔ Carrier enforcement actions &amp; market data</li>
              <li>✔ Key Florida statutes every PA should know</li>
              <li>✔ Free policy reviews &amp; attorney consultations</li>
              <li>✔ No upfront cost — we work on contingency</li>
            </ul>
            <Link href="/case-law-updates#submit-policy" className={styles.ctaPrimary}>
              Submit a Policy for Review →
            </Link>
            <a href="sms:7864360687?body=I%20have%20a%20question%20in%20regards%20to%20a%20claim." className={styles.askLawyerHeroCta}>
              💬 Ask A Lawyer — Text Us Now
            </a>
            <p className={styles.ctaNote}>Free review · No obligation · No upfront cost</p>
          </div>
          <div className={styles.heroCard}>
            <div className={styles.heroCardBadge}>For Public Adjusters</div>
            <h2 className={styles.heroCardTitle}>Need Legal Backup on a Claim?</h2>
            <p className={styles.heroCardBody}>
              When a carrier denies, delays, or lowballs after your estimate — it&apos;s time
              for an attorney. We handle the legal fight so you can keep adjusting.
              Submit any policy for a free attorney review.
            </p>
            <div className={styles.trustRow}>
              <div className={styles.trustStat}><strong>$200M+</strong><span>Recovered</span></div>
              <div className={styles.trustStat}><strong>$0</strong><span>Upfront Cost</span></div>
              <div className={styles.trustStat}><strong>24/7</strong><span>Available</span></div>
              <div className={styles.trustStat}><strong>No Win</strong><span>No Fee</span></div>
            </div>
            <Link href="/case-law-updates#submit-policy" className={styles.ctaCard}>
              Submit Policy for Review — Free
            </Link>
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
          <strong>Carrier Deadline:</strong> Under F.S. 627.70131, insurers must pay or deny within 90 days.{" "}
          <a href="tel:8336574812" className={styles.urgencyLink}>
            If a carrier is past deadline, call us now
          </a>.
        </span>
      </div>

      {/* RESOURCE CARDS */}
      <section className={styles.services}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>Essential Resources</div>
          <h2 className={styles.sectionTitle}>
            Regulatory <span className={styles.gold}>Intelligence</span> for Florida PAs
          </h2>
          <p className={styles.sectionSubtitle}>
            Stay ahead of carrier behavior, regulatory changes, and market trends. These are
            the official Florida sources every public adjuster should be monitoring.
          </p>
          <div className={styles.servicesGrid}>
            {SERVICES.map((s) => (
              <a href={s.link} key={s.title} className={styles.serviceCard} target="_blank" rel="noopener noreferrer">
                <div className={styles.serviceIcon}>{s.icon}</div>
                <h3 className={styles.serviceTitle}>{s.title}</h3>
                <div className={styles.serviceKeywords}>
                  {s.keywords.map((k) => (
                    <span key={k} className={styles.serviceKeyword}>{k}</span>
                  ))}
                </div>
                <p className={styles.serviceDesc}>{s.desc}</p>
                <span className={styles.serviceArrow}>View Source →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* BY THE NUMBERS */}
      <section className={styles.services} style={{ background: "#f8f9fa" }}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>By the Numbers</div>
          <h2 className={styles.sectionTitle}>
            Why PAs <span className={styles.gold}>Recommend</span> Louis Law Group
          </h2>
          <div className={styles.servicesGrid}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>{s.icon}</div>
                <h3 className={styles.statNumber}>{s.number}</h3>
                <p className={styles.serviceDesc}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEY STATUTES */}
      <section className={styles.dayOne}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>Legal Reference</div>
          <h2 className={styles.sectionTitle}>
            Key Florida <span className={styles.gold}>Statutes</span> Every PA Should Know
          </h2>
          <p className={styles.sectionSubtitle}>
            These statutes govern PA conduct, carrier obligations, and policyholder rights.
            Knowing them gives you leverage at every stage of the claims process.
          </p>
          <div className={styles.dayOneGrid}>
            {STATUTES.map((s) => (
              <div key={s.statute} className={styles.dayOneCard}>
                <div className={styles.dayOneIcon}>⚖️</div>
                <h3>{s.statute} — {s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MID-PAGE CTA */}
      <section className={styles.midCta}>
        <div className={styles.midCtaInner}>
          <h2 className={styles.midCtaTitle}>Have a Claim That Needs Legal Backup?</h2>
          <p className={styles.midCtaBody}>
            When a carrier denies, delays, or underpays after your PA work — don&apos;t let the
            policyholder lose. Submit the policy for a free attorney review. We handle the legal
            fight so you can focus on what you do best.
          </p>
          <Link href="/case-law-updates#submit-policy" className={styles.ctaPrimary}>
            Submit Policy for Review — Free
          </Link>
          <a href="sms:7864360687?body=I%20have%20a%20question%20in%20regards%20to%20a%20claim." className={styles.askLawyerMidCta}>
            💬 Ask A Lawyer — Text Us Now
          </a>
        </div>
      </section>

      {/* WHEN TO INVOLVE AN ATTORNEY */}
      <section className={styles.dayOne}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>Know When to Call</div>
          <h2 className={styles.sectionTitle}>
            When to <span className={styles.gold}>Involve</span> an Attorney
          </h2>
          <p className={styles.sectionSubtitle}>
            PAs and property damage attorneys serve complementary roles. Here are the
            situations where legal counsel maximizes the policyholder&apos;s recovery.
          </p>
          <div className={styles.dayOneGrid}>
            {REFERRAL_TRIGGERS.map((s) => (
              <div key={s.title} className={styles.dayOneCard}>
                <div className={styles.dayOneIcon}>{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className={styles.dayOneCta}>
            <p className={styles.dayOneCtaNote}>
              The earlier you involve an attorney, the stronger the case — especially for bad faith and coverage disputes.
            </p>
            <a href="tel:8336574812" className={styles.ctaPrimary}>
              Call Us About a Claim — (833) 657-4812
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
          <Link href="/case-law-updates#submit-policy" className={styles.ctaPrimary} style={{ marginTop: "2.5rem" }}>
            Start Step 01 — Submit a Policy for Review
          </Link>
        </div>
      </section>

      {/* WHY LLG */}
      <section className={styles.why}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrowLight}>Why Louis Law Group</div>
          <h2 className={styles.sectionTitleLight}>
            Attorneys Who Work <em>With</em> Public Adjusters
          </h2>
          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>⚖️</div>
              <h3>Licensed FL Attorneys</h3>
              <p>We are licensed Florida attorneys who can file lawsuits, pursue bad faith claims, and escalate to appellate court — capabilities PAs need but cannot exercise themselves.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>💰</div>
              <h3>Zero Upfront Cost</h3>
              <p>No upfront cost to the policyholder. We work on contingency — we only get paid if we recover.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>🤝</div>
              <h3>PA-Friendly Approach</h3>
              <p>We don&apos;t replace PAs — we complement them. You handle the damage assessment and estimate. We handle the legal fight. Together, the policyholder wins.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>🌀</div>
              <h3>Hurricane Claim Experience</h3>
              <p>We&apos;ve handled thousands of post-hurricane property claims across Florida. We understand the unique challenges of catastrophe claims — from carrier delays to AOB disputes.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>📍</div>
              <h3>Statewide Coverage</h3>
              <p>From Miami to Pensacola, we represent policyholders in every Florida county. No matter where your claim is, we can help.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>⚡</div>
              <h3>Fast Response</h3>
              <p>Deadlines matter in property claims. We respond within 24 hours and can file emergency motions when carriers act in bad faith.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faq}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>Common Questions</div>
          <h2 className={styles.sectionTitle}>
            Public Adjuster FAQs
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

      {/* FINAL CTA */}
      <section className={styles.finalCta}>
        <div className={styles.finalCtaInner}>
          <h2 className={styles.finalCtaTitle}>
            Your Policyholder Deserves a Full Recovery
          </h2>
          <p className={styles.finalCtaBody}>
            When the carrier denies, delays, or underpays — don&apos;t let it end there.
            Submit the policy for a free attorney review. We fight the legal battle
            so you can keep adjusting.{" "}
            <strong>No cost to the PA. No fee unless we win.</strong>
          </p>
          <Link href="/case-law-updates#submit-policy" className={styles.ctaFinal}>
            Submit a Policy for Review — Free →
          </Link>
          <a href="sms:7864360687?body=I%20have%20a%20question%20in%20regards%20to%20a%20claim." className={styles.askLawyerFinalCta}>
            💬 Ask A Lawyer — Text Us Now
          </a>
          <p className={styles.finalCtaNote}>
            Available 24/7 · No Obligation · No Upfront Cost
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
