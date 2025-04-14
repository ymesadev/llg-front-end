"use client"; // Ensure this is a client component for hooks and GSAP
import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Hero.module.css";
import HeroForm from "./components/HeroForm";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
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
              <span className={styles.insurance}>Insurance</span>
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
            </div>
            <HeroForm />
          </div>
        </div>
      </div>
    </section>
  );
}
