import styles from "./WhyChooseUs.module.css";

const reasons = [
  {
    icon: "⚖️",
    title: "No Fees Unless We Win",
    body: "You pay nothing upfront. We only get paid when we recover compensation for you — zero financial risk.",
  },
  {
    icon: "🏆",
    title: "Millions Recovered for Clients",
    body: "We've helped thousands of Florida families recover millions from insurance companies and the SSA.",
  },
  {
    icon: "📞",
    title: "Same-Day Response",
    body: "Every inquiry gets a response within hours, not days. Your case is urgent — we treat it that way.",
  },
  {
    icon: "🔒",
    title: "100% Confidential",
    body: "Attorney-client privilege protects every conversation. Your information is never shared without your consent.",
  },
  {
    icon: "📍",
    title: "Florida-Focused Practice",
    body: "We know Florida insurance law, SSA procedures, and local courts. Our focus gives our clients an edge.",
  },
  {
    icon: "👤",
    title: "Direct Attorney Access",
    body: "You'll work directly with Pierre A. Louis, Esq. — not a paralegal or call center. Real attorney attention.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className={styles.section}>
      <div className="container">
        <p className={styles.eyebrow}>Why Clients Choose Us</p>
        <h2 className={styles.title}>The Louis Law Group Difference</h2>
        <p className={styles.subtitle}>
          We're not a settlement mill. We're a Florida-focused firm that fights
          for maximum recovery — every time.
        </p>
        <div className={styles.grid}>
          {reasons.map((r, i) => (
            <div key={i} className={styles.card}>
              <span className={styles.icon}>{r.icon}</span>
              <h3 className={styles.cardTitle}>{r.title}</h3>
              <p className={styles.cardBody}>{r.body}</p>
            </div>
          ))}
        </div>
        <div className={styles.ctaWrap}>
          <a href="sms:8336574812" className={styles.ctaBtn}>
            Start Your Free Case Review — No Fee Unless We Win →
          </a>
        </div>
      </div>
    </section>
  );
}
