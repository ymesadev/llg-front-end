// app/resources/page.tsx  (or wherever your ResourcesPage lives)

import Layout from "../components/Layout/Layout";
import styles from "./resources.module.css";
import Link from "next/link";
import Results from "../components/Results/Results";
import Steps from "../components/Steps/Steps";
import Contact from "../components/Contact/ContactSection";

export const revalidate = 60; // ISR: Refresh every 60 seconds

// ─── HELPER: build [1,2,…,9,10,11,…,101,102] ───────────────────────────────
function getPaginationRange({
  totalPages,
  currentPage,
  siblingCount = 1,
  boundaryCount = 2,
}: {
  totalPages: number;
  currentPage: number;
  siblingCount?: number;
  boundaryCount?: number;
}): (number | '...')[] {
  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const totalNumbers = boundaryCount * 2 + siblingCount * 2 + 3;
  if (totalPages <= totalNumbers) {
    return range(1, totalPages);
  }

  const result: (number | '...')[] = [];
  const startPages = range(1, boundaryCount);
  const endPages = range(totalPages - boundaryCount + 1, totalPages);

  const siblingsStart = Math.max(currentPage - siblingCount, boundaryCount + 2);
  const siblingsEnd   = Math.min(currentPage + siblingCount, totalPages - boundaryCount - 1);

  result.push(...startPages);

  if (siblingsStart > boundaryCount + 2) {
    result.push('...');
  } else if (siblingsStart === boundaryCount + 2) {
    result.push(boundaryCount + 1);
  }

  result.push(...range(siblingsStart, siblingsEnd));

  if (siblingsEnd < totalPages - boundaryCount - 1) {
    result.push('...');
  } else if (siblingsEnd === totalPages - boundaryCount - 1) {
    result.push(totalPages - boundaryCount);
  }

  result.push(...endPages);

  return result;
}

// ─── DATA FETCHING ────────────────────────────────────────────────────────────
export async function getBlogPosts(page = 1) {
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const apiUrl = `${strapiURL}/api/articles?populate=cover&fields[]=title&fields[]=slug&fields[]=description&sort[0]=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=20`;
  try {
    const res = await fetch(apiUrl, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Failed to fetch blog posts");
    const data = await res.json();
    return { posts: data.data, meta: data.meta };
  } catch (error) {
    console.error("❌ Error fetching blog posts:", error);
    return { posts: [], meta: null };
  }
}

// ─── PAGE COMPONENT ──────────────────────────────────────────────────────────
export default async function ResourcesPage({ searchParams }) {
  const currentPage = searchParams?.page ? parseInt(searchParams.page) : 1;
  const { posts, meta } = await getBlogPosts(currentPage);
  const totalPages = meta?.pagination?.pageCount || 1;
  const paginationRange = getPaginationRange({
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
              <Link
                key={post.id}
                href={`/${post.slug}`}
                className={styles.postCard}
              >
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
              {/* Previous */}
              {currentPage > 1 && (
                <Link
                  href={`/resources?page=${currentPage - 1}`}
                  className={styles.paginationLink}
                >
                  Previous
                </Link>
              )}

              {/* Page Buttons / Ellipses */}
              {paginationRange.map((item, idx) =>
                item === '...' ? (
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

              {/* Next */}
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