import Layout from "../../components/Layout/Layout";
import styles from "./page.module.css";
import HeroForm from "../../components/Hero/components/HeroForm";
import Results from "../../components/Results/Results";
import Steps from "../../components/Steps/Steps";
import ContactSection from "../../components/Contact/ContactSection";
import ReactMarkdown from "react-markdown";
import { renderContentBlocks, processHeroContent, processSectionsContent } from "../../utils/contentFormatter";
import { notFound } from 'next/navigation';

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  try {
    // Add proper headers and cache configuration
    const res = await fetch(
      `${strapiURL}/api/insurance-companies?fields[0]=slug&pagination[pageSize]=100`,
      {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        next: { 
          revalidate: 60 
        }
      }
    );

    if (!res.ok) {
      console.error('Failed to fetch insurance companies:', await res.text());
      return [];
    }

    const data = await res.json();

    // Validate data structure
    if (!data?.data || !Array.isArray(data.data)) {
      console.error('Invalid data structure received:', data);
      return [];
    }

    // Map and filter out any invalid entries
    const params = data.data
      .filter(company => company?.attributes?.slug)
      .map(company => ({
        'company-slug': company.attributes.slug
      }));

    console.log('Generated params for insurance companies:', params);
    return params;

  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function InsuranceCompanyPage({ params }) {
  const slug = params['company-slug'];
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  
  try {
    const apiUrl = `${strapiURL}/api/insurance-companies?filters[slug][$eq]=${slug}&populate=*`;
    const res = await fetch(apiUrl, { 
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      next: { 
        revalidate: 60 
      }
    });

    if (!res.ok) {
      console.error(`Failed to fetch insurance company with slug ${slug}:`, await res.text());
      return notFound();
    }

    const data = await res.json();
    
    if (!data?.data?.[0]) {
      console.error(`No data found for insurance company with slug ${slug}`);
      return notFound();
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

        {/* Overview and Common Issues Section */}
        <section className={styles.lightBg}>
          <div className="container">
            <div className="column-2a">
              <div className={styles.mainContent}>
                <div className={styles.scrollableContent}>
                  <div className={styles.help}>
                    <ReactMarkdown>{company.overview?.body || ""}</ReactMarkdown>
                  </div>
                </div>
              </div>

              <div className={`${styles.mainContent} ${styles.darkContent}`}>
                <div className={styles.scrollableContent}>
                  {company.common_issues?.title?.map((block, index) => (
                    <div key={index} className={styles.issue}>
                      <h2 className={styles.issueTitle}>{block.children?.[0]?.text || ""}</h2>
                      <ul className={styles.issuesList}>
                        {company.common_issues?.description?.[0]?.children?.map((item, itemIndex) => (
                          <li key={itemIndex} className={styles.issueItem}>
                            {item.children?.[0]?.text || ""}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <div className={styles.helpSection}>
                    <h2 className={styles.issueTitle}>{company.how_we_help?.title}</h2>
                    <h3 className={styles.helpSubtitle}>{company.how_we_help?.subtitle}</h3>
                    {company.how_we_help?.body?.map((block, index) => (
                      <div key={index} className={styles.help}>
                        {block.type === 'paragraph' ? (
                          <p>{block.children?.[0]?.text || ""}</p>
                        ) : block.type === 'list' ? (
                          <ul className={styles.helpList}>
                            {block.children?.map((item, itemIndex) => (
                              <li key={itemIndex} className={styles.helpItem}>
                                {item.children?.[0]?.text || ""}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Case Results Section */}
        <section className={styles.darkBg}>
          <div className={`container ${styles.contentContainer}`}>
            <div className={styles.mainContent}>
              <div className={styles.scrollableContent}>
                <h2 className={styles.DescriptionTitle}>Our <span className={styles.free}>RESULTS</span></h2>
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
  } catch (error) {
    console.error(`Error rendering insurance company page for slug ${slug}:`, error);
    return notFound();
  }
} 