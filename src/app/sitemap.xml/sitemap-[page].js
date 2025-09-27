import { dynamic } from 'next';
export const dynamic = 'force-dynamic';

import { collectAllUrls, toUrlsetXml } from './chunked-helpers';

const PAGE_SIZE = Number(process.env.SITEMAP_PAGE_SIZE || 2000);

export async function GET(request, { params }) {
  try {
    const pageNum = Number(params.page || '1');
    if (!Number.isFinite(pageNum) || pageNum < 1) return new Response('Not Found', { status: 404 });

    const all = await collectAllUrls();
    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (pageNum > totalPages) return new Response('Not Found', { status: 404 });

    const start = (pageNum - 1) * PAGE_SIZE;
    const chunk = all.slice(start, start + PAGE_SIZE);
    const xml = toUrlsetXml(chunk);
    return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
  } catch (e) {
    return new Response('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>/</loc></url>\n</urlset>\n', { headers: { 'Content-Type': 'application/xml' } });
  }
}
