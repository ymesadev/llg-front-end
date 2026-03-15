import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, carrier, damageType, dateOfLoss, insurerResponse, score } = body;

    if (!name || !phone || !email) {
      return NextResponse.json({ error: "Missing required contact fields" }, { status: 400 });
    }

    const damageLabels = ["Hurricane / Wind", "Water / Flood", "Roof Damage", "Fire / Smoke", "Plumbing Leak", "Mold", "Other"];
    const responseLabels = ["Denied claim entirely", "Underpaid / lowballed", "Delaying or not responding", "Claim pending — no decision yet", "No claim filed yet"];
    const scoreLabel = score >= 70 ? "STRONG CANDIDATE" : score >= 45 ? "POSSIBLE CANDIDATE" : "REVIEW NEEDED";

    const description = [
      `--- QUALIFIER RESULTS ---`,
      `Score: ${score}/100 — ${scoreLabel}`,
      `Insurance Carrier: ${carrier || "Not provided"}`,
      `Type of Damage: ${damageLabels[damageType] ?? "Not provided"}`,
      `Date of Loss: ${dateOfLoss || "Not provided"}`,
      `Insurer Response: ${responseLabels[insurerResponse] ?? "Not provided"}`,
    ].join("\n");

    // Primary: n8n webhook → Microsoft Outlook
    const n8nWebhookUrl = process.env.N8N_INTAKE_WEBHOOK_URL || "https://n8n.louislawgroup.com/webhook/llg-intake-qualifier";
    let sent = false;

    try {
      const n8nRes = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, carrier, damageType, dateOfLoss, insurerResponse, score }),
      });
      if (n8nRes.ok) sent = true;
      else console.error("[qualify-intake] n8n webhook returned:", n8nRes.status);
    } catch (n8nErr) {
      console.error("[qualify-intake] n8n webhook failed:", n8nErr.message);
    }

    // Fallback: email relay on Mailu server
    if (!sent) {
      const relayUrl = process.env.EMAIL_RELAY_URL || "http://144.217.164.240:9090/send-email";
      const relaySecret = process.env.EMAIL_RELAY_SECRET || "llg-relay-2026";
      const toEmail = process.env.QUALIFY_TO_EMAIL || "pierre@louislawgroup.com";
      try {
        const relayRes = await fetch(relayUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: relaySecret,
            to: toEmail,
            subject: `[${scoreLabel}] New Property Damage Inquiry — ${name}`,
            body: `${description}\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}`,
          }),
        });
        if (relayRes.ok) sent = true;
      } catch (relayErr) {
        console.error("[qualify-intake] Email relay fallback failed:", relayErr.message);
      }
    }

    return NextResponse.json({ success: sent, score });
  } catch (err) {
    console.error("[qualify-intake]", err);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
