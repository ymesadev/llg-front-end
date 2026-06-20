import { NextResponse } from 'next/server';

const CAL_BASE = 'https://bookings.louislawgroup.com/api/v2';
const CAL_KEY = 'cal_27d4a14aa24a92b4deb38bbc9ab89e0a22e5bd2a61b3c9e2';
const ALLOWED_EVENTS = new Set([2, 4, 7]);

const cors = { 'Access-Control-Allow-Origin': '*', Vary: 'Origin' };

// Books a Cal.com consultation directly from the chat — no tab switch.
// Body: { eventTypeId, start (ISO), name, email, phone, timeZone, notes }
export async function POST(request) {
  try {
    const { eventTypeId, start, name, email, phone, timeZone, notes } = await request.json();

    let etId = parseInt(eventTypeId, 10);
    if (!ALLOWED_EVENTS.has(etId)) etId = 4;
    if (!start) return NextResponse.json({ error: 'Missing start time' }, { status: 400, headers: cors });
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required to book' }, { status: 400, headers: cors });
    }

    const attendee = {
      name,
      email,
      timeZone: timeZone || 'America/New_York',
      language: 'en',
    };
    if (phone) attendee.phoneNumber = phone;

    const body = {
      start,
      eventTypeId: etId,
      attendee,
      metadata: { source: 'website-chatbot' },
    };
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
      console.error('Cal.com booking failed:', res.status, JSON.stringify(data).slice(0, 500));
      // Surface a soft failure so the widget can fall back to the booking page.
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
    console.error('cal-book error:', error);
    return NextResponse.json({ success: false, error: 'Booking error' }, { status: 200, headers: cors });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
