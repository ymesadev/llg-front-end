export const dynamic = 'force-dynamic';

import { collectUrlsRange, toUrlsetXml, getEndpointCounts } from '../sitemap.xml/chunked-helpers';

const PAGE_SIZE = Number(process.env.SITEMAP_PAGE_SIZE || 2000);

export async function GET(request, { params }) {
  try {
  const raw = params?.name || '';
  // accept filenames like "0-sitemap" or "1-sitemap" and also allow an accidental ".xml"
  // examples: "2-sitemap" or "2-sitemap.xml"
  const match = raw.match(/^(\d+)-sitemap(?:\.xml)?$/i);
    if (!match) return new Response('Not Found', { status: 404 });
    const pageNum = Number(match[1]);

    // compute total and validate pageNum
    const counts = await getEndpointCounts();
    const total = counts.reduce((s, c) => s + (Number(c.count) || 0), 0) + 1; // +1 for root
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (pageNum < 0 || pageNum >= totalPages) return new Response('Not Found', { status: 404 });

    // compute start index (0-based) across flattened url list
    const start = pageNum * PAGE_SIZE;
    const urls = await collectUrlsRange(start, PAGE_SIZE);
      // If a chunk ends up empty, return an empty but valid urlset (don't 404)
      if (!Array.isArray(urls) || urls.length === 0) {
        console.warn(`[sitemap] chunk ${pageNum} returned 0 URLs (start=${start}, pageSize=${PAGE_SIZE})`);
        const empty = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>\n`;
        return new Response(empty, { headers: { 'Content-Type': 'application/xml' } });
      }

      const xml = toUrlsetXml(urls);
      return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
  } catch (e) {
    // Log full error for diagnostics and return a valid (empty) urlset so crawlers don't get a 404
    console.error('[sitemap] chunk route error for', params?.name, e && e.stack ? e.stack : e);
    const empty = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>\n`;
    return new Response(empty, { headers: { 'Content-Type': 'application/xml' } });
  }
}
