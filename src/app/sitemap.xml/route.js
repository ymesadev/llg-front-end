// src/app/sitemap.xml/route.js
export const dynamic = 'force-dynamic';

const SITE  = (process.env.NEXT_PUBLIC_SITE_URL || 'https://louislawgroup.com').replace(/\/+$/,'');
const STRAPI = (process.env.NEXT_PUBLIC_STRAPI_API_URL || process.env.STRAPI_URL || 'https://login.louislawgroup.com').replace(/\/+$/,'');
const TOKEN = process.env.STRAPI_API_TOKEN || '';

/** Which collections and which fields hold the path/slug **/
const MAP = [
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

async function fetchAll(endpoint, fields) {
  const pageSize = 200;
  const first = await fetchPage(endpoint, 1, pageSize);
  const totalPages = first?.meta?.pagination?.pageCount || 1;
  const data = [...(first?.data || [])];

  for (let p = 2; p <= totalPages; p++) {
    const res = await fetchPage(endpoint, p, pageSize);
    if (res?.data) data.push(...res.data);
  }

  const out = [];
  for (const item of data) {
    const attrs = item?.attributes ?? item ?? {};
    const val = pick(attrs, fields);
    const path = toLoc(MAP.find(m => m.endpoint === endpoint)?.prefix || '', val);
    if (!path) continue;
    const lastmod = attrs.updatedAt || attrs.publishedAt || attrs.createdAt || undefined;
    out.push({ loc: `${SITE}${path}`, lastmod });
  }
  return out;
}

function toXml(urls) {
  const head = `<?xml version="1.0" encoding="UTF-8"?>`;
  const open = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  const body = urls.map(u => {
    const last = u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : '';
    return `<url><loc>${u.loc}</loc>${last}<changefreq>weekly</changefreq><priority>0.7</priority></url>`;
  }).join('');
  const close = `</urlset>`;
  return `${head}\n${open}\n${body}\n${close}\n`;
}

export async function GET() {
  try {
    const all = [];
    for (const { endpoint, fields } of MAP) {
      const entries = await fetchAll(endpoint, fields);
      all.push(...entries);
    }
    const xml = toXml(all);
    return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
  } catch (e) {
    // Fail-safe: always return at least the homepage
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>${SITE}/</loc></url>\n</urlset>\n`;
    return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
  }
}