"use client";
import styles from "./Testimonials.module.css";

const testimonials = [
  {
    quote: "Citizens denied our roof leak claim, but this firm fought for us and got money for our repairs. We even had funds left over after fixing the roof.",
    name: "Ketty M.",
    type: "Roof Damage Claim",
    outcome: "Claim Won",
  },
  {
    quote: "Pierre and his team are amazing. They truly cater to their clients and help you get the most from your insurance company.",
    name: "Elizabeth M.",
    type: "Insurance Claim",
    outcome: "Maximized Recovery",
  },
  {
    quote: "When my insurance company denied my roof damage claim, Louis Law Group stepped in and fought for me. I'm extremely satisfied with the results they obtained.",
    name: "Michael N.",
    type: "Roof Damage Claim",
    outcome: "Claim Resolved",
  },
  {
    quote: "They accomplished exactly what they set out to do and helped me finally receive my insurance check.",
    name: "Helen F.",
    type: "Insurance Claim",
    outcome: "Insurance Check Received",
  },
  {
    quote: "Louis Law Group handled our homeowners insurance dispute and got results much faster than we expected. Excellent service and great communication.",
    name: "Tee T.",
    type: "Homeowners Insurance",
    outcome: "Dispute Resolved",
  },
  {
    quote: "Very professional attorneys with outstanding attention to detail. They will not stop fighting for their clients.",
    name: "Edwin M.",
    type: "Property Damage",
    outcome: "Claim Recovered",
  },
];

export default function Testimonials() {
  return (
    <section className={styles.section}>
      <div className="container">
        <p className={styles.eyebrow}>★★★★★ 4.7 · 67 Google Reviews</p>
        <h2 className={styles.title}>What Our Clients Say</h2>
        <p className={styles.subtitle}>
          Real reviews from real clients who fought their insurance companies — and won.
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
                  <p className={styles.location}>{t.type}</p>
                </div>
                <span className={styles.outcome}>{t.outcome}</span>
              </div>
            </div>
          ))}
        </div>
        <p className={styles.disclaimer}>
          * Reviews from Google. Results may vary by case.
        </p>
      </div>
    </section>
  );
}
