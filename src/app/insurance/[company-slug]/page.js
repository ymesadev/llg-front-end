import Layout from "../../components/Layout/Layout";
import styles from "./page.module.css";
import HeroForm from "../../components/Hero/components/HeroForm";
import Results from "../../components/Results/Results";
import Steps from "../../components/Steps/Steps";
import ContactSection from "../../components/Contact/ContactSection";
import ReactMarkdown from "react-markdown";
import { renderContentBlocks, processHeroContent, processSectionsContent } from "../../utils/contentFormatter";
import { notFound } from 'next/navigation';

// Force static generation
export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = false;

// ✅ Generate Static Paths
export async function generateStaticParams() {
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  console.log('Starting generateStaticParams for insurance companies');
  console.log('Strapi URL:', strapiURL);

  if (!strapiURL) {
    console.error('NEXT_PUBLIC_STRAPI_API_URL is not defined');
    return [];
  }

  try {
    // ✅ Fetch Insurance Companies
    const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const url = `${strapiURL}/api/insurance-companies?fields[]=slug&pagination[limit]=1000&populate=*`;
    console.log('📡 Fetching insurance companies from:', url);
    
    const res = await fetch(
      `${strapiURL}/api/insurance-companies`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Failed to fetch insurance companies:', errorText);
      throw new Error(`Failed to fetch: ${res.status} ${errorText}`);
    }

    const data = await res.json();
    console.log('Fetched insurance companies data:', JSON.stringify(data, null, 2));

    if (!data?.data || !Array.isArray(data.data)) {
      console.error('Invalid data structure received:', data);
      return [];
    }

    const params = data.data
      .filter(company => {
        if (!company?.attributes?.slug) {
          console.warn('Company missing slug:', company);
          return false;
        }
        return true;
      })
      .map(company => {
        console.log('Generating params for company:', company.attributes.slug);
        return {
          'company-slug': company.attributes.slug
        };
      });

    console.log('Generated static params:', params);
    return params;

  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    throw error; // Let the build fail if we can't generate the pages
  }
}

// ✅ Fetch and Render Page Content
async function getCompanyData(slug) {
  console.log('🔍 Starting getCompanyData for slug:', slug);
  if (!slug) {
    console.error('❌ No slug provided to getCompanyData');
    return null;
  }

  try {
    const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const url = `${strapiURL}/api/insurance-companies?filters[slug][$eq]=${slug}&populate=*`;
    console.log('📡 Fetching company data from:', url);
    
    const res = await fetch(
      url,
      { 
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 }
      }
    );

    if (!res.ok) {
      console.error('❌ Failed to fetch company data:', res.status, res.statusText);
      throw new Error(`Failed to fetch company data: ${res.status}`);
    }

    const response = await res.json();
    console.log('📦 Received company data:', JSON.stringify(response, null, 2));
    
    if (!response?.data?.[0]) {
      console.error('❌ Invalid company data structure:', response);
      return null;
    }

    console.log('✅ Successfully retrieved company data');
    return response.data[0];
  } catch (error) {
    console.error("❌ Error fetching company data:", error);
    return null;
  }
}

export default async function InsuranceCompanyPage({ params }) {
  const slug = params['company-slug'];
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  
  if (!strapiURL) {
    console.error('NEXT_PUBLIC_STRAPI_API_URL is not defined');
    return notFound();
  }

  console.log(`Rendering insurance company page for slug: ${slug}`);
  
  try {
    const apiUrl = `${strapiURL}/api/insurance-companies?filters[slug][$eq]=${slug}&populate=deep`;
    console.log('Fetching from URL:', apiUrl);

    const res = await fetch(apiUrl, { 
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Failed to fetch insurance company with slug ${slug}:`, errorText);
      return notFound();
    }

    const data = await res.json();
    console.log(`Data received for ${slug}:`, JSON.stringify(data, null, 2));
    
    if (!data?.data?.[0]) {
      console.error(`No data found for insurance company with slug ${slug}`);
      return notFound();
    }

    const company = data.data[0];
    console.log(`Rendering company page for: ${company.attributes?.name || slug}`);

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
                  )}

                  {company?.how_we_help && (
                    <div className={styles.helpSection}>
                      <h2 className={styles.issueTitle}>{company.how_we_help.title}</h2>
                      <h3 className={styles.helpSubtitle}>{company.how_we_help.subtitle}</h3>
                      <ReactMarkdown>
                        {`${company.how_we_help.body?.[0]?.children?.[0]?.text || ''}\n\n${
                          company.how_we_help.body?.[1]?.children?.map(item => 
                            `- ${item.children?.[0]?.text}`
                          ).join('\n') || ''
                        }`}
                      </ReactMarkdown>
                    </div>
                  )}
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
    throw error; // Let the build fail if we can't render the page
  }
} 