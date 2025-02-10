"use client";
import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import styles from "./EmblaCarousel.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Team Members Data
const teamMembers = [
  {
    name: "Jennifer Dougherty",
    photo: "/images/jennifer-dougherty.jpg",
    description: "Senior Intake Specialist",
    link: "/jennifer-dougherty",
  },
  {
    name: "Diana “Dee” Vergara",
    photo: "/images/dee-vergara.jpg",
    description: "Intake Specialist ",
    link: "/diana-vergara",
  },
 
  
  
];

export default function EmblaCarousel() {
  const [emblaRef, embla] = useEmblaCarousel({
    loop: false,
    align: "start",
    dragFree: true, // **Fixes laggy sliding**
    containScroll: "trimSnaps",
  });

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);

  // **Fix Navigation Button Display**
  useEffect(() => {
    if (!embla) return;
    const updateButtons = () => {
      setCanScrollPrev(embla.canScrollPrev());
      setCanScrollNext(embla.canScrollNext());
    };
    embla.on("select", updateButtons);
    updateButtons();
  }, [embla]);

  return (
    <div className="container">
      <div className={styles.carouselWrapper}>
        <button
          className={`${styles.navButton} ${styles.prevButton} ${canScrollPrev ? "" : styles.hidden}`}
          onClick={scrollPrev}
        >
          <ChevronLeft size={32} />
        </button>

        <div className={styles.embla} ref={emblaRef}>
          <div className={styles.emblaContainer}>
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className={styles.emblaSlide}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setHoveredIndex(index)}
              >
                <img src={member.photo} alt={member.name} className={styles.teamImage} />
                {hoveredIndex === index && (
                  <div className={styles.infoOverlay}>
                    <h3 className={styles.name}>{member.name}</h3>
                    <p className={styles.description}>{member.description}</p>
                    <a href={member.link} className={styles.learnMore}>
                      Learn More
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          className={`${styles.navButton} ${styles.nextButton} ${canScrollNext ? "" : styles.hidden}`}
          onClick={scrollNext}
        >
          <ChevronRight size={32} />
        </button>
      </div>
    </div>
  );
}