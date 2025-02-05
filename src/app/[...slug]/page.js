import Layout from "../components/Layout/Layout";
import styles from "./page.module.css";
import HeroForm from "../components/Hero/HeroForm";
import ServicesCarousel from "../components/ServicesCarousel/ServicesCarousel";
import Results from "../components/Results/Results";
import Steps from "../components/Steps/Steps";
import Contact from "../components/Contact/ContactSection";
import ReactMarkdown from "react-markdown";

export const revalidate = 60; // ISR: Revalidate every 60 seconds

export async function generateStaticParams() {
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  try {
    const resPages = await fetch(
      `${strapiURL}/api/pages?fields[]=Slug&pagination[limit]=1000&populate=parent`,
      { next: { revalidate: 60 } } // ISR every 60 seconds
    );
    const resAttorneys = await fetch(
      `${strapiURL}/api/team-pages?fields[]=Slug&pagination[limit]=1000`,
      { next: { revalidate: 60 } } // ISR every 60 seconds
    );
    const resArticles = await fetch(
      `${strapiURL}/api/articles?fields[]=Slug&pagination[limit]=1000`,
      { next: { revalidate: 60 } } // ISR every 60 seconds
    );

    if (!resPages.ok || !resAttorneys.ok || !resArticles.ok) throw new Error("Failed to fetch slugs");

    const dataPages = await resPages.json();
    const dataAttorneys = await resAttorneys.json();
    const dataArticles = await resArticles.json();

    const pages = dataPages.data.map((page) => {
      let fullSlug = page.Slug;
      if (page.parent) {
        fullSlug = `${page.parent.Slug}/${page.Slug}`;
      }
      return { slug: fullSlug.split("/") };
    });

    const attorneys = dataAttorneys.data.map((attorney) => ({
      slug: [attorney.Slug],
    }));

    const articles = dataArticles.data.map((article) => ({
      slug: [article.slug],
    }));

    return [...pages, ...attorneys, ...articles];
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

// ✅ Fetch and Render Page Content
export default async function Page({ params }) {
  const slugArray = params.slug || [];
  const slug = slugArray.join("/");

  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  let apiUrl;
  let isAttorneyPage = false;
  let isArticlePage = false;

  try {
    const attorneyRes = await fetch(`${strapiURL}/api/team-pages?fields[]=Slug&pagination[limit]=1000`, {
      next: { revalidate: 60 }, // ✅ ISR: Revalidate every 60 seconds
    });

    const articleRes = await fetch(`${strapiURL}/api/articles?fields[]=slug&pagination[limit]=1000`, {
      next: { revalidate: 60 }, // ✅ ISR: Revalidate every 60 seconds
    });

    const attorneyData = await attorneyRes.json();
    const articleData = await articleRes.json();

    const attorneySlugs = attorneyData.data.map((attorney) => attorney.Slug);
    const articleSlugs = articleData.data.map((article) => article.slug);

    if (attorneySlugs.includes(slug)) {
      isAttorneyPage = true;
    } else if (articleSlugs.includes(slug)) {
      isArticlePage = true;
    }
  } catch (error) {
    console.error("Error fetching slugs:", error);
  }

  if (isAttorneyPage) {
    apiUrl = `${strapiURL}/api/team-pages?filters[Slug][$eq]=${slug}&populate=Image.Image`;
  } else if (isArticlePage) {
    apiUrl = `${strapiURL}/api/articles?filters[slug][$eq]=${slug}&populate=blocks.file&populate=cover`;
  } else {
    const childSlug = slugArray[slugArray.length - 1];
    const parentSlug = slugArray.length > 1 ? slugArray.slice(0, -1).join("/") : null;

    if (parentSlug) {
      apiUrl = `${strapiURL}/api/pages?filters[Slug][$eq]=${childSlug}&filters[parent][Slug][$eq]=${parentSlug}&populate=*`;
    } else {
      apiUrl = `${strapiURL}/api/pages?filters[Slug][$eq]=${childSlug}&populate=*`;
    }
  }

  console.log("🔍 Fetching page for slug:", slug, "API:", apiUrl);

  const res = await fetch(apiUrl, { next: { revalidate: 60 } }); // ✅ ISR: Revalidate every 60 seconds

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
      {isArticlePage ? (
        <>
          <section className={styles.blogPost}>
            <div className="container blogContainer">
              <h1 className={styles.blogTitle}>{page.title}</h1>
              <p className={styles.blogDate}>
                📅 {new Date(page.createdAt).toLocaleDateString()} | ⏳{" "}
                {Math.ceil(page.blocks.length * 0.5)} min read
              </p>
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
                    src={page.Image?.Image?.url ? `https://login.louislawgroup.com${page.Image.Image.url}` : "/placeholder.jpg"}
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
      ) : (
        <>
         {/* ✅ Render Regular Page Content */}
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
        </>
      )}
      
    </Layout>
  );
}