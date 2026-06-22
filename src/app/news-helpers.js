// src/app/news-helpers.js
// Shared article fetch for the Google News sitemap (/news-sitemap.xml) and the RSS feed (/feed.xml).
// Mirrors the data source + auth used by sitemap.xml/chunked-helpers.js (Strapi, publicationState=live).
//
// Verified 2026-06-22 against live Strapi:
//   - Server-side date filters (filters[...][$gte]) are IGNORED by this instance (they return the
//     full collection), so freshness is enforced CLIENT-SIDE.
//   - publishedAt is unreliable: a bulk migration re-stamped ~39k evergreen articles with ONE
//     identical publishedAt (2026-06-20T20:51:14.402Z) while their real createdAt is ~2025. So we
//     sort + window by createdAt (the genuine publish time). `sort=createdAt:desc` IS honored, which
//     cleanly excludes the re-stamped corpus and yields only genuinely-fresh articles.
const STRAPI = (process.env.NEXT_PUBLIC_STRAPI_API_URL || process.env.STRAPI_URL || 'https://login.louislawgroup.com').replace(/\/+$/, '');
const TOKEN = process.env.STRAPI_API_TOKEN || '';

export const SITE = 'https://www.louislawgroup.com';
export const PUB_NAME = 'Louis Law Group';

const SLUG_FIELDS = ['slug', 'Slug', 'URL', 'Url', 'url', 'path', 'permalink'];
const TITLE_FIELDS = ['title', 'Title', 'headline', 'Headline', 'name', 'Name'];

function pick(attrs, fields) {
  for (const f of fields) {
    const v = attrs?.[f];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return null;
}

export function xmlEscape(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

/**
 * Fetch genuinely-fresh published articles, newest-first by createdAt.
 *  - sinceHours: keep only articles created within the last N hours (Google News = 48h window),
 *    enforced CLIENT-SIDE (this Strapi ignores server date filters).
 *  - limit: max items (Google News sitemaps cap at 1000 URLs).
 * Returns [{ loc, title, published }] where `published` is the genuine createdAt.
 */
export async function fetchRecentArticles({ sinceHours = null, limit = 1000 } = {}) {
  const url = new URL(`${STRAPI}/api/articles`);
  url.searchParams.set('publicationState', 'live');
  url.searchParams.set('sort', 'createdAt:desc');         // honored; createdAt = genuine publish time
  url.searchParams.set('pagination[page]', '1');
  url.searchParams.set('pagination[pageSize]', '1000');   // fetch a full page; window client-side

  const headers = { Accept: 'application/json' };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

  const res = await fetch(url, { headers, next: { tags: ['sitemap', 'news'] } });
  if (!res.ok) throw new Error(`articles ${res.status} ${res.statusText}`);
  const json = await res.json();

  const cutoff = sinceHours ? Date.now() - sinceHours * 3600 * 1000 : null;
  const seen = new Set();
  const out = [];
  for (const item of (json?.data || [])) {
    const a = item?.attributes ?? item ?? {};
    const slug = pick(a, SLUG_FIELDS);
    if (!slug) continue;
    const created = a.createdAt || a.publishedAt || null;
    if (cutoff && (!created || new Date(created).getTime() < cutoff)) continue;  // client-side freshness
    const clean = slug.startsWith('/') ? slug : `/${slug}`;
    const loc = `${SITE}${clean}`;
    if (seen.has(loc)) continue;                                                  // dedupe duplicate slugs
    seen.add(loc);
    out.push({ loc, title: pick(a, TITLE_FIELDS) || slug, published: created });
    if (out.length >= limit) break;
  }
  return out;
}
