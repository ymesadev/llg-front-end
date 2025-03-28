"use client";

import { ReactLenis } from "lenis/react";
import Hero from "./components/Hero/Hero";
import Results from "./components/Results/Results";
import Services from "./components/Services/Services";
import Steps from "./components/Steps/Steps"; // Import Steps component
import ContactSection from "./components/Contact/ContactSection"; // Import ContactSection component
import Layout from "./components/Layout/Layout";

export default function HomePage() {
  return (
    <ReactLenis root>
      <main>
        <Layout>
          <Hero />
          <Results />
          <Services />
          <Steps /> {/* Add Steps component */}
          <ContactSection /> {/* Add ContactSection component */}
        </Layout>
      </main>
    </ReactLenis>
  );
}
