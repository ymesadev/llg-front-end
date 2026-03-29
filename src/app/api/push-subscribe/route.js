import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const subscription = await request.json();

    // Forward to n8n webhook for storage
    const webhookUrl = process.env.N8N_PUSH_SUBSCRIBE_WEBHOOK;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
