// src/app/api/revalidate/route.js
import { revalidateTag } from 'next/cache';

export async function POST(req) {
  const secret = process.env.WEBHOOK_SECRET;
  const token = req.headers.get('x-webhook-token');

  if (!secret || token !== secret) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Bust all fetches we’ll tag with 'sitemap'
  revalidateTag('sitemap');

  return Response.json({ revalidated: true, now: Date.now() });
}