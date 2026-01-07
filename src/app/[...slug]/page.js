import Layout from "../components/Layout/Layout";
import styles from "./page.module.css";
import HeroForm from "../components/Hero/components/HeroForm";
import ServicesCarousel from "../components/ServicesCarousel/ServicesCarousel";
import Results from "../components/Results/Results";
import Steps from "../components/Steps/Steps";
import Contact from "../components/Contact/ContactSection";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import { renderContentBlocks, processHeroContent, processSectionsContent } from "../utils/contentFormatter";
import safeMediaUrl from '../../lib/media';
import Script from "next/script";

// Disable static prerendering: fetch data at request time
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const dynamicParams = true; // Allow dynamic params that weren't generated at build time
export const revalidate = 0; // dynamic routes ignore ISR; set to 0 to avoid build-time config collection issues

// Note: We do NOT export generateStaticParams here because that would force SSG mode.
// With dynamic = 'force-dynamic', the route will be server-rendered on demand.

// Sanitization schema that preserves <a> with class/href/target/rel and allows inline HTML rendering
const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), "a"],
  attributes: {
    ...(defaultSchema.attributes || {}),
    a: [
      ...(defaultSchema.attributes?.a || []),
      "href",
      "target",
      "rel",
      "className",
    ],
    p: [...(defaultSchema.attributes?.p || []), "className"],
  },
};

// react-markdown v9+: use a single urlTransform instead of transformImageUri/transformLinkUri
const mdUrlTransform = (url, key, node) => {
  try {
    // If this is an <img>, normalize the src via safeMediaUrl
    const tag = (node && (node.tagName || (node.type === 'element' ? node.tagName : ''))) || '';
    if (key === 'src' || tag === 'img') {
      return safeMediaUrl(url);
    }
    // Otherwise (links etc.), leave as-is
    return url;
  } catch {
    return url;
  }
};

// Server-side HTML rewrite to force blueButton class on the CTA link inside raw HTML strings (robust, with debug logging and SSR marker)
function injectBlueButtonClass(html) {
  if (typeof html !== 'string' || !html) return html;
  const URL = 'https://forms.louislawgroup.com/s/cmfkzvlq6001e684en1k5e2iy';
  const HREF_ESC = URL.replace(/\//g, '\\/');
  const HREF_RE = new RegExp(`(<a\\b[^>]*href=["']${HREF_ESC}["'][^>]*)(>)`, 'gi');
  const HAS_URL = new RegExp(`href=["']${HREF_ESC}["']`, 'i').test(html);
  const BEFORE_SNIPPET = HAS_URL ? (html.match(new RegExp(`.{0,80}href=["']${HREF_ESC}["'][^>]*>`, 'i'))?.[0] || '') : '';
  if (HAS_URL) {
    console.log('⚙️ [injectBlueButtonClass] BEFORE anchor snippet:', BEFORE_SNIPPET);
  } else {
    console.log('⚙️ [injectBlueButtonClass] No CTA URL found in this block.');
  }

  // 1) Strip any existing class attr (even empty) on matching <a ...>
  html = html.replace(
    new RegExp(`(<a\\b[^>]*href=["']${HREF_ESC}["'][^>]*?)\\sclass=(?:"[^"]*"|'[^']*'|[^\\s>]+)`, 'gi'),
    '$1'
  );
  // 2) Ensure class="blueButton"
  html = html.replace(
    new RegExp(`(<a\\b[^>]*href=["']${HREF_ESC}["'])(?![^>]*\\sclass=)`, 'gi'),
    '$1 class="blueButton"'
  );
  // 3) Ensure target/rel
  html = html.replace(
    new RegExp(`(<a\\b[^>]*href=["']${HREF_ESC}["'])(?![^>]*\\starget=)`, 'gi'),
    '$1 target="_blank"'
  );
  html = html.replace(
    new RegExp(`(<a\\b[^>]*href=["']${HREF_ESC}["'])(?![^>]*\\srel=)`, 'gi'),
    '$1 rel="noopener noreferrer"'
  );
  // 4) Normalize class=""
  html = html.replace(
    new RegExp(`(<a\\b[^>]*href=["']${HREF_ESC}["'][^>]*\\sclass=)("")`, 'gi'),
    '$1"blueButton"'
  );
  // 5) As a final guard, inject before closing >
  html = html.replace(HREF_RE, (m, pre, close) => {
    if (!/class=/i.test(pre)) pre += ' class="blueButton"';
    if (!/target=/i.test(pre)) pre += ' target="_blank"';
    if (!/rel=/i.test(pre)) pre += ' rel="noopener noreferrer"';
    // add a debug marker
    if (!/data-bluebutton-ssr=/i.test(pre)) pre += ' data-bluebutton-ssr="1"';
    return pre + close;
  });

  const AFTER_HAS_CLASS = new RegExp(`href=["']${HREF_ESC}["'][^>]*class=["'][^"']*blueButton`, 'i').test(html);
  const AFTER_SNIPPET = new RegExp(`.{0,120}href=["']${HREF_ESC}["'][^>]*>`, 'i').exec(html)?.[0] || '';
  if (HAS_URL) {
    console.log('⚙️ [injectBlueButtonClass] AFTER anchor snippet:', AFTER_SNIPPET);
    console.log('⚙️ [injectBlueButtonClass] Class applied?', AFTER_HAS_CLASS);
  }
  return html;
}

// ✅ Fetch and Render Page Content
export default async function Page({ params }) {
  // Log initial params for debugging
  console.log('🔍 [Page] Raw params received:', JSON.stringify(params));
  console.log('🔍 [Page] Params type:', typeof params, 'is Promise:', params instanceof Promise);
  
  // In Next.js 15, params might be a Promise and must be awaited
  let resolvedParams;
  try {
    if (params instanceof Promise) {
      resolvedParams = await params;
    } else {
      resolvedParams = params;
    }
    console.log('🔍 [Page] Resolved params:', JSON.stringify(resolvedParams));
  } catch (error) {
    console.error('❌ [Page] Error resolving params:', error);
    resolvedParams = params || {};
  }
  
  const { slug: maybeSlug = [] } = resolvedParams || {};
  const slugArray = Array.isArray(maybeSlug) ? maybeSlug : (typeof maybeSlug === 'string' ? [maybeSlug] : []);
  const slug = slugArray.join("/");
  
  console.log('🔍 [Page] Final slug:', slug, 'from array:', slugArray);

  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://login.louislawgroup.com";
  console.log('🔍 [Page] Strapi URL:', strapiURL, 'Env var set:', !!process.env.NEXT_PUBLIC_STRAPI_API_URL);
  let apiUrl;
  let isAttorneyPage = false;
  let isArticlePage = false;
  let isJobPage = false;
  let isFaqsPage = false;
  // --- SERVER-SIDE branch log ---
  console.log('🧭 Page type flags (server):', { slug, isAttorneyPage, isArticlePage, isJobPage, isFaqsPage });

  // ✅ Fast + accurate: check this exact slug per content type (no giant lists)
  try {
    const encSlug = encodeURIComponent(slug);

    const [articleCheckRes, attorneyCheckRes, jobCheckRes, faqsCheckRes] = await Promise.allSettled([
      fetch(`${strapiURL}/api/articles?filters[slug][$eq]=${encSlug}&fields[0]=slug`, { cache: 'no-store' }),
      fetch(`${strapiURL}/api/team-pages?filters[Slug][$eq]=${encSlug}&fields[0]=Slug`, { cache: 'no-store' }),
      fetch(`${strapiURL}/api/jobs?filters[Slug][$eq]=${encSlug}&fields[0]=Slug`, { cache: 'no-store' }),
      fetch(`${strapiURL}/api/faqs-and-legals?filters[slug][$eq]=${encSlug}&fields[0]=slug`, { cache: 'no-store' }),
    ]);

    const getOkJson = async (s) => (s.status === 'fulfilled' && s.value.ok) ? s.value.json() : null;

    const [articleCheck, attorneyCheck, jobCheck, faqsCheck] = await Promise.all([
      getOkJson(articleCheckRes),
      getOkJson(attorneyCheckRes),
      getOkJson(jobCheckRes),
      getOkJson(faqsCheckRes),
    ]);

    isArticlePage  = !!(articleCheck?.data?.length);
    isAttorneyPage = !isArticlePage && !!(attorneyCheck?.data?.length);
    isJobPage      = !isArticlePage && !isAttorneyPage && !!(jobCheck?.data?.length);
    isFaqsPage     = !isArticlePage && !isAttorneyPage && !isJobPage && !!(faqsCheck?.data?.length);
  } catch (error) {
    console.error("Error detecting page type:", error);
  }

  if (isAttorneyPage) {
    apiUrl = `${strapiURL}/api/team-pages?filters[Slug][$eq]=${encodeURIComponent(slug)}&populate=Image.Image`;
  } else if (isArticlePage) {
    // TEMP: populate everything to guarantee repeatable Button shows; we'll narrow after confirming apiId
    const base = `${strapiURL}/api/articles?filters[slug][$eq]=${encodeURIComponent(slug)}`;
    apiUrl = base + `&populate=*`;
  } else if (isJobPage) {
    apiUrl = `${strapiURL}/api/jobs?filters[Slug][$eq]=${encodeURIComponent(slug)}&populate=block`;
  } else if (isFaqsPage) {
    apiUrl = `${strapiURL}/api/faqs-and-legals?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`;
  } else {
    const childSlug = slugArray[slugArray.length - 1];
    const parentSlug = slugArray.length > 1 ? slugArray.slice(0, -1).join("/") : null;
    const buildBase = (withParent, useLowercase = false) => {
      const slugField = useLowercase ? 'slug' : 'Slug';
      const encChild = encodeURIComponent(childSlug || '');
      if (withParent) {
        const cleanParentSlug = (parentSlug ?? '').replace(/^\/+|\/+$/g, '');
        const encParent = encodeURIComponent(cleanParentSlug);
        return (
          `${strapiURL}/api/pages?filters[${slugField}][$eq]=${encChild}` +
          `&filters[parent_page][URL][$eq]=/${encParent}`
        );
      }
      return `${strapiURL}/api/pages?filters[${slugField}][$eq]=${encChild}`;
    };
    // Try uppercase first (default), then lowercase if that fails
    const base = buildBase(!!parentSlug, false);
    // Stable single request: broad populate + newest first
    apiUrl = `${base}&populate=*&sort=updatedAt:desc`;
  }

  console.log("🔍 Fetching page for slug:", slug, "API:", apiUrl);
  // Single fetch (stable) - using cache: 'no-store' for fully dynamic routes
  let res;
  let data = null;
  
  try {
    res = await fetch(apiUrl, { cache: 'no-store' });
  } catch (e) {
    console.error('❌ Fetch failed for', apiUrl, e);
    console.error('❌ Error details:', e.message, e.stack);
  }

  if (!res || !res.ok) {
    console.error('❌ API response not OK:', res?.status, res?.statusText, 'for slug:', slug);
    console.error('❌ Response headers:', res?.headers ? Object.fromEntries(res.headers.entries()) : 'no headers');
    return (
      <Layout>
        <div className={styles.error}>
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
        </div>
      </Layout>
    );
  }

  console.log('✅ API response OK:', res.status, res.statusText);
  data = await res.json();
  console.log('📦 API response data structure:', {
    hasData: !!data,
    hasDataArray: !!data?.data,
    dataArrayLength: Array.isArray(data?.data) ? data.data.length : 'not an array',
    dataKeys: data ? Object.keys(data) : 'no data',
    firstItemId: Array.isArray(data?.data) && data.data.length > 0 ? data.data[0]?.id : 'no items'
  });
  
  // If no data found with uppercase Slug, try lowercase slug (for pages only)
  if ((!data || !Array.isArray(data.data) || data.data.length === 0) && !isAttorneyPage && !isArticlePage && !isJobPage && !isFaqsPage) {
    console.log('🔄 Trying lowercase slug field for pages...');
    const childSlug = slugArray[slugArray.length - 1];
    const parentSlug = slugArray.length > 1 ? slugArray.slice(0, -1).join("/") : null;
    const buildBaseLowercase = (withParent) => {
      const encChild = encodeURIComponent(childSlug || '');
      if (withParent) {
        const cleanParentSlug = (parentSlug ?? '').replace(/^\/+|\/+$/g, '');
        const encParent = encodeURIComponent(cleanParentSlug);
        return (
          `${strapiURL}/api/pages?filters[slug][$eq]=${encChild}` +
          `&filters[parent_page][URL][$eq]=/${encParent}`
        );
      }
      return `${strapiURL}/api/pages?filters[slug][$eq]=${encChild}`;
    };
    const fallbackApiUrl = `${buildBaseLowercase(!!parentSlug)}&populate=*&sort=updatedAt:desc`;
    console.log('🔍 Fallback API URL:', fallbackApiUrl);
    
    try {
      const fallbackRes = await fetch(fallbackApiUrl, { cache: 'no-store' });
      if (fallbackRes && fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        console.log('📦 Fallback API response:', {
          dataArrayLength: Array.isArray(fallbackData?.data) ? fallbackData.data.length : 'not an array',
        });
        if (fallbackData && Array.isArray(fallbackData.data) && fallbackData.data.length > 0) {
          console.log('✅ Found data with lowercase slug field!');
          data = fallbackData;
          apiUrl = fallbackApiUrl; // Update for logging
        }
      }
    } catch (e) {
      console.error('❌ Fallback fetch failed:', e);
    }
  }
  
  if (!data || !Array.isArray(data.data) || data.data.length === 0) {
    console.error('❌ No data found for slug:', slug, 'after trying both uppercase and lowercase');
    console.error('❌ Final data structure:', JSON.stringify(data, null, 2));
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
  // Prefer a page that actually contains a Hero Button if multiple are returned (check attributes on v4 wrapper)
  let entity = null;
  if (data && Array.isArray(data.data) && data.data.length > 0) {
    const hasBtn = (p) =>
      !!(Array.isArray(p?.attributes?.Hero?.Button) && p.attributes.Hero.Button.length) ||
      !!(Array.isArray(p?.attributes?.Hero?.button) && p.attributes.Hero.button.length);
    entity = data.data.find(hasBtn) || data.data[0];
  }
  const __unwrap = (obj) => (obj && obj.attributes ? obj.attributes : obj);
  const page = __unwrap(entity);

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
    if (m.url) return safeMediaUrl(m.url);
    // v4 relation: { data: { attributes: { url } } }
    if (m.data?.attributes?.url) return safeMediaUrl(m.data.attributes.url);
    // Array forms
    if (Array.isArray(m) && m[0]?.url) return safeMediaUrl(m[0].url);
    if (Array.isArray(m) && m[0]?.data?.attributes?.url)
      return safeMediaUrl(m[0].data.attributes.url);
    return null;
  };

  // use shared safeMediaUrl helper from src/lib/media.js

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

  // Collect repeatable buttons from Article (supports common key variants, robust for Strapi v4)
  const getArticleButtons = (p) => {
    const unwrap = (obj) => (obj && obj.attributes ? obj.attributes : obj);
    const pickArray = (val) => {
      if (!val) return null;
      // handle relation shape { data: [...] }
      if (Array.isArray(val?.data)) return val.data;
      return Array.isArray(val) ? val : null;
    };
    const candidates = [
      pickArray(p?.buttons),
      pickArray(p?.Buttons),
      pickArray(p?.button),
      pickArray(p?.Button),
      // attributes wrapper (Strapi v4 default)
      pickArray(p?.attributes?.buttons),
      pickArray(p?.attributes?.Buttons),
      pickArray(p?.attributes?.button),
      pickArray(p?.attributes?.Button),
    ].filter(Boolean);

    const out = [];
    for (const arr of candidates) {
      for (const btn of arr) {
        const b = unwrap(btn) || {};
        // normalize fields
        let label = b.label ?? b.text ?? b.title ?? b.Text ?? 'See if you qualify';
        let href  = b.href  ?? b.url  ?? b.URL  ?? '';
        let target = b.target || (href && href.startsWith('http') ? '_blank' : '_self');
        if (!href) continue;
        if (!href.startsWith('http') && !href.startsWith('/')) href = '/' + href;
        out.push({ label, href, target });
      }
    }
    return out;
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

  // Tiny renderer for a row of buttons (Article repeatable buttons)
  const ArticleButtonsRow = ({ buttons }) => {
    if (!Array.isArray(buttons) || buttons.length === 0) return null;
    const RowIcon = () => (
      <svg width={25} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3.5 20.5 17-17M9.5 3.5h11v11"></path>
        </g>
      </svg>
    );
    const rowStyle = { margin: "16px 0", display: "flex", gap: "12px", flexWrap: "wrap" };
    return (
      <div style={rowStyle}>
        {buttons.map((b, i) => {
          const stableKey = b.href || b.label || `article-btn-${i}`;
          return (b.href || '').startsWith('http') ? (
            <a key={stableKey} href={b.href} target={b.target} rel={b.target === '_blank' ? 'noopener noreferrer' : undefined} className={`${styles?.blueButton ?? ''} blueButton`.trim()}>
              {b.label} <RowIcon />
            </a>
          ) : (
            <Link key={stableKey} href={b.href || '/'} className={`${styles?.blueButton ?? ''} blueButton`.trim()}>
              {b.label} <RowIcon />
            </Link>
          );
        })}
      </div>
    );
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
  if (typeof window !== 'undefined') {
    try {
      console.log('🧪 Article page keys (client):', Object.keys(page || {}));
      if (page && page.attributes) {
        console.log('🧪 Article page.attributes keys (client):', Object.keys(page.attributes || {}));
      }
    } catch {}
  }
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
                    <div key={`job-${index}`} className={styles.jobText}>
                      {block.Description.map((desc, j) => (
                        <p key={`job-${index}-p-${j}`}>{desc.children?.[0]?.text || ""}</p>
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
              <Script id="debug-article-buttons-present" strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    (function(){
                      try {
                        var p = window.__LLG_ARTICLE_PAGE = ${JSON.stringify({ title: page.title })};
                        console.log('🧪 Article page (title only):', p);
                      } catch(e){}
                    })();
                  `,
                }}
              />
              {/* Article repeatable buttons (below title) */}
              {(() => {
                const _btns = getArticleButtons(page);
                if (typeof window !== 'undefined') { try { console.log('🧪 Buttons resolved (top):', _btns); } catch(e){} }
                return <ArticleButtonsRow buttons={_btns} />;
              })()}
              <p className={styles.blogDate}>
                <FaRegCalendarAlt className={styles.icon} />{" "}
                {new Date(page.createdAt).toLocaleDateString()} |{" "}
                <FaRegClock className={styles.icon} />{" "}
                {Math.ceil(((Array.isArray(page.blocks) ? page.blocks.length : 0) * 0.5))} min read
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
              {page.cover?.url && (
                <img
                  src={safeMediaUrl(page.cover.url)}
                  alt={page.title}
                  className={styles.blogImage}
                />
              )}
              <div className={styles.blogContent}>
                {page.blocks.map((block, index) => {
                  if (block.__component === "shared.rich-text") {
                    return (
                      <div key={`rich-${index}`} className={styles.blogText} id={`cta-article-${index}`} data-cta-block-index={index}>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
                          urlTransform={mdUrlTransform}
                        >
                          {block.body}
                        </ReactMarkdown>
                      </div>
                    );
                  }
                  if (block.__component === "shared.media" && block.file?.url) {
                    const imageUrl = safeMediaUrl(block.file.url);
                    return (
                      <div key={`media-${index}`} className={styles.blogImageContainer}>
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
              {/* Article repeatable buttons (end of article) */}
              {(() => {
                const _btns = getArticleButtons(page);
                if (typeof window !== 'undefined') { try { console.log('🧪 Buttons resolved (bottom):', _btns); } catch(e){} }
                return <ArticleButtonsRow buttons={_btns} />;
              })()}
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
                        ? safeMediaUrl(page.Image.Image.url)
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
                    <p key={`attorney-desc-${idx}`} className={styles.attorneyBioText}>
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
                      <div key={`faq-${index}`} className={styles.faqText} id={`cta-faq-${index}`} data-cta-block-index={index}>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
                          urlTransform={mdUrlTransform}
                        >
                          {block.body}
                        </ReactMarkdown>
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
                        <p key={`intro-${index}`} className={styles.intro}>
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
                                pageId: ${JSON.stringify(typeof entity !== 'undefined' && entity ? entity.id : null)},
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
                      // If the right-side featured image is missing, show the Hero form instead
                      if (!mediaObj?.url) {
                        return <HeroForm />;
                      }
                      const src = safeMediaUrl(mediaObj.url);
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
      {/* GLOBAL CTA FIXER + LOGGER (client-side, all pages) */}
      <Script id="global-cta-fixer" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              try {
                var sel = 'a[href*="forms.louislawgroup.com/s/"]';
                function apply(root) {
                  var scope = root || document;
                  var list = Array.prototype.slice.call(scope.querySelectorAll(sel));
                  console.log('🌐 [GLOBAL CTA FIXER] Found anchors:', list.length, 'scope:', root ? '#'+(root.id||'root') : 'document');
                  list.forEach(function(a){
                    var before = a.outerHTML;
                    if (!a.classList.contains('blueButton')) a.classList.add('blueButton');
                    a.setAttribute('target','_blank');
                    a.setAttribute('rel','noopener noreferrer');
                    console.log('🌐 [GLOBAL CTA FIXER] Updated:', { before: before, after: a.outerHTML });
                  });
                }
                // Initial pass
                apply();
                // Observe future changes (client navigations, hydration updates)
                var mo = new MutationObserver(function(muts){
                  muts.forEach(function(m){
                    if (m.addedNodes) {
                      m.addedNodes.forEach(function(n){
                        if (n && n.nodeType === 1) {
                          apply(n);
                        }
                      });
                    }
                  });
                });
                mo.observe(document.documentElement, { childList: true, subtree: true });
              } catch (e) {
                console.warn('🌐 [GLOBAL CTA FIXER] Error', e);
              }
            })();
          `,
        }}
      />
    </Layout>
  );
}