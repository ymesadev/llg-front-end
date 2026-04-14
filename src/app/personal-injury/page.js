import styles from "./page.module.css";
import Link from "next/link";

export const metadata = {
  title: "Florida Personal Injury Attorney | Accident Lawyers | Louis Law Group",
  description:
    "Florida personal injury attorneys fighting for maximum compensation. Auto accidents, slip & fall, wrongful death, premises liability — free consultation: (833) 657-4812.",
  keywords:
    "personal injury attorney florida, florida personal injury lawyer, car accident lawyer florida, slip and fall attorney, wrongful death lawyer florida, premises liability attorney, dog bite lawyer florida",
  openGraph: {
    title: "Florida Personal Injury Attorney | Louis Law Group",
    description:
      "Injured in Florida? Personal injury attorneys at Louis Law Group fight for maximum compensation. Free consultation — no fees unless we win.",
    url: "https://www.louislawgroup.com/personal-injury",
  },
};

const CTA_URL = "/personal-injury/qualify";

const SERVICES = [
  {
    icon: "\u{1F697}",
    title: "Auto Accidents",
    keywords: ["car accident lawyer", "auto accident attorney", "rear-end collision"],
    desc: "Car crashes are the leading cause of personal injury claims in Florida. Whether you were rear-ended, T-boned, or hit by a distracted driver, we fight to recover full compensation for medical bills, lost wages, and pain and suffering.",
  },
  {
    icon: "\u{1FA78}",
    title: "Slip & Fall Injuries",
    keywords: ["slip and fall lawyer", "trip and fall attorney", "premises accident"],
    desc: "Property owners in Florida have a legal duty to maintain safe conditions. If you were injured due to wet floors, uneven surfaces, poor lighting, or other hazards, you may be entitled to significant compensation.",
  },
  {
    icon: "\u{1F3E2}",
    title: "Premises Liability",
    keywords: ["premises liability attorney", "unsafe property injury", "negligent security"],
    desc: "From inadequate security to dangerous conditions at stores, restaurants, and apartments — property owners are liable when their negligence causes injuries. We hold them accountable.",
  },
  {
    icon: "\u26B0\uFE0F",
    title: "Wrongful Death",
    keywords: ["wrongful death lawyer", "wrongful death attorney florida", "fatal accident"],
    desc: "When negligence takes a life, surviving family members deserve justice. We pursue wrongful death claims with the seriousness and sensitivity these cases demand — fighting for the compensation your family needs.",
  },
  {
    icon: "\u{1F415}",
    title: "Dog Bites & Animal Attacks",
    keywords: ["dog bite lawyer", "animal attack attorney", "dog owner liability"],
    desc: "Florida has strict liability for dog bites — the owner is responsible regardless of the dog's history. We handle claims for medical treatment, scarring, reconstructive surgery, and emotional trauma.",
  },
  {
    icon: "\u2696\uFE0F",
    title: "Product Liability",
    keywords: ["defective product lawyer", "product liability attorney", "dangerous product injury"],
    desc: "Defective or dangerous products cause thousands of injuries every year. From medical devices to consumer goods, we hold manufacturers, distributors, and retailers accountable for the harm their products cause.",
  },
];

const STATS = [
  {
    number: "2 Years",
    label: "Florida statute of limitations for most personal injury claims — don't wait to act",
    icon: "\u23F0",
  },
  {
    number: "$0",
    label: "upfront cost — we work on contingency. No recovery, no fee.",
    icon: "\u{1F6E1}\uFE0F",
  },
  {
    number: "3x",
    label: "higher settlements on average when injury victims hire an attorney vs. settling alone",
    icon: "\u{1F4C8}",
  },
  {
    number: "Modified",
    label: "comparative negligence — Florida's 2023 reform means if you're 51%+ at fault, you recover nothing",
    icon: "\u{1F4CB}",
  },
  {
    number: "14 Days",
    label: "to seek medical treatment after a car accident to preserve your PIP benefits under Florida law",
    icon: "\u{1F3E5}",
  },
  {
    number: "Free",
    label: "case evaluation — speak with a licensed attorney at no cost and no obligation",
    icon: "\u{1F4DE}",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Free Case Evaluation",
    desc: "Answer a few questions about your injury, how it happened, and the impact on your life. Takes less than 3 minutes to see if you have a case.",
  },
  {
    num: "02",
    title: "Attorney Review & Investigation",
    desc: "Our personal injury attorneys review your case, gather evidence, obtain medical records, and build a strategy to maximize your compensation.",
  },
  {
    num: "03",
    title: "We Fight — You Get Paid",
    desc: "We negotiate aggressively with insurance companies, file suit when necessary, and fight for every dollar you deserve. You pay nothing unless we win.",
  },
];

const FAQS = [
  {
    q: "How long do I have to file a personal injury claim in Florida?",
    a: "Under Florida's 2023 tort reform, the statute of limitations for most personal injury claims is now 2 years from the date of injury. For wrongful death, the limit is also 2 years. Missing this deadline means losing your right to sue — so act quickly.",
  },
  {
    q: "How much does a personal injury lawyer cost?",
    a: "Nothing upfront. Personal injury attorneys work on contingency — our fee is a percentage of your recovery. If we don't win your case, you owe us nothing. There is zero financial risk to you.",
  },
  {
    q: "What is Florida's comparative negligence rule?",
    a: "Florida adopted a modified comparative negligence standard in 2023. If you are found to be 51% or more at fault for your injury, you cannot recover damages. If you are 50% or less at fault, your recovery is reduced by your percentage of fault. Having an attorney is critical to protecting your share.",
  },
  {
    q: "What compensation can I recover in a personal injury case?",
    a: "You may be entitled to medical expenses (past and future), lost wages and earning capacity, pain and suffering, emotional distress, property damage, and in some cases punitive damages. The value of your case depends on the severity of your injuries and the circumstances.",
  },
  {
    q: "Should I accept the insurance company's first offer?",
    a: "Almost never. Initial offers from insurance companies are typically far below what your claim is worth. They're designed to close your case cheaply. An experienced personal injury attorney can evaluate the true value of your claim and negotiate a fair settlement — or take the case to trial.",
  },
  {
    q: "What should I do immediately after an injury?",
    a: "Seek medical attention immediately — both for your health and to document your injuries. Report the incident (police report for accidents, incident report for premises injuries). Photograph the scene if possible. Do not give recorded statements to the other party's insurance. Contact a personal injury attorney before signing anything.",
  },
];

const TESTIMONIALS = [
  {
    initial: "K",
    name: "Ketty M.",
    type: "Google Review",
    outcome: "Claim Won",
    text: "Citizens denied our roof leak claim, but this firm fought for us and got money for our repairs. We even had funds left over after fixing the roof.",
  },
  {
    initial: "E",
    name: "Elizabeth M.",
    type: "Google Review",
    outcome: "Maximized Recovery",
    text: "Pierre and his team are amazing. They truly cater to their clients and help you get the most from your insurance company.",
  },
  {
    initial: "M",
    name: "Michael N.",
    type: "Google Review",
    outcome: "Claim Resolved",
    text: "When my insurance company denied my roof damage claim, Louis Law Group stepped in and fought for me. I\u2019m extremely satisfied with the results they obtained.",
  },
  {
    initial: "H",
    name: "Helen F.",
    type: "Google Review",
    outcome: "Insurance Check Received",
    text: "They accomplished exactly what they set out to do and helped me finally receive my insurance check.",
  },
  {
    initial: "T",
    name: "Tee T.",
    type: "Google Review",
    outcome: "Dispute Resolved",
    text: "Louis Law Group handled our homeowners insurance dispute and got results much faster than we expected. Excellent service and great communication.",
  },
  {
    initial: "E",
    name: "Edwin M.",
    type: "Google Review",
    outcome: "Claim Recovered",
    text: "Very professional attorneys with outstanding attention to detail. They will not stop fighting for their clients.",
  },
];


export default function PersonalInjuryPage() {
  return (
    <main className={styles.page}>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>Florida Personal Injury Attorneys</div>
            <h1 className={styles.heroTitle}>
              <span className={styles.gold}>Were You Injured?</span> Get the{" "}
              <span className={styles.gold}>Compensation</span> You Deserve
            </h1>
            <p className={styles.heroSubtitle}>
              Insurance companies minimize payouts. Without legal representation,
              injury victims often settle for far less than their case is worth.
              We fight for your full compensation — and you pay nothing unless we win.
            </p>
            <ul className={styles.heroBullets}>
              <li>{"\u2714"} Auto accidents, slip &amp; fall, premises liability</li>
              <li>{"\u2714"} Wrongful death, dog bites &amp; product liability</li>
              <li>{"\u2714"} Medical bills, lost wages &amp; pain and suffering</li>
              <li>{"\u2714"} No upfront fees — contingency only</li>
              <li>{"\u2714"} Available 24/7 · No obligation</li>
            </ul>
            <a href={CTA_URL} className={styles.ctaPrimary}>
              See If You Qualify — Free →
            </a>
            <p className={styles.ctaNote}>Takes 3 minutes · No obligation · No upfront cost</p>
          </div>
          <div className={styles.heroCard}>
            <div className={styles.heroCardBadge}>Free Case Evaluation</div>
            <h2 className={styles.heroCardTitle}>Injured by Someone Else&apos;s Negligence?</h2>
            <p className={styles.heroCardBody}>
              You shouldn&apos;t have to pay for someone else&apos;s mistake. Whether it&apos;s a car accident,
              a dangerous property, or a defective product — our personal injury attorneys
              fight to make sure you&apos;re fully compensated.
            </p>
            <div className={styles.trustRow}>
              <div className={styles.trustStat}><strong>2 Yr</strong><span>Statute of Limitations</span></div>
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
        <span className={styles.urgencyIcon}>{"\u26A0\uFE0F"}</span>
        <span>
          <strong>Florida Deadline Alert:</strong> You have just 2 years to file a personal injury claim — and only 14 days after a car accident to seek treatment for PIP benefits.{" "}
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
            Insurance companies routinely undervalue personal injury claims.
            Victims with attorneys recover dramatically more — and avoid costly mistakes that can destroy a case.
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
          <h2 className={styles.midCtaTitle}>The Insurance Company Has Lawyers. Shouldn&apos;t You?</h2>
          <p className={styles.midCtaBody}>
            After an injury, insurance adjusters move fast to minimize what they pay you.
            They&apos;ll ask for recorded statements, push early settlements, and use your words against you.
            You need someone fighting on your side from day one.
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
            Every Type of <span className={styles.gold}>Personal Injury Case</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            From car accidents to wrongful death — we fight for Florida injury victims
            at every stage of the legal process.
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
              The sooner you get an attorney involved, the stronger your case — and the higher your recovery.
            </p>
            <a href={CTA_URL} className={styles.ctaPrimary}>
              Get an Attorney on Your Case — Free
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
            Personal Injury Attorneys Who Fight for You
          </h2>
          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>{"\u2696\uFE0F"}</div>
              <h3>Licensed Trial Attorneys</h3>
              <p>We are licensed Florida attorneys — not case brokers or referral services. We can take your case to trial and win if the insurance company refuses to pay fair value.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>{"\u{1F4B0}"}</div>
              <h3>Zero Upfront Cost</h3>
              <p>We work on contingency. You pay nothing unless we recover money for you. Our interests are 100% aligned with yours.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>{"\u{1F50D}"}</div>
              <h3>Thorough Investigation</h3>
              <p>We gather police reports, medical records, witness statements, surveillance footage, and expert opinions — building the strongest possible case for maximum compensation.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>{"\u{1F4CB}"}</div>
              <h3>Florida Law Experts</h3>
              <p>Florida&apos;s 2023 tort reform changed the rules. We know the new comparative negligence standards, fee structures, and deadlines — and how to navigate them to your advantage.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>{"\u{1F3DB}\uFE0F"}</div>
              <h3>Courtroom Ready</h3>
              <p>Most personal injury firms settle early. We prepare every case for trial — which is exactly why insurance companies offer more when we&apos;re on the other side.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>{"\u{1F4CD}"}</div>
              <h3>Statewide Coverage</h3>
              <p>We represent injury victims across Florida — from Miami-Dade to Jacksonville. Car accidents, slip and falls, wrongful death — wherever you were injured, we fight.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={styles.testimonials}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>{"\u2605\u2605\u2605\u2605\u2605"} 4.7 · 67 Google Reviews</div>
          <h2 className={styles.sectionTitle}>Clients Who Got the Compensation They Deserved</h2>
          <p className={styles.sectionSubtitle}>Real stories from Florida injury victims who fought back — and won with Louis Law Group.</p>
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
                <div className={styles.stars}>{"\u2605\u2605\u2605\u2605\u2605"}</div>
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
            Personal Injury Claim FAQs
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
            Don&apos;t Let the Insurance Company Win
          </h2>
          <p className={styles.finalCtaBody}>
            After an injury, every day matters. Evidence disappears, witnesses forget,
            and deadlines pass. The insurance company is already building its case against you.
            You deserve someone fighting just as hard on your side. Our personal injury attorneys
            review your case for free and fight for every dollar you deserve.{" "}
            <strong>No fees unless we win your case.</strong>
          </p>
          <a href={CTA_URL} className={styles.ctaFinal}>
            See If You Qualify Now — Free →
          </a>
          <p className={styles.finalCtaNote}>
            Available 24/7 · No Obligation · No Upfront Cost
          </p>
          <div className={styles.finalTrust}>
            <span>{"\u{1F4DE}"} (833) 657-4812</span>
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
