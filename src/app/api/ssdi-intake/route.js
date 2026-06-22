import { NextResponse } from "next/server";
import { getLlgVid } from "@/app/utils/viServerJoin";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, answers, score } = body;

    if (!name || !phone || !email) {
      return NextResponse.json({ error: "Missing required contact fields" }, { status: 400 });
    }

    // First-party visitor id (opaque, no PII) — forwarded so n8n can join the
    // funnel to the created CRM contact via the collector's /link.
    const llg_vid = getLlgVid(request);

    const n8nWebhookUrl = process.env.N8N_SSDI_WEBHOOK_URL || "https://n8n.louislawgroup.com/webhook/llg-ssdi-intake";
    let sent = false;

    try {
      const n8nRes = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, answers, score, llg_vid }),
      });
      if (n8nRes.ok) sent = true;
      else console.error("[ssdi-intake] n8n webhook returned:", n8nRes.status);
    } catch (err) {
      console.error("[ssdi-intake] n8n webhook failed:", err.message);
    }

    return NextResponse.json({ success: sent, score });
  } catch (err) {
    console.error("[ssdi-intake]", err);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
