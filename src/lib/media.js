export function safeMediaUrl(u) {
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://login.louislawgroup.com';
  if (!u || typeof u !== 'string') return null;
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  if (u.startsWith('//')) return `https:${u}`;
  if (u.startsWith('/uploads') || u.startsWith('uploads/')) {
    const path = u.startsWith('/') ? u : `/${u}`;
    return `${strapiURL}${path}`;
  }
  if (u.startsWith('/images') || u.startsWith('images/')) return u.startsWith('/') ? u : `/${u}`;
  if (u.startsWith('/')) return u;
  return `/${u}`;
}

export default safeMediaUrl;
