import Layout from "../components/Layout/Layout";
import styles from "./resources.module.css";
import Link from "next/link";

export const revalidate = 60; // ISR: Refresh every 60 seconds

export async function getBlogPosts() {
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const apiUrl = `${strapiURL}/api/articles?populate=cover&fields[]=title&fields[]=slug&fields[]=description`;
  
  try {
    const res = await fetch(apiUrl, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Failed to fetch blog posts");
    
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("❌ Error fetching blog posts:", error);
    return [];
  }
}

export default async function ResourcesPage() {
  const blogPosts = await getBlogPosts();

  return (
    <Layout>
      <section className={styles.resourcesPage}>
        <div className="container">
          <h1 className={styles.pageTitle}>Resources</h1>
          <p className={styles.pageSubtitle}>Browse our latest blog posts and insights.</p>

          <div className={styles.grid}>
            {blogPosts.length > 0 ? (
              blogPosts.map((post) => (
                <Link key={post.id} href={`${post.slug}`} className={styles.postCard}>
                  {/* ✅ Display Feature Image */}
                  {post.cover && (
                    <img
                      src={`https://login.louislawgroup.com${post.cover.url}`}
                      alt={post.title}
                      className={styles.postImage}
                    />
                  )}
                  {/* ✅ Display Blog Title & Excerpt */}
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
        </div>
      </section>
    </Layout>
  );
}