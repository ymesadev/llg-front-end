// src/app/news-sitemap.xml/route.js
// Google News sitemap: articles published in the last 48 hours, news-tagged.
// Declared in robots.js and submitted to Search Console. Covers ALL fresh LLG articles
// (including trend-to-publish output, which lands in the same Strapi).
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

import { fetchRecentArticles, xmlEscape, PUB_NAME } from '../news-helpers';

export async function GET() {
  try {
    const arts = (await fetchRecentArticles({ sinceHours: 48, limit: 1000 })).filter(a => a.published);
    const body = arts.map(a =>
      `<url><loc>${a.loc}</loc>` +
      `<news:news>` +
        `<news:publication><news:name>${xmlEscape(PUB_NAME)}</news:name><news:language>en</news:language></news:publication>` +
        `<news:publication_date>${new Date(a.published).toISOString()}</news:publication_date>` +
        `<news:title>${xmlEscape(a.title)}</news:title>` +
      `</news:news></url>`
    ).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ` +
      `xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n${body}\n</urlset>\n`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        // short cache: news must stay fresh
        'Cache-Control': 'public, max-age=600, s-maxage=600, stale-while-revalidate=3600',
      },
    });
  } catch (e) {
    console.error('news-sitemap error:', e);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"></urlset>\n`,
      { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
    );
  }
}
