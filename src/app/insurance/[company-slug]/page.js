import Layout from "../../components/Layout/Layout";
import styles from "./page.module.css";
import HeroForm from "../../components/Hero/components/HeroForm";
import Results from "../../components/Results/Results";
import Steps from "../../components/Steps/Steps";
import ContactSection from "../../components/Contact/ContactSection";
import ReactMarkdown from "react-markdown";
import { renderContentBlocks, processHeroContent, processSectionsContent } from "../../utils/contentFormatter";

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  try {
    const res = await fetch(
      `${strapiURL}/api/insurance-companies?fields[]=slug&pagination[limit]=1000`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) throw new Error("Failed to fetch insurance company slugs");
    const data = await res.json();

    // Log the response to see the structure
    console.log("Strapi Response:", data);

    // Check if data.data exists and has the expected structure
    if (!data.data || !Array.isArray(data.data)) {
      console.error("Invalid data structure:", data);
      return [];
    }

    return data.data.map((company) => {
      // Log each company to see its structure
      console.log("Company data:", company);
      
      // Check if company.attributes exists
      if (!company.attributes) {
        console.error("Company missing attributes:", company);
        return null;
      }

      return {
        'company-slug': company.attributes.slug,
      };
    }).filter(Boolean); // Remove any null entries
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

export default async function InsuranceCompanyPage({ params }) {
  const slug = params['company-slug'];
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const apiUrl = `${strapiURL}/api/insurance-companies?filters[slug][$eq]=${slug}&populate=*`;

  const res = await fetch(apiUrl, { next: { revalidate: 60 } });

  if (!res.ok) {
    return (
      <Layout>
        <div className={styles.error}>
          <h1>404 - Insurance Company Profile Not Found</h1>
          <p>The insurance company profile you are looking for does not exist.</p>
        </div>
      </Layout>
    );
  }

  const data = await res.json();
  if (!data.data || data.data.length === 0) {
    return (
      <Layout>
        <div className={styles.error}>
          <h1>404 - Insurance Company Profile Not Found</h1>
          <p>The insurance company profile you are looking for does not exist.</p>
        </div>
      </Layout>
    );
  }

  const company = data.data[0];

  return (
    <Layout>
      {/* Hero Section */}
      <section className={`${styles.darkBg} ${styles.fullHeight}`}>
        <div className="container">
          <div className="column-2a">
            <div className={styles.leftColumn}>
              {company.hero?.subtitle && (
                <h3 className={styles.subtitle}>{company.hero.subtitle}</h3>
              )}
              <h1 className={`${styles.title} ${styles.free}`}>{company.hero?.title}</h1>
              {Array.isArray(company.hero?.intro) &&
                company.hero.intro.map((block, index) => (
                  <p key={index} className={styles.intro}>
                    {block.children?.[0]?.text || ""}
                  </p>
                ))}
            </div>
            <div className={styles.rightColumn}>
              <div className={styles.evaluationText}>
                <span className={styles.evaluationTitle}>
                  Get a <span className={styles.free}>FREE</span> case evaluation today.
                </span>
              </div>
              <HeroForm />
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className={styles.lightBg}>
        <div className={`container ${styles.contentContainer}`}>
          <div className={styles.mainContent}>
            <div className={styles.scrollableContent}>
              <h2 className={styles.DescriptionTitle}>Overview</h2>
              <ReactMarkdown>{company.overview?.body}</ReactMarkdown>
            </div>
          </div>
        </div>
      </section>

      {/* Common Issues Section */}
      <section className={styles.darkBg}>
        <div className={`container ${styles.contentContainer}`}>
          <div className={styles.mainContent}>
            <div className={styles.scrollableContent}>
              <h2 className={styles.DescriptionTitle}>Common Issues</h2>
              {company.common_issues?.title?.map((block, index) => (
                <div key={index} className={styles.issue}>
                  <ReactMarkdown>{block.children?.[0]?.text || ""}</ReactMarkdown>
                </div>
              ))}
              {company.common_issues?.description?.map((block, index) => (
                <div key={index} className={styles.issue}>
                  {block.children?.map((item, itemIndex) => (
                    <ReactMarkdown key={itemIndex}>{item.children?.[0]?.text || ""}</ReactMarkdown>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How We Help Section */}
      <section className={styles.lightBg}>
        <div className={`container ${styles.contentContainer}`}>
          <div className={styles.mainContent}>
            <div className={styles.scrollableContent}>
              <h2 className={styles.DescriptionTitle}>{company.how_we_help?.title}</h2>
              <h3 className={styles.Descriptionsubtitle}>{company.how_we_help?.subtitle}</h3>
              {company.how_we_help?.body?.map((block, index) => (
                <div key={index} className={styles.help}>
                  {block.type === 'paragraph' ? (
                    <ReactMarkdown>{block.children?.[0]?.text || ""}</ReactMarkdown>
                  ) : block.type === 'list' ? (
                    <ul className={styles.helpList}>
                      {block.children?.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <ReactMarkdown>{item.children?.[0]?.text || ""}</ReactMarkdown>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Case Results Section */}
      <section className={styles.darkBg}>
        <div className={`container ${styles.contentContainer}`}>
          <div className={styles.mainContent}>
            <div className={styles.scrollableContent}>
              <h2 className={styles.DescriptionTitle}>Our Results</h2>
              <div className={styles.resultsGrid}>
                {company.case_results?.map((result, index) => (
                  <div key={index} className={styles.resultCard}>
                    <h3 className={styles.amount}>
                      {result.amount.startsWith('$') ? result.amount : `$${result.amount}`}
                    </h3>
                    <p className={styles.description}>{result.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.lightBg}>
        <div className={`container ${styles.contentContainer}`}>
          <div className={styles.mainContent}>
            <div className={styles.scrollableContent}>
              <h2 className={styles.DescriptionTitle}>Client Testimonials</h2>
              <div className={styles.testimonialsGrid}>
                {company.testimonials?.map((testimonial, index) => (
                  <div key={index} className={styles.testimonialCard}>
                    <blockquote className={styles.quote}>
                      {testimonial.body}
                    </blockquote>
                    <cite className={styles.author}>{testimonial.title}</cite>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Results />
      <Steps />
      <ContactSection />
    </Layout>
  );
} 