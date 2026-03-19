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

    const fileNames = files.length > 0
      ? files.map(f => `${f.name} (${(f.size / 1024).toFixed(1)} KB)`).join(", ")
      : "None";

    // Build multipart form for n8n (supports binary file uploads)
    const n8nForm = new FormData();
    n8nForm.append("fullName", fullName);
    n8nForm.append("email", email);
    n8nForm.append("phone", phone);
    n8nForm.append("message", message);
    n8nForm.append("documents", fileNames);

    // Attach files as binary data
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const blob = new Blob([buffer], { type: file.type || "application/octet-stream" });
      n8nForm.append("data", blob, file.name);
    }

    // Send to n8n webhook as multipart/form-data
    try {
      const n8nRes = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        body: n8nForm,
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
