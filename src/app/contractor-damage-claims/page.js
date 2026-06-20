import styles from "./page.module.css";
import Link from "next/link";

export const metadata = {
  title: "Florida Contractor Damage Attorney | Sue Your Contractor | Louis Law Group",
  description:
    "Contractor damaged your home? Florida attorneys who sue HVAC, plumbing, and roofing contractors. Free evaluation — no fees unless we win.",
  keywords:
    "contractor damaged my property Florida, sue contractor for water damage Florida, HVAC contractor negligence Florida, plumber damaged my home Florida, roofing contractor lawsuit Florida",
  alternates: { canonical: "https://www.louislawgroup.com/contractor-damage-claims" },
  openGraph: {
    title: "Florida Contractor Damage Attorney | Louis Law Group",
    description:
      "Contractor damaged your home? Florida attorneys who sue HVAC, plumbing, and roofing contractors. Free evaluation — no fees unless we win.",
    url: "https://www.louislawgroup.com/contractor-damage-claims",
  },
};

const CTA_URL = "/contractor-damage-claims/qualify";

const SERVICES = [
  {
    icon: "❄️",
    title: "HVAC Contractor Damage",
    keywords: ["HVAC water damage Florida", "AC installation flooding", "ductwork damage claim"],
    desc: "Improper AC installation is one of the leading causes of attic flooding and mold damage in Florida. We pursue HVAC contractors for negligent installation, refrigerant leaks, and condensate line failures that flood your home.",
  },
  {
    icon: "🔧",
    title: "Plumbing Contractor Damage",
    keywords: ["plumber burst pipe Florida", "plumbing negligence claim", "sue plumber water damage"],
    desc: "When a plumber cracks a pipe during re-pipe work, fails to seal connections, or causes a slab leak — the damage can be catastrophic. We sue plumbing contractors and their bonded insurers for the full cost of repairs plus consequential losses.",
  },
  {
    icon: "🏠",
    title: "Roofing Contractor Damage",
    keywords: ["roof installation water damage", "roofer defective workmanship", "new roof leaking Florida"],
    desc: "A faulty roof installation can let water in for months before the full damage becomes apparent. We pursue roofing contractors for defective workmanship, improper flashing, and damage caused during the replacement process.",
  },
  {
    icon: "⚡",
    title: "Electrical Contractor Damage",
    keywords: ["electrician caused fire Florida", "electrical contractor negligence", "faulty wiring damage claim"],
    desc: "Faulty electrical work causes fires, appliance damage, and structural harm. We hold electricians and their bonded insurers accountable for negligent wiring, improper panel work, and code violations that result in property damage.",
  },
  {
    icon: "🦠",
    title: "Mold & Water Intrusion",
    keywords: ["contractor caused mold Florida", "moisture intrusion negligence", "mold after HVAC installation"],
    desc: "Contractor-caused moisture intrusion almost always leads to mold — which insurance routinely excludes. We document the causal chain from contractor fault through mold growth and fight for complete remediation costs from the contractor.",
  },
  {
    icon: "🔍",
    title: "Insurance Denial — Contractor Fault",
    keywords: ["insurance denied contractor fault", "third party liability claim Florida", "contractor GL insurance claim"],
    desc: "When your insurer says the contractor caused the damage — not a covered peril — that is your signal to sue the contractor's general liability carrier. We pursue their GL policy and professional liability coverage for the full loss.",
  },
];

const STATS = [
  {
    number: "3 Trades",
    label: "HVAC, plumbing, and roofing contractors cause most contractor-related property damage in Florida",
    icon: "🔧",
  },
  {
    number: "70%",
    label: "of homeowners insurance claims for contractor-caused damage are denied — leaving owners no coverage unless they sue the contractor directly",
    icon: "❌",
  },
  {
    number: "$200M+",
    label: "recovered for clients in property damage, insurance disputes, and contractor liability cases",
    icon: "💰",
  },
  {
    number: "4 Years",
    label: "Florida statute of limitations on contractor damage claims — after that, your right to sue is gone forever",
    icon: "⏰",
  },
  {
    number: "Oct 2025",
    label: "Air Pros USA (Florida's largest HVAC contractor) filed Chapter 11 — time-limited window to file claims against the bankruptcy estate",
    icon: "⚠️",
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
    title: "Free Case Assessment",
    desc: "Tell us what the contractor did, when it happened, and what your insurer said. Under 5 minutes to find out if you have a contractor liability claim worth pursuing.",
  },
  {
    num: "02",
    title: "Investigation & Evidence",
    desc: "We bring independent inspectors and engineers to document contractor fault, distinguish negligence from normal wear, and build an airtight liability record against the contractor and their insurer.",
  },
  {
    num: "03",
    title: "Sue the Contractor — Get Paid",
    desc: "We pursue the contractor's general liability bond and insurance carrier. You pay nothing unless we recover — and we typically recover full repair costs plus consequential damages and attorney fees.",
  },
];

const FAQS = [
  {
    q: "My homeowners insurance denied my claim because the damage was the contractor's fault. What do I do?",
    a: "That denial is actually the foundation of a lawsuit against the contractor. When your insurer says the damage was caused by the contractor — not a covered peril — they are making your case for you. We sue the contractor's general liability carrier for full repair costs, mold remediation, temporary housing, and all consequential losses.",
  },
  {
    q: "How long do I have to sue a contractor in Florida?",
    a: "Florida's statute of limitations for contractor negligence is 4 years from the date the damage was discovered or reasonably should have been discovered. Evidence degrades fast — contractor insurance policies can lapse and corporate entities can dissolve. Contact us immediately after discovering contractor damage to preserve your options.",
  },
  {
    q: "What if the contractor is out of business or has filed bankruptcy?",
    a: "A dissolved or bankrupt contractor does not end your claim. General liability policies remain in force for claims filed during the policy period. Florida licensing law also requires contractor bonding. For franchise contractors, the franchisor may have direct liability exposure. For bankruptcies like Air Pros USA (Chapter 11, Oct 2025), there is a time-limited window to file claims with the bankruptcy estate.",
  },
  {
    q: "Can I sue the contractor even if my insurance already paid something?",
    a: "Yes. Your insurer's payment reduces your out-of-pocket loss but does not extinguish the contractor's liability. If the contractor's negligence caused the damage, you or your insurer (via subrogation) can still pursue the contractor for the full loss. We frequently take contractor liability cases alongside an existing insurance recovery.",
  },
  {
    q: "What is the difference between an insurance claim and a contractor damage claim?",
    a: "An insurance claim goes to your homeowner's insurer under your property policy. A contractor damage claim goes to the contractor's general liability insurer — a completely separate policy with separate limits. You can pursue both simultaneously. The contractor's GL policy is often the right path when your own insurer denies because they say the damage was the contractor's fault.",
  },
  {
    q: "What types of contractor damage do you handle?",
    a: "Water damage from HVAC installation, burst pipes from plumbing work, roof leaks from faulty roofing, mold from moisture intrusion, structural damage from construction errors, and fire or electrical damage from negligent wiring. We handle every type of contractor-caused property damage in Florida — residential and commercial.",
  },
];

const TESTIMONIALS = [
  {
    initial: "K",
    name: "Ketty M.",
    type: "Roofing Contractor Claim",
    outcome: "Claim Won",
    text: "Citizens denied our roof leak claim, but this firm fought for us and got money for our repairs. We even had funds left over after fixing the roof.",
  },
  {
    initial: "E",
    name: "Elizabeth M.",
    type: "Contractor Damage Claim",
    outcome: "Maximized Recovery",
    text: "Pierre and his team are amazing. They truly cater to their clients and help you get the most from your insurance company.",
  },
  {
    initial: "M",
    name: "Michael N.",
    type: "Roofing Contractor Claim",
    outcome: "Claim Resolved",
    text: "When my insurance company denied my roof damage claim, Louis Law Group stepped in and fought for me. I'm extremely satisfied with the results they obtained.",
  },
  {
    initial: "H",
    name: "Helen F.",
    type: "Contractor Insurance Claim",
    outcome: "Insurance Check Received",
    text: "They accomplished exactly what they set out to do and helped me finally receive my insurance check.",
  },
  {
    initial: "T",
    name: "Tee T.",
    type: "Contractor Insurance Claim",
    outcome: "Dispute Resolved",
    text: "Louis Law Group handled our homeowners insurance dispute and got results much faster than we expected. Excellent service and great communication.",
  },
  {
    initial: "E",
    name: "Edwin M.",
    type: "Contractor Liability",
    outcome: "Claim Recovered",
    text: "Very professional attorneys with outstanding attention to detail. They will not stop fighting for their clients.",
  },
];

export default function ContractorDamageClaimsPage() {
  return (
    <main className={styles.page}>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>Florida Contractor Third-Party Liability Attorneys</div>
            <h1 className={styles.heroTitle}>
              <span className={styles.gold}>Contractor Damaged</span> Your Property?{" "}
              <span className={styles.gold}>We Make Them Pay.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              When an HVAC technician floods your attic, a plumber bursts a pipe in your walls, or a roofer&apos;s shoddy work lets water in — your homeowners insurance may deny the claim because the contractor caused it. We sue the contractor and their insurer to recover every dollar you&apos;re owed.
            </p>
            <ul className={styles.heroBullets}>
              <li>✔ HVAC, plumbing, roofing &amp; electrical contractor damage</li>
              <li>✔ Insurance denied? We sue the contractor directly</li>
              <li>✔ Negligent installation, water damage, structural damage</li>
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
            <h2 className={styles.heroCardTitle}>Did a Contractor Damage Your Property?</h2>
            <p className={styles.heroCardBody}>
              If your insurer denied your claim because the contractor caused it — that denial is the foundation of a lawsuit against the contractor. We pursue their general liability carrier for full repair costs, mold remediation, temporary housing, and all consequential losses.
            </p>
            <div className={styles.trustRow}>
              <div className={styles.trustStat}><strong>$0</strong><span>Upfront</span></div>
              <div className={styles.trustStat}><strong>No Win</strong><span>No Fee</span></div>
              <div className={styles.trustStat}><strong>Free</strong><span>Review</span></div>
              <div className={styles.trustStat}><strong>Day 1</strong><span>Attorney</span></div>
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
          <strong>Florida Deadline Alert:</strong> Contractor damage claims expire in 4 years — and evidence degrades fast. Don&apos;t wait —{" "}
          <a href={CTA_URL} className={styles.urgencyLink}>
            check your options now
          </a>.
        </span>
      </div>

      {/* STATS */}
      <section className={styles.services}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>The Numbers Don&apos;t Lie</div>
          <h2 className={styles.sectionTitle}>
            Why Contractor Liability Claims <span className={styles.gold}>Require an Attorney</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Contractor-caused property damage falls into a legal gap — your insurer won&apos;t pay and the contractor hopes you walk away. An attorney closes that gap by pursuing the contractor&apos;s GL carrier directly.
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
          <h2 className={styles.midCtaTitle}>Insurance Denied Because the Contractor Caused It? That&apos;s Our Case.</h2>
          <p className={styles.midCtaBody}>
            Contractors carry general liability insurance for exactly this reason. When your homeowner&apos;s insurer points at the contractor, they are handing you the roadmap to recovery. We follow it — and we make the contractor&apos;s insurer pay.
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
            Every Type of <span className={styles.gold}>Contractor Damage Claim</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            From HVAC flooding to roofing defects to insurance denials — we pursue Florida contractors and their insurers at every stage.
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
              The sooner you get an attorney involved, the more leverage you have — and the better your evidence before it degrades.
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
            Contractor Damage Attorneys Who Fight for You
          </h2>
          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>⚖️</div>
              <h3>Licensed Trial Attorneys</h3>
              <p>We are licensed Florida attorneys who can take contractors and their insurers to court. We do not just write demand letters — we file lawsuits and win.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>🔍</div>
              <h3>Independent Engineers</h3>
              <p>We bring our own structural engineers and damage inspectors to document contractor fault and distinguish negligence from pre-existing conditions — so the insurer cannot dispute causation.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>💰</div>
              <h3>Zero Upfront Cost</h3>
              <p>We work on contingency — no fee unless we recover. Our interests are 100% aligned with getting you the maximum recovery from the contractor and their insurer.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>📋</div>
              <h3>Contractor Bond &amp; GL Experts</h3>
              <p>Contractor damage claims involve multiple insurance layers — GL policies, professional liability, licensing bonds, and manufacturer warranties. We know how to attack every layer.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>🏛️</div>
              <h3>Courtroom Ready</h3>
              <p>Most contractors settle once they see we are prepared to litigate. We prepare every case for trial — which is why contractors&apos; insurers pay more when we are on the other side.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>📍</div>
              <h3>Statewide Coverage</h3>
              <p>We represent property owners across Florida against HVAC, plumbing, roofing, and electrical contractors. Wherever the damage is in Florida, we fight.</p>
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
            Contractor Damage Claim FAQs
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
            Don&apos;t Let the Contractor Walk Away
          </h2>
          <p className={styles.finalCtaBody}>
            Contractors carry general liability insurance for exactly this reason. If their negligence damaged your home — whether your insurer paid, denied, or is still deciding — you have the right to pursue the contractor directly. We review your case for free and fight for every dollar their insurance owes you.{" "}
            <strong>No fees unless we win.</strong>
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
