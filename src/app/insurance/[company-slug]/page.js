import Layout from "../../components/Layout/Layout";
import styles from "./page.module.css";
import HeroForm from "../../components/Hero/components/HeroForm";
import Results from "../../components/Results/Results";
import Steps from "../../components/Steps/Steps";
import ContactSection from "../../components/Contact/ContactSection";
import ReactMarkdown from "react-markdown";
import { notFound } from 'next/navigation';

// ✅ Configure Static Generation
export const dynamic = 'force-static';
export const dynamicParams = true;
export const revalidate = 60;

// ✅ Generate Static Paths
export async function generateStaticParams() {
  console.log('🔍 Starting generateStaticParams');
  try {
    // ✅ Fetch Insurance Companies
    const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const url = `${strapiURL}/api/insurance-companies?fields[]=slug&pagination[limit]=1000&populate=*`;
    console.log('📡 Fetching insurance companies from:', url);
    
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
      console.error('❌ Failed to fetch insurance companies:', res.status, res.statusText);
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    const response = await res.json();
    console.log('📦 Received response:', JSON.stringify(response, null, 2));
    
    if (!response?.data || !Array.isArray(response.data)) {
      console.error('❌ Invalid response structure:', response);
      return [];
    }

    // ✅ Generate Paths from Companies
    const paths = response.data
      .filter(item => {
        const hasSlug = !!item?.attributes?.slug;
        if (!hasSlug) {
          console.warn('⚠️ Company missing slug:', item);
        }
        return hasSlug;
      })
      .map(item => ({
        'company-slug': item.attributes.slug
      }));

    console.log('✅ Generated paths:', paths);
    return paths;
  } catch (error) {
    console.error("❌ Error generating paths:", error);
    return [];
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
  console.log('🔍 Starting InsuranceCompanyPage with params:', params);
  try {
    // ✅ Get Company Data
    console.log('⏳ Awaiting params resolution');
    const resolvedParams = await Promise.resolve(params);
    console.log('✅ Resolved params:', resolvedParams);
    
    const slug = resolvedParams?.['company-slug'];
    console.log('📝 Extracted slug:', slug);
    
    if (!slug) {
      console.error('❌ No slug provided in params');
      return notFound();
    }

    console.log('📡 Fetching data for slug:', slug);
    const company = await getCompanyData(slug);
    console.log('📦 Received company data:', company ? 'Data found' : 'No data');
    
    if (!company) {
      console.error('❌ No company data found for slug:', slug);
      return notFound();
    }

    console.log('✅ Successfully extracted company data');

    return (
      <Layout>
        {/* Hero Section */}
        <section className={`${styles.darkBg} ${styles.fullHeight}`}>
          <div className="container">
            <div className="column-2a">
              <div className={styles.leftColumn}>
                <h3 className={styles.subtitle}>{company?.hero?.subtitle || ''}</h3>
                <h1 className={`${styles.title} ${styles.free}`}>{company?.name || ''}</h1>
                <p className={styles.intro}>
                  {company?.hero?.intro?.[0]?.children?.[0]?.text || ''}
                </p>
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
          <div className="container">
            <div className="column-2a">
              <div className={styles.mainContent}>
                <div className={styles.scrollableContent}>
                  <div className={styles.help}>
                    <ReactMarkdown>{company?.overview?.body || ''}</ReactMarkdown>
                  </div>
                </div>
              </div>

              <div className={`${styles.mainContent} ${styles.darkContent}`}>
                <div className={styles.scrollableContent}>
                  {company?.common_issues && (
                    <div className={styles.issue}>
                      <h2 className={styles.issueTitle}>
                        {company.common_issues.title?.[0]?.children?.[0]?.text || 'Common Issues'}
                      </h2>
                      <ReactMarkdown>
                        {company.common_issues.description?.[0]?.children?.map(item => 
                          `- ${item.children?.[0]?.text}`
                        ).join('\n')}
                      </ReactMarkdown>
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

        {/* Case Results Section */}
        {company?.case_results?.length > 0 && (
          <section className={styles.darkBg}>
            <div className={`container ${styles.contentContainer}`}>
              <div className={styles.mainContent}>
                <div className={styles.scrollableContent}>
                  <h2 className={styles.DescriptionTitle}>Our <span className={styles.free}>RESULTS</span></h2>
                  <div className={styles.resultsGrid}>
                    {company.case_results.map((result, index) => (
                      <div key={index} className={styles.resultCard}>
                        <h3 className={styles.amount}>
                          {result?.amount?.startsWith('$') ? 
                            result.amount : 
                            `$${result.amount}`}
                        </h3>
                        <p className={styles.description}>{result?.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Testimonials Section */}
        {company?.testimonials?.length > 0 && (
          <section className={styles.lightBg}>
            <div className={`container ${styles.contentContainer}`}>
              <div className={styles.mainContent}>
                <div className={styles.scrollableContent}>
                  <h2 className={styles.DescriptionTitle}>Client Testimonials</h2>
                  <div className={styles.testimonialsGrid}>
                    {company.testimonials.map((testimonial, index) => (
                      <div key={index} className={styles.testimonialCard}>
                        <blockquote className={styles.quote}>
                          {testimonial?.body}
                        </blockquote>
                        <cite className={styles.author}>{testimonial?.title}</cite>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <Results />
        <Steps />
        <ContactSection />
      </Layout>
    );
  } catch (error) {
    console.error('❌ Error rendering insurance company page:', error);
    return notFound();
  }
} 