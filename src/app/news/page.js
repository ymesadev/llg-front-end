import Layout from "../components/Layout/Layout";
import Link from "next/link";
import styles from "./news.module.css";
import { fetchRecentArticles, SITE } from "../news-helpers";

export const revalidate = 300;

export const metadata = {
  title: "News | Louis Law Group",
  description:
    "Timely Florida legal news and analysis from Louis Law Group — property insurance, warranty and vehicle service contracts, contract disputes, landlord-tenant, and consumer protection.",
  alternates: { canonical: "https://www.louislawgroup.com/news" },
  openGraph: {
    title: "News | Louis Law Group",
    description:
      "Timely Florida legal news and analysis from Louis Law Group.",
    url: "https://www.louislawgroup.com/news",
  },
};

function fmtDate(d) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default async function NewsPage() {
  let articles = [];
  try {
    // Newest-first by genuine createdAt; the trend/news articles sort to the top.
    articles = await fetchRecentArticles({ sinceHours: null, limit: 300 });
  } catch (e) {
    articles = [];
  }

  return (
    <Layout>
      <section className={styles.page}>
        <div className="container">
          <div className={styles.header}>
            <span className={styles.eyebrow}>Updated Daily</span>
            <h1 className={styles.pageTitle}>News</h1>
            <p className={styles.pageSubtitle}>
              Timely Florida legal news and analysis — property insurance, warranty
              and vehicle service contracts, contract disputes, landlord-tenant, and
              consumer protection.
            </p>
          </div>

          {articles.length === 0 ? (
            <p className={styles.empty}>New articles are on the way. Check back soon.</p>
          ) : (
            <ul className={styles.grid}>
              {articles.map((a) => {
                const href = a.loc.startsWith(SITE) ? a.loc.slice(SITE.length) : a.loc;
                return (
                  <li key={a.loc} className={styles.card}>
                    <Link href={href} className={styles.cardLink}>
                      {a.published && (
                        <span className={styles.date}>{fmtDate(a.published)}</span>
                      )}
                      <h2 className={styles.cardTitle}>{a.title}</h2>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </Layout>
  );
}
