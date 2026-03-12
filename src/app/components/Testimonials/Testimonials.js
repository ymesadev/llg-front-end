"use client";
import styles from "./Testimonials.module.css";

const testimonials = [
  {
    quote: "After my insurance company denied my hurricane damage claim for two years, Louis Law Group stepped in and recovered far more than I expected. Pierre and his team fought hard for me. I can finally repair my home.",
    name: "M. Rodriguez",
    location: "Broward County, FL",
    type: "Property Damage",
    outcome: "Claim Resolved",
  },
  {
    quote: "I had been denied SSDI twice and was ready to give up. Louis Law Group took my case and won my appeal. Now I have the benefits I needed. I'm so grateful for their persistence and professionalism.",
    name: "D. Williams",
    location: "Miami, FL",
    type: "SSDI Appeal",
    outcome: "Benefits Approved",
  },
  {
    quote: "Citizens Insurance delayed my water damage claim for over a year. Louis Law Group resolved it in 60 days. They handled everything — I didn't have to deal with the insurance company at all.",
    name: "T. Johnson",
    location: "Fort Lauderdale, FL",
    type: "Insurance Claim",
    outcome: "Claim Settled",
  },
];

export default function Testimonials() {
  return (
    <section className={styles.section}>
      <div className="container">
        <p className={styles.eyebrow}>Client Success Stories</p>
        <h2 className={styles.title}>Real Clients. Real Results.</h2>
        <p className={styles.subtitle}>
          We've helped thousands of Florida residents fight back against insurance companies and the SSA.
        </p>
        <div className={styles.grid}>
          {testimonials.map((t, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.stars}>★★★★★</div>
              <p className={styles.quote}>"{t.quote}"</p>
              <div className={styles.footer}>
                <div className={styles.avatar}>{t.name.charAt(0)}</div>
                <div>
                  <p className={styles.name}>{t.name}</p>
                  <p className={styles.location}>{t.location} · {t.type}</p>
                </div>
                <span className={styles.outcome}>{t.outcome}</span>
              </div>
            </div>
          ))}
        </div>
        <p className={styles.disclaimer}>
          * Client names anonymized for privacy. Results vary by case.
        </p>
      </div>
    </section>
  );
}
