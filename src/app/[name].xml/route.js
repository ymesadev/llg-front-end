import { dynamic } from 'next';
export const dynamic = 'force-dynamic';

import { collectUrlsRange, toUrlsetXml, getEndpointCounts } from '../sitemap.xml/chunked-helpers';

const PAGE_SIZE = Number(process.env.SITEMAP_PAGE_SIZE || 2000);

export async function GET(request, { params }) {
  try {
    const raw = params?.name || '';
    // expect filenames like "0-sitemap" or "1-sitemap" (without .xml)
    const match = raw.match(/^(\d+)-sitemap$/);
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
    const xml = toUrlsetXml(urls);
    return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
  } catch (e) {
    return new Response('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>/</loc></url>\n</urlset>\n', { headers: { 'Content-Type': 'application/xml' } });
  }
}
