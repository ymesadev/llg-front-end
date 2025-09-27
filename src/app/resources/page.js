// src/app/resources/page.js

import Layout from "../components/Layout/Layout";
import styles from "./resources.module.css";
import Link from "next/link";
import Results from "../components/Results/Results";
import Steps from "../components/Steps/Steps";
import Contact from "../components/Contact/ContactSection";

export const revalidate = 60; // ISR: refresh every 60 seconds

// ─── Pagination helper: [1, 2, …, 9, 10, 11, …, 101, 102] ──────────────────
function getPaginationRange({ totalPages, currentPage, siblingCount = 1, boundaryCount = 2 }) {
  // create a range of numbers from start to end
  function range(start, end) {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  // how many page numbers we’d show if no dots
  const totalNumbers = boundaryCount * 2 + siblingCount * 2 + 3;
  if (totalPages <= totalNumbers) {
    return range(1, totalPages);
  }

  const pages = [];
  const startPages = range(1, boundaryCount);
  const endPages = range(totalPages - boundaryCount + 1, totalPages);

  const siblingsStart = Math.max(currentPage - siblingCount, boundaryCount + 2);
  const siblingsEnd   = Math.min(currentPage + siblingCount, totalPages - boundaryCount - 1);

  // first boundary pages
  pages.push(...startPages);

  // leading dots
  if (siblingsStart > boundaryCount + 2) {
    pages.push("...");
  } else if (siblingsStart === boundaryCount + 2) {
    pages.push(boundaryCount + 1);
  }

  // sibling pages
  pages.push(...range(siblingsStart, siblingsEnd));

  // trailing dots
  if (siblingsEnd < totalPages - boundaryCount - 1) {
    pages.push("...");
  } else if (siblingsEnd === totalPages - boundaryCount - 1) {
    pages.push(totalPages - boundaryCount);
  }

  // last boundary pages
  pages.push(...endPages);

  return pages;
}

// ─── Data fetching for one page of blog posts ───────────────────────────────
async function getBlogPosts(page = 1) {
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const apiUrl = 
    `${strapiURL}/api/articles?` +
    `populate=cover&` +
    `fields[]=title&fields[]=slug&fields[]=description&` +
    `publicationState=live&` +
    `sort[0]=publishedAt:desc&` +
    `pagination[page]=${page}&pagination[pageSize]=20&pagination[withCount]=true`;

  try {
    const res = await fetch(apiUrl, { next: { revalidate: 60 } });
    if (!res.ok) {
      console.error("Failed to fetch blog posts:", res.status, res.statusText);
      return { posts: [], meta: null };
    }
    const json = await res.json();
    return { posts: json.data, meta: json.meta };
  } catch (err) {
    console.error("Error fetching blog posts:", err);
    return { posts: [], meta: null };
  }
}

// ─── Page component ─────────────────────────────────────────────────────────
export default async function ResourcesPage({ searchParams }) {
  // searchParams in Next's app router can be an async proxy; await it before using
  const sp = await searchParams;
  let currentPage = sp?.page ? parseInt(sp.page, 10) : 1;
  if (!Number.isFinite(currentPage) || currentPage < 1) currentPage = 1;

  let { posts, meta } = await getBlogPosts(currentPage);
  let totalPages = meta?.pagination?.pageCount || 1;

  // If requested page is beyond total pages (e.g., stale link), clamp and refetch
  if (currentPage > totalPages && totalPages > 0) {
    currentPage = totalPages;
    ({ posts, meta } = await getBlogPosts(currentPage));
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
      <section className={styles.resourcesPage}>
        <div className="container">
          <h1 className={styles.pageTitle}>Resources</h1>
          <p className={styles.pageSubtitle}>Browse our latest blog posts and insights.</p>

          <div className={styles.grid}>
            {posts.map((post) => (
              <Link key={post.id} href={`/${post.slug}`} className={styles.postCard}>
                {post.cover && (
                  <img
                    src={`https://login.louislawgroup.com${post.cover.url}`}
                    alt={post.title}
                    className={styles.postImage}
                  />
                )}
                <div className={styles.postContent}>
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  <p className={styles.postExcerpt}>{post.description}</p>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className={styles.pagination}>
              {/* Previous lnk */}
              {currentPage > 1 && (
                <Link
                  href={`/resources?page=${currentPage - 1}`}
                  className={styles.paginationLink}
                >
                  Previous
                </Link>
              )}

              {/* Page numbers with ellipses */}
              {paginationItems.map((item, idx) =>
                item === "..." ? (
                  <span key={idx} className={styles.paginationDots}>…</span>
                ) : (
                  <Link
                    key={item}
                    href={`/resources?page=${item}`}
                    className={`${styles.paginationLink} ${
                      currentPage === item ? styles.active : ""
                    }`}
                  >
                    {item}
                  </Link>
                )
              )}

              {/* Next link */}
              {currentPage < totalPages && (
                <Link
                  href={`/resources?page=${currentPage + 1}`}
                  className={styles.paginationLink}
                >
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