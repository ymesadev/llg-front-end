import { NextResponse } from "next/server";
import { getLlgVid } from "@/app/utils/viServerJoin";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, propertyAddress, damageType, caseType, gclid, warrantyCompany, warrantyType } = body;

    if (!name || !phone || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const damageLabels = ["Hurricane / Wind", "Water / Flood", "Roof Damage", "Fire / Smoke", "Plumbing Leak", "Mold", "Other"];
    const isWarranty = caseType === "warranty";

    // First-party visitor id (opaque, no PII) — forwarded so n8n can join the
    // funnel to the created CRM contact via the collector's /link.
    const llg_vid = getLlgVid(request);

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
          llg_vid,
        }),
      });
      if (res.ok) sent = true;
    } catch (err) {
      console.error("[qualify-intake-partial] webhook failed:", err.message);
    }

    // Drop-off detection is handled client-side by the pagehide/DQ beacon
    // (src/app/utils/dropoffBeacon.js) -> n8n llg-dropoff-watch, which fires
    // only on a genuine un-booked exit. A server-side forward here would
    // false-alert for every partial lead, including those who go on to book.

    return NextResponse.json({ success: sent });
  } catch (err) {
    console.error("[qualify-intake-partial]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
