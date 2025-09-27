export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
// src/app/api/revalidate/route.js
import { revalidateTag, revalidatePath } from 'next/cache';

export async function GET() {
  return new Response('OK', { status: 200 });
}

export async function POST(req) {
  try {
    const secretEnv = process.env.REVALIDATE_SECRET || process.env.WEBHOOK_SECRET || '';
    const token =
      req.headers.get('x-webhook-token') ||
      req.headers.get('x-revalidate-token') ||
      req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
      '';

    if (process.env.NODE_ENV === 'production') {
      if (!secretEnv) {
        return new Response('Missing REVALIDATE_SECRET/WEBHOOK_SECRET', { status: 500 });
      }
      if (!token || token !== secretEnv) {
        return new Response('Unauthorized', { status: 401 });
      }
    }

    let body = {};
    try { body = await req.json(); } catch (_) {}

    const inputTag = typeof body.tag === 'string' && body.tag.trim() ? body.tag.trim() : null;
    const inputPath = typeof body.path === 'string' && body.path.trim() ? body.path.trim() : null;

    if (inputPath) {
      revalidatePath(inputPath);
      return Response.json({ revalidated: true, type: 'path', path: inputPath, now: Date.now() });
    }

    const tag = inputTag || 'sitemap';
    revalidateTag(tag);
    return Response.json({ revalidated: true, type: 'tag', tag, now: Date.now() });
  } catch (err) {
    return new Response(`Bad Request: ${String(err?.message || err)}`, { status: 400 });
  }
}