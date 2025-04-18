// src/app/components/Layout/Layout.js

import Head from "next/head"; // Import Next.js Head component
import styles from "./Layout.module.css"; // Ensure the path is correct

export default function Layout({ children, seo = {} }) {
  return (
    <div>
      {/* SEO Metadata */}
      <Head>
        <title>{seo.SEO_Title || "Default Title"}</title>
        <meta
          name="description"
          content={seo.MetaDescription || "Default meta description"}
        />
      </Head>

      {/* Main Content */}
      <main className={styles.mainContent}>{children}</main>

      {/* Footer */}
    </div>
  );
}
