import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, title, slug, url } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Forward to n8n webhook for lead capture + email delivery
    const webhookUrl = process.env.N8N_SAVE_ARTICLE_WEBHOOK;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          title,
          slug,
          url,
          timestamp: new Date().toISOString(),
          source: "save_article",
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
