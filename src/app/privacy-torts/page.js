import Link from "next/link";
import styles from "./page.module.css";
import { ShieldAlert, ArrowRight, Eye, Lock, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Privacy Torts | Louis Law Group",
  description:
    "Louis Law Group represents victims of unauthorized online tracking and privacy violations. Learn about your rights and check if you qualify for compensation.",
};

const cases = [
  {
    company: "American Integrity Insurance",
    slug: "american-integrity-insurance-privacy-torts",
    description:
      "If you visited American Integrity Insurance's website within the last 2 years, hidden tracking technology may have secretly recorded your clicks, browsing behavior, and personal information without your consent.",
    badge: "⚠️ Statute of Limitations Applies",
    urgent: true,
  },
  {
    company: "Kin Insurance",
    slug: "kin-insurance-privacy-torts",
    description:
      "Kin Insurance may have embedded session replay and pixel tracking technology on their website, capturing your personal data and browsing behavior without proper disclosure or consent.",
    badge: null,
    urgent: false,
  },
  {
    company: "Vuori",
    slug: "vuori-privacy-torts",
    description:
      "Vuori's website may have used hidden tracking tools to monitor your online activity—including form inputs, clicks, and personal information—without your knowledge or meaningful consent.",
    badge: null,
    urgent: false,
  },
  {
    company: "Tower Hill Insurance",
    slug: "tower-hill-insurance-privacy-torts",
    description:
      "Tower Hill Insurance may have deployed unauthorized tracking software on their website that collected and shared your personal data with third parties without your permission.",
    badge: null,
    urgent: false,
  },
  {
    company: "Slide Insurance",
    slug: "slide-insurance-privacy-torts",
    description:
      "Slide Insurance may have used covert session tracking technology on their website, recording your interactions and personal information without your knowledge or consent.",
    badge: null,
    urgent: false,
  },
  {
    company: "American Home Shield",
    slug: "american-home-shield-privacy-torts",
    description:
      "American Home Shield may have embedded hidden tracking technology on their website that recorded your clicks, browsing activity, and personal information without your knowledge or consent when you visited ahs.com to get a quote or manage your home warranty.",
    badge: "⚠️ Statute of Limitations Applies",
    urgent: true,
  },
];

export default function PrivacyTortsHub() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.badge}>
            <ShieldAlert size={16} />
            <span>Privacy Tort Cases</span>
          </div>
          <h1 className={styles.heroTitle}>
            Was Your Online Privacy Violated?
            <span className={styles.highlight}>You May Be Entitled to Compensation.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Companies are quietly embedding hidden tracking technology on their websites—recording
            your every click, scroll, and keystroke without your knowledge or consent. This may
            violate state and federal privacy laws. Louis Law Group is fighting back on behalf of
            affected consumers.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <Eye size={28} className={styles.statIcon} />
              <span className={styles.statLabel}>Session Replay Tracking</span>
            </div>
            <div className={styles.stat}>
              <Lock size={28} className={styles.statIcon} />
              <span className={styles.statLabel}>No Upfront Cost</span>
            </div>
            <div className={styles.stat}>
              <AlertTriangle size={28} className={styles.statIcon} />
              <span className={styles.statLabel}>Deadlines Apply</span>
            </div>
          </div>
        </div>
      </section>

      {/* What is a Privacy Tort */}
      <section className={styles.infoSection}>
        <div className="container">
          <div className={styles.infoGrid}>
            <div className={styles.infoText}>
              <h2 className={styles.sectionTitle}>
                What Is a <span className={styles.accent}>Privacy Tort?</span>
              </h2>
              <p>
                A privacy tort is a legal claim arising from the unauthorized collection, use, or
                disclosure of your personal information. When a company secretly monitors your
                online activity—through session replay software, tracking pixels, or hidden
                analytics—without your informed consent, they may be violating laws such as:
              </p>
              <ul className={styles.lawList}>
                <li>California Invasion of Privacy Act (CIPA)</li>
                <li>Florida Security of Communications Act</li>
                <li>Federal Wiretap Act</li>
                <li>State Consumer Protection Statutes</li>
              </ul>
              <p>
                Victims of these violations may be entitled to statutory damages, actual damages,
                and other remedies—without paying anything out of pocket.
              </p>
            </div>
            <div className={styles.infoCard}>
              <ShieldAlert size={48} className={styles.infoCardIcon} />
              <h3>Free Case Evaluation</h3>
              <p>
                Not sure if you qualify? Our attorneys offer a completely free, no-obligation
                case review. If we take your case, you pay nothing unless we win.
              </p>
              <Link href="/vuori-privacy-torts" className={styles.callBtn}>
                Check Eligibility
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Active Cases */}
      <section className={styles.casesSection}>
        <div className="container">
          <h2 className={styles.casesSectionTitle}>
            Active Privacy Tort <span className={styles.accent}>Cases</span>
          </h2>
          <p className={styles.casesSectionSubtitle}>
            Select a company below to check your eligibility and learn more about the specific
            privacy violations alleged.
          </p>
          <div className={styles.casesGrid}>
            {cases.map((c) => (
              <div key={c.slug} className={`${styles.caseCard} ${c.urgent ? styles.urgentCard : ""}`}>
                {c.badge && (
                  <div className={styles.urgentBadge}>
                    <AlertTriangle size={13} />
                    {c.badge}
                  </div>
                )}
                <h3 className={styles.caseCompany}>{c.company}</h3>
                <p className={styles.caseDescription}>{c.description}</p>
                <Link href={`/${c.slug}`} className={styles.caseBtn}>
                  Check Eligibility
                  <ArrowRight size={18} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaContent}>
            <ShieldAlert size={52} className={styles.ctaIcon} />
            <h2>Don't Wait — Deadlines Apply</h2>
            <p>
              Privacy tort claims are subject to statutes of limitations. If you believe a company
              tracked your online activity without consent, contact us today before your right to
              file expires.
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/free-case-evaluation" className={styles.ctaPrimary}>
                Get a Free Case Evaluation
                <ArrowRight size={20} />
              </Link>
              <Link href="/vuori-privacy-torts" className={styles.ctaSecondary}>
                Check Eligibility
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
