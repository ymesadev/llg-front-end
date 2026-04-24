import Layout from "../../components/Layout/Layout";
import styles from "./resources.module.css";
import Link from "next/link";
import Results from "../../components/Results/Results";
import Steps from "../../components/Steps/Steps";
import Contact from "../../components/Contact/ContactSection";

export const revalidate = 3600;

export const metadata = {
  title: "Fire Insurance Claim Resources & Articles | Louis Law Group",
  description: "Browse articles on fire damage insurance claims, denied fire claims, smoke damage, and legal guides from Louis Law Group fire claim attorneys.",
  alternates: { canonical: "https://www.louislawgroup.com/fire-insurance-claims/resources" },
};

const FIRE_SLUG_KEYWORDS = ["fire", "smoke-damage", "arson", "soot", "lightning-strike", "blaze", "burn", "flame"];

async function getFireArticles(page = 1) {
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  const filters = FIRE_SLUG_KEYWORDS
    .map((kw, i) => `filters[$or][${i}][slug][$containsi]=${kw}`)
    .join("&");

  const apiUrl =
    `${strapiURL}/api/articles?` +
    `${filters}&` +
    `fields[]=title&fields[]=slug&fields[]=description&` +
    `publicationState=live&` +
    `sort[0]=publishedAt:desc&` +
    `pagination[page]=${page}&pagination[pageSize]=24&pagination[withCount]=true`;

  try {
    const res = await fetch(apiUrl, { next: { revalidate: 3600 } });
    if (!res.ok) return { posts: [], meta: null };
    const json = await res.json();
    return { posts: json.data, meta: json.meta };
  } catch {
    return { posts: [], meta: null };
  }
}

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

export default async function FireResourcesPage({ searchParams }) {
  const sp = await searchParams;
  let currentPage = sp?.page ? parseInt(sp.page, 10) : 1;
  if (!Number.isFinite(currentPage) || currentPage < 1) currentPage = 1;

  let { posts, meta } = await getFireArticles(currentPage);
  let totalPages = meta?.pagination?.pageCount || 1;

  if (currentPage > totalPages && totalPages > 0) {
    currentPage = totalPages;
    ({ posts, meta } = await getFireArticles(currentPage));
    totalPages = meta?.pagination?.pageCount || 1;
  }

  const paginationItems = getPaginationRange({ totalPages, currentPage, siblingCount: 1, boundaryCount: 2 });

  return (
    <Layout>
      <section className={styles.resourcesPage}>
        <div className="container">
          <nav className={styles.breadcrumb}>
            <Link href="/">Home</Link> &gt; <Link href="/fire-insurance-claims">Fire Insurance Claims</Link> &gt; Resources
          </nav>
          <h1 className={styles.pageTitle}>Fire Insurance Claim Resources</h1>
          <p className={styles.pageSubtitle}>Browse our latest articles on fire damage insurance claims, denied claims, and legal guides.</p>

          {posts.length === 0 ? (
            <p className={styles.noPosts}>No fire claim articles yet. Check back soon.</p>
          ) : (
            <div className={styles.grid}>
              {posts.map((post) => (
                <Link key={post.id} href={`/fire-insurance-claims/resources/${post.slug}`} className={styles.postCard}>
                  <div className={styles.postContent}>
                    <h2 className={styles.postTitle}>{post.title}</h2>
                    <p className={styles.postExcerpt}>{post.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className={styles.pagination}>
              {currentPage > 1 && (
                <Link href={`/fire-insurance-claims/resources?page=${currentPage - 1}`} className={styles.paginationLink}>
                  Previous
                </Link>
              )}
              {paginationItems.map((item, idx) =>
                item === "..." ? (
                  <span key={idx} className={styles.paginationDots}>...</span>
                ) : (
                  <Link
                    key={item}
                    href={`/fire-insurance-claims/resources?page=${item}`}
                    className={`${styles.paginationLink} ${currentPage === item ? styles.active : ""}`}
                  >
                    {item}
                  </Link>
                )
              )}
              {currentPage < totalPages && (
                <Link href={`/fire-insurance-claims/resources?page=${currentPage + 1}`} className={styles.paginationLink}>
                  Next
                </Link>
              )}
            </nav>
          )}
        </div>
      </section>

      <Results />
      <Steps />
      <Contact />
    </Layout>
  );
}
