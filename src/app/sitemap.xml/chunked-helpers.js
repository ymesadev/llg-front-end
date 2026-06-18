import fs from 'fs';
import path from 'path';

export const SITE  = 'https://www.louislawgroup.com';
const STRAPI = (process.env.NEXT_PUBLIC_STRAPI_API_URL || process.env.STRAPI_URL || 'https://login.louislawgroup.com').replace(/\/+$/,'');
const TOKEN = process.env.STRAPI_API_TOKEN || '';

// ── Redirect exclusion filter ──────────────────────────────────────
// Prevents redirected/dead pages from appearing in the sitemap,
// saving Google crawl budget. Loads once and caches in memory.
let _redirectSet = null;
let _redirectPrefixes = null;

function loadRedirectExclusions() {
  if (_redirectSet) return;
  _redirectSet = new Set();
  _redirectPrefixes = [];

  const srcDir = path.join(process.cwd(), 'src');

  // Load JSON redirect maps (key = source path)
  for (const file of ['dead-page-redirects.json', 'pi-redirects.json']) {
    try {
      const raw = fs.readFileSync(path.join(srcDir, file), 'utf-8');
      const map = JSON.parse(raw);
      if (map && typeof map === 'object') {
        for (const key of Object.keys(map)) {
          _redirectSet.add((key || '/').replace(/\/+$/, '') || '/');
        }
      }
    } catch (e) { /* file may not exist in dev */ }
  }

  // Parse wildcard redirect prefixes from next.config.mjs
  try {
    const configPath = path.join(process.cwd(), 'next.config.mjs');
    const configContent = fs.readFileSync(configPath, 'utf-8');
    for (const m of configContent.matchAll(/source:\s*'([^']+)'/g)) {
      const src = m[1];
      if (src === '/:slug*' || src === '/api/:path*') continue;
      if (src.includes(':slug') || src.includes(':path') || src.includes('(')) {
        const prefix = src.split(/[:([]/)[0];
        if (prefix && prefix !== '/') _redirectPrefixes.push(prefix);
      } else {
        _redirectSet.add((src || '/').replace(/\/+$/, '') || '/');
      }
    }
  } catch (e) { /* non-fatal */ }

  console.log(`[sitemap] Loaded ${_redirectSet.size} exact + ${_redirectPrefixes.length} wildcard redirect exclusions`);
}

export function isRedirectSource(urlPath) {
  loadRedirectExclusions();
  const normalized = (urlPath || '/').replace(/\/+$/, '') || '/';
  if (_redirectSet.has(normalized)) return true;
  for (const prefix of _redirectPrefixes) {
    if (normalized.startsWith(prefix)) return true;
  }
  return false;
}
// ── End redirect exclusion filter ──────────────────────────────────

/**
 * Dynamically discover all static pages from the app directory
 * Excludes: api routes, dynamic routes [...], private folders _, and special files
 */
function discoverStaticPages() {
  const appDir = path.join(process.cwd(), 'src', 'app');
  const staticPages = [];

  function scanDir(dir, routePath = '') {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        // Skip private folders, api, and special Next.js folders
        if (entry.name.startsWith('_') ||
            entry.name.startsWith('.') ||
            entry.name === 'api' ||
            entry.name === 'sitemap.xml' ||
            entry.name.endsWith('.xml')) {
          continue;
        }

        if (entry.isDirectory()) {
          // Skip dynamic route segments like [slug], [...slug], (groups)
          if (entry.name.startsWith('[') || entry.name.startsWith('(')) {
            continue;
          }

          const newRoutePath = routePath + '/' + entry.name;

          // Check if this directory has a page.js/page.tsx
          const hasPage = entries.some(e =>
            e.name === 'page.js' || e.name === 'page.tsx' ||
            e.name === 'page.jsx' || e.name === 'page.mdx'
          );

          // Check if the subdirectory has a page file
          try {
            const subEntries = fs.readdirSync(fullPath);
            const subHasPage = subEntries.some(name =>
              name === 'page.js' || name === 'page.tsx' ||
              name === 'page.jsx' || name === 'page.mdx'
            );
            if (subHasPage) {
              staticPages.push(newRoutePath);
            }
          } catch (e) {
            // Ignore read errors
          }

          // Recurse into subdirectory
          scanDir(fullPath, newRoutePath);
        }
      }

      // Check if current directory (root) has a page file
      if (routePath === '') {
        const hasRootPage = entries.some(e =>
          e.name === 'page.js' || e.name === 'page.tsx' ||
          e.name === 'page.jsx' || e.name === 'page.mdx'
        );
        if (hasRootPage) {
          staticPages.push('/');
        }
      }
    } catch (e) {
      console.error('Error scanning directory:', dir, e);
    }
  }

  scanDir(appDir);

  // Remove root '/' as it's added separately, and remove duplicates
  return [...new Set(staticPages.filter(p => p !== '/'))];
}

// Cache static pages discovery
let _staticPagesCache = null;
export function getStaticPages() {
  if (!_staticPagesCache) {
    _staticPagesCache = discoverStaticPages();
  }
  return _staticPagesCache;
}

/** Which collections and which fields hold the path/slug **/
export const MAP = [
  { endpoint: 'pages',       prefix: '',        fields: ['URL','Url','url','full_slug','Slug','slug','path'] },
  { endpoint: 'articles',    prefix: '',        fields: ['slug','Slug','URL','Url','url','path','permalink'] },
  { endpoint: 'team-pages',  prefix: '',        fields: ['Slug','slug'] },
  { endpoint: 'jobs',        prefix: 'careers', fields: ['Slug','slug'] },
  { endpoint: 'faqs-and-legals', prefix: 'faqs', fields: ['slug','Slug'] },
];

function pick(attrs, fields) {
  for (const f of fields) {
    const v = attrs?.[f];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return null;
}

function toLoc(prefix, slugOrUrl) {
  if (!slugOrUrl) return null;
  const clean = slugOrUrl.startsWith('/') ? slugOrUrl : `/${slugOrUrl}`;
  const pref = prefix ? `/${prefix}` : '';
  const path = pref && !clean.startsWith(pref + '/') ? `${pref}${clean}` : clean;
  return path.replace(/\/{2,}/g, '/');
}

async function fetchPage(endpoint, page, pageSize) {
  const url = new URL(`${STRAPI}/api/${endpoint}`);
  url.searchParams.set('pagination[page]', String(page));
  url.searchParams.set('pagination[pageSize]', String(pageSize));
  url.searchParams.set('publicationState', 'live');
  url.searchParams.set('pagination[withCount]', 'true');

  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

  // Tag this fetch so /api/revalidate can bust it
  const res = await fetch(url, { headers, next: { tags: ['sitemap'] } });
  if (!res.ok) throw new Error(`${endpoint} ${res.status} ${res.statusText}`);
  return res.json();
}

export async function collectAllUrls() {
  // keep for small sites / fallbacks: fetch everything (not used by optimized chunking)
  const pageSize = 200;
  const all = [];
  for (const { endpoint, fields } of MAP) {
    const first = await fetchPage(endpoint, 1, pageSize);
    const totalPages = first?.meta?.pagination?.pageCount || 1;
    const data = [...(first?.data || [])];
    // SEO P0 2026-06-18: parallelize remaining pages (batched) so a large collection
    // finishes well under the edge timeout instead of N sequential round-trips.
    const restPages = [];
    for (let p = 2; p <= totalPages; p++) restPages.push(p);
    const CONCURRENCY = 8;
    for (let i = 0; i < restPages.length; i += CONCURRENCY) {
      const batch = await Promise.all(
        restPages.slice(i, i + CONCURRENCY).map(p => fetchPage(endpoint, p, pageSize).catch(() => null))
      );
      for (const res of batch) if (res?.data) data.push(...res.data);
    }

    for (const item of data) {
      const attrs = item?.attributes ?? item ?? {};
      const val = pick(attrs, fields);
      const path = toLoc(MAP.find(m => m.endpoint === endpoint)?.prefix || '', val);
      if (!path) continue;
      if (isRedirectSource(path)) continue; // skip redirected pages
      const lastmod = attrs.updatedAt || attrs.publishedAt || attrs.createdAt || undefined;
      all.push({ loc: `${SITE}${path}`, lastmod });
    }
  }

  // also include root
  all.unshift({ loc: `${SITE}/`, lastmod: null });

  // add dynamically discovered static pages (with today's date for /faq/ so Google sees fresh content)
  const staticPages = getStaticPages();
  const TODAY = new Date().toISOString();
  for (const pagePath of staticPages) {
    if (isRedirectSource(pagePath)) continue; // skip redirected pages
    const lastmod = pagePath === '/faq' ? TODAY : null;
    all.push({ loc: `${SITE}${pagePath}`, lastmod });
  }

  return all;
}

// ── Cached filtered URL list ────────────────────────────────────────
// Since we filter out redirects, offset-based pagination against Strapi
// counts would be inaccurate. Instead, we cache the full filtered list
// and slice from it. Cache refreshes every request (force-dynamic).
let _cachedFilteredUrls = null;
let _cacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 min in-process cache

async function getFilteredUrls() {
  const now = Date.now();
  if (_cachedFilteredUrls && (now - _cacheTime) < CACHE_TTL_MS) {
    return _cachedFilteredUrls;
  }
  _cachedFilteredUrls = await collectAllUrls();
  _cacheTime = now;
  return _cachedFilteredUrls;
}

// --- Optimized helpers (redirect-aware) ---
export async function getEndpointCounts() {
  // Return a single synthetic count based on the filtered list
  const urls = await getFilteredUrls();
  return [{ endpoint: 'all', count: urls.length, fields: [], prefix: '' }];
}

// collect urls for a flattened range [start, start+limit)
export async function collectUrlsRange(startIndex, limit) {
  const urls = await getFilteredUrls();
  return urls.slice(startIndex, startIndex + limit);
}

export function toUrlsetXml(urls) {
  const head = `<?xml version="1.0" encoding="UTF-8"?>`;
  const open = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  const body = urls.map(u => {
    const last = u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : '';
    return `<url><loc>${u.loc}</loc>${last}<changefreq>weekly</changefreq><priority>0.7</priority></url>`;
  }).join('');
  const close = `</urlset>`;
  return `${head}\n${open}\n${body}\n${close}\n`;
}
