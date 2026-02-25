import Layout from "../components/Layout/Layout";
import styles from "./page.module.css";
import HeroForm from "../components/Hero/components/HeroForm";
import ServicesCarousel from "../components/ServicesCarousel/ServicesCarousel";
import Results from "../components/Results/Results";
import Steps from "../components/Steps/Steps";
import Contact from "../components/Contact/ContactSection";
import ReactMarkdown from "react-markdown";
import parse from "html-react-parser";
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


// ✅ SEO: Parse FAQ section from article blocks for structured data
function extractFaqSchema(blocks) {
  const faqItems = [];
  let inFaqSection = false;
  let currentQ = null;
  let currentA = [];

  for (const block of blocks) {
    if (block.__component !== "shared.rich-text") continue;
    const body = block.body || "";

    if (!inFaqSection) {
      if (body.includes("Frequently Asked Questions") || body.includes("## **FAQ")) {
        inFaqSection = true;
      } else {
        continue;
      }
    }

    const lines = body.split("\n");
    for (const line of lines) {
      const qMatch = line.match(/^#{3,4}\s*\**\d+\.\s*(.+?)\**\s*$/);
      if (qMatch) {
        if (currentQ) {
          faqItems.push({ q: currentQ, a: currentA.join(" ").trim() });
          currentA = [];
        }
        currentQ = qMatch[1].replace(/\*\*/g, "").trim();
      } else if (currentQ && line.trim() && !line.startsWith("#")) {
        const clean = line
          .replace(/\*\*|__/g, "")
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
          .trim();
        if (clean) currentA.push(clean);
      }
    }
    if (inFaqSection && currentQ) {
      faqItems.push({ q: currentQ, a: currentA.join(" ").trim() });
      break;
    }
  }

  if (faqItems.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

// ✅ SEO: Dynamic meta titles, OG tags, and Twitter Cards per page
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slugArray = resolvedParams.slug || [];
  const slug = slugArray.join("/");
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const siteUrl = "https://www.louislawgroup.com";
  const defaultImage = `${siteUrl}/og-default.jpg`;

  try {
    const res = await fetch(
      `${strapiURL}/api/articles?filters[slug][$eq]=${slug}&fields[0]=title&fields[1]=description&populate[0]=cover`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        const article = data.data[0];
        if (article.title) {
          const imageUrl = article.cover?.url
            ? `https://login.louislawgroup.com${article.cover.url}`
            : defaultImage;
          const description =
            article.description ||
            "Contact Louis Law Group for a free case evaluation. Florida\'s trusted property damage attorneys.";
          return {
            title: `${article.title} | Louis Law Group`,
            description,
            openGraph: {
              title: `${article.title} | Louis Law Group`,
              description,
              url: `${siteUrl}/${slug}`,
              siteName: "Louis Law Group",
              images: [{ url: imageUrl, width: 1200, height: 630, alt: article.title }],
              type: "article",
            },
            twitter: {
              card: "summary_large_image",
              title: `${article.title} | Louis Law Group`,
              description,
              images: [imageUrl],
            },
          };
        }
      }
    }
  } catch (e) {}

  return {
    title: "Louis Law Group | Florida Property Damage Attorneys",
    description:
      "Trusted legal services for Florida property owners. Contact us for a free case evaluation.",
    openGraph: {
      title: "Louis Law Group | Florida Property Damage Attorneys",
      description: "Trusted legal services for Florida property owners. Contact us for a free case evaluation.",
      url: siteUrl,
      siteName: "Louis Law Group",
      images: [{ url: defaultImage, width: 1200, height: 630, alt: "Louis Law Group" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Louis Law Group | Florida Property Damage Attorneys",
      description: "Trusted legal services for Florida property owners. Contact us for a free case evaluation.",
      images: [defaultImage],
    },
  };
}

// ✅ Fetch and Render Page Content
export default async function Page(props) {
  const params = await props.params;
  const slugArray = params.slug || [];
  const slug = slugArray.join("/");

  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  let apiUrl;
  let isAttorneyPage = false;
  let isArticlePage = false;
  let isJobPage = false;
  let isFaqsPage = false;

  try {
    // ✅ Query each type by the exact slug — avoids 22K+ slug list that misses new articles
    const [attorneyRes, articleRes, jobRes, faqsRes] = await Promise.all([
      fetch(`${strapiURL}/api/team-pages?filters[Slug][$eq]=${slug}&fields[]=Slug&pagination[limit]=1`, { next: { revalidate: 60 } }),
      fetch(`${strapiURL}/api/articles?filters[slug][$eq]=${slug}&fields[]=slug&pagination[limit]=1`, { next: { revalidate: 60 } }),
      fetch(`${strapiURL}/api/jobs?filters[Slug][$eq]=${slug}&fields[]=Slug&pagination[limit]=1`, { next: { revalidate: 60 } }),
      fetch(`${strapiURL}/api/faqs-and-legals?filters[slug][$eq]=${slug}&fields[]=slug&pagination[limit]=1`, { next: { revalidate: 60 } }),
    ]);

    const [attorneyData, articleData, jobData, faqsData] = await Promise.all([
      attorneyRes.json(), articleRes.json(), jobRes.json(), faqsRes.json(),
    ]);

    if (attorneyData.data?.length > 0) {
      isAttorneyPage = true;
    } else if (articleData.data?.length > 0) {
      isArticlePage = true;
    } else if (jobData.data?.length > 0) {
      isJobPage = true;
    } else if (faqsData.data?.length > 0) {
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
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": page.title,
                "datePublished": page.createdAt,
                "dateModified": page.updatedAt || page.createdAt,
                "image": page.cover?.url
                  ? `https://login.louislawgroup.com${page.cover.url}`
                  : "https://www.louislawgroup.com/og-default.jpg",
                "author": {
                  "@type": "Organization",
                  "name": "Louis Law Group",
                  "url": "https://www.louislawgroup.com"
                },
                "publisher": {
                  "@type": "LegalService",
                  "name": "Louis Law Group",
                  "url": "https://www.louislawgroup.com",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://www.louislawgroup.com/logo.png"
                  }
                },
                "mainEntityOfPage": {
                  "@type": "WebPage",
                  "@id": `https://www.louislawgroup.com/${page.slug}`
                }
              })
            }}
          />
          {(() => {
            const faqSchema = page.blocks ? extractFaqSchema(page.blocks) : null;
            return faqSchema ? (
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
              />
            ) : null;
          })()}
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
                    const body = block.body || "";
                    const isHtml = body.trimStart().startsWith("<");
                    return (
                      <div key={index} className={styles.blogText}>
                        {isHtml ? parse(body) : <ReactMarkdown>{body}</ReactMarkdown>}
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