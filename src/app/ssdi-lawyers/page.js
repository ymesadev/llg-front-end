import styles from "./page.module.css";
import Link from "next/link";
import {
  ClipboardList,
  Scale,
  Landmark,
  FolderOpen,
  Briefcase,
  RefreshCw,
  XCircle,
  TrendingUp,
  DollarSign,
  Banknote,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Phone,
} from "lucide-react";

const LUCIDE_ICON_MAP = {
  "📋": ClipboardList,
  "⚖️": Scale,
  "🏛️": Landmark,
  "📁": FolderOpen,
  "💼": Briefcase,
  "🔄": RefreshCw,
  "❌": XCircle,
  "📈": TrendingUp,
  "💰": DollarSign,
  "💵": Banknote,
  "✅": CheckCircle2,
  "🛡️": ShieldCheck,
  "⚠️": AlertTriangle,
  "📍": MapPin,
  "📞": Phone,
};

const LIcon = ({ name, size = 28, className }) => {
  const C = LUCIDE_ICON_MAP[name];
  return C ? (
    <C size={size} className={className} strokeWidth={1.5} />
  ) : (
    <span>{name}</span>
  );
};

export const metadata = {
  title: "SSDI Disability Lawyers | Social Security Disability Attorneys | Louis Law Group",
  description:
    "Denied Social Security disability benefits? Louis Law Group fights for SSDI claimants nationwide. Representation triples your approval odds. No fees unless you win.",
  keywords:
    "SSDI lawyer, social security disability attorney, SSDI denial appeal, disability benefits lawyer, social security disability claim, SSDI hearing representation, SSI attorney, disability lawyer",
  alternates: { canonical: "https://www.louislawgroup.com/ssdi-lawyers" },
  openGraph: {
    title: "SSDI Disability Lawyers | Louis Law Group",
    description:
      "70% of SSDI applications are denied. With an attorney, your odds of winning at hearing more than double. Free case evaluation — no fees unless we win.",
    url: "https://www.louislawgroup.com/ssdi-lawyers",
  },
};

const CTA_URL = "/ssdi/qualify";

const SERVICES = [
  {
    icon: "📋",
    title: "Initial SSDI Application",
    keywords: ["ssdi application", "apply for disability", "social security disability"],
    desc: "Most claimants apply without help — and 70% are denied. We build your application correctly from day one, maximizing your chance of first-round approval.",
  },
  {
    icon: "⚖️",
    title: "Reconsideration Appeals",
    keywords: ["ssdi appeal", "disability reconsideration", "social security denial"],
    desc: "Denied at reconsideration? Don't give up. This is a required step before your hearing, and having an attorney on record dramatically strengthens your case.",
  },
  {
    icon: "🏛️",
    title: "ALJ Hearing Representation",
    keywords: ["ssdi hearing", "ALJ hearing", "disability hearing lawyer"],
    desc: "Represented claimants win at ALJ hearings at more than double the rate of unrepresented claimants. We prepare you, present evidence, and cross-examine experts.",
  },
  {
    icon: "📁",
    title: "Medical Evidence Development",
    keywords: ["medical records disability", "ssdi medical evidence", "disability documentation"],
    desc: "The SSA denies claims when medical records are incomplete. We obtain and organize your full medical history — ensuring every condition, every limitation is documented.",
  },
  {
    icon: "💼",
    title: "Back Pay Recovery",
    keywords: ["ssdi back pay", "disability back pay", "retroactive benefits"],
    desc: "SSDI awards include back pay from your established onset date. With an attorney, we fight to push that date as far back as possible — often resulting in $14,000+ in retroactive benefits.",
  },
  {
    icon: "🔄",
    title: "Appeals Council & Federal Court",
    keywords: ["ssdi appeals council", "federal court disability", "disability appeal"],
    desc: "If your ALJ hearing is denied, we can escalate to the Appeals Council and federal district court. We don't stop until every legal option is exhausted.",
  },
];

const STATS = [
  {
    number: "70%",
    label: "of SSDI applications are denied on first submission",
    icon: "❌",
  },
  {
    number: "3x",
    label: "higher approval rate at hearings with legal representation vs. without",
    icon: "📈",
  },
  {
    number: "$1,537",
    label: "average monthly SSDI benefit — recurring, for life",
    icon: "💰",
  },
  {
    number: "$14,000+",
    label: "average back pay recovered when an attorney fights for your onset date",
    icon: "💵",
  },
  {
    number: "60%",
    label: "approval rate at ALJ hearings with representation (vs. 30% without)",
    icon: "✅",
  },
  {
    number: "$0",
    label: "upfront cost — attorney fees are SSA-capped at 25% of back pay, max $7,200",
    icon: "🛡️",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Free Qualification Check",
    desc: "Answer a few questions about your condition and work history. Takes less than 3 minutes to see if you qualify.",
  },
  {
    num: "02",
    title: "Attorney Review & Strategy",
    desc: "Our SSDI attorneys review your medical records, work history, and denial letters — and build a winning case strategy at no cost.",
  },
  {
    num: "03",
    title: "We Fight — You Get Benefits",
    desc: "We handle everything: paperwork, hearings, medical evidence. You pay nothing unless we win your benefits.",
  },
];

const FAQS = [
  {
    q: "What are my chances of winning SSDI with a lawyer vs. without?",
    a: "Significantly better. According to SSA data, claimants represented by an attorney or advocate at ALJ hearings are approved at roughly double the rate — approximately 60% with representation versus 30% without. An attorney knows how to present medical evidence, challenge vocational experts, and frame your limitations in terms the SSA must accept.",
  },
  {
    q: "How much does a Social Security disability attorney cost in Florida?",
    a: "Nothing upfront. Social Security disability attorneys work on contingency. By law, our fee is capped at 25% of your back pay award, with a maximum of $7,200 — whichever is less. If we don't win your case, you owe us nothing.",
  },
  {
    q: "My SSDI application was denied. Is it too late?",
    a: "No — but deadlines matter. You have 60 days from your denial notice to file a timely appeal. Missing that window can reset your case and cost you months of back pay. Contact us immediately after a denial.",
  },
  {
    q: "What conditions qualify for SSDI?",
    a: "Any condition that prevents you from working full-time for 12+ months can qualify: cancer, heart disease, diabetes, chronic pain, mental health disorders, spinal conditions, fibromyalgia, neurological conditions, and more. The SSA evaluates your specific limitations — not just your diagnosis.",
  },
  {
    q: "How long does the SSDI process take?",
    a: "Initial decisions take 3–6 months. If denied and you appeal through reconsideration and ALJ hearing, the full process often takes 1–2 years. An attorney can't speed up the SSA's clock — but they ensure you don't waste time on procedural mistakes that cause additional delays.",
  },
  {
    q: "What is SSDI back pay and how much can I get?",
    a: "SSDI back pay is the monthly benefits you're owed from your disability onset date through your approval date. If you've been disabled for 2 years before approval, you could receive 2 years of back pay in a lump sum. Our attorneys fight to push your onset date as far back as the records support — often adding thousands in retroactive pay.",
  },
];

const TESTIMONIALS = [
  {
    initial: "D",
    name: "Denise R.",
    type: "SSDI Hearing",
    outcome: "Benefits Approved",
    text: "I was denied twice before calling Louis Law Group. They took over my case, got my medical records organized, and I was approved at my ALJ hearing. I couldn't have done it without them.",
  },
  {
    initial: "M",
    name: "Marcus T.",
    type: "Back Pay Recovery",
    outcome: "$22,400 Back Pay",
    text: "They pushed my onset date back further than I expected and I received over $22,000 in back pay. Professional, responsive, and they know the SSDI process inside and out.",
  },
  {
    initial: "L",
    name: "Linda P.",
    type: "SSDI Appeal",
    outcome: "Denied → Approved",
    text: "After two denials on my own, my attorney at Louis Law Group helped me understand exactly what the SSA needed. We won at the hearing. I now receive my monthly benefits.",
  },
  {
    initial: "J",
    name: "James W.",
    type: "Disability Claim",
    outcome: "Claim Won",
    text: "Pierre and his team handled everything. I didn't have to deal with the SSA at all. They communicated every step and got my disability benefits approved.",
  },
  {
    initial: "C",
    name: "Carmen S.",
    type: "SSDI Application",
    outcome: "First Round Approval",
    text: "They helped me apply from the start and I was approved on the first submission. Having an attorney from day one made all the difference.",
  },
  {
    initial: "R",
    name: "Robert H.",
    type: "ALJ Hearing",
    outcome: "Benefits + Back Pay",
    text: "I had been denied for 3 years before finding Louis Law Group. They took my case, won my hearing, and I received back pay going all the way to my original filing date.",
  },
];

export default function SSDILawyersPage() {
  return (
    <main className={styles.page}>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>Social Security Disability Attorneys</div>
            <h1 className={styles.heroTitle}>
              <span className={styles.gold}>SSDI Disability</span> Lawyers{" "}
              Who <span className={styles.gold}>Win Benefits</span>
            </h1>
            <p className={styles.heroSubtitle}>
              The SSA denies 70% of first applications. With legal representation, your
              odds of winning at hearing more than double. We fight for your benefits —
              and you pay nothing unless we win.
            </p>
            <ul className={styles.heroBullets}>
              <li>✔ SSDI applications, appeals &amp; ALJ hearings</li>
              <li>✔ Medical evidence development &amp; documentation</li>
              <li>✔ Back pay recovery from your onset date</li>
              <li>✔ No upfront fees — SSA-regulated contingency</li>
              <li>✔ Available 24/7 · No obligation</li>
            </ul>
            <a href={CTA_URL} className={styles.ctaPrimary}>
              See If You Qualify — Free →
            </a>
            <p className={styles.ctaNote}>Takes 3 minutes · No obligation · No upfront cost</p>
          </div>
          <div className={styles.heroCard}>
            <div className={styles.heroCardBadge}>Free Qualification Check</div>
            <h2 className={styles.heroCardTitle}>Were You Denied SSDI Benefits?</h2>
            <p className={styles.heroCardBody}>
              A denial is not the end. Most SSDI winners were denied at least once.
              Our attorneys know what the SSA needs to see — and we fight to get you
              every dollar you&apos;re owed.
            </p>
            <div className={styles.trustRow}>
              <div className={styles.trustStat}><strong>3x</strong><span>Higher Win Rate</span></div>
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
        <span className={styles.urgencyIcon}><LIcon name="⚠️" size={20} /></span>
        <span>
          <strong>SSDI Deadline Alert:</strong> You have only 60 days from a denial notice to appeal.{" "}
          <a href={CTA_URL} className={styles.urgencyLink}>
            Don&apos;t miss your window — check your options now
          </a>.
        </span>
      </div>

      {/* REPRESENTATION STATS */}
      <section className={styles.services}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>The Numbers Don&apos;t Lie</div>
          <h2 className={styles.sectionTitle}>
            Why Representation <span className={styles.gold}>Changes Everything</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            The Social Security Administration&apos;s own data shows that claimants with attorneys
            win at significantly higher rates at every stage of the process.
          </p>
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

      {/* MID-PAGE CTA */}
      <section className={styles.midCta}>
        <div className={styles.midCtaInner}>
          <h2 className={styles.midCtaTitle}>Were You Denied? You&apos;re Not Alone — and You&apos;re Not Done.</h2>
          <p className={styles.midCtaBody}>
            Most SSDI winners were denied at least once. The difference between those who give up and
            those who get benefits is almost always having the right attorney at their side.
          </p>
          <a href={CTA_URL} className={styles.ctaPrimary}>
            Check If You Still Qualify — Free
          </a>
        </div>
      </section>

      {/* WHAT WE HANDLE */}
      <section className={styles.dayOne}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>What We Handle</div>
          <h2 className={styles.sectionTitle}>
            Every Stage of Your <span className={styles.gold}>SSDI Claim</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            From your first application to federal court — we fight at every level of the
            Social Security disability process.
          </p>
          <div className={styles.dayOneGrid}>
            {SERVICES.map((s) => (
              <div key={s.title} className={styles.dayOneCard}>
                <div className={styles.dayOneIcon}><LIcon name={s.icon} /></div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className={styles.dayOneCta}>
            <p className={styles.dayOneCtaNote}>
              The earlier you get an attorney involved, the stronger your case — and the more back pay you may recover.
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
            Disability Attorneys Who Fight for You
          </h2>
          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}><LIcon name="⚖️" size={32} /></div>
              <h3>Attorneys, Not Advocates</h3>
              <p>We are licensed Florida attorneys — not non-attorney representatives. We can escalate to federal court if needed, which advocates cannot.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}><LIcon name="💰" size={32} /></div>
              <h3>Zero Upfront Cost</h3>
              <p>Our fee is SSA-regulated: 25% of back pay or $7,200 — whichever is less. If we don&apos;t win your benefits, you owe us nothing.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}><LIcon name="📋" size={32} /></div>
              <h3>Medical Record Mastery</h3>
              <p>SSDI cases are won or lost on medical evidence. We obtain, organize, and present your records in exactly the format ALJ judges need to approve your claim.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}><LIcon name="🏛️" size={32} /></div>
              <h3>Hearing Preparation</h3>
              <p>We prepare you for your ALJ hearing — what to expect, how to answer, and how to describe your limitations accurately so nothing is understated or overlooked.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}><LIcon name="📍" size={32} /></div>
              <h3>Available Nationwide</h3>
              <p>We represent SSDI claimants across the country. Social Security disability hearings can be handled remotely — no matter where you are, we can fight for you.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}><LIcon name="🔄" size={32} /></div>
              <h3>We Don&apos;t Give Up</h3>
              <p>If your ALJ denies your case, we appeal to the Appeals Council and federal court. Most firms stop at the hearing. We go further.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={styles.testimonials}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>★★★★★ 4.7 · 67 Google Reviews</div>
          <h2 className={styles.sectionTitle}>Clients Who Got Their Benefits</h2>
          <p className={styles.sectionSubtitle}>Real stories from real Floridians who were denied — and then won with Louis Law Group.</p>
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
            Join Our Clients Who Won Benefits — Start Free →
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faq}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionEyebrow}>Common Questions</div>
          <h2 className={styles.sectionTitle}>
            SSDI Disability FAQs
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

      {/* CROSS-PRACTICE — Property Damage */}
      <section className={styles.steps}>
        <div className={styles.sectionInner} style={{ paddingBottom: "3rem" }}>
          <h3 style={{ fontFamily: "Anton, sans-serif", fontSize: "1.5rem", fontWeight: 400, color: "#1a2b49", marginBottom: "1rem" }}>
            Also Handling Property Damage Claims
          </h3>
          <p style={{ fontSize: "1rem", color: "#3a4a6a", lineHeight: 1.7, maxWidth: "680px", margin: "0 auto 1.5rem" }}>
            Louis Law Group also represents Florida homeowners with denied or underpaid
            property insurance claims — hurricane damage, roof damage, water damage, mold, and more.
          </p>
          <Link href="/property-damage-claims" className={styles.ctaSecondary} style={{ marginTop: 0 }}>
            Learn about our property damage practice &rarr;
          </Link>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.finalCta}>
        <div className={styles.finalCtaInner}>
          <h2 className={styles.finalCtaTitle}>
            Don&apos;t Fight the SSA Alone
          </h2>
          <p className={styles.finalCtaBody}>
            The Social Security Administration has lawyers on their side. You should too.
            Whether you&apos;re filing for the first time or appealing a denial — we review your
            case for free and fight for every dollar you&apos;ve earned.{" "}
            <strong>No fees unless we win your benefits.</strong>
          </p>
          <a href={CTA_URL} className={styles.ctaFinal}>
            See If You Qualify Now — Free →
          </a>
          <p className={styles.finalCtaNote}>
            Available 24/7 · No Obligation · No Upfront Cost
          </p>
          <div className={styles.finalTrust}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}><LIcon name="📞" size={16} /> (833) 657-4812</span>
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
