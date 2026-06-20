"use client";

import Layout from "../components/Layout/Layout";
import ContactSection from "../components/Contact/ContactSection";
import QualifyDropdown from "../components/QualifyDropdown/QualifyDropdown";
import styles from "./page.module.css";

export default function FreeCaseEvaluation() {
  return (
    <Layout>
      <section className={styles.chooser}>
        <h1 className={styles.title}>
          See If You <span className={styles.gold}>Qualify</span> — Free
        </h1>
        <p className={styles.subtitle}>
          Tell us what you&apos;re dealing with and we&apos;ll take you straight to the right
          eligibility check. Takes under 2 minutes — no fees unless we win.
        </p>
        <QualifyDropdown variant="cards" />
      </section>
      <ContactSection />
    </Layout>
  );
}
