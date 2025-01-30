// src/app/[slug]/page.js

import Layout from "../components/Layout/Layout";
import styles from "./page.module.css";
import HeroForm from "../components/Hero/HeroForm"; // Import HeroForm
import ServicesCarousel from "../components/ServicesCarousel/ServicesCarousel"; // Import ServicesCarousel
import Results from "../components/Results/Results"; // Import Result
import Steps from "../components/Steps/Steps"; // Import Steps
import Contact from "../components/Contact/ContactSection"; // Import Steps


export const revalidate = 60; // ISR: Revalidate every 60 seconds

// Generate all page slugs
export async function generateStaticParams() {
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  try {
    // Fetch all pages to get their Slug
    const res = await fetch(
      `${strapiURL}/api/pages?fields[]=Slug&pagination[limit]=1000`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.error("Failed to fetch page slugs:", res.statusText);
      throw new Error("Failed to fetch page slugs");
    }

    const data = await res.json();
    console.log("Fetched data for generateStaticParams:", JSON.stringify(data, null, 2));

    // Extract slugs directly from each page object
    return data.data.map((page) => ({
      slug: page.Slug, // Access 'Slug' directly
    }));
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    throw error;
  }
}

// Render the page based on slug
export default async function Page({ params }) {
  const { slug } = params;
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  // Fetch the page with the given Slug
  const res = await fetch(
    `${strapiURL}/api/pages?filters[Slug][$eq]=${slug}&populate=*`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return (
      <Layout>
        <div className={styles.error}>
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
        </div>
      </Layout>
    );
  }

  const data = await res.json();

  if (data.data.length === 0) {
    return (
      <Layout>
        <div className={styles.error}>
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
        </div>
      </Layout>
    );
  }

  const page = data.data[0];

  return (
    <Layout>
  
        

 {/* Render Hero */}
{page.Hero && (
  <section className={`${styles.darkBg} ${styles.fullHeight} ${styles.verticalCenter}`}>
    <div className="container">
      <div className="column-2a">
        {/* Left Column: Hero Text */}
        <div className={styles.leftColumn}>
          <h3 className={styles.subtitle}>{page.Hero.subtitle}</h3>
          <h1 className={styles.title}>{page.Hero.title}</h1>
          {page.Hero.intro.map((block, index) => (
            <p key={index} className={styles.intro}>
              {block.children[0].text}
            </p>
          ))}
        </div>
        
        {/* Right Column: HeroForm */}
        <div className={styles.rightColumn}>
        <div className={styles.evaluationText}>
              <p className={styles.evaluationTitle}>
                Get a <span className={styles.free}>FREE</span> case evaluation today.
              </p>
            </div>
          <HeroForm />
        </div>
      </div>
    </div>
  </section>
)}

       {/* Render Sections as a Single Component */}
{page.Sections ? (
  <section className={styles.Descriptionsection}>
    <div className="container">
    <h2 className={styles.DescriptionTitle} >{page.Sections.title}</h2>
    <h3 className={styles.Descriptionsubtitle}>
      {page.Sections.subtitle}</h3>
    {page.Sections.body.map((block, idx) => (
      <p key={idx}>{block.children[0].text}</p>
    ))}
    </div>
  </section>
) : (
  <div className={styles.noSections}>
    <p>No sections available for this page.</p>
  </div>
)}

      {/* Render Services */}
      {page.Services && Array.isArray(page.Services) && page.Services.length > 0 && (
        <ServicesCarousel services={page.Services} />
      )}

     
<Results />
<Steps />
<Contact />
    </Layout>
  );
}