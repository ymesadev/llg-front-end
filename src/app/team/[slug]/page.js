// ISR: serve from cache, regenerate in background every hour
export const revalidate = 3600;

import Layout from "../../components/Layout/Layout";
import styles from "./page.module.css";

const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://login.louislawgroup.com';
const makeAbs = (u) => {
  if (!u || typeof u !== 'string') return '';
  if (u.includes('..')) return '';
  if (/^https?:\/\//i.test(u)) return u;
  const rel = u.startsWith('/') ? u : `/${u}`;
  return `${STRAPI_BASE}${rel}`;
};

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';
  try {
    const res = await fetch(
      `${STRAPI_BASE}/api/team-pages?filters[Slug][$eq]=${encodeURIComponent(slug)}&fields[0]=title`,
      { next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const json = await res.json();
      const item = json?.data?.[0];
      const title = (item?.attributes || item)?.title;
      if (title) return { title: `${title} | Louis Law Group` };
    }
  } catch {}
  return { title: 'Louis Law Group' };
}

// ✅ Generate Static Paths for All Attorneys
export async function generateStaticParams() {
  try {
    const res = await fetch(`${STRAPI_BASE}/api/team-pages?fields[]=Slug&pagination[limit]=1000`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error("Failed to fetch team page slugs");

    const data = await res.json();

    return data.data.map((page) => ({
      slug: page.Slug,
    }));
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

// ✅ Fetch and Render Attorney Page
export default async function TeamPage(props) {
  const params = await props.params;
  const slug = params.slug;
  const apiUrl = `${STRAPI_BASE}/api/team-pages?filters[Slug][$eq]=${encodeURIComponent(slug)}&populate=*`;

  console.log("Fetching attorney page for slug:", slug, "API:", apiUrl);

  // Fetch the page content from Strapi
  const res = await fetch(apiUrl, { next: { revalidate: 3600 } });

  if (!res.ok) {
    return (
      <Layout>
        <div className={styles.error}>
          <h1>404 - Attorney Page Not Found</h1>
          <p>The attorney page you are looking for does not exist.</p>
        </div>
      </Layout>
    );
  }

  const data = await res.json();
  const entity = Array.isArray(data?.data) && data.data[0] ? data.data[0] : null;
  const page = entity ? (entity.attributes || entity) : null;

  if (!page) {
    return (
      <Layout>
        <div className={styles.error}>
          <h1>404 - Attorney Page Not Found</h1>
          <p>The attorney page you are looking for does not exist.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className={styles.teamPage}>
        <div className="container">
          <div className="column-2a">
            {/* ✅ Left Column: Attorney Image */}
            <div>
              {(() => {
                // Try common Strapi v4 shapes
                const imgUrl =
                  page?.Image?.data?.attributes?.url ||
                  page?.Image?.Image?.url ||
                  page?.Image?.url ||
                  null;
                const altText =
                  page?.Image?.data?.attributes?.alternativeText ||
                  page?.Image?.alt ||
                  page?.Title ||
                  page?.title ||
                  'Attorney';
                return imgUrl ? (
                  <img src={makeAbs(imgUrl)} alt={altText} className={styles.teamImage} />
                ) : null;
              })()}
            </div>

            {/* ✅ Right Column: Attorney Details */}
            <div>
              <h1 className={styles.title}>{page.Title || page.title}</h1>
              <p className={styles.description}>
                {typeof page.Description === 'string'
                  ? page.Description
                  : Array.isArray(page.Description)
                  ? page.Description.map((b) => b?.children?.[0]?.text || '').join('\n')
                  : page.description || ''}
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
