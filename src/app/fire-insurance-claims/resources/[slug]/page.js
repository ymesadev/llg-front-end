import Layout from "../../../components/Layout/Layout";
import styles from "./article.module.css";
import Link from "next/link";
import parse from "html-react-parser";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import UrgencyBanner from "@/app/components/UrgencyBanner/UrgencyBanner";
import DocumentUploadCTA from "../../../components/DocumentUploadCTA/DocumentUploadCTA";
import ChecklistCTA from "../../../components/ChecklistCTA/ChecklistCTA";
import OpenChatButton from "../../../components/OpenChatButton/OpenChatButton";
import MobileExitIntent from "../../../components/MobileExitIntent/MobileExitIntent";
import ReadingProgress from "../../../components/ReadingProgress/ReadingProgress";
import Results from "../../../components/Results/Results";
import Steps from "../../../components/Steps/Steps";
import Contact from "../../../components/Contact/ContactSection";

export const revalidate = 3600;

async function getArticle(slug) {
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const apiUrl = `${strapiURL}/api/articles?filters[slug][$eq]=${slug}&populate=*`;
  try {
    const res = await fetch(apiUrl, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.[0] || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Article Not Found | Louis Law Group" };
  return {
    title: `${article.title} | Louis Law Group`,
    description: article.description || `${article.title} — Florida fire insurance claim guidance from Louis Law Group.`,
    alternates: { canonical: `https://www.louislawgroup.com/fire-insurance-claims/resources/${slug}` },
    openGraph: {
      title: article.title,
      description: article.description || "",
      url: `https://www.louislawgroup.com/fire-insurance-claims/resources/${slug}`,
    },
  };
}

function isPureHtml(text) {
  return /<[a-z][\s\S]*>/i.test(text) && !text.startsWith("#");
}

function demoteH1(body) {
  if (!body) return body;
  return body
    .replace(/<h1(\s|>)/gi, "<h2$1")
    .replace(/<\/h1>/gi, "</h2>")
    .replace(/^#\s+/gm, "## ");
}

export default async function FireArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return (
      <Layout>
        <section className={styles.articlePage}>
          <div className="container">
            <h1>Article Not Found</h1>
            <p>This fire insurance claim article could not be found.</p>
            <Link href="/fire-insurance-claims/resources">Back to Fire Claim Resources</Link>
          </div>
        </section>
      </Layout>
    );
  }

  const blocks = article.blocks || [];
  const wordCount = blocks.reduce((acc, b) => {
    if (b.__component !== "shared.rich-text") return acc;
    return acc + (b.body || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  }, 0);
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  const midpoint = Math.floor(blocks.length / 2);

  const articleSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description || "",
    author: { "@type": "Person", name: "Pierre A. Louis, Esq.", url: "https://www.louislawgroup.com/pierre-a-louis-esq" },
    publisher: { "@type": "Organization", name: "Louis Law Group", url: "https://www.louislawgroup.com" },
    datePublished: article.createdAt,
    dateModified: article.updatedAt || article.createdAt,
    wordCount,
    about: { "@type": "Thing", name: "Fire Insurance Claims" },
  });

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.louislawgroup.com" },
      { "@type": "ListItem", position: 2, name: "Fire Insurance Claims", item: "https://www.louislawgroup.com/fire-insurance-claims" },
      { "@type": "ListItem", position: 3, name: "Resources", item: "https://www.louislawgroup.com/fire-insurance-claims/resources" },
      { "@type": "ListItem", position: 4, name: article.title },
    ],
  });

  const CTA_URL = "/property-damage-claims/qualify";

  return (
    <Layout>
      <ReadingProgress />
      <article className={styles.articlePage}>
        <div className="container">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleSchema }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchema }} />

          {/* Breadcrumb */}
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true"> &rsaquo; </span>
            <Link href="/fire-insurance-claims">Fire Insurance Claims</Link>
            <span aria-hidden="true"> &rsaquo; </span>
            <Link href="/fire-insurance-claims/resources">Resources</Link>
            <span aria-hidden="true"> &rsaquo; </span>
            <span>{article.title}</span>
          </nav>

          <h1 className={styles.articleTitle}>{article.title}</h1>

          {article.description && (
            <div className={styles.quickAnswer}>
              <span className={styles.quickAnswerLabel}>Quick Answer</span>
              <p>{article.description}</p>
            </div>
          )}

          <UrgencyBanner articleType="property-damage" slug={slug} />

          {/* Author byline */}
          <Link href="/pierre-a-louis-esq" className={styles.authorByline}>
            <img
              src="https://login.louislawgroup.com/uploads/pierre_louis_new_003bb95e9b.jpg"
              alt="Pierre A. Louis, Esq."
              className={styles.authorPhoto}
            />
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>Pierre A. Louis, Esq.</span>
              <span className={styles.authorCredential}>Louis Law Group</span>
            </div>
          </Link>

          <p className={styles.articleMeta}>
            <FaRegCalendarAlt /> {new Date(article.createdAt).toLocaleDateString()} | <FaRegClock /> {readTime} min read
          </p>

          {/* Article body */}
          <div className={styles.articleBody}>
            <DocumentUploadCTA articleType="property-damage" lang="en" slug={slug} />
            {blocks.map((block, index) => (
              <div key={index}>
                {block.__component === "shared.rich-text" && (() => {
                  const body = demoteH1(block.body || "");
                  return (
                    <div className={styles.articleText}>
                      {isPureHtml(body) ? parse(body) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                          {body}
                        </ReactMarkdown>
                      )}
                    </div>
                  );
                })()}
                {index === midpoint && <ChecklistCTA articleType="property-damage" />}
              </div>
            ))}
          </div>

          {/* End-of-article CTA */}
          <div className={styles.endCta}>
            <h2 className={styles.endCtaTitle}>Find Out If You Qualify — Free Case Review</h2>
            <p className={styles.endCtaSubtext}>No fees unless we win · 100% confidential · Same-day response</p>
            <div className={styles.endCtaButtons}>
              <OpenChatButton className={styles.chatBtn}>Ask Us a Question Live →</OpenChatButton>
              <Link href={CTA_URL} className={styles.qualifyBtn}>See If You Qualify →</Link>
            </div>
          </div>
        </div>
      </article>

      {/* Sticky mobile CTA */}
      <div className={styles.stickyMobileCta}>
        <OpenChatButton className={styles.stickyChat}>Ask Us a Question Live</OpenChatButton>
        <Link href={CTA_URL} className={styles.stickyQualify}>See If You Qualify →</Link>
      </div>

      {/* Sticky desktop CTA */}
      <div className={styles.stickyDesktopCta}>
        <span className={styles.stickyDesktopText}>Insurance claim issues? Find out if you have a case — free, no obligation.</span>
        <OpenChatButton className={styles.stickyDesktopBtn}>Chat Now</OpenChatButton>
        <Link href={CTA_URL} className={styles.stickyDesktopBtn}>See If You Qualify</Link>
      </div>

      <MobileExitIntent articleType="property-damage" />

      <Results />
      <Steps />
      <Contact />
    </Layout>
  );
}
