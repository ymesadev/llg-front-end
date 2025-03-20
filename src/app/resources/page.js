import Layout from "../components/Layout/Layout";
import styles from "./resources.module.css";
import Link from "next/link";
import Results from "../components/Results/Results";
import Steps from "../components/Steps/Steps";
import Contact from "../components/Contact/ContactSection";

export const revalidate = 60; // ISR: Refresh every 60 seconds

// Function to fetch blog posts with pagination (20 per page)
export async function getBlogPosts(page = 1) {
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  // Build API URL with pagination, sorting, and field selection
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

// The page component uses searchParams (for App Router) to get the current page number
export default async function ResourcesPage({ searchParams }) {
  const currentPage = searchParams?.page ? parseInt(searchParams.page) : 1;
  const { posts, meta } = await getBlogPosts(currentPage);
  const totalPages = meta?.pagination?.pageCount || 1;

  return (
    <Layout>
      <section className={styles.resourcesPage}>
        <div className="container">
          <h1 className={styles.pageTitle}>Resources</h1>
          <p className={styles.pageSubtitle}>Browse our latest blog posts and insights.</p>

          <div className={styles.grid}>
            {posts.length > 0 ? (
              posts.map((post) => (
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
              ))
            ) : (
              <p className={styles.noPosts}>No blog posts available.</p>
            )}
          </div>

          {/* Pagination Links */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              {currentPage > 1 && (
                <Link href={`/resources?page=${currentPage - 1}`} className={styles.paginationLink}>
                  Previous
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => (
                <Link
                  key={i}
                  href={`/resources?page=${i + 1}`}
                  className={`${styles.paginationLink} ${currentPage === i + 1 ? styles.active : ""}`}
                >
                  {i + 1}
                </Link>
              ))}
              {currentPage < totalPages && (
                <Link href={`/resources?page=${currentPage + 1}`} className={styles.paginationLink}>
                  Next
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
      <Results />
      <Steps />
      <Contact />
    </Layout>
  );
}
