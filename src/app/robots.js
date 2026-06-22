// app/robots.js
export default function robots() {
  const site = 'https://www.louislawgroup.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/sitemap/'],
        disallow: ['/api/', '/admin', '/preview', '/draft', '/private', '/_next'],
      },
    ],
    sitemap: [`${site}/sitemap.xml`, `${site}/news-sitemap.xml`],
    host: site,
  }
}