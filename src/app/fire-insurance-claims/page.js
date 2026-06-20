import styles from "./page.module.css";
import Link from "next/link";
import { Flame, XCircle, ClipboardList, Scale, Landmark, Zap, MapPin, TrendingUp, DollarSign, Clock, ShieldCheck, Phone, Search } from "lucide-react";

const LUCIDE_ICON_MAP = { "🔥": Flame, "❌": XCircle, "📋": ClipboardList, "⚖️": Scale, "🏛️": Landmark, "⚡": Zap, "📍": MapPin, "📈": TrendingUp, "💰": DollarSign, "⏰": Clock, "🛡️": ShieldCheck, "📞": Phone, "🔍": Search };
const LIcon = ({ name, size = 28, className }) => { const C = LUCIDE_ICON_MAP[name]; return C ? <C size={size} className={className} strokeWidth={1.5} /> : <span>{name}</span>; };

export const metadata = {
  title: "Florida Fire Insurance Claim Lawyers | Denied Fire Claim Attorneys | Louis Law Group",
  description:
    "Fire damage insurance claim denied or underpaid? Florida fire claim attorneys at Louis Law Group fight insurance companies. Free consultation — (833) 657-4812.",
  keywords:
    "fire insurance claim lawyer florida, fire damage claim denied, fire insurance attorney, smoke damage claim, house fire insurance claim, fire claim lawyer near me",
  openGraph: {
    title: "Florida Fire Insurance Claim Lawyers | Louis Law Group",
    description:
      "Denied or underpaid fire damage claim? Louis Law Group fights Florida insurance companies for full fire claim compensation. Free case evaluation — no fees unless we win.",
    url: "https://www.louislawgroup.com/fire-insurance-claims",
  },
  alternates: { canonical: "https://www.louislawgroup.com/fire-insurance-claims" },
};

const CTA_URL = "/property-damage-claims/qualify";

const CLUSTERS = [
  { slug: "types-of-damage", icon: "🔥", title: "Types of Fire Damage", desc: "Structural, smoke, soot, water from firefighting, electrical, HVAC contamination" },
  { slug: "denied-claims", icon: "❌", title: "Why Fire Claims Get Denied", desc: "Arson allegations, misrepresentation, excluded causes, lapsed coverage, late notice" },
  { slug: "claim-process", icon: "📋", title: "The Fire Claim Process", desc: "Steps after a fire, documentation, proof of loss, EUO, working with adjusters" },
  { slug: "coverage-disputes", icon: "⚖️", title: "Coverage Disputes", desc: "ACV vs RCV, additional living expenses, personal property, code upgrades, depreciation" },
  { slug: "legal-remedies", icon: "🏛️", title: "Legal Remedies", desc: "Bad faith claims, Civil Remedy Notice, appraisal, mediation, litigation" },
  { slug: "fire-scenarios", icon: "⚡", title: "Specific Fire Scenarios", desc: "Kitchen fires, electrical fires, lightning strikes, wildfire, smoke-only damage" },
  { slug: "florida-specific", icon: "📍", title: "Florida-Specific Issues", desc: "Tort reform impact, Citizens Insurance, wind + fire, Florida statutes" },
];

const STATS = [
  { number: "47%", label: "of Florida property damage claims are denied or closed without payment", icon: "❌" },
  { number: "3x", label: "higher settlement when policyholders hire an attorney vs. accepting the first offer", icon: "📈" },
  { number: "$200M+", label: "recovered for clients across property damage and insurance disputes", icon: "💰" },
  { number: "60 Days", label: "to submit proof of loss once your insurer requests it — don't miss this deadline", icon: "⏰" },
  { number: "$0", label: "upfront cost — we work on contingency. No recovery, no fee.", icon: "🛡️" },
  { number: "24/7", label: "available for urgent fire claim consultations and case reviews", icon: "📞" },
];

const STEPS = [
  { num: "01", title: "Free Qualification Check", desc: "Answer a few questions about your fire damage, insurance carrier, and claim status. Takes less than 3 minutes to see if you have a case." },
  { num: "02", title: "Attorney Review & Investigation", desc: "Our fire damage attorneys review your claim, policy, and denial letter. We coordinate independent fire damage inspections and document the full extent of loss." },
  { num: "03", title: "We Fight — You Get Paid", desc: "We negotiate with your insurer, file suit if necessary, and fight for the maximum recovery. You pay nothing unless we win." },
];

const FAQS = [
  { q: "My insurance company denied my fire damage claim. What can I do?", a: "A denial is not the final word. Florida law protects policyholders from unfair claim denials. An attorney can review your policy and denial letter, gather independent evidence of fire damage, and dispute the denial — often recovering significantly more than the insurer initially offered." },
  { q: "How long do I have to file a fire damage insurance claim in Florida?", a: "You must report fire damage to your insurer promptly. Once your insurer requests a proof of loss, you typically have 60 days to submit it. The statute of limitations for filing a lawsuit is generally 3 years from the date of loss. After the 2022 tort reforms, timelines are stricter — contact an attorney immediately." },
  { q: "Does homeowners insurance cover all types of fire damage?", a: "Most Florida homeowners policies cover fire damage including structural damage, smoke damage, soot contamination, water damage from firefighting, and personal property losses. However, insurers often dispute the extent of damage or allege arson. We fight to ensure every covered loss is paid." },
  { q: "What if my insurer says the fire was caused by arson?", a: "Arson allegations are one of the most common tactics insurers use to deny fire claims. The burden of proof is on the insurer. We work with independent fire investigators and forensic experts to challenge baseless arson allegations and protect your claim." },
  { q: "Can I claim additional living expenses (ALE) after a fire?", a: "Yes. Most homeowners policies include ALE or loss of use coverage for temporary housing, meals, and other living expenses while your home is uninhabitable due to fire damage. Insurers often underpay ALE — we fight for the full amount you're entitled to." },
  { q: "How much does a fire damage attorney cost?", a: "Nothing upfront. We work on contingency — you pay nothing unless we recover money for your fire damage claim. Our fee is a percentage of what we win. If we don't recover anything, you owe us nothing." },
];

const fireServiceSchema = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "Louis Law Group - Fire Insurance Claims",
  url: "https://www.louislawgroup.com/fire-insurance-claims",
  telephone: "+18336574812",
  priceRange: "Free consultation — contingency fee",
  description: "Florida fire insurance claim attorneys. We fight denied and underpaid fire damage claims. Free consultation — no fees unless we win.",
  areaServed: { "@type": "State", name: "Florida" },
  address: { "@type": "PostalAddress", addressRegion: "FL", addressCountry: "US" },
  serviceType: "Fire Insurance Claims",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(f => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FireInsuranceClaimsPage() {
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(fireServiceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>Florida Fire Insurance Claim Attorneys</div>
            <h1 className={styles.heroTitle}>
              <span className={styles.gold}>Fire Damage</span> Insurance Claim{" "}
              <span className={styles.gold}>Lawyers</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Insurance companies deny and underpay fire damage claims every day.
              Smoke damage, structural loss, personal property — your policy covers it.
              We fight to make your insurer pay what you&apos;re owed. No fees unless we win.
            </p>
            <ul className={styles.heroBullets}>
              <li>✔ House fires, smoke &amp; soot damage</li>
              <li>✔ Electrical fires &amp; lightning strikes</li>
              <li>✔ Denied, underpaid &amp; delayed fire claims</li>
              <li>✔ Additional living expenses (ALE) disputes</li>
              <li>✔ No upfront fees — contingency only</li>
            </ul>
            <a href={CTA_URL} className={styles.ctaPrimary}>
              See If You Qualify — Free →
            </a>
            <p className={styles.ctaNote}>Takes 3 minutes · No obligation · No upfront cost</p>
          </div>
          <div className={styles.heroCard}>
            <div className={styles.heroCardBadge}>Free Fire Claim Evaluation</div>
            <h2 className={styles.heroCardTitle}>Was Your Fire Claim Denied or Underpaid?</h2>
            <p className={styles.heroCardBody}>
              A denial or lowball offer is not the end. Most fire damage claims are
              undervalued on the first pass. Our attorneys know what your fire damage is really
              worth — and we fight to make your insurer pay.
            </p>
            <div className={styles.trustRow}>
              <div className={styles.trustStat}><strong>$200M+</strong><span>Recovered</span></div>
              <div className={styles.trustStat}><strong>$0</strong><span>Upfront Cost</span></div>
              <div className={styles.trustStat}><strong>Day 1</strong><span>Lawyer on Your Case</span></div>
              <div className={styles.trustStat}><strong>No Win</strong><span>No Fee</span></div>
            </div>
            <a href={CTA_URL} className={styles.ctaCard}>See If You Qualify — Free</a>
            <p className={styles.cardDisclaimer}>Licensed Attorneys · No Win, No Fee</p>
          </div>
        </div>
      </section>

      {/* URGENCY BANNER */}
      <div className={styles.urgencyBanner}>
        <span className={styles.urgencyIcon}>⚠️</span>
        <span>
          <strong>Florida Deadline Alert:</strong> You have 60 days to submit proof of loss once requested.{" "}
          <a href={CTA_URL} className={styles.urgencyLink}>
            Don&apos;t miss your window — check your options now
          </a>.
        </span>
      </div>

      {/* STATS */}
      <section className={styles.services}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>The Numbers</div>
          <h2 className={styles.sectionTitle}>
            Why Legal Representation <span className={styles.gold}>Changes Everything</span>
          </h2>
          <div className={styles.servicesGrid}>
            {STATS.map((s) => (
              <a href={CTA_URL} key={s.label} className={styles.serviceCard}>
                <div className={styles.serviceIcon}><LIcon name={s.icon} /></div>
                <h3 className={styles.statNumber}>{s.number}</h3>
                <p className={styles.serviceDesc}>{s.label}</p>
                <span className={styles.serviceArrow}>See If You Qualify →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CLUSTER GRID */}
      <section className={styles.dayOne}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>Fire Claim Resources</div>
          <h2 className={styles.sectionTitle}>
            Everything You Need to Know About <span className={styles.gold}>Fire Insurance Claims</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Explore our in-depth guides on every aspect of fire damage insurance claims in Florida.
          </p>
          <div className={styles.dayOneGrid}>
            {CLUSTERS.map((c) => (
              <Link key={c.slug} href={`/fire-insurance-claims/${c.slug}`} className={styles.dayOneCard}>
                <div className={styles.dayOneIcon}><LIcon name={c.icon} /></div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </Link>
            ))}
          </div>
          <div className={styles.dayOneCta}>
            <Link href="/fire-insurance-claims/resources" className={styles.ctaSecondary}>
              Browse All Fire Claim Articles →
            </Link>
          </div>
        </div>
      </section>

      {/* MID-PAGE CTA */}
      <section className={styles.midCta}>
        <div className={styles.midCtaInner}>
          <h2 className={styles.midCtaTitle}>Fire Claim Denied? Your Insurer Isn&apos;t on Your Side.</h2>
          <p className={styles.midCtaBody}>
            Insurance companies have teams of adjusters and lawyers working to minimize your fire claim payout.
            You deserve someone fighting just as hard for you. Our fire damage attorneys level the playing field.
          </p>
          <a href={CTA_URL} className={styles.ctaPrimary}>Check If You Have a Case — Free</a>
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
          <h2 className={styles.sectionTitleLight}>Fire Damage Attorneys Who Fight for You</h2>
          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}><LIcon name="⚖️" /></div>
              <h3>Licensed Trial Attorneys</h3>
              <p>We are licensed Florida attorneys — not public adjusters. We can take your insurer to court and win if they refuse to pay your fire claim.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}><LIcon name="💰" /></div>
              <h3>Zero Upfront Cost</h3>
              <p>We work on contingency. You pay nothing unless we recover money for your fire damage claim.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}><LIcon name="🔍" /></div>
              <h3>Independent Fire Investigation</h3>
              <p>We bring independent fire investigators and forensic experts — not your insurer&apos;s. This is how we prove the true cause and extent of your fire damage.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}><LIcon name="📋" /></div>
              <h3>Fire Claim Specialists</h3>
              <p>From arson defense to smoke damage disputes to ALE claims — we handle every aspect of fire insurance litigation.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}><LIcon name="🏛️" /></div>
              <h3>Courtroom Ready</h3>
              <p>We prepare every fire claim for trial — which is why insurers offer more when Louis Law Group is on the other side.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}><LIcon name="📍" /></div>
              <h3>All of Florida</h3>
              <p>We represent fire damage victims across Florida — from Miami-Dade to the Panhandle.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faq}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>Common Questions</div>
          <h2 className={styles.sectionTitle}>Fire Insurance Claim FAQs</h2>
          <div className={styles.faqGrid}>
            {FAQS.map((f) => (
              <div key={f.q} className={styles.faqItem}>
                <h3 className={styles.faqQ}>{f.q}</h3>
                <p className={styles.faqA}>{f.a}</p>
              </div>
            ))}
          </div>
          <Link href="/fire-insurance-claims/faqs" className={styles.ctaSecondary} style={{ marginTop: "2rem" }}>
            View All Fire Claim FAQs →
          </Link>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.finalCta}>
        <div className={styles.finalCtaInner}>
          <h2 className={styles.finalCtaTitle}>Don&apos;t Let Your Insurer Win</h2>
          <p className={styles.finalCtaBody}>
            Your insurance company has adjusters, lawyers, and billions on their side.
            You deserve someone fighting just as hard for you. Whether your fire claim was denied,
            underpaid, or delayed — we review your case for free and fight for every dollar
            your policy covers.{" "}
            <strong>No fees unless we win your claim.</strong>
          </p>
          <a href={CTA_URL} className={styles.ctaFinal}>See If You Qualify Now — Free →</a>
          <p className={styles.finalCtaNote}>Available 24/7 · No Obligation · No Upfront Cost</p>
          <div className={styles.finalTrust}>
            <span><LIcon name="📞" size={16} /> (833) 657-4812</span>
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
