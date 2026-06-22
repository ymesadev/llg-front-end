import { NextResponse } from "next/server";
import { isCoveredCompany } from "@/app/warranty-claims/data/warrantyCompanies";
import { fireViSubmit } from "@/app/utils/viServerJoin";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, propertyAddress, carrier, damageType, dateOfLoss, insurerResponse, score, gclid } = body;

    if (!name || !phone || !email) {
      return NextResponse.json({ error: "Missing required contact fields" }, { status: 400 });
    }

    const isPI = body.caseType === "personal-injury";
    const isWarranty = body.caseType === "warranty";

    const damageLabels = ["Hurricane / Wind", "Water / Flood", "Roof Damage", "Fire / Smoke", "Plumbing Leak", "Mold", "Other"];
    const responseLabels = ["Denied claim entirely", "Underpaid / lowballed", "Delaying or not responding", "Claim pending — no decision yet", "No claim filed yet"];
    const scoreLabel = score >= 70 ? "STRONG CANDIDATE" : score >= 45 ? "POSSIBLE CANDIDATE" : "REVIEW NEEDED";

    // Defense-in-depth: the front-end hard-gates on the covered-company list, but
    // validate again here so a hand-crafted POST with an uncovered provider is
    // flagged for human review instead of silently treated as qualified.
    const companyCovered = isWarranty ? isCoveredCompany(body.warrantyCompanyValue) : true;

    let description;
    if (isWarranty) {
      description = [
        `--- WARRANTY QUALIFIER RESULTS ---`,
        `Score: ${score}/100 — ${scoreLabel}`,
        `Warranty Company: ${body.warrantyCompany || "Not provided"}`,
        `Covered provider: ${companyCovered ? "YES" : "⚠ NO — NOT ON COVERED LIST, REVIEW"}`,
        `Warranty Type: ${body.warrantyType || "Not provided"}`,
        `Mailing Address: ${propertyAddress || "Not provided"}`,
      ].join("\n");
    } else {
      description = [
        `--- QUALIFIER RESULTS ---`,
        `Score: ${score}/100 — ${scoreLabel}`,
        `Insurance Carrier: ${carrier || "Not provided"}`,
        `Type of Damage: ${damageLabels[damageType] ?? "Not provided"}`,
        `Property Address: ${propertyAddress || "Not provided"}`,
        `Date of Loss: ${dateOfLoss || "Not provided"}`,
        `Insurer Response: ${responseLabels[insurerResponse] ?? "Not provided"}`,
      ].join("\n");
    }

    // Primary: n8n webhook → CRM / Microsoft Outlook. Route to the correct
    // n8n workflow based on case type.
    const n8nWebhookUrl = isPI
      ? "https://n8n.louislawgroup.com/webhook/llg-pi-intake-qualifier"
      : isWarranty
      ? (process.env.N8N_WARRANTY_WEBHOOK_URL || "https://n8n.louislawgroup.com/webhook/llg-warranty-intake-qualifier")
      : (process.env.N8N_INTAKE_WEBHOOK_URL || "https://n8n.louislawgroup.com/webhook/llg-intake-qualifier");
    let sent = false;

    try {
      const n8nPayload = isPI
        ? body // Send full PI payload (injuryType, dateOfInjury, medicalTreatment, etc.)
        : isWarranty
        ? { name, phone, email, propertyAddress, caseType: "warranty", warrantyCompany: body.warrantyCompany, warrantyCompanyValue: body.warrantyCompanyValue, warrantyType: body.warrantyType, companyCovered, score, gclid }
        : { name, phone, email, propertyAddress, carrier, damageType, dateOfLoss, insurerResponse, score, gclid };
      const n8nRes = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(n8nPayload),
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
      const inquiryType = isPI ? "Personal Injury" : isWarranty ? "Warranty Claim" : "Property Damage";
      try {
        const relayRes = await fetch(relayUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: relaySecret,
            to: toEmail,
            subject: `[${scoreLabel}] New ${inquiryType} Inquiry — ${name}`,
            body: `${description}\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}`,
          }),
        });
        if (relayRes.ok) sent = true;
      } catch (relayErr) {
        console.error("[qualify-intake] Email relay fallback failed:", relayErr.message);
      }
    }

    // Visitor-intelligence server-side join (fire-and-forget, no PII, dark until cutover).
    fireViSubmit(request, {
      qualifier: isPI ? "personal-injury" : isWarranty ? "warranty" : "property-damage",
      gatePassed: true,
    });

    return NextResponse.json({ success: sent, score });
  } catch (err) {
    console.error("[qualify-intake]", err);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
