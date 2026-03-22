"use client";

import dynamic from "next/dynamic";
import { ReactLenis } from "lenis/react";
import Hero from "./components/Hero/Hero";

const Results = dynamic(() => import("./components/Results/Results"));
const Testimonials = dynamic(() => import("./components/Testimonials/Testimonials"));
const WhyChooseUs = dynamic(() => import("./components/WhyChooseUs/WhyChooseUs"));
const Services = dynamic(() => import("./components/Services/Services"));
const Steps = dynamic(() => import("./components/Steps/Steps"), { ssr: false });
const ContactSection = dynamic(() => import("./components/Contact/ContactSection"), { ssr: false });

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
