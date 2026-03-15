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

    // Primary: Email relay on Mailu server (authenticated SMTP via localhost:587)
    const relayUrl = process.env.EMAIL_RELAY_URL || "http://144.217.164.240:9090/send-email";
    const relaySecret = process.env.EMAIL_RELAY_SECRET || "llg-relay-2026";
    const toEmail = process.env.QUALIFY_TO_EMAIL || "pierre@louislawgroup.com";
    let sent = false;

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
      console.error("[qualify-intake] Email relay failed:", relayErr.message);
    }

    // Fallback: direct SMTP via nodemailer
    if (!sent) {
      try {
        const nodemailer = await import("nodemailer");
        const transporter = nodemailer.default.createTransport({
          host: process.env.SMTP_HOST || "144.217.164.240",
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: false,
          ignoreTLS: true,
          auth: {
            user: process.env.SMTP_USER || "admin@louislawgroup.claims",
            pass: process.env.SMTP_PASS || "LLGAdmin2026!",
          },
        });
        await transporter.sendMail({
          from: `"LLG Qualifier" <admin@louislawgroup.claims>`,
          to: toEmail,
          subject: `[${scoreLabel}] New Property Damage Inquiry — ${name}`,
          text: `${description}\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}`,
        });
        sent = true;
      } catch (smtpErr) {
        console.error("[qualify-intake] SMTP fallback failed:", smtpErr.message);
      }
    }

    return NextResponse.json({ success: sent, score });
  } catch (err) {
    console.error("[qualify-intake]", err);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
