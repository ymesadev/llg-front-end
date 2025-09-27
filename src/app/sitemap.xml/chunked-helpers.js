export const SITE  = (process.env.NEXT_PUBLIC_SITE_URL || 'https://louislawgroup.com').replace(/\/+$/,'');
const STRAPI = (process.env.NEXT_PUBLIC_STRAPI_API_URL || process.env.STRAPI_URL || 'https://login.louislawgroup.com').replace(/\/+$/,'');
const TOKEN = process.env.STRAPI_API_TOKEN || '';

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
    for (let p = 2; p <= totalPages; p++) {
      const res = await fetchPage(endpoint, p, pageSize);
      if (res?.data) data.push(...res.data);
    }

    for (const item of data) {
      const attrs = item?.attributes ?? item ?? {};
      const val = pick(attrs, fields);
      const path = toLoc(MAP.find(m => m.endpoint === endpoint)?.prefix || '', val);
      if (!path) continue;
      const lastmod = attrs.updatedAt || attrs.publishedAt || attrs.createdAt || undefined;
      all.push({ loc: `${SITE}${path}`, lastmod });
    }
  }

  // also include root
  all.unshift({ loc: `${SITE}/`, lastmod: null });
  return all;
}

// --- New optimized helpers ---
export async function getEndpointCounts() {
  const out = [];
  for (const m of MAP) {
    // fetch with pageSize=1 to get total count
    const res = await fetchPage(m.endpoint, 1, 1);
    const total = res?.meta?.pagination?.total ?? 0;
    out.push({ endpoint: m.endpoint, count: Number(total || 0), fields: m.fields, prefix: m.prefix });
  }
  return out;
}

// collect urls for a flattened range [start, start+limit)
export async function collectUrlsRange(startIndex, limit, fetchPageSize = 200) {
  let remaining = limit;
  let offset = startIndex; // 0-based
  const out = [];

  // root occupies index 0
  if (offset === 0 && remaining > 0) {
    out.push({ loc: `${SITE}/`, lastmod: null });
    offset = 0; // subsequent logic will treat endpoints starting at index 0 after root
    remaining -= 1;
    // if limit was 1, we're done
    if (remaining <= 0) return out;
    // move offset to account for root already consumed
    // subsequent endpoint offsets are zero-based relative to first endpoint
    offset = Math.max(0, startIndex - 1);
  } else {
    // if startIndex > 0, adjust for root's presence
    offset = Math.max(0, startIndex - 1);
  }

  const counts = await getEndpointCounts();

  for (const c of counts) {
    if (offset >= c.count) {
      offset -= c.count;
      continue;
    }

    // need items from this endpoint starting at offset, up to remaining or end
    const need = Math.min(remaining, c.count - offset);
    // determine which pages to fetch from this endpoint
    const firstPage = Math.floor(offset / fetchPageSize) + 1;
    let idxInPage = offset % fetchPageSize;
    let fetched = 0;

    for (let p = firstPage; fetched < need; p++) {
      const res = await fetchPage(c.endpoint, p, fetchPageSize);
      const data = res?.data || [];
      for (let i = idxInPage; i < data.length && fetched < need; i++) {
        const item = data[i];
        const attrs = item?.attributes ?? item ?? {};
        const val = pick(attrs, c.fields);
        const path = toLoc(c.prefix || '', val);
        if (!path) continue;
        const lastmod = attrs.updatedAt || attrs.publishedAt || attrs.createdAt || undefined;
        out.push({ loc: `${SITE}${path}`, lastmod });
        fetched += 1;
        remaining -= 1;
      }
      idxInPage = 0; // only the first page uses a non-zero start
    }

    // we've consumed offset in this endpoint
    offset = 0;
    if (remaining <= 0) break;
  }

  return out;
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
