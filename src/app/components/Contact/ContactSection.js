"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import styles from "./ContactSection.module.css";
import HeroForm from "../Hero/components/HeroForm";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import contactAnimation from "../../../../public/lottie/contact.json";
import { Instagram, Facebook, Linkedin, Phone } from "lucide-react";

function LazyLottie() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { rootMargin: "200px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={styles.lottieWrapper}>
      {visible && <Lottie animationData={contactAnimation} loop={false} />}
    </div>
  );
}

const ContactSection = () => {
  return (
    <>
      <section className={`blueBg ${styles.contactSection}`}>
        <div className="container">
          <div className="column-2a">
            {/* Left Section */}
            <div className={styles.leftColumn}>
              <h2 className={styles.title}>Let's get <span className={styles.yellowBg}>in touch</span></h2>
              <p className={styles.description}>
                We like to simplify our intake process. From submitting your
                claim to finalizing your case, our streamlined approach ensures
                a hassle-free experience. Our legal team is dedicated to making
                this process as efficient and straightforward as possible.
              </p>
              <div className={styles.contactInfo}>
                {/* Phone Number */}
                <div className={styles.phone}>
                  <Phone className={styles.icon} />
                  <span>
                    <a className={styles.phoneLink} href="tel:8336574812">
                      833-657-4812
                    </a>
                  </span>
                </div>

                {/* Social Media Icons */}
                <div className={styles.socialIcons}>
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Instagram className={styles.icon} />
                  </a>
                  <a
                    href="https://www.facebook.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Facebook className={styles.icon} />
                  </a>
                  <a
                    href="https://www.linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Linkedin className={styles.icon} />
                  </a>
                </div>
              </div>

              <LazyLottie />

              {/* Address */}
              <div className={styles.address}>
                <p>12 S.E. 7th Street, Suite 805, Fort Lauderdale, FL 33301</p>
              </div>
            </div>

            {/* Right Section */}
            <div className={styles.rightColumn}>
              <HeroForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer is now handled in layout.js */}
    </>
  );
};

export default ContactSection;
