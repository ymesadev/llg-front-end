import Layout from "../components/Layout/Layout";
import styles from "./page.module.css";
import HeroForm from "../components/Hero/HeroForm";
import ServicesCarousel from "../components/ServicesCarousel/ServicesCarousel";
import Results from "../components/Results/Results";
import Steps from "../components/Steps/Steps";
import Contact from "../components/Contact/ContactSection";

export const revalidate = 60; // ISR: Revalidate every 60 seconds

// ✅ **Generate Static Paths for All Pages**
export async function generateStaticParams() {
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  try {
    const res = await fetch(`${strapiURL}/api/pages?fields[]=Slug&pagination[limit]=1000&populate=parent`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch page slugs");

    const data = await res.json();

    return data.data.map((page) => {
      let fullSlug = page.Slug;
      if (page.parent) {
        fullSlug = `${page.parent.Slug}/${page.Slug}`;
      }
      return { slug: fullSlug.split("/") }; // Convert to array for Next.js routing
    });
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

// ✅ **Fetch and Render Page Content**
export default async function Page({ params }) {
  const slugArray = params.slug || [];
  if (slugArray.length === 0) {
    return (
      <Layout>
        <div className={styles.error}>
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
        </div>
      </Layout>
    );
  }

  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  let apiUrl;

  // ✅ Extract parent/child slug correctly
  const childSlug = slugArray[slugArray.length - 1]; // Last part of URL (child page)
  const parentSlug = slugArray.length > 1 ? slugArray.slice(0, -1).join("/") : null; // Parent part

  console.log("Checking Parent/Child", { parentSlug, childSlug });

  // ✅ Correct API Request with Populate Fix
  if (parentSlug) {
    apiUrl = `${strapiURL}/api/pages?filters[Slug][$eq]=${childSlug}&filters[parent][Slug][$eq]=${parentSlug}&populate[0]=parent&populate[1]=Hero&populate[2]=Sections&populate[3]=Services`;
  } else {
    apiUrl = `${strapiURL}/api/pages?filters[Slug][$eq]=${childSlug}&populate[0]=parent&populate[1]=Hero&populate[2]=Sections&populate[3]=Services`;
  }

  console.log("Fetching page for slug:", slugArray.join("/"), "API:", apiUrl);

  // ✅ Fetch the page content from Strapi
  const res = await fetch(apiUrl, { cache: "no-store" });

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
      {/* ✅ Render Hero Section */}
      {page.Hero && (
        <section className={`${styles.darkBg} ${styles.fullHeight} ${styles.verticalCenter}`}>
          <div className="container">
            <div className="column-2a">
              <div className={styles.leftColumn}>
                {page.Hero.subtitle && <h3 className={styles.subtitle}>{page.Hero.subtitle}</h3>}
                <h1 className={styles.title}>{page.Hero.title}</h1>
                {Array.isArray(page.Hero.intro) &&
                  page.Hero.intro.map((block, index) => (
                    <p key={index} className={styles.intro}>
                      {block.children?.[0]?.text || ""}
                    </p>
                  ))}
              </div>
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

      {/* ✅ Render Sections */}
      {page.Sections && page.Sections.body && page.Sections.body.length > 0 && (
        <section className={styles.Descriptionsection}>
          <div className="container">
            {page.Sections.title && <h2 className={styles.DescriptionTitle}>{page.Sections.title}</h2>}
            {page.Sections.subtitle && <h3 className={styles.Descriptionsubtitle}>{page.Sections.subtitle}</h3>}
            {page.Sections.body.map((block, idx) => (
              <p key={idx}>{block.children?.[0]?.text || ""}</p>
            ))}
          </div>
        </section>
      )}

      {/* ✅ Render Services */}
      {Array.isArray(page.Services) && page.Services.length > 0 && (
        <ServicesCarousel services={page.Services} />
      )}

      <Results />
      <Steps />
      <Contact />
    </Layout>
  );
}