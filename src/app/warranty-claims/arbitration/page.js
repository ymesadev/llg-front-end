import styles from "../page.module.css";
import { Car, Home, Wrench, Hammer, Snowflake, ClipboardList, Scale, DollarSign, ShieldCheck, ScrollText, CheckCircle2, AlertTriangle, Search, Landmark, MapPin, FileText, Phone, Gavel } from "lucide-react";

const LUCIDE_ICON_MAP = { "🚗": Car, "🏠": Home, "🧰": Wrench, "🏗️": Hammer, "❄️": Snowflake, "📋": ClipboardList, "⚖️": Scale, "💰": DollarSign, "🛡️": ShieldCheck, "📜": ScrollText, "✅": CheckCircle2, "⚠️": AlertTriangle, "🔍": Search, "🏛️": Landmark, "📍": MapPin, "📄": FileText, "📞": Phone, "🔨": Gavel };
const LIcon = ({ name, size = 28, className }) => { const C = LUCIDE_ICON_MAP[name]; return C ? <C size={size} className={className} strokeWidth={1.5} /> : <span>{name}</span>; };

export const revalidate = 3600;

export const metadata = {
  title: "Warranty Claim Denied? Fight It in Arbitration | Louis Law Group",
  description:
    "Denied, delayed, or underpaid by your warranty company? Many contracts force arbitration — but under the contract and AAA / JAMS consumer rules, the company pays the arbitration fees. Louis Law Group files your Florida warranty arbitration for you. Free review: (833) 657-4812.",
  keywords:
    "warranty arbitration attorney florida, forced arbitration warranty claim, denied warranty claim arbitration lawyer, AAA consumer arbitration warranty, JAMS arbitration warranty company, vehicle service contract arbitration florida, home warranty arbitration lawyer",
  alternates: { canonical: "https://www.louislawgroup.com/warranty-claims/arbitration" },
  openGraph: {
    title: "Forced Into Arbitration? Make Them Pay For It | Louis Law Group",
    description:
      "Your warranty contract may force arbitration instead of court — but the company pays the arbitration fees under the contract and AAA / JAMS consumer rules. Louis Law Group files your Florida warranty arbitration for you. Free review — no upfront cost.",
    url: "https://www.louislawgroup.com/warranty-claims/arbitration",
  },
};

const CTA_URL = "/warranty-claims/arbitration/qualify";

const SERVICES = [
  {
    icon: "🔨",
    title: "They Forced You Into Arbitration",
    desc: "Buried in your warranty or service contract is a clause that bars court and sends disputes to private arbitration. That clause cuts both ways — it is also the path to make the company answer for a denied claim.",
  },
  {
    icon: "💰",
    title: "The Company Pays the Costs",
    desc: "Under the contract and the AAA and JAMS consumer arbitration rules, the warranty company — not you — pays the arbitration filing and arbitrator fees. You can pursue your claim without those costs falling on you.",
  },
  {
    icon: "📋",
    title: "We File the Arbitration for You",
    desc: "Arbitration has its own demand, deadlines, and procedures. Louis Law Group prepares and files the arbitration, builds the record, and presents your case — so you are not navigating it alone.",
  },
  {
    icon: "🚗",
    title: "Auto & Vehicle Service Contracts",
    desc: "Denied engine, transmission, or covered-component repairs. When your extended warranty or vehicle service contract company refuses a repair it should cover, we pursue it through the arbitration the contract requires.",
  },
  {
    icon: "🏠",
    title: "Home & Appliance Warranties",
    desc: "AC, plumbing, electrical, and appliance failures denied as 'pre-existing' or 'improper maintenance.' We take bad-faith home and appliance warranty denials into arbitration and demand the coverage you paid for.",
  },
  {
    icon: "📜",
    title: "Florida Warranty Contracts",
    desc: "We read the actual arbitration clause in your Florida warranty or service contract — including any AAA or JAMS reference and any fee-shifting language — and hold the company to what it agreed to.",
  },
];

const STATS = [
  {
    number: "Arbitration",
    label: "your contract may force arbitration instead of court — but that does not mean you lose your right to fight a denied claim.",
    icon: "⚖️",
  },
  {
    number: "$200M+",
    label: "recovered for clients in insurance and claim disputes across Louis Law Group's practice.",
    icon: "💰",
  },
  {
    number: "$0",
    label: "upfront cost — we work on contingency, and under the contract and AAA / JAMS consumer rules the company pays the arbitration fees.",
    icon: "🛡️",
  },
  {
    number: "AAA / JAMS",
    label: "consumer arbitration rules generally shift the filing and arbitrator fees to the company — not the consumer.",
    icon: "📜",
  },
  {
    number: "Day 1",
    label: "a licensed attorney on your warranty arbitration from the start — not a call-center adjuster.",
    icon: "⚖️",
  },
  {
    number: "Free",
    label: "no-cost, no-obligation review of your warranty or service-contract dispute and your arbitration clause.",
    icon: "✅",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Free Qualification Check",
    desc: "Answer a few questions about your warranty, the company, and what happened with your claim. Takes about 2 minutes to see if your dispute is a fit for arbitration.",
  },
  {
    num: "02",
    title: "Attorney Review of Your Clause",
    desc: "Our attorneys review your warranty or service contract, the arbitration clause, the denial, and the company's conduct — and identify exactly where they breached the agreement.",
  },
  {
    num: "03",
    title: "We File — You Pursue Your Claim",
    desc: "We prepare and file the arbitration and present your case. The company pays the arbitration fees, and you pay us nothing unless we recover for you.",
  },
];

const FAQS = [
  {
    q: "My contract says I must arbitrate — can I still fight a denied claim?",
    a: "Yes. An arbitration clause does not mean you have to accept a wrongful denial — it just changes where your dispute is heard. Instead of court, your breach-of-contract claim goes to a private arbitrator. Louis Law Group prepares and files the arbitration and presents your case, so a forced-arbitration clause becomes the path to challenge the denial rather than a dead end. An attorney can review your specific clause and explain your options.",
  },
  {
    q: "Who pays the arbitration fees?",
    a: "In consumer warranty disputes, the company generally does. Most warranty and service contracts reference AAA or JAMS, and under those organizations' consumer arbitration rules the business — not the consumer — pays the arbitration filing and arbitrator fees. Many contracts contain their own fee-shifting language to the same effect. We review the actual clause in your contract to confirm how the costs are allocated before we proceed.",
  },
  {
    q: "What does it cost me to fight this?",
    a: "Nothing upfront. We review your warranty dispute and arbitration clause for free and work on a contingency basis for qualifying cases — our fee comes from what we recover for you, and if we don't recover, you owe us no attorney's fee. On top of that, the company typically bears the arbitration filing and arbitrator fees under the contract and the AAA / JAMS consumer rules.",
  },
  {
    q: "Which warranty companies do you handle?",
    a: "We handle arbitration disputes involving vehicle service contracts (extended auto warranties), home warranties, appliance and electronics protection plans, new-home and builder structural warranties, and HVAC and other service contracts — when the company denies, underpays, or delays a covered claim and the contract sends the dispute to arbitration.",
  },
  {
    q: "Is this only for Florida?",
    a: "Louis Law Group represents Florida residents and holders of Florida-issued warranty and service contracts in arbitration. If your contract was issued outside Florida, we are generally unable to take the matter, but we may be able to point you toward an attorney in your state.",
  },
  {
    q: "The company says my problem is 'pre-existing' or 'wear and tear.' Is that the final answer?",
    a: "No. 'Pre-existing condition,' 'improper maintenance,' and 'normal wear and tear' are among the most common denial tactics. We examine your contract's actual coverage and exclusions, gather documentation, and present the case to the arbitrator to challenge an improper denial — what the company calls 'excluded' is often, in fact, covered.",
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
  const kws = ["warranty", "arbitration", "vehicle-service-contract", "service-contract"];
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

export default async function WarrantyArbitrationLandingPage() {
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
    name: "Louis Law Group — Florida Warranty Arbitration Attorneys",
    url: "https://www.louislawgroup.com/warranty-claims/arbitration",
    telephone: "+1-833-657-4812",
    areaServed: { "@type": "State", name: "Florida" },
    description:
      "Florida attorneys representing consumers in warranty and service-contract arbitration — denied, underpaid, and delayed auto, home, appliance, and builder warranty claims where the contract requires arbitration.",
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
            <div className={styles.eyebrow}>Florida Warranty Arbitration Attorneys</div>
            <h1 className={styles.heroTitle}>
              <span className={styles.gold}>Forced Into Arbitration?</span>{" "}
              Make Them <span className={styles.gold}>Pay For It.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Denied, delayed, or underpaid by your warranty company? Your contract may force binding
              arbitration instead of court — but under the contract and the AAA / JAMS consumer rules,
              the company pays the arbitration filing and arbitrator fees. Fight the denial at no upfront
              cost. We file the arbitration for you.
            </p>
            <ul className={styles.heroBullets}>
              <li>✔ Your contract forced arbitration — we use it against them</li>
              <li>✔ The company pays the arbitration fees (AAA / JAMS consumer rules)</li>
              <li>✔ Auto, home, appliance &amp; builder warranties</li>
              <li>✔ No upfront fees — contingency only</li>
              <li>✔ Free, no-obligation review of your arbitration clause</li>
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
              A forced-arbitration clause is not a dead end — it is the path to make the company answer.
              Under the contract and AAA / JAMS consumer rules, the company pays the arbitration costs.
              Our attorneys read the fine print, find the coverage they owe you, and file the arbitration.
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
        <span className={styles.urgencyIcon}><LIcon name="⚠️" /></span>
        <span>
          <strong>Don&apos;t wait:</strong> warranty contracts and arbitration rules can impose short deadlines to file your demand.{" "}
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
            Why Arbitration Can <span className={styles.gold}>Work in Your Favor</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Warranty companies write arbitration into their contracts expecting you to give up. But the
            same clause — and the AAA / JAMS consumer rules behind it — puts the cost of arbitration on
            them, not you. We know the difference.
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
          <h2 className={styles.midCtaTitle}>They Sent You to Arbitration to Make You Quit. Don&apos;t.</h2>
          <p className={styles.midCtaBody}>
            Warranty and service-contract companies have adjusters and lawyers working to minimize what they pay —
            and they count on arbitration feeling out of reach. It isn&apos;t. The company pays the arbitration costs,
            and our attorneys file and present your case.
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
            Warranty Disputes <span className={styles.gold}>Headed to Arbitration</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            From extended auto warranties to home and builder structural coverage — when the contract forces
            arbitration, we file it for Florida consumers whose warranty companies won&apos;t pay.
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
              The sooner you get an attorney involved, the more leverage you have — and the cleaner your arbitration record.
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
            Attorneys Who File Arbitration for You
          </h2>
          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}><LIcon name="⚖️" /></div>
              <h3>Licensed Florida Attorneys</h3>
              <p>We are licensed Florida attorneys — not a claims-consulting service. We prepare, file, and present your warranty arbitration when the company refuses to honor your contract.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}><LIcon name="💰" /></div>
              <h3>Zero Upfront Cost</h3>
              <p>We work on contingency for qualifying cases — you pay nothing unless we recover for you — and the company typically pays the arbitration fees under the contract and AAA / JAMS consumer rules.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}><LIcon name="🔍" /></div>
              <h3>We Read the Arbitration Clause</h3>
              <p>Warranty and service contracts are dense and full of exclusions and arbitration terms. We find the coverage the company is trying to avoid — and the fee-shifting language that helps you.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}><LIcon name="🔨" /></div>
              <h3>We File the Arbitration</h3>
              <p>From the arbitration demand to the AAA or JAMS filing, the deadlines, and the hearing, we handle the process and build the record — so you are not facing the company&apos;s lawyers alone.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}><LIcon name="📜" /></div>
              <h3>Florida Contract &amp; Consumer Law</h3>
              <p>We use Florida contract and consumer law alongside the AAA / JAMS consumer rules to hold warranty companies to the agreements — and the costs — they signed up for.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}><LIcon name="📍" /></div>
              <h3>Serving Florida Consumers</h3>
              <p>We represent warranty and service-contract holders across Florida — auto, home, appliance, HVAC, and builder warranties alike — in arbitration.</p>
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
            Warranty Arbitration FAQs
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
          <div className={styles.sectionEyebrow}>Arbitration Resources</div>
          <h2 className={styles.sectionTitle}>
            Learn Your <span className={styles.gold}>Rights</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Guides on forced arbitration, who pays the costs, denied warranty claims, and your legal options in Florida.
          </p>
          {articles.length > 0 ? (
            <div className={styles.dayOneGrid}>
              {articles.map((post) => (
                <a key={post.id} href={`/${post.slug}`} className={styles.dayOneCard} style={{ textDecoration: "none" }}>
                  <div className={styles.dayOneIcon}><LIcon name="📄" /></div>
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                  <span className={styles.serviceArrow}>Read more →</span>
                </a>
              ))}
            </div>
          ) : (
            <p className={styles.sectionSubtitle} style={{ marginTop: "0" }}>
              New warranty arbitration guides are publishing soon.
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
            Forced Into Arbitration? Don&apos;t Face It Alone.
          </h2>
          <p className={styles.finalCtaBody}>
            Warranty and service-contract companies have adjusters, lawyers, and a playbook for saying no —
            and they hope arbitration scares you off. It shouldn&apos;t. The company pays the arbitration costs
            under the contract and AAA / JAMS consumer rules, and our attorneys file and present your case.
            Denied, underpaid, or delayed — we review your case for free.{" "}
            <strong>No fees unless we win your case.</strong>
          </p>
          <a href={CTA_URL} className={styles.ctaFinal}>
            See If You Qualify Now — Free →
          </a>
          <p className={styles.finalCtaNote}>
            Free Case Review · No Obligation · No Upfront Cost
          </p>
          <div className={styles.finalTrust}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}><LIcon name="📞" size={18} /> (833) 657-4812</span>
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
