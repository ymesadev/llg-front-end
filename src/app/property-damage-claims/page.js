import styles from "./page.module.css";
import Link from "next/link";

export const metadata = {
  title: "Property Damage Claims Lawyers | Insurance Claim Attorneys | Louis Law Group",
  description:
    "Insurance claim denied or underpaid? Louis Law Group fights for Florida property owners against insurance companies. Free case evaluation — no fees unless you win.",
  keywords:
    "property damage lawyer, insurance claim attorney, denied insurance claim Florida, underpaid insurance claim, hurricane damage lawyer, roof damage claim, water damage attorney, property damage insurance dispute",
  openGraph: {
    title: "Property Damage Claims Lawyers | Louis Law Group",
    description:
      "Insurance companies deny or underpay most Florida property damage claims. Our attorneys fight back. Free case evaluation — no fees unless we win.",
    url: "https://www.louislawgroup.com/property-damage-claims",
  },
};

const CTA_URL = "/property-damage-claims/qualify";

const SERVICES = [
  {
    icon: "🏠",
    title: "Hurricane & Wind Damage",
    keywords: ["hurricane damage claim", "wind damage insurance", "storm damage lawyer"],
    desc: "Florida leads the nation in hurricane claims — and in claim denials. We fight to recover full compensation for roof, structural, and interior damage from hurricanes and tropical storms.",
  },
  {
    icon: "💧",
    title: "Water Damage & Flooding",
    keywords: ["water damage claim", "flood damage lawyer", "pipe burst insurance"],
    desc: "From burst pipes to storm flooding, water damage claims are routinely lowballed. We document the full scope of damage — including mold, structural decay, and hidden moisture — and demand fair payment.",
  },
  {
    icon: "🔨",
    title: "Roof Damage Claims",
    keywords: ["roof damage claim", "roof insurance dispute", "denied roof claim"],
    desc: "Insurers love to blame roof damage on wear and tear. We bring independent inspectors and engineers to prove storm causation — and force insurers to pay for full replacement when warranted.",
  },
  {
    icon: "🔥",
    title: "Fire & Smoke Damage",
    keywords: ["fire damage claim", "smoke damage insurance", "fire loss attorney"],
    desc: "Fire claims involve structural damage, smoke contamination, and personal property losses. We ensure nothing is overlooked — and that your insurer doesn't cut corners on your rebuild.",
  },
  {
    icon: "📋",
    title: "Underpaid & Denied Claims",
    keywords: ["underpaid insurance claim", "denied claim attorney", "insurance bad faith"],
    desc: "If your insurer denied your claim, underpaid, or is delaying — that's not the final answer. We reopen claims, challenge lowball estimates, and hold insurers accountable under Florida law.",
  },
  {
    icon: "⚖️",
    title: "Insurance Bad Faith",
    keywords: ["insurance bad faith", "bad faith claim Florida", "insurer misconduct"],
    desc: "When insurers unreasonably deny or delay valid claims, Florida law allows policyholders to pursue bad faith damages. We identify bad faith tactics and fight for the compensation you're owed.",
  },
];

const STATS = [
  {
    number: "72%",
    label: "of Florida property damage claims are underpaid or denied on first submission",
    icon: "❌",
  },
  {
    number: "3x",
    label: "higher settlement amount when policyholders hire an attorney vs. accepting the first offer",
    icon: "📈",
  },
  {
    number: "$200M+",
    label: "recovered for clients in property damage and insurance disputes",
    icon: "💰",
  },
  {
    number: "30+",
    label: "years of combined experience fighting Florida insurance companies",
    icon: "⚖️",
  },
  {
    number: "60 Days",
    label: "to file proof of loss after damage — missing this deadline can kill your claim",
    icon: "⏰",
  },
  {
    number: "$0",
    label: "upfront cost — we work on contingency. No recovery, no fee.",
    icon: "🛡️",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Free Qualification Check",
    desc: "Answer a few questions about your property, damage, and insurer response. Takes less than 3 minutes to see if you have a case.",
  },
  {
    num: "02",
    title: "Attorney Review & Inspection",
    desc: "Our property damage attorneys review your claim, policy, and denial letter. We coordinate independent inspections and document the full extent of damage.",
  },
  {
    num: "03",
    title: "We Fight — You Get Paid",
    desc: "We negotiate with your insurer, file suit if necessary, and fight for the maximum recovery. You pay nothing unless we win.",
  },
];

const FAQS = [
  {
    q: "My insurance company denied my property damage claim. What can I do?",
    a: "A denial is not the final word. Florida law protects policyholders from unfair claim denials. An attorney can review your policy and denial letter, gather independent evidence, and reopen or dispute the claim — often recovering significantly more than the insurer initially offered.",
  },
  {
    q: "How much does a property damage attorney cost?",
    a: "Nothing upfront. Property damage attorneys in Florida work on contingency. Our fee is a percentage of what we recover for you. If we don't recover anything, you owe us nothing.",
  },
  {
    q: "How long do I have to file a property damage insurance claim in Florida?",
    a: "Florida law requires you to report damage to your insurer promptly — typically within 60 days for proof of loss. The statute of limitations for filing a lawsuit is generally 3 years from the date of loss under current Florida law. However, after the 2022 reforms, timelines are stricter. Contact an attorney immediately to protect your rights.",
  },
  {
    q: "What if my insurer says my damage is from wear and tear, not the storm?",
    a: "This is one of the most common denial tactics. We bring independent inspectors, engineers, and experts who can document storm causation and distinguish it from pre-existing conditions. In many cases, what the insurer calls 'wear and tear' is actually covered storm damage.",
  },
  {
    q: "Can I still file a claim after Florida's 2022 insurance reform?",
    a: "Yes. While the 2022 reform changed attorney fee rules and shortened some deadlines, policyholders still have the right to file claims and sue insurers. The reform does not eliminate your right to full coverage under your policy. An experienced attorney can navigate the new rules effectively.",
  },
  {
    q: "What types of property damage does homeowners insurance cover?",
    a: "Most Florida homeowners policies cover damage from hurricanes, wind, hail, fire, smoke, vandalism, burst pipes, and certain water damage. Flood damage requires separate flood insurance. We review your specific policy to identify every coverage available — and fight for every dollar you're entitled to.",
  },
];

const TESTIMONIALS = [
  {
    initial: "K",
    name: "Ketty M.",
    type: "Roof Damage Claim",
    outcome: "Claim Won",
    text: "Citizens denied our roof leak claim, but this firm fought for us and got money for our repairs. We even had funds left over after fixing the roof.",
  },
  {
    initial: "E",
    name: "Elizabeth M.",
    type: "Insurance Claim",
    outcome: "Maximized Recovery",
    text: "Pierre and his team are amazing. They truly cater to their clients and help you get the most from your insurance company.",
  },
  {
    initial: "M",
    name: "Michael N.",
    type: "Roof Damage Claim",
    outcome: "Claim Resolved",
    text: "When my insurance company denied my roof damage claim, Louis Law Group stepped in and fought for me. I'm extremely satisfied with the results they obtained.",
  },
  {
    initial: "H",
    name: "Helen F.",
    type: "Insurance Claim",
    outcome: "Insurance Check Received",
    text: "They accomplished exactly what they set out to do and helped me finally receive my insurance check.",
  },
  {
    initial: "T",
    name: "Tee T.",
    type: "Homeowners Insurance",
    outcome: "Dispute Resolved",
    text: "Louis Law Group handled our homeowners insurance dispute and got results much faster than we expected. Excellent service and great communication.",
  },
  {
    initial: "E",
    name: "Edwin M.",
    type: "Property Damage",
    outcome: "Claim Recovered",
    text: "Very professional attorneys with outstanding attention to detail. They will not stop fighting for their clients.",
  },
];

export default function PropertyDamageClaimsPage() {
  return (
    <main className={styles.page}>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>Florida Property Damage Attorneys</div>
            <h1 className={styles.heroTitle}>
              <span className={styles.gold}>Property Damage</span> Lawyers{" "}
              Who <span className={styles.gold}>Fight Insurers</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Insurance companies deny or underpay most Florida property damage claims.
              With legal representation, policyholders recover significantly more —
              often 3x the insurer&apos;s first offer. We fight for your claim and you pay nothing unless we win.
            </p>
            <ul className={styles.heroBullets}>
              <li>✔ Hurricane, water, roof, fire &amp; mold damage</li>
              <li>✔ Denied, underpaid &amp; delayed claims</li>
              <li>✔ Independent inspections &amp; damage documentation</li>
              <li>✔ No upfront fees — contingency only</li>
              <li>✔ Available 24/7 · No obligation</li>
            </ul>
            <a href={CTA_URL} className={styles.ctaPrimary}>
              See If You Qualify — Free →
            </a>
            <p className={styles.ctaNote}>Takes 3 minutes · No obligation · No upfront cost</p>
          </div>
          <div className={styles.heroCard}>
            <div className={styles.heroCardBadge}>Free Case Evaluation</div>
            <h2 className={styles.heroCardTitle}>Was Your Claim Denied or Underpaid?</h2>
            <p className={styles.heroCardBody}>
              A denial or lowball offer is not the end. Most property damage claims are
              undervalued on the first pass. Our attorneys know what your damage is really
              worth — and we fight to make your insurer pay.
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
          <strong>Florida Deadline Alert:</strong> You must file proof of loss within 60 days of damage.{" "}
          <a href={CTA_URL} className={styles.urgencyLink}>
            Don&apos;t miss your window — check your options now
          </a>.
        </span>
      </div>

      {/* STATS */}
      <section className={styles.services}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>The Numbers Don&apos;t Lie</div>
          <h2 className={styles.sectionTitle}>
            Why Legal Representation <span className={styles.gold}>Changes Everything</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Florida insurance companies routinely deny and underpay legitimate property damage claims.
            Policyholders with attorneys recover dramatically more — and faster.
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
          <h2 className={styles.midCtaTitle}>Denied or Underpaid? Your Insurer Isn&apos;t on Your Side.</h2>
          <p className={styles.midCtaBody}>
            Insurance companies have teams of adjusters and lawyers working to minimize your payout.
            You deserve someone fighting just as hard for you. Our property damage attorneys level the playing field.
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
            Every Type of <span className={styles.gold}>Property Damage Claim</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            From hurricane damage to insurance bad faith — we fight for Florida property owners
            at every stage of the claims process.
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
              The sooner you get an attorney involved, the more leverage you have — and the higher your recovery.
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
            Property Damage Attorneys Who Fight for You
          </h2>
          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>⚖️</div>
              <h3>Licensed Trial Attorneys</h3>
              <p>We are licensed Florida attorneys — not public adjusters or claim consultants. We can take your insurer to court and win if they refuse to pay.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>💰</div>
              <h3>Zero Upfront Cost</h3>
              <p>We work on contingency. You pay nothing unless we recover money for you. Our interests are 100% aligned with yours.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>🔍</div>
              <h3>Independent Inspections</h3>
              <p>We bring our own inspectors, engineers, and experts — not your insurer&apos;s. This is how we prove the true extent of your damage and force fair payment.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>📋</div>
              <h3>Policy Experts</h3>
              <p>Insurance policies are complex and full of exclusions. Our attorneys know how to read every clause and find coverage the insurer doesn&apos;t want to pay.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>🏛️</div>
              <h3>Courtroom Ready</h3>
              <p>Most property damage firms settle early. We prepare every case for trial — which is exactly why insurers offer more when we&apos;re on the other side.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>📍</div>
              <h3>Statewide Coverage</h3>
              <p>We represent property owners across Florida — from Miami-Dade to the Panhandle. Hurricane, water, fire, or mold — wherever the damage is, we fight.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={styles.testimonials}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>★★★★★ 4.7 · 67 Google Reviews</div>
          <h2 className={styles.sectionTitle}>Clients Who Got Their Claims Paid</h2>
          <p className={styles.sectionSubtitle}>Real stories from Florida property owners who were denied or underpaid — and then won with Louis Law Group.</p>
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
          <p className={styles.testimonialDisclaimer}>* Reviews from Google. Results may vary by case.</p>
          <a href={CTA_URL} className={styles.ctaSecondary}>
            Join Our Clients Who Won — Start Free →
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faq}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>Common Questions</div>
          <h2 className={styles.sectionTitle}>
            Property Damage Claim FAQs
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
            Don&apos;t Let Your Insurer Win
          </h2>
          <p className={styles.finalCtaBody}>
            Your insurance company has adjusters, lawyers, and billions of dollars on their side.
            You deserve someone fighting just as hard for you. Whether your claim was denied,
            underpaid, or delayed — we review your case for free and fight for every dollar
            your policy covers.{" "}
            <strong>No fees unless we win your claim.</strong>
          </p>
          <a href={CTA_URL} className={styles.ctaFinal}>
            See If You Qualify Now — Free →
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
