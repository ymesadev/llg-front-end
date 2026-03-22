"use client";

import { ReactLenis } from "lenis/react";
import Hero from "./components/Hero/Hero";
import Results from "./components/Results/Results";
import Testimonials from "./components/Testimonials/Testimonials";
import WhyChooseUs from "./components/WhyChooseUs/WhyChooseUs";
import Services from "./components/Services/Services";
import Steps from "./components/Steps/Steps";
import ContactSection from "./components/Contact/ContactSection";

export default function HomePage() {
  return (
    <ReactLenis root>
      <main>
        <Hero />
        <Results />
        <Testimonials />
        <WhyChooseUs />
        <Services />
        <Steps />
        <ContactSection />
      </main>
    </ReactLenis>
  );
}
