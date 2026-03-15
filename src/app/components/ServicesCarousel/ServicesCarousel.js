"use client"; // This directive makes the component a Client Component

import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import styles from "./ServicesCarousel.module.css"; // Import the CSS module
import { ArrowRight } from "../../../../public/icons";

const INTAKE_MAP = {
  "ssdi":               "/ssdi/qualify",
  "property-damage":    "/property-damage-claims/qualify",
  "ahs":                "/american-home-shield-privacy-torts/qualify",
  "vuori":              "/vuori-privacy-torts/qualify",
  "kin":                "/kin-insurance-privacy-torts/qualify",
  "slide":              "/slide-insurance-privacy-torts/qualify",
  "tower-hill":         "/tower-hill-insurance-privacy-torts/qualify",
  "american-integrity": "/american-integrity-insurance-privacy-torts/qualify",
};

const ServicesCarousel = ({ services, articleType = "property-damage" }) => {
  const qualifyHref = INTAKE_MAP[articleType] || INTAKE_MAP["property-damage"];
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Update the state of navigation buttons
  const updateButtons = () => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  };

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", updateButtons);
    updateButtons();
  }, [emblaApi]);

  return (
    <section className={styles.darkBg}>
      <div className="container">
        <div className={styles.servicesContainer}>
          {/* Previous Button */}
          <button
            className={`${styles.navButton} ${styles.prevButton}`}
            onClick={() => emblaApi && emblaApi.scrollPrev()}
            disabled={!canScrollPrev}
            aria-label="Previous Slide"
          >
            <ArrowRight />
          </button>
          <div className={styles.carouselWrapper}>
            {/* Embla Carousel */}
            <div className={styles.carousel} ref={emblaRef}>
              <div className={styles.embla__container}>
                {services.map((service) => (
                  <div key={service.id} className={styles.embla__slide}>
                    <Link href={qualifyHref} className={styles.serviceBox}>
                      <h3 className={styles.serviceTitle}>{service.title}</h3>
                      {service.description.map((block, idx) => (
                        <p key={idx} className={styles.serviceDescription}>
                          {block.children[0].text}
                        </p>
                      ))}
                      <span className={styles.serviceCardCta}>See if you qualify →</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Next Button */}
          <button
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={() => emblaApi && emblaApi.scrollNext()}
            disabled={!canScrollNext}
            aria-label="Next Slide"
          >
            <ArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesCarousel;
