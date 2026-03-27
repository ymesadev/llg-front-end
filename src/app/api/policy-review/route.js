import { NextResponse } from "next/server";

const N8N_WEBHOOK_URL = "https://n8n.louislawgroup.com/webhook/policy-review-submit";
const N8N_FILE_STORE_URL = "https://n8n.louislawgroup.com/webhook/policy-file-store";
const N8N_FILE_DL_BASE = "https://n8n.louislawgroup.com/webhook/policy-file-dl";
const DL_SECRET = "llg-policy-dl-secret-2026-xK9m";

// Must match the signature logic in the n8n Code node
function generateSignature(uuid, exp) {
  const payload = uuid + ":" + exp + ":" + DL_SECRET;
  let h = 0;
  for (let i = 0; i < payload.length; i++) {
    h = ((h << 5) - h) + payload.charCodeAt(i);
    h = h | 0; // Convert to 32-bit integer
  }
  const abs = Math.abs(h);
  // Convert to base36
  return abs.toString(36).slice(0, 12);
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const fullName = formData.get("fullName");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const message = formData.get("message") || "";
    const files = formData.getAll("files").filter((f) => f instanceof File && f.size > 0);

    if (!fullName || !email || !phone) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Upload files to n8n file storage and get UUIDs
    const fileLinks = [];
    if (files.length > 0) {
      for (const file of files) {
        try {
          const uploadForm = new FormData();
          const buffer = Buffer.from(await file.arrayBuffer());
          const blob = new Blob([buffer], { type: file.type || "application/octet-stream" });
          uploadForm.append("data", blob, file.name);

          const storeRes = await fetch(N8N_FILE_STORE_URL, {
            method: "POST",
            body: uploadForm,
          });

          if (storeRes.ok) {
            const storeData = await storeRes.json();
            if (storeData.success && storeData.files) {
              for (const f of storeData.files) {
                const exp = Date.now() + 24 * 60 * 60 * 1000; // 24h
                const sig = generateSignature(f.uuid, exp.toString());
                const url = `${N8N_FILE_DL_BASE}?id=${f.uuid}&sig=${sig}&exp=${exp}`;
                fileLinks.push({ name: f.name, size: f.size, url });
              }
            }
          }
        } catch (uploadErr) {
          console.error("[policy-review] File upload error:", uploadErr.message);
        }
      }
    }

    // Build download links HTML
    const docsHtml = fileLinks.length > 0
      ? fileLinks.map(f =>
          `<a href="${f.url}" style="color:#1a73e8;text-decoration:underline;font-weight:bold;">${f.name}</a> (${(f.size / 1024).toFixed(1)} KB)`
        ).join("<br>")
      : "None";
    const docsText = fileLinks.length > 0
      ? fileLinks.map(f => `${f.name} (${(f.size / 1024).toFixed(1)} KB)`).join(", ")
      : "None";

    // Send notification to n8n email webhook
    try {
      const n8nRes = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          message,
          documents: docsText,
          documentLinks: docsHtml,
        }),
      });
      if (!n8nRes.ok) {
        console.error("[policy-review] n8n webhook returned:", n8nRes.status);
      }
    } catch (n8nErr) {
      console.error("[policy-review] n8n webhook failed:", n8nErr.message);
    }

    return NextResponse.json({
      success: true,
      message: "Your policy review request has been submitted. We will contact you within 24 hours.",
    });
  } catch (err) {
    console.error("[policy-review] error:", err);
    return NextResponse.json({ success: false, error: "Server error. Please try again." }, { status: 500 });
  }
}
