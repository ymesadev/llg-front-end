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
import parse from "html-react-parser";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import UrgencyBanner from "@/app/components/UrgencyBanner/UrgencyBanner";
import { renderContentBlocks, processHeroContent, processSectionsContent } from "../utils/contentFormatter";
import safeMediaUrl from '../../lib/media';
import Script from "next/script";
import DocumentUploadCTA from "../components/DocumentUploadCTA/DocumentUploadCTA";
import Testimonials from "../components/Testimonials/Testimonials";


function getArticleType(slug) {
  const s = (slug || "").toLowerCase();
  const ssdiKeywords = ["ssdi","ssi","social-security","social security","disability-benefit","supplemental-security","ssa-","function-report","disability-report","reconsideration","appointment-of-representative","authorization-to-disclose","disability-attorney","disability-lawyer","disability-claim","disability-appeal","disability-insurance","sga","ssdi-pay","ssdi-payment"];
  if (ssdiKeywords.some(k => s.includes(k))) {
    return "ssdi";
  }
  return "property-damage";
}

// US state slug fragments → full names
const STATE_MAP = {
  alabama:"Alabama",alaska:"Alaska",arizona:"Arizona",arkansas:"Arkansas",
  california:"California",colorado:"Colorado",connecticut:"Connecticut",delaware:"Delaware",
  florida:"Florida",georgia:"Georgia",hawaii:"Hawaii",idaho:"Idaho",
  illinois:"Illinois",indiana:"Indiana",iowa:"Iowa",kansas:"Kansas",
  kentucky:"Kentucky",louisiana:"Louisiana",maine:"Maine",maryland:"Maryland",
  massachusetts:"Massachusetts",michigan:"Michigan",minnesota:"Minnesota",mississippi:"Mississippi",
  missouri:"Missouri",montana:"Montana",nebraska:"Nebraska",nevada:"Nevada",
  "new-hampshire":"New Hampshire","new-jersey":"New Jersey","new-mexico":"New Mexico","new-york":"New York",
  "north-carolina":"North Carolina","north-dakota":"North Dakota",ohio:"Ohio",oklahoma:"Oklahoma",
  oregon:"Oregon",pennsylvania:"Pennsylvania","rhode-island":"Rhode Island","south-carolina":"South Carolina",
  "south-dakota":"South Dakota",tennessee:"Tennessee",texas:"Texas",utah:"Utah",
  vermont:"Vermont",virginia:"Virginia",washington:"Washington","west-virginia":"West Virginia",
  wisconsin:"Wisconsin",wyoming:"Wyoming",
};

function getStateFromSlug(slug) {
  const s = slug.toLowerCase();
  for (const [key] of Object.entries(STATE_MAP)) {
    if (s.includes(key)) return key;
  }
  return null;
}

function getRelatedLinks(slug, articleType) {
  const state = getStateFromSlug(slug);
  const stateName = state ? STATE_MAP[state] : null;

  if (articleType === "ssdi") {
    const stateLinks = state ? [
      { href: `/how-much-does-ssdi-pay-in-${state}-2026`, label: `How Much Does SSDI Pay in ${stateName}?` },
      { href: `/average-ssdi-payment-${state}-2026`, label: `Average SSDI Payment in ${stateName} 2026` },
      { href: `/ssdi-benefit-calculator-${state}-2026`, label: `SSDI Benefit Calculator for ${stateName}` },
      { href: `/disability-attorney-${state}`, label: `SSDI Attorney in ${stateName}` },
    ] : [];
    const baseLinks = [
      { href: "/request-for-reconsideration-form-ssa-561", label: "SSA-561: How to File a Request for Reconsideration" },
      { href: "/ssa-3373-function-report-adult", label: "SSA-3373 — Function Report Adult" },
      { href: "/how-long-does-ssdi-approval-take", label: "How Long Does SSDI Approval Take?" },
      { href: "/what-conditions-qualify-for-ssdi-2026", label: "Conditions That Qualify for SSDI in 2026" },
      { href: "/how-to-win-ssdi-appeal", label: "How to Win Your SSDI Appeal" },
    ];
    return { title: `Related SSDI Resources${stateName ? ` — ${stateName}` : ""}`, links: [...stateLinks, ...baseLinks].slice(0, 8) };
  }

  // property-damage
  const stateLinks = state ? [
    { href: `/insurance-claim-denied-${state}`, label: `Insurance Claim Denied in ${stateName}? Your Rights` },
    { href: `/property-damage-attorney-${state}`, label: `Property Damage Attorney in ${stateName}` },
    { href: `/homeowners-insurance-claim-${state}`, label: `Homeowners Insurance Claim in ${stateName}` },
  ] : [];
  const baseLinks = [
    { href: "/insurance-claim-denied-fl", label: "Insurance Claim Denied in Florida? Your Legal Rights" },
    { href: "/ten-tips-handling-allstate-claim-denials", label: "10 Tips for Handling Allstate Claim Denials" },
    { href: "/ten-tips-handling-usaa-insurance-claim-denials", label: "10 Tips for Handling USAA Claim Denials" },
    { href: "/underpaid-insurance-claim-florida", label: "Underpaid Insurance Claim? How to Fight Back" },
    { href: "/insurance-company-delayed-my-claim-florida", label: "Insurance Company Delaying Your Claim?" },
    { href: "/tips-handling-claim-denials-progressive-select-insurance", label: "Progressive Select Claim Denied? 10 Ways to Win" },
  ];
  return { title: `Related Insurance Claim Resources${stateName ? ` — ${stateName}` : ""}`, links: [...stateLinks, ...baseLinks].slice(0, 8) };
}

// Returns the correct href for the end-of-article CTA button
function getEndCtaHref(slug) {
  const s = (slug || "").toLowerCase();
  if (s.includes("american-home-shield") || s.startsWith("ahs-"))
    return "/american-home-shield-privacy-torts";
  if (s.includes("kin-insurance"))
    return "/kin-insurance-privacy-torts";
  if (s.includes("tower-hill"))
    return "/tower-hill-insurance-privacy-torts";
  if (s.includes("slide-insurance"))
    return "/slide-insurance-privacy-torts";
  if (s.includes("american-integrity"))
    return "/american-integrity-insurance-privacy-torts";
  if (s.includes("vuori"))
    return "/vuori-privacy-torts";
  // SSDI and property damage → SMS
  return "sms:8336574812";
}

// ISR: serve from cache, regenerate in background every hour
export const revalidate = 3600;

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


// ✅ UX: Extract H2 headings from blocks for Table of Contents
function extractTocHeadings(blocks) {
  if (!Array.isArray(blocks)) return [];
  const headings = [];
  for (const block of blocks) {
    if (block.__component !== "shared.rich-text") continue;
    const body = block.body || "";
    // Markdown ## headings (with optional bold **)
    const mdMatches = [...body.matchAll(/^##\s+\*{0,2}([^*\n]+)\*{0,2}\s*$/gm)];
    for (const m of mdMatches) headings.push(m[1].replace(/\*+/g, "").trim());
    // HTML <h2>
    const htmlMatches = [...body.matchAll(/<h2[^>]*>([^<]+)<\/h2>/gi)];
    for (const m of htmlMatches) headings.push(m[1].trim());
  }
  return headings;
}

// ✅ SEO: Parse FAQ section from article blocks for structured data
function extractFaqSchema(blocks) {
  const faqItems = [];
  let inFaqSection = false;
  let currentQ = null;
  let currentA = [];

  for (const block of blocks) {
    if (block.__component !== "shared.rich-text") continue;
    const body = block.body || "";

    if (!inFaqSection) {
      if (body.includes("Frequently Asked Questions") || body.includes("## **FAQ")) {
        inFaqSection = true;
      } else {
        continue;
      }
    }

    const lines = body.split("\n");
    for (const line of lines) {
      const qMatch = line.match(/^#{3,4}\s*\**\d+\.\s*(.+?)\**\s*$/);
      if (qMatch) {
        if (currentQ) {
          faqItems.push({ q: currentQ, a: currentA.join(" ").trim() });
          currentA = [];
        }
        currentQ = qMatch[1].replace(/\*\*/g, "").trim();
      } else if (currentQ && line.trim() && !line.startsWith("#")) {
        const clean = line
          .replace(/\*\*|__/g, "")
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
          .trim();
        if (clean) currentA.push(clean);
      }
    }
    if (inFaqSection && currentQ) {
      faqItems.push({ q: currentQ, a: currentA.join(" ").trim() });
      break;
    }
  }

  if (faqItems.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

// ✅ SEO: Dynamic meta titles, OG tags, and Twitter Cards per page
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slugArray = resolvedParams.slug || [];
  const slug = slugArray.join("/");
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const siteUrl = "https://www.louislawgroup.com";
  const defaultImage = `${siteUrl}/og-default.jpg`;

  // Canonical: strip dedup suffix (e.g. -5, -12) but NOT year suffixes (2024, 2025, 2026)
  // Match dedup suffixes up to 3 digits (2-999) — excludes 4-digit years (2024, 2026 etc.)
  const canonicalMatch = slug.match(/^(.+)-(\d{1,3})$/);
  const isDupSlug = canonicalMatch && parseInt(canonicalMatch[2]) >= 2 && parseInt(canonicalMatch[2]) <= 999;
  const canonicalSlug = isDupSlug ? canonicalMatch[1] : slug;
  const canonicalUrl = `${siteUrl}/${canonicalSlug}`;

  try {
    const res = await fetch(
      `${strapiURL}/api/articles?filters[slug][$eq]=${slug}&fields[0]=title&fields[1]=description&populate[0]=cover`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        const article = data.data[0];
        if (article.title) {
          const imageUrl = article.cover?.url
            ? `https://login.louislawgroup.com${article.cover.url}`
            : defaultImage;
          const description =
            article.description ||
            "Contact Louis Law Group for a free case evaluation. Florida\'s trusted property damage attorneys.";
          return {
            title: `${article.title} | Louis Law Group`,
            description,
            alternates: { canonical: canonicalUrl },
            ...(isDupSlug && { robots: { index: false, follow: true } }),
            openGraph: {
              title: `${article.title} | Louis Law Group`,
              description,
              url: `${siteUrl}/${slug}`,
              siteName: "Louis Law Group",
              images: [{ url: imageUrl, width: 1200, height: 630, alt: article.title }],
              type: "article",
            },
            twitter: {
              card: "summary_large_image",
              title: `${article.title} | Louis Law Group`,
              description,
              images: [imageUrl],
            },
          };
        }
      }
    }
  } catch (e) {}

  return {
    title: "Louis Law Group | Florida Property Damage Attorneys",
    description:
      "Trusted legal services for Florida property owners. Contact us for a free case evaluation.",
    openGraph: {
      title: "Louis Law Group | Florida Property Damage Attorneys",
      description: "Trusted legal services for Florida property owners. Contact us for a free case evaluation.",
      url: siteUrl,
      siteName: "Louis Law Group",
      images: [{ url: defaultImage, width: 1200, height: 630, alt: "Louis Law Group" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Louis Law Group | Florida Property Damage Attorneys",
      description: "Trusted legal services for Florida property owners. Contact us for a free case evaluation.",
      images: [defaultImage],
    },
  };
}

// ✅ Fetch and Render Page Content
export default async function Page(props) {
  const params = await props.params;
  const slugArray = params.slug || [];
  const slug = slugArray.join("/");

  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://login.louislawgroup.com";
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
      fetch(`${strapiURL}/api/articles?filters[slug][$eq]=${encSlug}&fields[0]=slug`, { next: { revalidate: 60 } }),
      fetch(`${strapiURL}/api/team-pages?filters[Slug][$eq]=${encSlug}&fields[0]=Slug`, { next: { revalidate: 60 } }),
      fetch(`${strapiURL}/api/jobs?filters[Slug][$eq]=${encSlug}&fields[0]=Slug`, { next: { revalidate: 60 } }),
      fetch(`${strapiURL}/api/faqs-and-legals?filters[slug][$eq]=${encSlug}&fields[0]=slug`, { next: { revalidate: 60 } }),
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
    const buildBase = (withParent) => {
      const encChild = encodeURIComponent(childSlug || '');
      if (withParent) {
        const cleanParentSlug = (parentSlug ?? '').replace(/^\/+|\/+$/g, '');
        const encParent = encodeURIComponent(cleanParentSlug);
        return (
          `${strapiURL}/api/pages?filters[Slug][$eq]=${encChild}` +
          `&filters[parent_page][URL][$eq]=/${encParent}`
        );
      }
      return `${strapiURL}/api/pages?filters[Slug][$eq]=${encChild}`;
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
          <p>The page you are looking for does not exist..</p>
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

  // Compute article type early — used in schema injection + content rendering
  const articleType = getArticleType(slug);
  const isSSAFormPage = /^ssa-\d+/.test(slug) || slug === 'request-for-reconsideration-form-ssa-561';

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
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.louislawgroup.com" },
                  { "@type": "ListItem", "position": 2, "name": "Resources", "item": "https://www.louislawgroup.com/resources" },
                  { "@type": "ListItem", "position": 3, "name": page.title, "item": `https://www.louislawgroup.com/${slug}` }
                ]
              })
            }}
          />
          {slug.startsWith("faq-") ? (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "mainEntity": [{
                    "@type": "Question",
                    "name": page.title,
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": page.description || ""
                    }
                  }]
                })
              }}
            />
          ) : (
            <>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "headline": page.title,
                    "datePublished": page.createdAt,
                    "dateModified": page.updatedAt || page.createdAt,
                    "image": page.cover?.url
                      ? `https://login.louislawgroup.com${page.cover.url}`
                      : "https://www.louislawgroup.com/og-default.jpg",
                    "author": {
                      "@type": "Organization",
                      "name": "Louis Law Group",
                      "url": "https://www.louislawgroup.com"
                    },
                    "publisher": {
                      "@type": "LegalService",
                      "name": "Louis Law Group",
                      "url": "https://www.louislawgroup.com",
                      "logo": {
                        "@type": "ImageObject",
                        "url": "https://www.louislawgroup.com/logo.png"
                      }
                    },
                    "mainEntityOfPage": {
                      "@type": "WebPage",
                      "@id": `https://www.louislawgroup.com/${page.slug}`
                    }
                  })
                }}
              />
              {/* HowTo schema for SSA form pages (triggers step-by-step rich results) */}
              {isSSAFormPage && (
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "HowTo",
                      "name": page.title,
                      "description": page.description || `Step-by-step guide for ${page.title}`,
                      "step": [
                        { "@type": "HowToStep", "position": 1, "name": "Download the form", "text": "Use the download button on this page to get the official form directly from SSA.gov." },
                        { "@type": "HowToStep", "position": 2, "name": "Complete all sections", "text": "Fill in every required field carefully. Incomplete forms are a common cause of delays in disability cases." },
                        { "@type": "HowToStep", "position": 3, "name": "Attach supporting documents", "text": "Include medical records, doctor statements, and any other evidence supporting your disability claim." },
                        { "@type": "HowToStep", "position": 4, "name": "Submit to the SSA", "text": "Deliver your completed form to a local Social Security office, mail it, or submit online at my.ssa.gov." },
                        { "@type": "HowToStep", "position": 5, "name": "Get legal help if denied", "text": "If your claim is denied, Louis Law Group can represent you on contingency at no upfront cost. Call (833) 657-4812." }
                      ]
                    })
                  }}
                />
              )}
              {/* FAQPage schema — extracted from content or static SSDI fallback */}
              {(() => {
                const faqSchema = page.blocks ? extractFaqSchema(page.blocks) : null;
                const ssdiStaticFaq = !faqSchema && articleType === "ssdi" ? {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "mainEntity": [
                    { "@type": "Question", "name": "How long does it take to get approved for SSDI?", "acceptedAnswer": { "@type": "Answer", "text": "Most initial SSDI applications take 3–6 months for a decision. Appeals can take 12–24 months. Working with a disability attorney significantly improves your approval odds at every stage." }},
                    { "@type": "Question", "name": "What should I do if my SSDI claim is denied?", "acceptedAnswer": { "@type": "Answer", "text": "About 67% of initial SSDI claims are denied. You have 60 days to file a Request for Reconsideration. If denied again, request an ALJ hearing — this is where most claims are ultimately approved. A disability attorney can represent you at no upfront cost." }},
                    { "@type": "Question", "name": "Does Louis Law Group handle SSDI cases?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Louis Law Group is a Florida law firm specializing in SSDI and SSI disability claims. We work on contingency — you pay nothing unless we win. Call (833) 657-4812 for a free consultation." }}
                  ]
                } : null;
                const schema = faqSchema || ssdiStaticFaq;
                return schema ? (
                  <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                  />
                ) : null;
              })()}
            </>
          )}
          {slug.startsWith("faq-") && page.description && (
            <section className={styles.blogPost}>
              <div className="container blogContainer">
                <nav aria-label="Breadcrumb" style={{ marginBottom: "1rem", fontSize: "0.9rem" }}>
                  <Link href="/">Home</Link> &rsaquo; <Link href="/faq">FAQ</Link> &rsaquo; <span>{page.title}</span>
                </nav>
                <h1 className={styles.blogTitle}>{page.title}</h1>
                <UrgencyBanner />
                <div className={styles.blogContent}>
                  <div className={styles.blogText}>
                    <p>{page.description}</p>
                    <p>Have questions about your legal rights? <Link href="/#contact">Contact Louis Law Group</Link> for a free case evaluation.</p>
                  </div>
                </div>
                <ArticleButtonsRow buttons={getArticleButtons(page)} />
              </div>
            </section>
          )}
          {!slug.startsWith("faq-") && (
          <section className={styles.blogPost}>
            <div className="container blogContainer">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
                <Link href="/">Home</Link>
                <span aria-hidden="true"> › </span>
                <Link href={articleType === "ssdi" ? "/social-security-disability" : "/property-damage-insurance-claim"}>
                  {articleType === "ssdi" ? "SSDI" : "Property Damage"}
                </Link>
                <span aria-hidden="true"> › </span>
                <span>{page.title}</span>
              </nav>
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
              <UrgencyBanner />
              {/* Author byline */}
              <div className={styles.authorByline}>
                <img
                  src="https://login.louislawgroup.com/uploads/pierre_louis_new_003bb95e9b.jpg"
                  alt="Pierre A. Louis, Esq."
                  className={styles.authorPhoto}
                />
                <div className={styles.authorInfo}>
                  <Link href="/pierre-a-louis-esq" className={styles.authorName}>
                    Pierre A. Louis, Esq.
                  </Link>
                  <span className={styles.authorCredential}>
                    Florida Bar Member · Louis Law Group
                  </span>
                </div>
              </div>
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
              {/* Article schema */}
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Article",
                  headline: page.title,
                  author: { "@type": "Person", name: "Pierre A. Louis, Esq.", url: "https://www.louislawgroup.com/pierre-a-louis-esq" },
                  publisher: { "@type": "Organization", name: "Louis Law Group", url: "https://www.louislawgroup.com" },
                  datePublished: page.createdAt,
                  dateModified: page.updatedAt || page.createdAt,
                  wordCount: (page.blocks || []).reduce((acc, b) => {
                    if (b.__component !== "shared.rich-text") return acc;
                    return acc + (b.body || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
                  }, 0),
                }) }}
              />
              {page.cover?.url && (
                <img
                  src={safeMediaUrl(page.cover.url)}
                  alt={page.title}
                  className={styles.blogImage}
                  fetchPriority="high"
                />
              )}
              {/* Table of Contents */}
              {(() => {
                const tocHeadings = extractTocHeadings(page.blocks);
                if (tocHeadings.length < 4) return null;
                return (
                  <nav className={styles.toc} aria-label="Table of contents">
                    <p className={styles.tocTitle}>In This Article</p>
                    <ol className={styles.tocList}>
                      {tocHeadings.map((h, i) => (
                        <li key={i} className={styles.tocItem}>{h}</li>
                      ))}
                    </ol>
                  </nav>
                );
              })()}
              <div className={styles.blogContent}>
                {(() => {
                  // articleType computed above via getArticleType(slug)
                  const midpoint = Math.floor((page.blocks || []).length / 2);
                  return (page.blocks || []).map((block, index) => (
                    <div key={index}>
                      {index === midpoint && <DocumentUploadCTA articleType={articleType} />}
                      {block.__component === "shared.rich-text" && (() => {
                        const body = block.body || "";
                        const isHtml = body.trimStart().startsWith("<");
                        return (
                          <div className={styles.blogText}>
                            {isHtml ? parse(body) : (
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
                                urlTransform={mdUrlTransform}
                              >{body}</ReactMarkdown>
                            )}
                          </div>
                        );
                      })()}
                      {block.__component === "shared.media" && block.file?.url && (
                        <div className={styles.blogImageContainer}>
                          <img
                            src={`https://login.louislawgroup.com${block.file.url}`}
                            alt={block.file.alternativeText || "Blog Image"}
                            className={styles.blogPostImage}
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>
                  ));
                })()}
              </div>
              {/* SSDI: Related Forms box — contextual internal links to SSA form pages */}
              {articleType === "ssdi" && !isSSAFormPage && (
                <div style={{background:"#f0f7ff",borderLeft:"4px solid #1a56db",padding:"20px 24px",borderRadius:"4px",margin:"32px 0"}}>
                  <h3 style={{marginTop:0,color:"#1a56db"}}>SSDI Forms You May Need</h3>
                  <ul>
                    <li><a href="/request-for-reconsideration-form-ssa-561">SSA-561 — Request for Reconsideration</a></li>
                    <li><a href="/ssa-3373-function-report-adult">SSA-3373 — Function Report Adult</a></li>
                    <li><a href="/ssa-3441-disability-report-appeal">SSA-3441 — Disability Report Appeal</a></li>
                    <li><a href="/ssa-3368-disability-report-adult">SSA-3368 — Disability Report Adult</a></li>
                    <li><a href="/ssa-1696-appointment-of-representative">SSA-1696 — Appointment of Representative</a></li>
                    <li><a href="/ssa-827-authorization-to-disclose-information">SSA-827 — Authorization to Disclose</a></li>
                  </ul>
                </div>
              )}
              {/* Related Articles — dynamic state-specific internal linking */}
              {(() => {
                const { title: relTitle, links: relLinks } = getRelatedLinks(slug, articleType);
                return (
                  <div style={{background:"#f9fafb",border:"1px solid #e5e7eb",padding:"20px 24px",borderRadius:"6px",margin:"32px 0"}}>
                    <h3 style={{marginTop:0,marginBottom:"12px",color:"#111827",fontSize:"1.05rem"}}>{relTitle}</h3>
                    <ul style={{margin:0,paddingLeft:"20px",lineHeight:"1.8"}}>
                      {relLinks.map((l, i) => <li key={i}><a href={l.href}>{l.label}</a></li>)}
                    </ul>
                  </div>
                );
              })()}
              {/* End-of-article CTA */}
              {(() => {
                const endCtaHref = getEndCtaHref(slug);
                const isPrivacyTort = endCtaHref.includes("privacy-torts") || endCtaHref.includes("vuori");
                const isSms = endCtaHref.startsWith("sms:");
                return (
                  <div className={styles.endCta}>
                    <h3 className={styles.endCtaTitle}>
                      {isPrivacyTort ? "See If You Qualify — Free Eligibility Check" : "Ready to Fight Back? Get a Free Case Review."}
                    </h3>
                    <p className={styles.endCtaSubtext}>No fees unless we win · 100% confidential · Same-day response</p>
                    {isSms ? (
                      <a href={endCtaHref} className={styles.endCtaBtn}>Start Your Free Review →</a>
                    ) : (
                      <Link href={endCtaHref} className={styles.endCtaBtn}>Check Your Eligibility →</Link>
                    )}
                  </div>
                );
              })()}
              {/* Author bio card */}
              <div className={styles.authorCard}>
                <img
                  src="https://login.louislawgroup.com/uploads/pierre_louis_new_003bb95e9b.jpg"
                  alt="Pierre A. Louis, Esq."
                  className={styles.authorCardPhoto}
                />
                <div>
                  <p className={styles.authorCardName}>
                    <Link href="/pierre-a-louis-esq">Pierre A. Louis, Esq.</Link>
                  </p>
                  <p className={styles.authorCardBio}>
                    Pierre A. Louis is a Florida-licensed attorney and founder of Louis Law Group, specializing in property damage insurance claims and Social Security disability (SSDI/SSI). He has recovered over $200 million for clients against major insurance companies.
                  </p>
                </div>
              </div>
              {/* Article repeatable buttons (end of article) */}
              {(() => {
                const _btns = getArticleButtons(page);
                if (typeof window !== 'undefined') { try { console.log('🧪 Buttons resolved (bottom):', _btns); } catch(e){} }
                return <ArticleButtonsRow buttons={_btns} />;
              })()}
            </div>
          </section>
          )}
          {/* Sticky mobile CTA */}
          <div className={styles.stickyMobileCta}>
            <a href="tel:8336574812" className={styles.stickyCall}>📞 (833) 657-4812</a>
            <Link href="/#contact" className={styles.stickyReview}>Free Case Review →</Link>
          </div>
          <Testimonials />
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