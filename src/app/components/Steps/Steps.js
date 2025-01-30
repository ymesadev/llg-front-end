"use client"; // For client-side functionality

import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import styles from "./Steps.module.css";
import Lottie from "lottie-react";
import step1Animation from "../../../../public/lottie/step1.json";
import step2Animation from "../../../../public/lottie/step2.json";
import step3Animation from "../../../../public/lottie/step3.json";

const stepsData = [
  {
    number: 1,
    title: "Submit Claim",
    description:
      "Briefly describe your incident and see if you fit our criteria in just 2 minutes.",
    animation: step1Animation,
  },
  {
    number: 2,
    title: "Await a Communication",
    description:
      "One of our legal team members will send you a text message to look deeper into your case.",
    animation: step2Animation,
  },
  {
    number: 3,
    title: "Secure Your Case",
    description:
      "Once you opt to work with us, documents can be finalized via text, email, or directly in person.",
    animation: step3Animation,
  },
];

export default function Steps() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [progress, setProgress] = useState(0);

  const updateProgress = () => {
    if (!emblaApi) return;
    const scrollProgress = emblaApi.scrollProgress();
    setProgress(scrollProgress * 100); // Progress in percentage
  };

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("scroll", updateProgress);
    updateProgress(); // Initialize progress
  }, [emblaApi]);

  return (
    <section className={styles.stepsSection}>
      <div className="container">
        <div className="column-2a">
          {/* Left Column */}
          <div className={styles.leftColumn}>
            <h2 className={styles.title}>How it Works</h2>
            <h3 className={styles.subtitle}>No Win,<span className={styles.nofee}> No Fee</span></h3>
            <p className={styles.description}>
              We like to simplify our intake process. From submitting your claim to finalizing your case, our streamlined approach ensures a hassle-free experience. Our legal team is dedicated to making this process as efficient and straightforward as possible.
            </p>
            <p className={styles.description2}>
              You can expect transparent communication, prompt updates, and a commitment to achieving the best possible outcome for your case.
            </p>
            <a href="/free-case-evaluation" className={styles.blueButton}>
  Free Case Evaluation
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3.5 20.5 17-17M9.5 3.5h11v11"></path>
    </g>
  </svg>
</a>
          </div>

          {/* Right Column: Slider */}
          <div className={styles.rightColumn}>
            <div className={styles.carouselWrapper}>
              {/* Navigation Buttons */}
              <button
                className={`${styles.navButton} ${styles.prevButton}`}
                onClick={() => emblaApi && emblaApi.scrollPrev()}
              >
                ‹
              </button>
              <div className={styles.carousel} ref={emblaRef}>
                <div className={styles.embla__container}>
                  {stepsData.map((step) => (
                    <div key={step.number} className={styles.embla__slide}>
                      <div className={styles.stepBox}>
                        <Lottie
                          animationData={step.animation}
                          loop
                          className={styles.lottieAnimation}
                        />
                        <h4 className={styles.stepTitle}>
                          Step {step.number}: {step.title}
                        </h4>
                        <p className={styles.stepDescription}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                className={`${styles.navButton} ${styles.nextButton}`}
                onClick={() => emblaApi && emblaApi.scrollNext()}
              >
                ›
              </button>
            </div>

            {/* Progress Bar */}
            <div className={styles.progressBarWrapper}>
              <div
                className={styles.progressBar}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}