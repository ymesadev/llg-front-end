import { NextResponse } from 'next/server';

const CAL_BASE = 'https://bookings.louislawgroup.com/api/v2';
// TODO(security): move to CALCOM_API_KEY in Vercel and rotate; literal is a transitional fallback.
const CAL_KEY = process.env.CALCOM_API_KEY || 'cal_27d4a14aa24a92b4deb38bbc9ab89e0a22e5bd2a61b3c9e2';
// 4 = property-insurance consult, 7 = warranty consult, 2 = generic 30-min consult (PI/SSDI/privacy)
const ALLOWED_EVENTS = new Set([2, 4, 7]);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let eventTypeId = parseInt(searchParams.get('eventTypeId') || '4', 10);
    if (!ALLOWED_EVENTS.has(eventTypeId)) eventTypeId = 4;

    const now = new Date();
    const startTime = now.toISOString();
    const endTime = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString();

    const res = await fetch(
      `${CAL_BASE}/slots/available?startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}&eventTypeId=${eventTypeId}`,
      {
        headers: { Authorization: `Bearer ${CAL_KEY}` },
        next: { revalidate: 300 }, // cache 5 min
      }
    );

    const data = await res.json();
    if (data.status === 'error') {
      return NextResponse.json({ slots: [], eventTypeId }, { status: 200 });
    }

    const byDay = data?.data?.slots || data?.slots || {};
    const days = Object.keys(byDay).sort();
    const slots = [];

    // Prefer one slot per day so the visitor sees 5-6 distinct DATES to choose from.
    for (const day of days) {
      const arr = byDay[day];
      if (Array.isArray(arr) && arr.length) slots.push(arr[0].time || arr[0]);
      if (slots.length >= 6) break;
    }
    // If fewer than 6 days are open, top up with additional times from the days we have.
    if (slots.length < 6) {
      for (const day of days) {
        const arr = byDay[day] || [];
        for (let i = 1; i < arr.length && slots.length < 6; i++) slots.push(arr[i].time || arr[i]);
        if (slots.length >= 6) break;
      }
    }

    return NextResponse.json({ slots: slots.slice(0, 6), eventTypeId });
  } catch (error) {
    console.error('Cal.com slots error:', error);
    return NextResponse.json({ slots: [], eventTypeId: 4 }, { status: 200 });
  }
}
