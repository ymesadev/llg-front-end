import Layout from "../components/Layout/Layout";
import Link from "next/link";
import styles from "./news.module.css";

export const revalidate = 300;

// Authoritative newsjacking article list (from tp_articles), published to Strapi public uploads.
// The /news page reads ONLY this, so blog / programmatic-SEO pages never appear here.
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
    return new Date(d).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

// The manifest lives in a shared Strapi /uploads bucket, so treat it as untrusted input.
// Never render an href from the manifest directly: reconstruct a same-origin path from the slug
// and reject anything that isn't a plain [a-z0-9-_] slug (blocks javascript:/data:/external URLs).
function safeHref(item) {
  const slug = String(item?.slug || "").replace(/^\/+/, "");
  // must start alphanumeric, then only slug-safe chars. No ':' (blocks javascript:/data:/http:),
  // no '.' (blocks external hosts), no whitespace/control chars. Trailing '-' is fine.
  if (!/^[a-z0-9][a-z0-9/_-]*$/i.test(slug)) return null;
  return `/${slug}`;
}

async function getNews() {
  try {
    const res = await fetch(MANIFEST, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const j = await res.json();
    const raw = Array.isArray(j.items) ? j.items : [];
    // attach a validated href and drop any item whose slug isn't a safe same-origin path
    return raw
      .map((it) => ({ ...it, href: safeHref(it) }))
      .filter((it) => it.href);
  } catch {
    return [];
  }
}

export default async function NewsPage() {
  const items = await getNews();
  const [lead, ...rest] = items;

  return (
    <Layout>
      <section className={styles.page}>
        <div className="container">
          <header className={styles.masthead}>
            <div>
              <span className={styles.kicker}>Louis Law Group Newsroom</span>
              <h1 className={styles.title}>News</h1>
            </div>
            <p className={styles.tagline}>
              Original Florida legal reporting and analysis — insurance, warranty and
              vehicle service contracts, contract disputes, and landlord-tenant.
            </p>
          </header>

          {items.length === 0 ? (
            <div className={styles.empty}>
              <h2>Fresh coverage is on the way.</h2>
              <p>Our newsroom is preparing its next stories. Check back shortly.</p>
            </div>
          ) : (
            <>
              {lead && (
                <Link href={lead.href} className={styles.lead}>
                  {lead.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={lead.image} alt="" className={styles.leadImg} loading="eager" />
                  )}
                  <div className={styles.leadBody}>
                    <span className={styles.leadSection}>{lead.section}</span>
                    <h2 className={styles.leadTitle}>{lead.title}</h2>
                    {lead.dek && <p className={styles.leadDek}>{lead.dek}</p>}
                    <span className={styles.meta}>
                      {fmtDate(lead.published)} · Read the full story →
                    </span>
                  </div>
                </Link>
              )}

              {rest.length > 0 && (
                <div className={styles.grid}>
                  {rest.map((a) => (
                    <Link key={a.slug} href={a.href} className={styles.card}>
                      {a.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={a.image} alt="" className={styles.cardImg} loading="lazy" />
                      )}
                      <div className={styles.cardBody}>
                        <span className={styles.cardSection}>{a.section}</span>
                        <h3 className={styles.cardTitle}>{a.title}</h3>
                        {a.dek && <p className={styles.cardDek}>{a.dek}</p>}
                        <span className={styles.cardDate}>{fmtDate(a.published)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
