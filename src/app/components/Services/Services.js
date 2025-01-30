"use client"; // Use client directive if you need interactivity or hooks
import styles from "./Services.module.css";

export default function Services() {
  return (
    <section className={styles.servicesSection}>
      <div className="container">
        {/* Header Area */}
        <div className={styles.headerServices}>
          <p className={styles.subtitle}>Practice Areas</p>
          <h2 className={styles.title}>
            Legal Representation for <span className="yellowText">Insurance Claims</span>
          </h2>
          <p className={styles.subheading}>
            We fight for the compensation you deserve.
          </p>
          <p className={styles.description}>
            Our experienced team of attorneys is dedicated to providing personalized advocacy for your insurance claim. Whether you've suffered property damage, need assistance with a personal injury, require help with an SSDI claim, or have issues with your health insurance, we’re here to help. We’re committed to securing the compensation you deserve.
          </p>
        </div>

        {/* Services Row */}
        <div className={`column-4 ${styles.servicesRow}`}>
          <div className={styles.serviceBox}>
            <h3>Property Damage</h3>
            <p>
              Property damage law in Florida pertains to damage to tangible items, such as vehicles, homes, and personal belongings. Whether it’s a hurricane-damaged roof, a fender-bender in a parking lot, or vandalism to a storefront, Florida’s legal framework offers clarity on determining liability and ensuring rightful compensation for affected parties.
            </p>
            <a href="/property-damage-claims" className={styles.arrowLink}>
              <span className={styles.arrowCircle}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  id="arrow"
                  className={styles.arrowIcon}
                >
                  <g fill="none" stroke="#303c42" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3.5 20.5 17-17M9.5 3.5h11v11"></path>
                  </g>
                </svg>
              </span>
            </a>
          </div>
          <div className={styles.serviceBox}>
            <h3>SSDI</h3>
            <p>
              Social Security Disability Insurance (SSDI) is a federally run program designed to provide financial support to individuals who are unable to work due to a long-term disability. Navigating the SSDI process can be intricate, and understanding its aspects within the Florida context can be pivotal for claimants.
            </p>
            <a href="/social-security-disability-lawyers" className={styles.arrowLink}>
              <span className={styles.arrowCircle}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  id="arrow"
                  className={styles.arrowIcon}
                >
                  <g fill="none" stroke="#303c42" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3.5 20.5 17-17M9.5 3.5h11v11"></path>
                  </g>
                </svg>
              </span>
            </a>
          </div>
          <div className={styles.serviceBox}>
            <h3>Personal Injury</h3>
            <p>
              Personal injury law in Florida is designed to protect individuals who have suffered harm due to the negligence or wrongful actions of another party. Whether it’s a slip and fall at a store, a car accident on I-95, or a medical mishap, Florida’s laws ensure victims have a legal pathway to seek compensation.
            </p>
            <a href="/personal-injury-attorneys" className={styles.arrowLink}>
              <span className={styles.arrowCircle}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  id="arrow"
                  className={styles.arrowIcon}
                >
                  <g fill="none" stroke="#303c42" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3.5 20.5 17-17M9.5 3.5h11v11"></path>
                  </g>
                </svg>
              </span>
            </a>
          </div>
          <div className={styles.serviceBox}>
            <h3>Health Insurance</h3>
            <p>
              Health insurance plays a pivotal role in ensuring Floridians receive essential medical care without incurring insurmountable expenses. Whether you’re an individual seeking coverage or an employer offering benefits, understanding Florida’s health insurance landscape can be crucial.
            </p>
            <a href="/health-insurance-claim-denial-lawyer-in-florida" className={styles.arrowLink}>
              <span className={styles.arrowCircle}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  id="arrow"
                  className={styles.arrowIcon}
                >
                  <g fill="none" stroke="#303c42" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3.5 20.5 17-17M9.5 3.5h11v11"></path>
                  </g>
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}