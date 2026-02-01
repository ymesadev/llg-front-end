// src/app/sitemap.xml/route.js
export const dynamic = 'force-dynamic';

// Sitemap index: lists chunked sitemap files (sitemap-1.xml, sitemap-2.xml, ...)
// The heavy lifting of fetching entries is delegated to helper functions in chunked-helpers.js
import { SITE, getEndpointCounts, collectAllUrls } from './chunked-helpers';

const PAGE_SIZE = Number(process.env.SITEMAP_PAGE_SIZE || 2000);

function toIndexXml(locEntries) {
  const head = `<?xml version="1.0" encoding="UTF-8"?>`;
  const open = `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  const body = locEntries.map(u => `<sitemap><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ''}</sitemap>`).join('');
  const close = `</sitemapindex>`;
  return `${head}\n${open}\n${body}\n${close}\n`;
}

export async function GET() {
  try {
    // Compute total number of URLs using endpoint counts to avoid fetching all entries
    const counts = await getEndpointCounts();
    const total = counts.reduce((s, c) => s + (Number(c.count) || 0), 0) + 1; // +1 for root
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    const indexEntries = [];
    for (let i = 1; i <= totalPages; i++) {
      // use 1-based numbered files matching the dynamic route: sitemap-1.xml, sitemap-2.xml, ...
      indexEntries.push({ loc: `${SITE}/sitemap-${i}.xml`, lastmod: null });
    }

  const xml = toIndexXml(indexEntries);
    return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
  } catch (e) {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<sitemap><loc>${SITE}/sitemap-1.xml</loc></sitemap>\n</sitemapindex>\n`;
    return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
  }
}