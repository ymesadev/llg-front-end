import styles from "./page.module.css";
import Link from "next/link";

export const metadata = {
  title: "Water Damage Restoration & Mold Remediation Claims | Louis Law Group",
  description:
    "Suffering from water damage, mold, or roof leaks in Miami-Dade, Broward, or Palm Beach? Louis Law Group fights insurance companies to get you the compensation you deserve. Free case evaluation.",
  keywords:
    "water damage restoration, water damage repair, mold removal service, mold remediation, roof leak repair, emergency water restoration, flood damage, water damage miami, water damage fort lauderdale, water damage west palm beach",
  openGraph: {
    title: "Water Damage Restoration Claims | Louis Law Group",
    description:
      "Insurance company underpaying or denying your water damage claim? We fight for full compensation. No fees unless we win.",
    url: "https://www.louislawgroup.com/water-damage-restoration",
  },
};

const CTA_URL = "https://www.louislawgroup.com/property-damage-claims/qualify";

const SERVICES = [
  {
    icon: "💧",
    title: "Water Damage Repair",
    keywords: ["water damage repair", "water damage cleanup", "water extraction"],
    desc: "Burst pipes, appliance leaks, flooding — insurance companies routinely underpay these claims. We recover the full cost of restoration.",
  },
  {
    icon: "🍃",
    title: "Mold Remediation Claims",
    keywords: ["mold removal service", "mold remediation", "mold inspection"],
    desc: "Mold from water damage is a serious health hazard. If your insurer denied or lowballed your mold claim, we hold them accountable.",
  },
  {
    icon: "🏠",
    title: "Roof Leak & Storm Damage",
    keywords: ["fix leak roof", "emergency roof repair", "storm damage restoration"],
    desc: "Hurricane, hail, and wind damage to your roof is covered — yet insurers frequently dispute the scope. We maximize your settlement.",
  },
  {
    icon: "🚨",
    title: "Emergency Water Restoration",
    keywords: ["emergency water restoration", "emergency water removal", "24 hour water damage"],
    desc: "Emergency mitigation costs add up fast. We document every expense and fight to ensure every dollar is included in your claim.",
  },
  {
    icon: "🔧",
    title: "Plumbing Leak Damage",
    keywords: ["plumbing leak repair", "water leak repair", "leak repair near me"],
    desc: "Hidden pipe leaks can cause thousands in structural damage. Our attorneys know how to prove long-term loss to your insurer.",
  },
  {
    icon: "🏢",
    title: "Sewage & Contamination",
    keywords: ["sewage cleanup", "water damage contractors", "water mitigation company"],
    desc: "Sewage backups and contaminated water damage require specialized remediation. We ensure insurers cover the full remediation scope.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Free Case Evaluation",
    desc: "Answer a few quick questions about your water damage claim. Takes less than 3 minutes.",
  },
  {
    num: "02",
    title: "Attorney Review",
    desc: "Our property damage attorneys review your policy and damage documentation at no cost.",
  },
  {
    num: "03",
    title: "We Fight — You Win",
    desc: "We negotiate or litigate your claim. You pay nothing unless we recover money for you.",
  },
];

const FAQS = [
  {
    q: "My insurance company denied my water damage claim. What can I do?",
    a: "A denial is not the end. Insurance companies frequently deny valid claims hoping policyholders won't push back. Our attorneys review your denial letter, identify bad-faith tactics, and build a case to overturn it. You have rights under Florida law.",
  },
  {
    q: "How long do I have to file a water damage insurance claim in Florida?",
    a: "Under Florida law, you generally have 1–2 years from the date of loss to file or re-open a claim, depending on your policy and loss date. Do not wait — evidence degrades and deadlines are strict. Contact us immediately.",
  },
  {
    q: "Does homeowners insurance cover mold from water damage?",
    a: "It depends on the source. If mold resulted from a covered water loss (like a burst pipe or roof leak from a storm), your insurer is typically responsible for mold remediation. Insurers often try to exclude mold coverage — we fight that.",
  },
  {
    q: "What does water damage restoration cost in Miami-Dade, Broward, or Palm Beach?",
    a: "Water damage restoration typically costs $2,000–$10,000+ depending on the extent, materials affected, and mold involvement. If your insurer is paying less than the actual repair cost, you may be entitled to more. We evaluate this for free.",
  },
  {
    q: "Do I need a public adjuster or an attorney?",
    a: "An attorney provides stronger protection. Unlike public adjusters, attorneys can take your case to court, file bad-faith claims, and recover attorney's fees from the insurance company under Florida Statute § 627.428. In many cases, the insurer pays our fees — not you.",
  },
  {
    q: "What areas do you serve for water damage claims?",
    a: "We serve all of Miami-Dade, Broward, and Palm Beach counties — including Miami, Fort Lauderdale, Boca Raton, West Palm Beach, Coral Springs, Pembroke Pines, Hollywood, Miramar, Homestead, and surrounding areas.",
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

export default function WaterDamageRestorationPage() {
  return (
    <main className={styles.page}>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>Property Damage Attorneys — South Florida</div>
            <h1 className={styles.heroTitle}>
              <span className={styles.gold}>Water Damage</span> &amp; Mold Claims{" "}
              <span className={styles.gold}>Lawyers</span> in Miami-Dade, Broward &amp; Palm Beach
            </h1>
            <p className={styles.heroSubtitle}>
              Insurance companies underpay and deny water damage, mold remediation, and roof
              leak claims every day. We fight back — and we don&apos;t charge you unless we win.
            </p>
            <ul className={styles.heroBullets}>
              <li>✔ Water damage repair &amp; restoration claims</li>
              <li>✔ Mold removal &amp; remediation disputes</li>
              <li>✔ Emergency water extraction claims</li>
              <li>✔ Roof leak &amp; storm damage recovery</li>
              <li>✔ No fees unless we recover money for you</li>
            </ul>
            <a href={CTA_URL} className={styles.ctaPrimary}>
              Start Your Free Case Evaluation →
            </a>
            <p className={styles.ctaNote}>Takes 3 minutes · No obligation · Available 24/7</p>
          </div>
          <div className={styles.heroCard}>
            <div className={styles.heroCardBadge}>Free Case Review</div>
            <h2 className={styles.heroCardTitle}>Was Your Water Damage Claim Denied or Underpaid?</h2>
            <p className={styles.heroCardBody}>
              Our attorneys recover the full cost of your water damage restoration — including
              mold remediation, structural repairs, and emergency services.
            </p>
            <div className={styles.trustRow}>
              <div className={styles.trustStat}><strong>$200M+</strong><span>Recovered</span></div>
              <div className={styles.trustStat}><strong>3,000+</strong><span>Cases Won</span></div>
              <div className={styles.trustStat}><strong>Day 1</strong><span>Lawyer on Your Case</span></div>
              <div className={styles.trustStat}><strong>No Win</strong><span>No Fee</span></div>
            </div>
            <a href={CTA_URL} className={styles.ctaCard}>
              Check If You Qualify — Free
            </a>
            <p className={styles.cardDisclaimer}>
              Licensed in FL · Serving Miami-Dade, Broward &amp; Palm Beach
            </p>
          </div>
        </div>
      </section>

      {/* URGENCY BANNER */}
      <div className={styles.urgencyBanner}>
        <span className={styles.urgencyIcon}>⚠️</span>
        <span>
          <strong>Florida Deadline Alert:</strong> Water damage claims have strict filing windows.
          If your loss occurred within the last 2 years,{" "}
          <a href={CTA_URL} className={styles.urgencyLink}>act now before your claim expires</a>.
        </span>
      </div>

      {/* SERVICES */}
      <section className={styles.services}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>What We Handle</div>
          <h2 className={styles.sectionTitle}>
            We Fight Every Type of <span className={styles.gold}>Water Damage Claim</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            From emergency water extraction to mold remediation services near you — if your
            insurance company is refusing to pay, we step in.
          </p>
          <div className={styles.servicesGrid}>
            {SERVICES.map((s) => (
              <a href={CTA_URL} key={s.title} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>{s.icon}</div>
                <h3 className={styles.serviceTitle}>{s.title}</h3>
                <div className={styles.serviceKeywords}>
                  {s.keywords.map((k) => (
                    <span key={k} className={styles.kwTag}>{k}</span>
                  ))}
                </div>
                <p className={styles.serviceDesc}>{s.desc}</p>
                <span className={styles.serviceArrow}>Get Help →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* MID-PAGE CTA */}
      <section className={styles.midCta}>
        <div className={styles.midCtaInner}>
          <h2 className={styles.midCtaTitle}>Is Your Insurance Company Lowballing You?</h2>
          <p className={styles.midCtaBody}>
            Water damage restoration contractors near you will give you a fair estimate. Your
            insurance company&apos;s estimate is often 40–70% lower. We close that gap.
          </p>
          <a href={CTA_URL} className={styles.ctaPrimary}>
            See If You Have a Case — Free
          </a>
        </div>
      </section>

      {/* DAY ONE REPRESENTATION */}
      <section className={styles.dayOne}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>Why It Matters</div>
          <h2 className={styles.sectionTitle}>
            Why You Need an Attorney <span className={styles.gold}>From Day One</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Most policyholders wait until their claim is denied to call a lawyer. By then, critical
            evidence is gone and the insurance company has already built its case against you.
          </p>
          <div className={styles.dayOneGrid}>
            <div className={styles.dayOneCard}>
              <div className={styles.dayOneIcon}>📸</div>
              <h3>Evidence Preserved Immediately</h3>
              <p>Water damage deteriorates fast. An attorney documents the full scope of loss before it&apos;s repaired, dried out, or questioned by an adjuster. That documentation becomes your leverage.</p>
            </div>
            <div className={styles.dayOneCard}>
              <div className={styles.dayOneIcon}>🛑</div>
              <h3>Stop Lowball Offers Before They&apos;re Made</h3>
              <p>Insurers send adjusters whose job is to minimize payouts. When an attorney is already on record, carriers know a lowball offer will be challenged — so they often settle fairly from the start.</p>
            </div>
            <div className={styles.dayOneCard}>
              <div className={styles.dayOneIcon}>📄</div>
              <h3>Your Statements Are Protected</h3>
              <p>Anything you say to your insurance company can be used to reduce your claim. Your attorney speaks for you — ensuring no recorded statement, EUO, or document request harms your case.</p>
            </div>
            <div className={styles.dayOneCard}>
              <div className={styles.dayOneIcon}>⏱️</div>
              <h3>Deadlines Met Without Mistakes</h3>
              <p>Florida insurance claims have strict notice requirements and proof-of-loss deadlines. Missing even one can void your right to recover. We track every deadline from the day we take your case.</p>
            </div>
            <div className={styles.dayOneCard}>
              <div className={styles.dayOneIcon}>🏗️</div>
              <h3>Scope of Damage Fully Captured</h3>
              <p>Insurance adjusters often miss hidden damage — inside walls, under flooring, in the HVAC system. We bring in independent experts to ensure every affected area is documented and claimed.</p>
            </div>
            <div className={styles.dayOneCard}>
              <div className={styles.dayOneIcon}>⚖️</div>
              <h3>Bad Faith Leverage From the Start</h3>
              <p>Under Florida law, insurers who act in bad faith — delaying, underpaying, or misrepresenting your policy — can owe you extra damages. That leverage only exists if an attorney is monitoring the process.</p>
            </div>
          </div>
          <div className={styles.dayOneCta}>
            <p className={styles.dayOneCtaNote}>Don&apos;t wait for a denial. The earlier we get involved, the stronger your case.</p>
            <a href={CTA_URL} className={styles.ctaPrimary}>
              Get an Attorney Involved Now — It&apos;s Free
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
            South Florida&apos;s Property Damage Attorneys
          </h2>
          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>⚖️</div>
              <h3>Attorney-Level Representation</h3>
              <p>Unlike public adjusters, we can take your case to court and file bad-faith claims against your insurer.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>💰</div>
              <h3>No Fees Unless We Win</h3>
              <p>We work on contingency. If we don&apos;t recover money for you, you owe us nothing. Zero risk.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>📍</div>
              <h3>Local South Florida Experts</h3>
              <p>We know Florida insurance law, local contractors, and the tactics insurers use in Miami-Dade, Broward, and Palm Beach.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>⚡</div>
              <h3>Fast Response</h3>
              <p>Water damage worsens every hour. We move quickly to document your claim and stop further delays from your insurer.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>🛡️</div>
              <h3>Full Coverage Disputes</h3>
              <p>We handle denied claims, underpaid settlements, delayed responses, and bad-faith insurance practices.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>📋</div>
              <h3>Complete Documentation</h3>
              <p>We coordinate with water damage restoration contractors, mold specialists, and engineers to build an airtight claim.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={styles.testimonials}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>★★★★★ 4.7 · 67 Google Reviews</div>
          <h2 className={styles.sectionTitle}>What Our Clients Say</h2>
          <p className={styles.sectionSubtitle}>Real reviews from real clients who fought their insurance companies — and won.</p>
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
            Join 67+ Clients Who Won — Get Your Free Review →
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faq}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>Common Questions</div>
          <h2 className={styles.sectionTitle}>
            Water Damage Claim FAQs
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
            Don&apos;t Let Your Insurance Company Shortchange You
          </h2>
          <p className={styles.finalCtaBody}>
            Whether you need water damage restoration near you, mold removal services, or roof
            leak repair — if your insurer isn&apos;t paying fairly, we fight for you.
            <strong> No fees unless we win.</strong>
          </p>
          <a href={CTA_URL} className={styles.ctaFinal}>
            Start Your Free Case Evaluation Now →
          </a>
          <p className={styles.finalCtaNote}>
            Serving Miami-Dade · Broward · Palm Beach · Available 24/7
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
