"use client"; // This file needs to be a client component for hooks
import styles from "./Results.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function AccordionItem({ amount, company, details }) {
  return (
    <div className={styles.accordionItem}>
      <div className={styles.accordionButton}>
        <span className={styles.accordionAmount}>{amount}</span>
        <span className={styles.accordionCompany}>{company}</span>
      </div>
      {details && (
        <div className={styles.accordionContent}>
          {details}
        </div>
      )}
    </div>
  );
}

export default function Results() {
  const data = [
    
    { 
      amount: "1600+ CASES ", 
      company: "vs. UNIVERSAL PROPERTY & CASUALTY INSURANCE COMPANY" 
    },
    { 
      amount: "920+ CASES", 
      company: "vs. CITIZENS PROPERTY INSURANCE CORPORATION" 
    },
    { 
      amount: "270+ CASES", 
      company: "vs. HERITAGE PROPERTY & CASUALTY INSURANCE COMPANY" 
    },
   
    { 
      amount: "250+ CASES", 
      company: "vs. AMERICAN SECURITY INSURANCE COMPANY" 
    },
    { 
      amount: "250+ CASES", 
      company: "vs. AMERICAN INTEGRITY INSURANCE COMPANY OF FLORIDA" 
    },
    { 
      amount: "250+ CASES", 
      company: "vs. STATE FARM FLORIDA INSURANCE COMPANY" 
    },
  ];
  
  return (
    <section className={styles.resultsSection}>
      <div className="container">
        <h2 className={styles.resultsTitle}>
          We have recovered over <span className={styles.moneyResults}>$200,000,000</span> for our clients.
        </h2>
        <p className={styles.resultsParagraph}>
          If you’ve encountered property damage, been in an accident, had a health claim denied, or need assistance with an SSDI claim,
          you will likely need to deal with an insurance provider. Unfortunately, this can be a drawn-out process,
          and it’s far too common for valid claims to be unfairly denied. As your trusted insurance attorneys,
          we don’t simply wait to see how your insurer responds. Instead, we use our knowledge and determination
          to negotiate directly on your behalf and secure what you may be rightfully owed.
        </p>
        
        {/* Global container and column classes applied here */}
        <div className="container">
          <div className={`column-2a blueBg ${styles.resultsCont}`}>
            {/* Left Column: Image */}
            <div className={styles.imageColumn}>
              <img
                src="/images/100-dollar-bill.jpg"
                alt="Pierre Louis Florida Property Damage Attorney"
                className={styles.resultsImage}
              />
            </div>
            {/* Right Column: Static Accordion with results */}
            <div className={styles.accordionColumn}>
              {data.map((item, idx) => (
                <AccordionItem
                  key={idx}
                  amount={item.amount}
                  company={item.company}
                  details=""  // Static content; if you have any additional details, include them here.
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}