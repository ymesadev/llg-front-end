"use client";

import { ReactLenis } from "lenis/react";
import Hero from "./components/Hero/Hero";
import Results from "./components/Results/Results";
import Services from "./components/Services/Services";
import Steps from "./components/Steps/Steps"; // Import Steps component
import ContactSection from "./components/Contact/ContactSection"; // Import ContactSection component
import Popup from "./components/Popup/Popup"; // Import Popup component
import Navbar from "./components/Navbar/Navbar";

export default function HomePage() {
  return (
    <ReactLenis root>
      <main>
        <Popup />
        <Navbar />
        <Hero />
        <Results />
        <Services />
        <Steps /> {/* Add Steps component */}
        <ContactSection /> {/* Add ContactSection component */}
      </main>
    </ReactLenis>
  );
}
