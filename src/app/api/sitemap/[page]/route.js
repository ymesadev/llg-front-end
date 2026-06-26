export const dynamic = 'force-dynamic';
export const maxDuration = 60;

import { collectUrlsRange, toUrlsetXml, getTotalPages, SITE } from '../../../sitemap.xml/chunked-helpers';

const PAGE_SIZE = Number(process.env.SITEMAP_PAGE_SIZE || 2000);

export async function GET(request, { params }) {
  try {
    const pageNum = Number(params.page || '1');
    if (!Number.isFinite(pageNum) || pageNum < 1) {
      return new Response('Not Found', { status: 404 });
    }

    // Validate page number against the same cheap, cached count the index uses
    // (keeps index/chunk page counts consistent without a second full-list fetch).
    const totalPages = await getTotalPages(PAGE_SIZE);

    if (pageNum > totalPages) {
      return new Response('Not Found', { status: 404 });
    }

    // Use optimized range-based fetching
    const start = (pageNum - 1) * PAGE_SIZE;
    const chunk = await collectUrlsRange(start, PAGE_SIZE);
    const xml = toUrlsetXml(chunk);

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (e) {
    console.error('Sitemap chunk error:', e);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>${SITE}/</loc></url>\n</urlset>\n`,
      {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8'
        }
      }
    );
  }
}
