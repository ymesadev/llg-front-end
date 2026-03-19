import { NextResponse } from "next/server";

const N8N_WEBHOOK_URL = "https://n8n.louislawgroup.com/webhook/policy-review-submit";

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

    // Convert files to base64 for n8n
    const attachments = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      attachments.push({
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        data: buffer.toString("base64"),
      });
    }

    // Send to n8n webhook (single call — Outlook email to Pierre)
    try {
      const n8nRes = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: {
            fullName,
            email,
            phone,
            message,
            documents: attachments.length > 0
              ? attachments.map(a => `${a.name} (${(a.size / 1024).toFixed(1)} KB)`).join(", ")
              : "None",
            attachments,
          },
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
