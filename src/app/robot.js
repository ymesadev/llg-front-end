// app/robots.js
export default function robots() {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || 'https://louislawgroup.com').replace(/\/+$/, '')

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin', '/preview', '/draft', '/private', '/_next'],
      },
    ],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  }
}