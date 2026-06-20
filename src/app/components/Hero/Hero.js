"use client"; // Ensure this is a client component for hooks and GSAP
import { useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Hero.module.css";
import HeroForm from "./components/HeroForm";
import { Home, ShieldCheck, Scale, Users, Lock, ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const [pdOpen, setPdOpen] = useState(false);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.set(
        [
          `.${styles.heroLeft}`,
          `.${styles.heroRight}`,
          `.${styles.heroForm}`,
          `.${styles.florida}`,
          `.${styles.litigation}`,
          `.${styles.insurance}`,
          `.${styles.attorneys}`,
        ],
        { opacity: 1 }
      );

      gsap.from(`.${styles.heroLeft}`, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        scrollTrigger: {
          trigger: `.${styles.heroLeft}`,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(`.${styles.heroRight}`, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        scrollTrigger: {
          trigger: `.${styles.heroRight}`,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(`.${styles.heroForm}`, {
        opacity: 0,
        scale: 0.95,
        duration: 0.5,
        scrollTrigger: {
          trigger: `.${styles.heroForm}`,
          start: "top center",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from([`.${styles.florida}`, `.${styles.litigation}`], {
        opacity: 0,
        x: -50,
        duration: 1,
        ease: "power1.out",
        scrollTrigger: {
          trigger: `.${styles.florida}`,
          start: "top center",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from([`.${styles.insurance}`, `.${styles.attorneys}`], {
        opacity: 0,
        y: 50,
        duration: 1.3,
        ease: "power1.out",
        scrollTrigger: {
          trigger: `.${styles.insurance}`,
          start: "top center",
          toggleActions: "play none none reverse",
        },
      });

      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      className={`${styles.darkBg} ${styles.fullHeight} ${styles.verticalCenter}`}
    >
      <div className="container">
        <div className="column-2a">
          {/* Left Section */}
          <div className={styles.heroLeft}>
            <h1 className={styles.heroTitle}>
              <span className={styles.florida}>Florida</span>
              <span className={styles.litigation}>Litigation</span>
              <span className={styles.attorneys}>Attorneys</span>
            </h1>
            <p className={styles.introParagraph}>
              The Louis Law Group serves clients throughout Florida. We take
              immense pride in our dedicated team of attorneys who are committed
              to delivering exceptional legal services. We understand that
              navigating legal matters can be challenging—that’s why our
              experienced insurance litigation attorneys work directly to get
              you the compensation you deserve.
            </p>
          </div>

          {/* Right Section */}
          <div className={styles.heroRight}>
            <div className={styles.evaluationText}>
              <p className={styles.evaluationTitle}>
                Get a <span className={styles.free}>FREE</span> case evaluation
                today.
              </p>
              <p className={styles.evaluationSubtext}>
                Select your case type to get started:
              </p>
            </div>
            <div className={styles.practiceButtons}>
              <div className={`${styles.practiceGroup} ${pdOpen ? styles.pdOpen : ""}`}>
                <button
                  type="button"
                  className={styles.practiceBtn}
                  onClick={() => setPdOpen((v) => !v)}
                  aria-expanded={pdOpen}
                >
                  <span className={styles.practiceBtnIcon}><Home size={20} /></span>
                  <span className={styles.practiceBtnText}>
                    <strong>Property Damage</strong>
                    <small>Insurance claims, denied or underpaid</small>
                  </span>
                  <ChevronDown size={18} className={styles.practiceCaret} aria-hidden="true" />
                </button>
                <div className={styles.practiceSub}>
                  <a href="/property-damage-claims/qualify" className={styles.practiceSubBtn}>
                    First Party Claims
                  </a>
                  <a href="/contractor-damage-claims/qualify" className={styles.practiceSubBtn}>
                    Third Party (Contractor)
                  </a>
                </div>
              </div>
              <a href="/warranty-claims/qualify" className={styles.practiceBtn}>
                <span className={styles.practiceBtnIcon}><ShieldCheck size={20} /></span>
                <span className={styles.practiceBtnText}>
                  <strong>Warranty</strong>
                  <small>Home or vehicle warranty claim denied</small>
                </span>
              </a>
              <a href="/ssdi/qualify" className={styles.practiceBtn}>
                <span className={styles.practiceBtnIcon}><Scale size={20} /></span>
                <span className={styles.practiceBtnText}>
                  <strong>Social Security Disability</strong>
                  <small>SSDI &amp; SSI benefits claims</small>
                </span>
              </a>
              <a href="https://family.louislawgroup.com/" className={styles.practiceBtn}>
                <span className={styles.practiceBtnIcon}><Users size={20} /></span>
                <span className={styles.practiceBtnText}>
                  <strong>Family Law</strong>
                  <small>Divorce, custody &amp; support</small>
                </span>
              </a>
              <a href="/privacy-torts" className={styles.practiceBtn}>
                <span className={styles.practiceBtnIcon}><Lock size={20} /></span>
                <span className={styles.practiceBtnText}>
                  <strong>Privacy Torts</strong>
                  <small>Data privacy &amp; consumer protection</small>
                </span>
              </a>
            </div>
            <p className={styles.phoneText}>
              Or call us now: <a href="tel:8336574812" className={styles.phoneLink}>(833) 657-4812</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
