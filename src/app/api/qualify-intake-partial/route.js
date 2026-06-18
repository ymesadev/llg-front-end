import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, propertyAddress, damageType, caseType, gclid, warrantyCompany, warrantyType } = body;

    if (!name || !phone || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const damageLabels = ["Hurricane / Wind", "Water / Flood", "Roof Damage", "Fire / Smoke", "Plumbing Leak", "Mold", "Other"];
    const isWarranty = caseType === "warranty";

    // Send to partial lead n8n webhook
    const webhookUrl = "https://n8n.louislawgroup.com/webhook/llg-fpp-partial-lead";
    let sent = false;

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, phone, email, propertyAddress,
          damageType: isWarranty
            ? (warrantyType || "Not provided")
            : (damageLabels[damageType] ?? damageType ?? "Not provided"),
          caseType: caseType || "property-damage",
          warrantyCompany: isWarranty ? (warrantyCompany || "Not provided") : undefined,
          partialLead: true,
          gclid,
        }),
      });
      if (res.ok) sent = true;
    } catch (err) {
      console.error("[qualify-intake-partial] webhook failed:", err.message);
    }

    // Also notify the drop-off watcher (emails Pierre if no consult is booked within ~1h).
    // Fire-and-forget: never affects the partial-lead capture or the response.
    try {
      await fetch("https://n8n.louislawgroup.com/webhook/llg-dropoff-watch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, phone, email, propertyAddress,
          damageType: isWarranty
            ? (warrantyType || "Not provided")
            : (damageLabels[damageType] ?? damageType ?? "Not provided"),
          caseType: caseType || "property-damage",
          warrantyCompany: isWarranty ? (warrantyCompany || "Not provided") : undefined,
          partialLead: true,
          gclid,
        }),
      });
    } catch (err) {
      console.error("[qualify-intake-partial] dropoff webhook failed:", err.message);
    }

    return NextResponse.json({ success: sent });
  } catch (err) {
    console.error("[qualify-intake-partial]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
