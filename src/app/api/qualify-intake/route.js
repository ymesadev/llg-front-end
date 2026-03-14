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

    const emailBody = `
New Property Damage Claim Inquiry — Louis Law Group

QUALIFICATION SCORE: ${score}/100 — ${scoreLabel}

CONTACT INFORMATION
Name: ${name}
Phone: ${phone}
Email: ${email}

CLAIM DETAILS
Insurance Carrier: ${carrier || "Not provided"}
Type of Damage: ${damageLabels[damageType] ?? "Not provided"}
Date of Loss: ${dateOfLoss || "Not provided"}
Insurer Response: ${responseLabels[insurerResponse] ?? "Not provided"}

---
Submitted via louislawgroup.com property damage qualifier
    `.trim();

    const smtpHost = process.env.SMTP_HOST || "144.217.164.240";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const smtpUser = process.env.SMTP_USER || "admin@louislawgroup.claims";
    const smtpPass = process.env.SMTP_PASS || "LLGAdmin2026!";
    const toEmail = process.env.QUALIFY_TO_EMAIL || "pierre@louislawgroup.com";

    // Use nodemailer if available, otherwise fall back to n8n webhook
    let sent = false;

    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.default.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: false,
        auth: { user: smtpUser, pass: smtpPass },
        tls: { rejectUnauthorized: false },
      });

      await transporter.sendMail({
        from: `"LLG Qualifier" <${smtpUser}>`,
        to: toEmail,
        subject: `[${scoreLabel}] New Property Damage Inquiry — ${name}`,
        text: emailBody,
      });
      sent = true;
    } catch {
      // Fallback: N8N webhook
      const webhookUrl = process.env.N8N_QUALIFY_WEBHOOK;
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, phone, email, carrier, damageType, dateOfLoss, insurerResponse, score, scoreLabel }),
        });
        sent = true;
      }
    }

    return NextResponse.json({ success: sent, score });
  } catch (err) {
    console.error("[qualify-intake]", err);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
