import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const now = new Date();
    const startTime = now.toISOString();
    const endTime = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString();

    const res = await fetch(
      `https://bookings.louislawgroup.com/api/v2/slots/available?startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}&eventTypeId=4`,
      {
        headers: {
          'Authorization': 'Bearer cal_27d4a14aa24a92b4deb38bbc9ab89e0a22e5bd2a61b3c9e2',
        },
        next: { revalidate: 300 }, // cache for 5 minutes
      }
    );

    const data = await res.json();

    if (data.status === 'error') {
      return NextResponse.json({ slots: [] }, { status: 200 });
    }

    // Flatten and pick first 4 slots
    const allSlots = [];
    const slotData = data?.data?.slots || data?.slots || {};
    for (const [, daySlots] of Object.entries(slotData)) {
      if (Array.isArray(daySlots)) {
        for (const slot of daySlots) {
          allSlots.push(slot.time || slot);
        }
      }
    }

    return NextResponse.json({ slots: allSlots.slice(0, 4) });
  } catch (error) {
    console.error('Cal.com slots error:', error);
    return NextResponse.json({ slots: [] }, { status: 200 });
  }
}
