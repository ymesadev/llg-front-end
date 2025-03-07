"use client";

import dynamic from "next/dynamic"; // Import next/dynamic
import styles from "./ContactSection.module.css";
import HeroForm from "../Hero/HeroForm";

// Dynamically import Lottie (disable SSR)
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Import Lottie animation JSON
import contactAnimation from "../../../../public/lottie/contact.json"; 

import { Instagram, Facebook, Linkedin, Phone } from "lucide-react"; // Icons from lucide-react

// ✅ Import the Footer component (adjust the path if needed)
import Footer from "../Footer";

const ContactSection = () => {
  return (
    <>
      <section className={`blueBg ${styles.contactSection}`}>
        <div className="container">
          <div className="column-2a">
            {/* Left Section */}
            <div className={styles.leftColumn}>
              <h2 className={styles.title}>Let's get in touch</h2>
              <p className={styles.description}>
                We like to simplify our intake process. From submitting your claim
                to finalizing your case, our streamlined approach ensures a
                hassle-free experience. Our legal team is dedicated to making this
                process as efficient and straightforward as possible.
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

              {/* Lottie Animation */}
              <div className={styles.lottieWrapper}>
                <Lottie animationData={contactAnimation} loop={false} />
              </div>

              {/* Address */}
              <div className={styles.address}>
                <p>290 NW 165th Street, Suite M-500, Miami, FL 33169</p>
              </div>
            </div>

            {/* Right Section */}
            <div className={styles.rightColumn}>
              <HeroForm />
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Insert the Footer below your section */}
      <Footer />
    </>
  );
};

export default ContactSection;