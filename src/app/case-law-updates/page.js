import Layout from "../components/Layout/Layout";
import styles from "./caselaw.module.css";
import Link from "next/link";
import Results from "../components/Results/Results";
import Steps from "../components/Steps/Steps";
import PolicyReviewForm from "./PolicyReviewForm";
import CaseLawGrid from "./CaseLawGrid";

export const revalidate = 60;

export const metadata = {
  title: "Case Law & Industry Insights | Louis Law Group",
  description:
    "Daily case law and industry insights on Florida property insurance litigation, public adjuster regulations, bad faith claims, and carrier disputes. Curated for public adjusters and claims professionals.",
  keywords:
    "florida property insurance case law, insurance litigation updates, public adjuster case law, bad faith insurance florida, property insurance court decisions, industry insights",
  alternates: { canonical: "https://www.louislawgroup.com/case-law-updates" },
  openGraph: {
    title: "Case Law & Industry Insights | Louis Law Group",
    description:
      "Daily case law and industry insights covering Florida property insurance disputes, PA regulations, bad faith claims, and carrier tactics.",
    url: "https://www.louislawgroup.com/case-law-updates",
  },
};

// ─── Pagination helper ──────────────────────────────────────────────────────
function getPaginationRange({ totalPages, currentPage, siblingCount = 1, boundaryCount = 2 }) {
  function range(start, end) {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
  const totalNumbers = boundaryCount * 2 + siblingCount * 2 + 3;
  if (totalPages <= totalNumbers) return range(1, totalPages);

  const pages = [];
  const startPages = range(1, boundaryCount);
  const endPages = range(totalPages - boundaryCount + 1, totalPages);
  const siblingsStart = Math.max(currentPage - siblingCount, boundaryCount + 2);
  const siblingsEnd = Math.min(currentPage + siblingCount, totalPages - boundaryCount - 1);

  pages.push(...startPages);
  if (siblingsStart > boundaryCount + 2) pages.push("...");
  else if (siblingsStart === boundaryCount + 2) pages.push(boundaryCount + 1);
  pages.push(...range(siblingsStart, siblingsEnd));
  if (siblingsEnd < totalPages - boundaryCount - 1) pages.push("...");
  else if (siblingsEnd === totalPages - boundaryCount - 1) pages.push(totalPages - boundaryCount);
  pages.push(...endPages);
  return pages;
}

// ─── Fetch case law articles from Strapi ────────────────────────────────────
async function getCaseLawPosts(page = 1) {
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const apiUrl =
    `${strapiURL}/api/articles?` +
    `populate=cover&` +
    `filters[slug][$contains]=case-law&` +
    `fields[]=title&fields[]=slug&fields[]=description&fields[]=publishedAt&` +
    `publicationState=live&` +
    `sort[0]=id:desc&` +
    `pagination[page]=${page}&pagination[pageSize]=20&pagination[withCount]=true`;

  try {
    const res = await fetch(apiUrl, { next: { revalidate: 60 } });
    if (!res.ok) {
      console.error("Failed to fetch case law posts:", res.status);
      return { posts: [], meta: null };
    }
    const json = await res.json();
    return { posts: json.data, meta: json.meta };
  } catch (err) {
    console.error("Error fetching case law posts:", err);
    return { posts: [], meta: null };
  }
}

// ─── Category tags from slug/title ──────────────────────────────────────────
function getCategoryTag(title, slug) {
  const text = `${title} ${slug}`.toLowerCase();
  if (text.includes("bad faith") || text.includes("624.155")) return "Bad Faith";
  if (text.includes("public adjuster") || text.includes("626.854")) return "PA Regulations";
  if (text.includes("appraisal") || text.includes("umpire")) return "Appraisal";
  if (text.includes("denial") || text.includes("underpay") || text.includes("exclusion")) return "Carrier Disputes";
  if (text.includes("reform") || text.includes("hb 837") || text.includes("sb 2a")) return "Legislative";
  return "Property Insurance";
}

function getTagColor(tag) {
  const colors = {
    "Bad Faith": { bg: "#fef2f2", text: "#991b1b", border: "#fca5a5" },
    "PA Regulations": { bg: "#eff6ff", text: "#1e40af", border: "#93c5fd" },
    "Appraisal": { bg: "#fefce8", text: "#854d0e", border: "#fde047" },
    "Carrier Disputes": { bg: "#fff7ed", text: "#9a3412", border: "#fdba74" },
    "Legislative": { bg: "#f0fdf4", text: "#166534", border: "#86efac" },
    "Property Insurance": { bg: "#f8fafc", text: "#1a2b49", border: "#cbd5e1" },
  };
  return colors[tag] || colors["Property Insurance"];
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default async function CaseLawUpdatesPage({ searchParams }) {
  const sp = await searchParams;
  let currentPage = sp?.page ? parseInt(sp.page, 10) : 1;
  if (!Number.isFinite(currentPage) || currentPage < 1) currentPage = 1;

  let { posts, meta } = await getCaseLawPosts(currentPage);
  let totalPages = meta?.pagination?.pageCount || 1;

  if (currentPage > totalPages && totalPages > 0) {
    currentPage = totalPages;
    ({ posts, meta } = await getCaseLawPosts(currentPage));
    totalPages = meta?.pagination?.pageCount || 1;
  }

  const paginationItems = getPaginationRange({
    totalPages,
    currentPage,
    siblingCount: 1,
    boundaryCount: 2,
  });

  return (
    <Layout>
      <section className={styles.page}>
        <div className="container">
          {/* Header */}
          <div className={styles.header}>
            <span className={styles.eyebrow}>Updated Daily · For Claims Professionals</span>
            <h1 className={styles.pageTitle}>Case Law and Industry Insights</h1>
            <p className={styles.pageSubtitle}>
              Florida property insurance court decisions and industry insights — curated daily for public adjusters
              and claims professionals.
            </p>
          </div>

          {/* Article Grid */}
          {posts.length > 0 && (
            <>
              {(() => {
                const enrichedPosts = posts.map((post) => {
                  const category = getCategoryTag(post.title || "", post.slug || "");
                  return {
                    ...post,
                    category,
                    tagColor: getTagColor(category),
                    dateLabel: post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "",
                  };
                });
                return <CaseLawGrid posts={enrichedPosts} />;
              })()}

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className={styles.pagination}>
                  {currentPage > 1 && (
                    <Link
                      href={`/case-law-updates?page=${currentPage - 1}`}
                      className={styles.paginationLink}
                    >
                      Previous
                    </Link>
                  )}
                  {paginationItems.map((item, idx) =>
                    item === "..." ? (
                      <span key={idx} className={styles.paginationDots}>…</span>
                    ) : (
                      <Link
                        key={item}
                        href={`/case-law-updates?page=${item}`}
                        className={`${styles.paginationLink} ${
                          currentPage === item ? styles.active : ""
                        }`}
                      >
                        {item}
                      </Link>
                    )
                  )}
                  {currentPage < totalPages && (
                    <Link
                      href={`/case-law-updates?page=${currentPage + 1}`}
                      className={styles.paginationLink}
                    >
                      Next
                    </Link>
                  )}
                </nav>
              )}
            </>
          )}
        </div>
      </section>

      {/* Policy Review Submission Form */}
      <section className={styles.formSection} id="submit-policy">
        <div className="container">
          <h2 className={styles.formTitle}>Submit a Policy for Review</h2>
          <p className={styles.formSubtitle}>
            Have a complex claim or coverage question? Submit your policyholder&apos;s details
            for a <strong>free review</strong> by our property damage attorneys. We&apos;ll analyze
            the situation and advise on the best path forward.
          </p>
          <PolicyReviewForm />
        </div>
      </section>

      <Results />
      <Steps />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Florida Property Insurance Case Law & Industry Insights",
            description:
              "Daily case law and industry insights on Florida property insurance litigation for public adjusters and claims professionals.",
            url: "https://www.louislawgroup.com/case-law-updates",
            publisher: {
              "@type": "LegalService",
              name: "Louis Law Group",
              url: "https://www.louislawgroup.com",
            },
          }),
        }}
      />
    </Layout>
  );
}
