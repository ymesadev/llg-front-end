import Layout from "../components/Layout/Layout";
import Link from "next/link";
import styles from "./news.module.css";

export const revalidate = 300;

// Authoritative newsjacking article list (from tp_articles), published to Strapi public uploads.
const MANIFEST = "https://login.louislawgroup.com/uploads/trend-news.json";

export const metadata = {
  title: "News | Louis Law Group",
  description:
    "Original Florida legal reporting and analysis from Louis Law Group — insurance, warranty and vehicle service contracts, contract disputes, landlord-tenant, and consumer protection.",
  alternates: { canonical: "https://www.louislawgroup.com/news" },
  openGraph: {
    title: "News | Louis Law Group",
    description: "Original Florida legal reporting and analysis from Louis Law Group.",
    url: "https://www.louislawgroup.com/news",
  },
};

function fmtDate(d) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  } catch {
    return "";
  }
}

// Manifest lives in a shared Strapi /uploads bucket -> treat as untrusted. Reconstruct a same-origin
// path from the slug; reject anything that isn't a plain slug (blocks javascript:/data:/external URLs).
function safeHref(item) {
  const slug = String(item?.slug || "").replace(/^\/+/, "");
  if (!/^[a-z0-9][a-z0-9/_-]*$/i.test(slug)) return null;
  return `/${slug}`;
}

async function getNews() {
  try {
    const res = await fetch(MANIFEST, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const j = await res.json();
    const raw = Array.isArray(j.items) ? j.items : [];
    return raw.map((it) => ({ ...it, href: safeHref(it) })).filter((it) => it.href);
  } catch {
    return [];
  }
}

export default async function NewsPage() {
  const items = await getNews();
  const lead = items[0];
  const secondary = items.slice(1, 5);
  const more = items.slice(5);

  return (
    <Layout>
      <section className={styles.page}>
        <div className="container">
          <div className={styles.topbar}>
            <div className={styles.brandRow}>
              <span className={styles.brandTag}>Louis Law Group</span>
              <h1 className={styles.title}>News</h1>
            </div>
            <span className={styles.tagline}>Florida legal news &amp; analysis</span>
          </div>

          {items.length === 0 ? (
            <div className={styles.empty}>
              <h2>Fresh coverage is on the way.</h2>
              <p>Our newsroom is preparing its next stories. Check back shortly.</p>
            </div>
          ) : (
            <>
              <div className={secondary.length ? styles.top : styles.topSolo}>
                {lead && (
                  <Link href={lead.href} className={styles.hero}>
                    {lead.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={lead.image} alt="" className={styles.heroImg} loading="eager" />
                    )}
                    <div className={styles.heroOverlay}>
                      <span className={styles.heroSection}>{lead.section}</span>
                      <h2 className={styles.heroTitle}>{lead.title}</h2>
                      {lead.dek && <p className={styles.heroDek}>{lead.dek}</p>}
                    </div>
                  </Link>
                )}

                {secondary.length > 0 && (
                  <aside className={styles.rail}>
                    {secondary.map((a) => (
                      <Link key={a.slug} href={a.href} className={styles.railItem}>
                        {a.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={a.image} alt="" className={styles.railThumb} loading="lazy" />
                        )}
                        <div className={styles.railBody}>
                          <span className={styles.railSection}>{a.section}</span>
                          <h3 className={styles.railTitle}>{a.title}</h3>
                        </div>
                      </Link>
                    ))}
                  </aside>
                )}
              </div>

              {more.length > 0 && (
                <>
                  <div className={styles.sectionHead}>
                    <span>More Stories</span>
                  </div>
                  <div className={styles.grid}>
                    {more.map((a) => (
                      <Link key={a.slug} href={a.href} className={styles.card}>
                        {a.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={a.image} alt="" className={styles.cardImg} loading="lazy" />
                        )}
                        <div className={styles.cardBody}>
                          <span className={styles.cardSection}>{a.section}</span>
                          <h3 className={styles.cardTitle}>{a.title}</h3>
                          <span className={styles.cardDate}>{fmtDate(a.published)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
