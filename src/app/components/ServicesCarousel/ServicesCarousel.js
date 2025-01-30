'use client'; // This directive makes the component a Client Component

import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import styles from './ServicesCarousel.module.css'; // Import the CSS module

const ServicesCarousel = ({ services }) => {
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
    emblaApi.on('select', updateButtons);
    updateButtons();
  }, [emblaApi]);

  return (
    <section className={styles.darkBg}>
      <div className="container">
        <div className={styles.servicesContainer}>
         
          
          
          <div className={styles.carouselWrapper}>
            {/* Previous Button */}
            <button
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={() => emblaApi && emblaApi.scrollPrev()}
              disabled={!canScrollPrev}
              aria-label="Previous Slide"
            >
              ‹
            </button>

            {/* Embla Carousel */}
            <div className={styles.carousel} ref={emblaRef}>
              <div className={styles.embla__container}>
                {services.map((service) => (
                  <div key={service.id} className={styles.embla__slide}>
                    <div className={styles.serviceBox}>
                      <h3 className={styles.serviceTitle}>{service.title}</h3>
                      {service.description.map((block, idx) => (
                        <p key={idx} className={styles.serviceDescription}>
                          {block.children[0].text}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <button
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={() => emblaApi && emblaApi.scrollNext()}
              disabled={!canScrollNext}
              aria-label="Next Slide"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesCarousel;