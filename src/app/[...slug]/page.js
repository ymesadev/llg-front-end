import Layout from "../components/Layout/Layout";
import styles from "./page.module.css";
import HeroForm from "../components/Hero/components/HeroForm";
import ServicesCarousel from "../components/ServicesCarousel/ServicesCarousel";
import Results from "../components/Results/Results";
import Steps from "../components/Steps/Steps";
import Contact from "../components/Contact/ContactSection";
import ReactMarkdown from "react-markdown";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import { renderContentBlocks, processHeroContent, processSectionsContent } from "../utils/contentFormatter";

// 1) Allow new slugs at runtime (fallback):
export const dynamicParams = true;

// Disable static prerendering: fetch data at request time
export const dynamic = 'force-dynamic';

// 2) Keep revalidate if you want ISR for existing pages
export const revalidate = 60; // Revalidate existing pages every 60s

// ✅ Fetch and Render Page Content
export default async function Page({ params }) {
  const slugArray = params.slug || [];
  const slug = slugArray.join("/");

  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  let apiUrl;
  let isAttorneyPage = false;
  let isArticlePage = false;
  let isJobPage = false;
  let isFaqsPage = false;

  try {
    const attorneyRes = await fetch(
      `${strapiURL}/api/team-pages?fields[]=Slug&pagination[limit]=1000`,
      { next: { revalidate: 60 } }
    );
    const articleRes = await fetch(
      `${strapiURL}/api/articles?fields[]=slug&pagination[pageSize]=22000`,
      { next: { revalidate: 60 } }
    );
    const jobRes = await fetch(
      `${strapiURL}/api/jobs?fields[]=Slug&pagination[limit]=1000`,
      { next: { revalidate: 60 } }
    );
    const faqsRes = await fetch(
      `${strapiURL}/api/faqs-and-legals?fields[]=slug&pagination[limit]=1000`,
      { next: { revalidate: 60 } }
    );

    const attorneyData = await attorneyRes.json();
    const articleData = await articleRes.json();
    const jobData = await jobRes.json();
    const faqsData = await faqsRes.json();

    // Now define the slug arrays
    const attorneySlugs = attorneyData.data.map((attorney) => attorney.Slug);
    const articleSlugs = articleData.data.map((article) => article.slug);
    const jobSlugs = jobData.data.map((job) => job.Slug);
    const faqsSlugs = faqsData.data.map((faq) =>
      faq.attributes && faq.attributes.slug ? faq.attributes.slug : faq.slug
    );

    // Decide which type of page it is
    if (attorneySlugs.includes(slug)) {
      isAttorneyPage = true;
    } else if (articleSlugs.includes(slug)) {
      isArticlePage = true;
    } else if (jobSlugs.includes(slug)) {
      isJobPage = true;
    } else if (faqsSlugs.includes(slug)) {
      isFaqsPage = true;
    }
  } catch (error) {
    console.error("Error fetching slugs:", error);
  }

  if (isAttorneyPage) {
    apiUrl = `${strapiURL}/api/team-pages?filters[Slug][$eq]=${slug}&populate=Image.Image`;
  } else if (isArticlePage) {
    apiUrl = `${strapiURL}/api/articles?filters[slug][$eq]=${slug}&populate=blocks.file&populate=cover`;
  } else if (isJobPage) {
    apiUrl = `${strapiURL}/api/jobs?filters[Slug][$eq]=${slug}&populate=block`;
  } else if (isFaqsPage) {
    apiUrl = `${strapiURL}/api/faqs-and-legals?filters[slug][$eq]=${slug}&populate=*`;
  } else {
    const childSlug = slugArray[slugArray.length - 1];
    const parentSlug = slugArray.length > 1 ? slugArray.slice(0, -1).join("/") : null;
    const buildBase = (withParent) => {
      if (withParent) {
        const cleanParentSlug = (parentSlug ?? '').replace(/^\/+|\/+$/g, '');
        return (
          `${strapiURL}/api/pages?filters[Slug][$eq]=${childSlug}` +
          `&filters[parent_page][URL][$eq]=/${cleanParentSlug}`
        );
      }
      return `${strapiURL}/api/pages?filters[Slug][$eq]=${childSlug}`;
    };
    const base = buildBase(!!parentSlug);
    // Stable single request: broad populate + newest first
    apiUrl = `${base}&populate=*&sort=updatedAt:desc`;
  }

  console.log("🔍 Fetching page for slug:", slug, "API:", apiUrl);
  // Single fetch (stable)
  let res;
  try {
    res = await fetch(apiUrl, { next: { revalidate: 60 } });
  } catch (e) {
    console.error('❌ Fetch failed for', apiUrl, e);
  }

  if (!res || !res.ok) {
    return (
      <Layout>
        <div className={styles.error}>
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
        </div>
      </Layout>
    );
  }

  const data = await res.json();
  if (!data || !Array.isArray(data.data) || data.data.length === 0) {
    return (
      <Layout>
        <div className={styles.error}>
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
        </div>
      </Layout>
    );
  }

  // Debug: log which IDs came back client-side (browser only)
  if (typeof window !== 'undefined') {
    try {
      console.log('🧭 Pages response IDs (sorted desc):', (data?.data || []).map(it => it?.id));
    } catch {}
  }
  // Prefer a page that actually contains a Hero Button if multiple are returned
  let page = null;
  if (data && Array.isArray(data.data) && data.data.length > 0) {
    const hasBtn = (p) => !!(Array.isArray(p?.Hero?.Button) && p.Hero.Button.length) || !!(Array.isArray(p?.Hero?.button) && p.Hero.button.length);
    page = data.data.find(hasBtn) || data.data[0];
  }
  if (!page) {
    return (
      <Layout>
        <div className={styles.error}>
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
        </div>
      </Layout>
    );
  }

  // Reverted: no extra repopulate; keep deep result null
  let __heroButtonFromDeep = null;
  const __hasInlineHeroBtn = false;
  const unwrap = (obj) => (obj && obj.attributes ? obj.attributes : obj);

  // Resolve Strapi media (handles multiple common shapes)
  const getMediaUrl = (media) => {
    const m = unwrap(media);
    if (!m) return null;
    // Direct url
    if (m.url) return m.url;
    // v4 relation: { data: { attributes: { url } } }
    if (m.data?.attributes?.url) return m.data.attributes.url;
    // Array forms
    if (Array.isArray(m) && m[0]?.url) return m[0].url;
    if (Array.isArray(m) && m[0]?.data?.attributes?.url)
      return m[0].data.attributes.url;
    return null;
  };

  // Helper: detect media URLs so we don't accidentally use them as button hrefs
  const isMediaUrl = (u) =>
    typeof u === "string" &&
    (/(\.(png|jpe?g|gif|webp|svg|mp4|mov|avi|m4v|mp3|wav)$)/i.test(u) || u.includes("/uploads/"));

  // Heuristic resolver for Featured Image field on Page content-type
  const resolveFeaturedImage = (p) => {
    const candidates = [
      p.FeaturedImage,
      p.featured_image,
      p.featuredImage,
      p.Hero?.featuredImage,
      p.Hero?.FeaturedImage,
      p.hero?.featuredImage,
      p.hero?.FeaturedImage,
    ].filter(Boolean);
    for (const c of candidates) {
      const url = getMediaUrl(c);
      if (url) {
        const alt =
          unwrap(c)?.alternativeText ||
          unwrap(c)?.alt ||
          p.Hero?.title ||
          p.title ||
          "Featured";
        return { url, alt };
      }
    }
    return null;
  };

  // Heuristic resolver for a Button component on Page content-type
  const resolveHeroButton = (p) => {
    const pickFirst = (x) => (Array.isArray(x) ? x[0] : x);
    const candidates = [
      pickFirst(p?.Hero?.button), // lower-case first — most common in Strapi
      pickFirst(p?.Hero?.Button),
      Array.isArray(p?.Hero?.buttons) ? p.Hero.buttons[0] : null,
      pickFirst(p.Button),
      pickFirst(p.button),
      pickFirst(p.button_component),
      pickFirst(p.ctaButton),
      pickFirst(p.cta_button),
      pickFirst(p.cta),
    ].filter(Boolean);

    const normalize = (btn) => {
      const b = unwrap(btn);
      if (!b) return null;
      // Accept common label/text keys (case-insensitive variants)
      const label =
        b.label ??
        b.text ??
        b.title ??
        b.name ??
        b.Text ?? // capitalized Strapi field as in screenshot
        "Learn more";
      // Accept common href/url keys (case-insensitive variants)
      const href =
        b.href ??
        b.url ??
        b.path ??
        b.to ??
        b.URL ?? // capitalized URL if used
        "/";
      const target = b.target || (href?.startsWith("http") ? "_blank" : "_self");
      const variant = b.variant || b.style || b.type || "gray";
      return { label, href, target, variant };
    };

    for (const c of candidates) {
      const n = normalize(c);
      // Guard: valid text and a non-empty href
      if (n && typeof n.href === "string" && n.href.length > 0) return n;
    }
    return null;
  };

  // Generic scan: find first array/object under Hero that looks like a button { Text/label/title, url/href }
  const scanHeroForButton = (hero) => {
    if (!hero || typeof hero !== 'object') return null;

    const getLabel = (o) => o?.Text || o?.text || o?.label || o?.title || null;

    // Direct candidates if hero itself is the button object
    const directHref = hero?.url || hero?.href || hero?.URL;
    const directLabel = getLabel(hero);
    if (directHref && !isMediaUrl(directHref) && directLabel) {
      return { href: directHref, label: directLabel };
    }

    // Only scan CTA-like keys to avoid picking up media
    const keys = Object.keys(hero).filter((k) => /(button|buttons|cta|ctas|link|links)/i.test(k));
    for (const k of keys) {
      const v = hero[k];
      if (!v) continue;
      // Case 1: array of objects (repeatable component)
      if (Array.isArray(v) && v.length && typeof v[0] === 'object') {
        const cand = v[0];
        const href = cand?.url || cand?.href || cand?.URL;
        const label = getLabel(cand);
        if (href && !isMediaUrl(href) && label) return { href, label };
      }
      // Case 2: nested object
      if (!Array.isArray(v) && typeof v === 'object') {
        const href = v?.url || v?.href || v?.URL;
        const label = getLabel(v);
        if (href && !isMediaUrl(href) && label) return { href, label };
        // Look one level deeper for arrays inside nested object
        for (const vv of Object.values(v)) {
          if (Array.isArray(vv) && vv.length && typeof vv[0] === 'object') {
            const cand = vv[0];
            const href2 = cand?.url || cand?.href || cand?.URL;
            const label2 = getLabel(cand);
            if (href2 && !isMediaUrl(href2) && label2) return { href: href2, label: label2 };
          }
        }
      }
    }
    return null;
  };

  // Scan the entire page object for the first thing that looks like a button {url|href, Text|text|label|title}
  const scanPageForButton = (obj, maxDepth = 4) => {
    const seen = new Set();
    const queue = [{ v: obj, d: 0 }];
    const getLabel = (o) => o?.Text || o?.text || o?.label || o?.title || 'Learn more';

    while (queue.length) {
      const { v, d } = queue.shift();
      if (!v || typeof v !== 'object' || seen.has(v) || d > maxDepth) continue;
      seen.add(v);

      // If v itself is a button-like object
      const href = v.url || v.href || v.URL;
      if (typeof href === 'string' && href.length) {
        return { href, label: getLabel(v) };
      }

      // If v is an array of objects, check first item
      if (Array.isArray(v) && v.length && typeof v[0] === 'object') {
        const cand = v[0];
        const href2 = cand?.url || cand?.href || cand?.URL;
        if (typeof href2 === 'string' && href2.length) {
          return { href: href2, label: getLabel(cand) };
        }
      }

      // Enqueue children
      for (const val of Object.values(v)) {
        if (val && typeof val === 'object') queue.push({ v: val, d: d + 1 });
      }
    }
    return null;
  };

  // Debug: log keys so we can see what's coming from Strapi in server logs
  console.log("🔎 Page keys:", Object.keys(page || {}));
  if (page?.Hero) console.log("🔎 Hero keys:", Object.keys(page.Hero));
  const __dbgBtn = resolveHeroButton(page);
  console.log("🔎 Resolved Button:", __dbgBtn);

  // -- RENDER LOGIC BELOW, UNCHANGED --
  return (
    <Layout>
      {isJobPage ? (
        <>
          <section className={styles.jobHero}>
            <div className="container">
              <h1 className={styles.jobTitle}>{page.Title}</h1>
              <Link
                href="/apply-for-this-position"
                className={styles.blueButton}
              >
                Apply Now
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3.5 20.5 17-17M9.5 3.5h11v11"></path>
                  </g>
                </svg>
              </Link>
            </div>
          </section>
          <section className={styles.jobDescription}>
            <div className="container">
              {page.block.map((block, index) => {
                if (block.__component === "shared.description") {
                  return (
                    <div key={index} className={styles.jobText}>
                      {block.Description.map((desc, j) => (
                        <p key={j}>{desc.children?.[0]?.text || ""}</p>
                      ))}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </section>
          <Steps />
          <Contact />
        </>
      ) : isArticlePage ? (
        <>
          <section className={styles.blogPost}>
            <div className="container blogContainer">
              <h1 className={styles.blogTitle}>{page.title}</h1>
              <p className={styles.blogDate}>
                <FaRegCalendarAlt className={styles.icon} />{" "}
                {new Date(page.createdAt).toLocaleDateString()} |{" "}
                <FaRegClock className={styles.icon} />{" "}
                {Math.ceil(page.blocks.length * 0.5)} min read
              </p>
              <div className={styles.socialShare}>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${
                    typeof window !== "undefined"
                      ? encodeURIComponent(window.location.href)
                      : ""
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook className={styles.socialIcon} />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    typeof window !== "undefined" ? window.location.href : ""
                  )}&text=${encodeURIComponent(page.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter className={styles.socialIcon} />
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                    typeof window !== "undefined" ? window.location.href : ""
                  )}&title=${encodeURIComponent(page.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin className={styles.socialIcon} />
                </a>
              </div>
              {page.cover && (
                <img
                  src={`https://login.louislawgroup.com${page.cover.url}`}
                  alt={page.title}
                  className={styles.blogImage}
                />
              )}
              <div className={styles.blogContent}>
                {page.blocks.map((block, index) => {
                  if (block.__component === "shared.rich-text") {
                    return (
                      <div key={index} className={styles.blogText}>
                        <ReactMarkdown>{block.body}</ReactMarkdown>
                      </div>
                    );
                  }
                  if (block.__component === "shared.media" && block.file?.url) {
                    const imageUrl = `https://login.louislawgroup.com${block.file.url}`;
                    return (
                      <div key={index} className={styles.blogImageContainer}>
                        <img
                          src={imageUrl}
                          alt={block.file.alternativeText || "Blog Image"}
                          className={styles.blogPostImage}
                        />
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </section>
          <Steps />
          <Contact />
        </>
      ) : isAttorneyPage ? (
        <>
          <section className={styles.attorneyHero}>
            <div className="container">
              <div className="column-2a">
                <div className={styles.leftColumn}>
                  <img
                    src={
                      page.Image?.Image?.url
                        ? `https://login.louislawgroup.com${page.Image.Image.url}`
                        : "/placeholder.jpg"
                    }
                    alt={page.Image?.Alt || "Attorney"}
                    className={styles.teamImage}
                  />
                  <h1 className={styles.attorneyTitle}>{page.title}</h1>
                </div>
                <div className={styles.rightColumn}>
                  <HeroForm />
                </div>
              </div>
            </div>
          </section>
          <section className={styles.attorneyBio}>
            <div className="container">
              <div className={styles.bioContainer}>
                <h2 className="bioHeading">Bio.</h2>
                {Array.isArray(page.Description) &&
                  page.Description.map((block, idx) => (
                    <p key={idx} className={styles.attorneyBioText}>
                      {block.children?.[0]?.text || ""}
                    </p>
                  ))}
              </div>
            </div>
          </section>
          <Results />
          <Steps />
          <Contact />
        </>
      ) : isFaqsPage ? (
        <>
          <section className={styles.faqHero}>
            <div className={styles.container}>
              {(() => {
                const faqTitle =
                  page.title ||
                  page.slug
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");
                return <h1 className={styles.faqTitle}>{faqTitle}</h1>;
              })()}
            </div>
          </section>
          <section className={styles.faqContent}>
            <div className={styles.container}>
              {page.blocks &&
                page.blocks.map((block, index) => {
                  if (block.__component === "shared.rich-text") {
                    return (
                      <div key={index} className={styles.faqText}>
                        <ReactMarkdown>{block.body}</ReactMarkdown>
                      </div>
                    );
                  }
                  return null;
                })}
            </div>
          </section>
          <Results />
          <Steps />
          <Contact />
        </>
      ) : (
        <>
          {page.Hero && (
            <section
              className={`${styles.darkBg} ${styles.fullHeight} ${styles.verticalCenter}`}
            >
              <div className="container">
                <div className="column-2a">
                  <div className={styles.leftColumn}>
                    {page.Hero.subtitle && (
                      <h3 className={styles.subtitle}>{page.Hero.subtitle}</h3>
                    )}
                    <h1 className={styles.title}>{page.Hero.title}</h1>
                    {Array.isArray(page.Hero.intro) &&
                      page.Hero.intro.map((block, index) => (
                        <p key={index} className={styles.intro}>
                          {block.children?.[0]?.text || ""}
                        </p>
                      ))}

                    {process.env.NODE_ENV !== 'production' && (
                      <script
                        dangerouslySetInnerHTML={{
                          __html: `
                            try {
                              window.__LLG_PAGE_DEBUG = {
                                heroKeys: ${JSON.stringify(Object.keys(page?.Hero || {}))},
                                hero: ${JSON.stringify(page?.Hero || {})},
                                pageId: ${JSON.stringify(page?.id || null)},
                                rootButton: ${JSON.stringify(page?.Button || null)},
                                rootbutton: ${JSON.stringify(page?.button || null)},
                                flatFields: ${JSON.stringify({
                                  hero_button_url: page?.hero_button_url || null,
                                  hero_cta_url: page?.hero_cta_url || null,
                                  hero_button: page?.hero_button || null,
                                  hero_cta: page?.hero_cta || null,
                                })},
                                apiUrlUsed: ${JSON.stringify(apiUrl)},
                                heroButtonFirst: ${JSON.stringify(((Array.isArray(page?.Hero?.Button) ? page.Hero.Button : Array.isArray(page?.Hero?.button) ? page.Hero.button : null) || [])[0] || null)}
                              };
                              console.log('🔍 __LLG_PAGE_DEBUG', window.__LLG_PAGE_DEBUG);
                            } catch (e) { console.warn('LLG debug inject failed', e); }
                          `,
                        }}
                      />
                    )}

                    {(() => {
                      // 1) Prefer root-level Button first (your new component at page.Button[0])
                      const rootBtnRaw = (Array.isArray(page?.Button) ? page.Button[0] : page?.Button)
                        || (Array.isArray(page?.button) ? page.button[0] : page?.button)
                        || null;

                      let href = rootBtnRaw?.url || rootBtnRaw?.URL || rootBtnRaw?.href || null;
                      let label = rootBtnRaw?.Text || rootBtnRaw?.text || rootBtnRaw?.title || rootBtnRaw?.label || null;
                      let source = href ? 'root-component' : null;

                      // 2) If not found at root, try explicit Hero component paths (both casings)
                      if (!href) {
                        const heroBtnRaw = (Array.isArray(page?.Hero?.Button) ? page.Hero.Button[0] : page?.Hero?.Button)
                          || (Array.isArray(page?.Hero?.button) ? page.Hero.button[0] : page?.Hero?.button)
                          || null;

                        href = heroBtnRaw?.url || heroBtnRaw?.URL || heroBtnRaw?.href || null;
                        label = label || heroBtnRaw?.Text || heroBtnRaw?.text || heroBtnRaw?.title || heroBtnRaw?.label || null;
                        if (href) source = 'hero-component';
                      }

                      // 3) Flat-field fallbacks (if component was private or not populated)
                      if (!href) {
                        href = page?.hero_button_url || page?.hero_cta_url || page?.hero_button || page?.hero_cta || null;
                        if (typeof href === 'object' && href !== null) href = href.url || href.href || null;
                        label = label || page?.hero_button_text || page?.hero_cta_text || page?.hero_button_label || page?.hero_cta_label || null;
                        if (href) source = 'flat-field';
                      }

                      // 4) Normalizer fallback
                      const fallbackBtn = href ? null : resolveHeroButton(page);

                      // 5) As a last resort, scan only the Hero (CTA-like keys) to avoid picking images
                      const scanned = href ? null : scanHeroForButton(page?.Hero);
                      if (!href && scanned?.href && !isMediaUrl(scanned.href)) {
                        href = scanned.href; label = label || scanned.label; source = 'hero-scan';
                      }

                      // Prefer inline Hero.Button first; use deep-fetched only if inline is missing
                      const deepHref = __heroButtonFromDeep?.href || null;
                      const deepLabel = __heroButtonFromDeep?.label || null;

                      let finalHref = href || deepHref || fallbackBtn?.href || '/free-case-evaluation';
                      let finalLabel = label || deepLabel || fallbackBtn?.label || 'See if you qualify';

                      // Normalize to start with "/" for internal links like "warranty"
                      if (finalHref && !finalHref.startsWith('http') && !finalHref.startsWith('/')) {
                        finalHref = '/' + finalHref;
                      }

                      // Never allow a media link to become the CTA href
                      if (finalHref && isMediaUrl(finalHref)) {
                        finalHref = fallbackBtn?.href || '/free-case-evaluation';
                        source = source || (fallbackBtn ? 'resolver' : 'fallback');
                      }

                      // Expose the found scanned button to the browser console for clarity.
                      if (typeof window !== 'undefined') console.log('🔎 scanned button:', scanned);
                      // Optional small log: show which source won
                      if (typeof window !== 'undefined') {
                        console.log('✅ Final hero href:', finalHref, 'label:', finalLabel, 'deep:', !!__heroButtonFromDeep, 'inlineHeroBtn:', __hasInlineHeroBtn, 'source:', source || (fallbackBtn ? 'resolver' : 'fallback'));
                      }

                      const isExternal = (finalHref || '').startsWith('http');
                      const className = styles.grayButton;

                      const Icon = () => (
                        <svg width={25} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3.5 20.5 17-17M9.5 3.5h11v11"></path>
                          </g>
                        </svg>
                      );

                      return isExternal ? (
                        <a href={finalHref} target="_blank" rel="noopener noreferrer" className={className}>
                          {finalLabel} <Icon />
                        </a>
                      ) : (
                        <Link href={finalHref} className={className}>
                          {finalLabel} <Icon />
                        </Link>
                      );
                    })()}
                  </div>
                  <div className={styles.rightColumn}>
                    {(() => {
                      const mediaObj = resolveFeaturedImage(page);
                      if (!mediaObj?.url) return null;
                      const base = process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://login.louislawgroup.com";
                      const src = mediaObj.url.startsWith("http") ? mediaObj.url : `${base}${mediaObj.url}`;
                      return (
                        <img
                          src={src}
                          alt={mediaObj.alt}
                          className={styles.featuredImage}
                          loading="eager"
                          style={{ maxWidth: "100%", width: "100%", height: "auto", objectFit: "contain" }}
                        />
                      );
                    })()}
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className={styles.Descriptionsection}>
            <div className={`container ${styles.contentContainer}`}>
              <div className={styles.mainContent}>
                <div className={styles.scrollableContent}>
                  {page.Sections?.title && (
                    <h2 className={styles.DescriptionTitle}>
                      {page.Sections.title}
                    </h2>
                  )}
                  {page.Sections?.subtitle && (
                    <h3 className={styles.Descriptionsubtitle}>
                      {page.Sections.subtitle}
                    </h3>
                  )}
                  {page.Sections && renderContentBlocks(processSectionsContent(page.Sections).body, styles)}
                  {(() => {
                    const rootBtnRaw = (Array.isArray(page?.Button) ? page.Button[0] : page?.Button)
                      || (Array.isArray(page?.button) ? page.button[0] : page?.button)
                      || null;

                    let href = rootBtnRaw?.url || rootBtnRaw?.URL || rootBtnRaw?.href || null;
                    let label = rootBtnRaw?.Text || rootBtnRaw?.text || rootBtnRaw?.title || rootBtnRaw?.label || 'See if you qualify';

                    if (href && !href.startsWith('http') && !href.startsWith('/')) {
                      href = '/' + href;
                    }

                    const isExternal = (href || '').startsWith('http');
                    const className = styles.blueButton;

                    const Icon = () => (
                      <svg width={25} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m3.5 20.5 17-17M9.5 3.5h11v11"></path>
                        </g>
                      </svg>
                    );

                    return isExternal ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
                        {label} <Icon />
                      </a>
                    ) : (
                      <Link href={href || '/free-case-evaluation'} className={className}>
                        {label} <Icon />
                      </Link>
                    );
                  })()}
                </div>
              </div>
            </div>
          </section>

          {Array.isArray(page.Services) && page.Services.length > 0 && (
            <ServicesCarousel services={page.Services} />
          )}

          <Results />
          <Steps />
          <Contact />
        </>
      )}
    </Layout>
  );
}