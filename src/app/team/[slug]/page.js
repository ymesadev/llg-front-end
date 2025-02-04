import Layout from "../../components/Layout/Layout";
import styles from "./page.module.css";

export const revalidate = 60; // ISR: Revalidate every 60 seconds

// ✅ **Generate Static Paths for All Attorneys**
export async function generateStaticParams() {
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  try {
    const res = await fetch(`${strapiURL}/api/team-pages?fields[]=Slug&pagination[limit]=1000`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch team page slugs");

    const data = await res.json();

    return data.data.map((page) => ({
      slug: page.Slug, // Generate paths for each attorney slug
    }));
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

// ✅ **Fetch and Render Attorney Page**
export default async function TeamPage({ params }) {
  const slug = params.slug;
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const apiUrl = `${strapiURL}/api/team-pages?filters[Slug][$eq]=${slug}&populate=*`;

  console.log("Fetching attorney page for slug:", slug, "API:", apiUrl);

  // Fetch the page content from Strapi
  const res = await fetch(apiUrl, { cache: "no-store" });

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
  if (data.data.length === 0) {
    return (
      <Layout>
        <div className={styles.error}>
          <h1>404 - Attorney Page Not Found</h1>
          <p>The attorney page you are looking for does not exist.</p>
        </div>
      </Layout>
    );
  }

  const page = data.data[0];

  return (
    <Layout>
      <section className={styles.teamPage}>
        <div className="container">
          <div className="column-2a">
            {/* ✅ Left Column: Attorney Image */}
            <div>
              <img src={page.Image.url} alt={page.Image.alt || page.Title} className={styles.teamImage} />
            </div>

            {/* ✅ Right Column: Attorney Details */}
            <div>
              <h1 className={styles.title}>{page.Title}</h1>
              <p className={styles.description}>{page.Description}</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}