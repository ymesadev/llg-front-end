import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, propertyAddress, damageType, caseType } = body;

    if (!name || !phone || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const damageLabels = ["Hurricane / Wind", "Water / Flood", "Roof Damage", "Fire / Smoke", "Plumbing Leak", "Mold", "Other"];

    // Send to partial lead n8n webhook
    const webhookUrl = "https://n8n.louislawgroup.com/webhook/llg-intake-partial";
    let sent = false;

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, phone, email, propertyAddress,
          damageType: damageLabels[damageType] ?? damageType ?? "Not provided",
          caseType: caseType || "property-damage",
          partialLead: true,
        }),
      });
      if (res.ok) sent = true;
    } catch (err) {
      console.error("[qualify-intake-partial] webhook failed:", err.message);
    }

    return NextResponse.json({ success: sent });
  } catch (err) {
    console.error("[qualify-intake-partial]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
