import Layout from "../components/Layout/Layout";
import styles from "./page.module.css";
import HeroForm from "../components/Hero/components/HeroForm";
import ServicesCarousel from "../components/ServicesCarousel/ServicesCarousel";
import Results from "../components/Results/Results";
import Steps from "../components/Steps/Steps";
import Contact from "../components/Contact/ContactSection";
import ReactMarkdown from "react-markdown";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import { renderContentBlocks, processHeroContent, processSectionsContent } from "../utils/contentFormatter";

// 1) Allow new slugs at runtime (fallback):
export const dynamicParams = true;

// Disable static prerendering: fetch data at request time
export const dynamic = 'force-dynamic';

// 2) Keep revalidate if you want ISR for existing pages
export const revalidate = 60; // Revalidate existing pages every 60s

// ✅ Fetch and Render Page Content
export default async function Page({ params }) {
  const slugArray = params.slug || [];
  const slug = slugArray.join("/");

  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  let apiUrl;
  let isAttorneyPage = false;
  let isArticlePage = false;
  let isJobPage = false;
  let isFaqsPage = false;

  try {
    const attorneyRes = await fetch(
      `${strapiURL}/api/team-pages?fields[]=Slug&pagination[limit]=1000`,
      { next: { revalidate: 60 } }
    );
    const articleRes = await fetch(
      `${strapiURL}/api/articles?fields[]=slug&pagination[pageSize]=22000`,
      { next: { revalidate: 60 } }
    );
    const jobRes = await fetch(
      `${strapiURL}/api/jobs?fields[]=Slug&pagination[limit]=1000`,
      { next: { revalidate: 60 } }
    );
    const faqsRes = await fetch(
      `${strapiURL}/api/faqs-and-legals?fields[]=slug&pagination[limit]=1000`,
      { next: { revalidate: 60 } }
    );

    const attorneyData = await attorneyRes.json();
    const articleData = await articleRes.json();
    const jobData = await jobRes.json();
    const faqsData = await faqsRes.json();

    // Now define the slug arrays
    const attorneySlugs = attorneyData.data.map((attorney) => attorney.Slug);
    const articleSlugs = articleData.data.map((article) => article.slug);
    const jobSlugs = jobData.data.map((job) => job.Slug);
    const faqsSlugs = faqsData.data.map((faq) =>
      faq.attributes && faq.attributes.slug ? faq.attributes.slug : faq.slug
    );

    // Decide which type of page it is
    if (attorneySlugs.includes(slug)) {
      isAttorneyPage = true;
    } else if (articleSlugs.includes(slug)) {
      isArticlePage = true;
    } else if (jobSlugs.includes(slug)) {
      isJobPage = true;
    } else if (faqsSlugs.includes(slug)) {
      isFaqsPage = true;
    }
  } catch (error) {
    console.error("Error fetching slugs:", error);
  }

  if (isAttorneyPage) {
    apiUrl = `${strapiURL}/api/team-pages?filters[Slug][$eq]=${slug}&populate=Image.Image`;
  } else if (isArticlePage) {
    apiUrl = `${strapiURL}/api/articles?filters[slug][$eq]=${slug}&populate=blocks.file&populate=cover`;
  } else if (isJobPage) {
    apiUrl = `${strapiURL}/api/jobs?filters[Slug][$eq]=${slug}&populate=block`;
  } else if (isFaqsPage) {
    apiUrl = `${strapiURL}/api/faqs-and-legals?filters[slug][$eq]=${slug}&populate=*`;
  } else {
    const childSlug = slugArray[slugArray.length - 1];
    const parentSlug =
      slugArray.length > 1 ? slugArray.slice(0, -1).join("/") : null;

    if (parentSlug) {
      // Clean up parent slug before using in API call
      const cleanParentSlug = (parentSlug ?? '').replace(/^\/+|\/+$/g, '');
      apiUrl =
        `${strapiURL}/api/pages?filters[Slug][$eq]=${childSlug}` +
        `&filters[parent_page][URL][$eq]=/${cleanParentSlug}&populate=*`;
    } else {
      apiUrl = `${strapiURL}/api/pages?filters[Slug][$eq]=${childSlug}&populate=*`;
    }
  }

  console.log("🔍 Fetching page for slug:", slug, "API:", apiUrl);

  // Fetch the data
  const res = await fetch(apiUrl, { next: { revalidate: 60 } });

  if (!res.ok) {
    console.error("❌ API Error:", res.status, res.statusText);
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
  if (!data.data || data.data.length === 0) {
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

  // -- RENDER LOGIC BELOW, UNCHANGED --
  return (
    <Layout>
      {isJobPage ? (
        <>
          <section className={styles.jobHero}>
            <div className="container">
              <h1 className={styles.jobTitle}>{page.Title}</h1>
              <Link
                href="/apply-for-this-position"
                className={styles.blueButton}
              >
                Apply Now
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3.5 20.5 17-17M9.5 3.5h11v11"></path>
                  </g>
                </svg>
              </Link>
            </div>
          </section>
          <section className={styles.jobDescription}>
            <div className="container">
              {page.block.map((block, index) => {
                if (block.__component === "shared.description") {
                  return (
                    <div key={index} className={styles.jobText}>
                      {block.Description.map((desc, j) => (
                        <p key={j}>{desc.children?.[0]?.text || ""}</p>
                      ))}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </section>
          <Steps />
          <Contact />
        </>
      ) : isArticlePage ? (
        <>
          <section className={styles.blogPost}>
            <div className="container blogContainer">
              <h1 className={styles.blogTitle}>{page.title}</h1>
              <p className={styles.blogDate}>
                <FaRegCalendarAlt className={styles.icon} />{" "}
                {new Date(page.createdAt).toLocaleDateString()} |{" "}
                <FaRegClock className={styles.icon} />{" "}
                {Math.ceil(page.blocks.length * 0.5)} min read
              </p>
              <div className={styles.socialShare}>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${
                    typeof window !== "undefined"
                      ? encodeURIComponent(window.location.href)
                      : ""
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook className={styles.socialIcon} />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    typeof window !== "undefined" ? window.location.href : ""
                  )}&text=${encodeURIComponent(page.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter className={styles.socialIcon} />
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                    typeof window !== "undefined" ? window.location.href : ""
                  )}&title=${encodeURIComponent(page.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin className={styles.socialIcon} />
                </a>
              </div>
              {page.cover && (
                <img
                  src={`https://login.louislawgroup.com${page.cover.url}`}
                  alt={page.title}
                  className={styles.blogImage}
                />
              )}
              <div className={styles.blogContent}>
                {page.blocks.map((block, index) => {
                  if (block.__component === "shared.rich-text") {
                    return (
                      <div key={index} className={styles.blogText}>
                        <ReactMarkdown>{block.body}</ReactMarkdown>
                      </div>
                    );
                  }
                  if (block.__component === "shared.media" && block.file?.url) {
                    const imageUrl = `https://login.louislawgroup.com${block.file.url}`;
                    return (
                      <div key={index} className={styles.blogImageContainer}>
                        <img
                          src={imageUrl}
                          alt={block.file.alternativeText || "Blog Image"}
                          className={styles.blogPostImage}
                        />
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </section>
          <Steps />
          <Contact />
        </>
      ) : isAttorneyPage ? (
        <>
          <section className={styles.attorneyHero}>
            <div className="container">
              <div className="column-2a">
                <div className={styles.leftColumn}>
                  <img
                    src={
                      page.Image?.Image?.url
                        ? `https://login.louislawgroup.com${page.Image.Image.url}`
                        : "/placeholder.jpg"
                    }
                    alt={page.Image?.Alt || "Attorney"}
                    className={styles.teamImage}
                  />
                  <h1 className={styles.attorneyTitle}>{page.title}</h1>
                </div>
                <div className={styles.rightColumn}>
                  <HeroForm />
                </div>
              </div>
            </div>
          </section>
          <section className={styles.attorneyBio}>
            <div className="container">
              <div className={styles.bioContainer}>
                <h2 className="bioHeading">Bio.</h2>
                {Array.isArray(page.Description) &&
                  page.Description.map((block, idx) => (
                    <p key={idx} className={styles.attorneyBioText}>
                      {block.children?.[0]?.text || ""}
                    </p>
                  ))}
              </div>
            </div>
          </section>
          <Results />
          <Steps />
          <Contact />
        </>
      ) : isFaqsPage ? (
        <>
          <section className={styles.faqHero}>
            <div className={styles.container}>
              {(() => {
                const faqTitle =
                  page.title ||
                  page.slug
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");
                return <h1 className={styles.faqTitle}>{faqTitle}</h1>;
              })()}
            </div>
          </section>
          <section className={styles.faqContent}>
            <div className={styles.container}>
              {page.blocks &&
                page.blocks.map((block, index) => {
                  if (block.__component === "shared.rich-text") {
                    return (
                      <div key={index} className={styles.faqText}>
                        <ReactMarkdown>{block.body}</ReactMarkdown>
                      </div>
                    );
                  }
                  return null;
                })}
            </div>
          </section>
          <Results />
          <Steps />
          <Contact />
        </>
      ) : (
        <>
          {page.Hero && (
            <section
              className={`${styles.darkBg} ${styles.fullHeight} ${styles.verticalCenter}`}
            >
              <div className="container">
                <div className="column-2a">
                  <div className={styles.leftColumn}>
                    {page.Hero.subtitle && (
                      <h3 className={styles.subtitle}>{page.Hero.subtitle}</h3>
                    )}
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
                        Get a <span className={styles.free}>FREE</span> case
                        evaluation today.
                      </p>
                    </div>
                    <HeroForm />
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className={styles.Descriptionsection}>
            <div className={`container ${styles.contentContainer}`}>
              <div className={styles.mainContent}>
                <div className={styles.scrollableContent}>
                  {page.Sections?.title && (
                    <h2 className={styles.DescriptionTitle}>
                      {page.Sections.title}
                    </h2>
                  )}
                  {page.Sections?.subtitle && (
                    <h3 className={styles.Descriptionsubtitle}>
                      {page.Sections.subtitle}
                    </h3>
                  )}
                  {page.Sections && renderContentBlocks(processSectionsContent(page.Sections).body, styles)}
                </div>
              </div>
            </div>
          </section>

          {Array.isArray(page.Services) && page.Services.length > 0 && (
            <ServicesCarousel services={page.Services} />
          )}

          <Results />
          <Steps />
          <Contact />
        </>
      )}
    </Layout>
  );
}