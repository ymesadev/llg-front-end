// src/app/sitemap.xml/route.js
export const dynamic = 'force-dynamic';

import { SITE, getEndpointCounts } from './chunked-helpers';

const PAGE_SIZE = Number(process.env.SITEMAP_PAGE_SIZE || 2000);

function toIndexXml(locEntries) {
  const head = `<?xml version="1.0" encoding="UTF-8"?>`;
  const open = `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  const body = locEntries.map(u => `<sitemap><loc>${u.loc}</loc></sitemap>`).join('');
  const close = `</sitemapindex>`;
  return `${head}\n${open}\n${body}\n${close}\n`;
}

export async function GET() {
  try {
    const counts = await getEndpointCounts();
    const total = counts.reduce((s, c) => s + (Number(c.count) || 0), 0) + 1;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    const indexEntries = [];
    for (let i = 1; i <= totalPages; i++) {
      indexEntries.push({ loc: `${SITE}/api/sitemap/${i}` });
    }

    const xml = toIndexXml(indexEntries);
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });
  } catch (e) {
    console.error('Sitemap index error:', e);
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<sitemap><loc>${SITE}/api/sitemap/1</loc></sitemap>\n</sitemapindex>\n`;
    return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
  }
}
