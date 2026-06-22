import { NextResponse } from "next/server";
import { fireViSubmit } from "@/app/utils/viServerJoin";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, propertyAddress, trade, contractorName, contractorOnList, damageType, damageDate, insuranceStatus, damageValue, score, smsConsent, gclid } = body;

    if (!name || !phone || !email) {
      return NextResponse.json({ error: "Missing required contact fields" }, { status: 400 });
    }

    const scoreLabel = score >= 70 ? "STRONG CANDIDATE" : score >= 45 ? "POSSIBLE CANDIDATE" : "REVIEW NEEDED";

    const description = [
      "--- CONTRACTOR TPL QUALIFIER RESULTS ---",
      `Score: ${score}/100 — ${scoreLabel}`,
      `Trade: ${trade || "Not provided"}`,
      `Contractor: ${contractorName || "Not provided"}`,
      `On Priority List: ${contractorOnList ? "YES — priority contractor" : "No"}`,
      `Damage Type: ${damageType || "Not provided"}`,
      `Damage Date: ${damageDate || "Not provided"}`,
      `Contractor Intent: ${insuranceStatus || "Not provided"}`,
      `Estimated Damage Value: ${damageValue || "Not provided"}`,
      `Property Address: ${propertyAddress || "Not provided"}`,
    ].join("\n");

    // Primary: n8n webhook → CRM / Microsoft Outlook.
    const n8nWebhookUrl = process.env.N8N_TPL_WEBHOOK_URL || "https://n8n.louislawgroup.com/webhook/llg-tpl-intake-qualifier";
    let sent = false;

    try {
      const n8nPayload = { name, phone, email, propertyAddress, caseType: "contractor-tpl", trade, contractorName, contractorOnList: !!contractorOnList, damageType, damageDate, insuranceStatus, damageValue, score, smsConsent: !!smsConsent, gclid: gclid || null };
      const n8nRes = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(n8nPayload),
      });
      if (n8nRes.ok) sent = true;
      else console.error("[qualify-intake-tpl] n8n webhook returned:", n8nRes.status);
    } catch (n8nErr) {
      console.error("[qualify-intake-tpl] n8n webhook failed:", n8nErr.message);
    }

    // Fallback: email relay on Mailu server (requires HTTPS relay URL + secret via env vars)
    if (!sent) {
      const relayUrl = process.env.EMAIL_RELAY_URL;
      const relaySecret = process.env.EMAIL_RELAY_SECRET;
      if (!relayUrl || !relaySecret) {
        console.error("[qualify-intake-tpl] EMAIL_RELAY_URL or EMAIL_RELAY_SECRET not configured — skipping fallback");
      } else if (relayUrl.startsWith("http://")) {
        console.error("[qualify-intake-tpl] EMAIL_RELAY_URL must use HTTPS — plaintext relay rejected");
      } else {
        const toEmail = process.env.QUALIFY_TO_EMAIL || "pierre@louislawgroup.com";
        try {
          const relayRes = await fetch(relayUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              secret: relaySecret,
              to: toEmail,
              subject: `[${scoreLabel}] New Contractor TPL Claim Inquiry — ${name}`,
              body: `${description}\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}`,
            }),
          });
          if (relayRes.ok) sent = true;
        } catch (relayErr) {
          console.error("[qualify-intake-tpl] Email relay fallback failed:", relayErr.message);
        }
      }
    }

    // Visitor-intelligence server-side join (fire-and-forget, no PII, dark until cutover).
    fireViSubmit(request, { qualifier: "contractor-tpl", gatePassed: true });

    return NextResponse.json({ success: sent, score });
  } catch (err) {
    console.error("[qualify-intake-tpl]", err);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
