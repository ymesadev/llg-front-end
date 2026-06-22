// src/app/feed.xml/route.js
// RSS 2.0 feed of the latest LLG articles — the input Google News / Apple News / Flipboard /
// JD Supra consume. Newest 50 articles.
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

import { fetchRecentArticles, xmlEscape, SITE, PUB_NAME } from '../news-helpers';

function rfc822(d) {
  try { return new Date(d).toUTCString(); } catch { return new Date().toUTCString(); }
}

export async function GET() {
  try {
    const arts = await fetchRecentArticles({ limit: 50 });
    const items = arts.map(a =>
      `<item>` +
        `<title>${xmlEscape(a.title)}</title>` +
        `<link>${a.loc}</link>` +
        `<guid isPermaLink="true">${a.loc}</guid>` +
        (a.published ? `<pubDate>${rfc822(a.published)}</pubDate>` : '') +
      `</item>`
    ).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<rss version="2.0"><channel>` +
      `<title>${xmlEscape(PUB_NAME)} — Florida Legal News</title>` +
      `<link>${SITE}</link>` +
      `<description>Trending Florida legal news and commentary from ${xmlEscape(PUB_NAME)}.</description>` +
      `<language>en-us</language>${items}</channel></rss>\n`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=600, s-maxage=600, stale-while-revalidate=3600',
      },
    });
  } catch (e) {
    console.error('feed error:', e);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>${xmlEscape(PUB_NAME)}</title><link>${SITE}</link><description>temporarily unavailable</description></channel></rss>\n`,
      { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } }
    );
  }
}
