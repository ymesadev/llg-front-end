"use client";
import { useState } from "react";
import Layout from "../components/Layout/Layout";
import styles from "./team.module.css";
import EmblaCarousel from "../components/TeamCarousel/EmblaCarousel";
import ManagementTeam from "../components/TeamCarousel/ManagementTeam";
import LegalSupport from "../components/TeamCarousel/LegalSupportCaorusel";
import IntakeTeam from "../components/TeamCarousel/IntakeTeam";
import Results from "../components/Results/Results";
import Services from "../components/Services/Services";
import Steps from "../components/Steps/Steps"; // Import Steps component
import ContactSection from "../components/Contact/ContactSection"; // Import ContactSection component

export default function Team() {
  return (
    <Layout>
        <section className={styles.teamsHero}>
            
      <div className={styles.teamContainer}>
        <h1 className={styles.teamTitle}>Our Team</h1>
        <p className={styles.teamDescription}>
          When navigating the complex world of insurance claims in Florida, having a seasoned insurance claims lawyer by your side can make all the difference. At Louis Law Group, our team of dedicated attorneys specializes in insurance litigation, offering you the legal expertise needed to maximize your insurance claim.
        </p>

        <h2 className={styles.positionTitle}>Attorneys</h2>
        <EmblaCarousel />
        <h2 className={styles.positionTitle}>Management Team</h2>
        <ManagementTeam />
        <h2 className={styles.positionTitle}>Legal Support</h2>
        <LegalSupport />
        <h2 className={styles.positionTitle}>Intake Team</h2>
        <IntakeTeam />
      </div>
      </section>
      <Results />
        <Services />
        <Steps /> {/* Add Steps component */}
        <ContactSection /> {/* Add ContactSection component */}
    </Layout>
  );
}