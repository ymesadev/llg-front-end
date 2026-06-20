import { NextResponse } from 'next/server';

const CAL_BASE = 'https://bookings.louislawgroup.com/api/v2';
// Prefer a server-only secret; the literal is a transitional fallback (also present in cal-slots/n8n).
// TODO(security): set CALCOM_API_KEY in Vercel and rotate this token at Cal.com, then drop the fallback.
const CAL_KEY = process.env.CALCOM_API_KEY || 'cal_27d4a14aa24a92b4deb38bbc9ab89e0a22e5bd2a61b3c9e2';
const ALLOWED_EVENTS = new Set([2, 4, 7, 8]);

const ALLOWED_ORIGINS = ['https://www.louislawgroup.com', 'https://louislawgroup.com'];
const isFirstParty = (v) =>
  !!v && (ALLOWED_ORIGINS.some((o) => v === o || v.startsWith(o + '/')) || /^https:\/\/[a-z0-9-]+\.vercel\.app/.test(v));

function corsFor(origin) {
  const allow = isFirstParty(origin) ? origin : ALLOWED_ORIGINS[0];
  return { 'Access-Control-Allow-Origin': allow, Vary: 'Origin' };
}

// Best-effort in-memory throttle (per warm instance). Real protection should live at the edge/WAF.
const HITS = new Map();
function rateLimited(key, max = 5, windowMs = 60000) {
  const now = Date.now();
  const arr = (HITS.get(key) || []).filter((t) => now - t < windowMs);
  arr.push(now);
  HITS.set(key, arr);
  if (HITS.size > 5000) for (const k of HITS.keys()) { HITS.delete(k); if (HITS.size < 2500) break; }
  return arr.length > max;
}

// Books a Cal.com consultation directly from the chat — no tab switch.
export async function POST(request) {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer') || '';
  const cors = corsFor(origin);

  // CSRF-style gate: only allow first-party callers (the on-site widget).
  if (!isFirstParty(origin) && !isFirstParty(referer)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403, headers: cors });
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';
  if (rateLimited(`ip:${ip}`)) {
    return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429, headers: cors });
  }

  try {
    const { eventTypeId, start, name, email, phone, timeZone, notes } = await request.json();

    let etId = parseInt(eventTypeId, 10);
    if (!ALLOWED_EVENTS.has(etId)) etId = 4;
    if (!start) return NextResponse.json({ error: 'Missing start time' }, { status: 400, headers: cors });
    if (!name || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: 'A valid name and email are required to book' }, { status: 400, headers: cors });
    }
    if (rateLimited(`email:${String(email).toLowerCase()}`, 3, 600000)) {
      return NextResponse.json({ success: false, error: 'Too many booking attempts' }, { status: 429, headers: cors });
    }

    const attendee = { name, email, timeZone: timeZone || 'America/New_York', language: 'en' };
    if (phone) attendee.phoneNumber = phone;

    const body = { start, eventTypeId: etId, attendee, metadata: { source: 'website-chatbot' } };
    if (notes) body.bookingFieldsResponses = { notes: String(notes).slice(0, 500) };

    const res = await fetch(`${CAL_BASE}/bookings`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CAL_KEY}`,
        'cal-api-version': '2024-08-13',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.status === 'error') {
      // Redact PII — log only status + error code/message, never attendee fields.
      console.error('Cal.com booking failed:', res.status, data?.error?.code || '', data?.error?.message || '');
      return NextResponse.json(
        { success: false, error: data?.error?.message || `Booking failed (${res.status})` },
        { status: 200, headers: cors }
      );
    }

    const d = data.data || data;
    return NextResponse.json(
      { success: true, uid: d.uid || d.id || null, start: d.start || start },
      { status: 200, headers: cors }
    );
  } catch (error) {
    console.error('cal-book error:', error?.message || 'unknown');
    return NextResponse.json({ success: false, error: 'Booking error' }, { status: 200, headers: cors });
  }
}

export async function OPTIONS(request) {
  const cors = corsFor(request.headers.get('origin'));
  return new NextResponse(null, {
    status: 200,
    headers: { ...cors, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' },
  });
}
