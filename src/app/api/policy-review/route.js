import { NextResponse } from "next/server";
import { createHash, createCipheriv, randomBytes } from "crypto";

const N8N_WEBHOOK_URL = "https://n8n.louislawgroup.com/webhook/policy-review-submit";
const DOWNLOAD_SECRET = process.env.POLICY_DOWNLOAD_SECRET || "llg-policy-review-secret-2026-xK9m";
const SITE_URL = "https://www.louislawgroup.com";

// Encrypt file data with AES-256 and return token + encrypted payload
function encryptFile(buffer, filename) {
  const id = randomBytes(16).toString("hex");
  const key = createHash("sha256").update(DOWNLOAD_SECRET).digest();
  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  // Token = id:iv:filename (base64url encoded)
  const meta = Buffer.from(JSON.stringify({ id, iv: iv.toString("hex"), name: filename })).toString("base64url");
  return { id, meta, encrypted };
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

    // Process files: generate secure download links
    const fileLinks = [];
    const fileAttachments = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      // Create signed download token (HMAC with expiry)
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      const fileId = randomBytes(16).toString("hex");
      const payload = `${fileId}:${file.name}:${expiresAt}`;
      const signature = createHash("sha256").update(payload + DOWNLOAD_SECRET).digest("hex").slice(0, 32);
      const token = Buffer.from(JSON.stringify({
        id: fileId,
        name: file.name,
        type: file.type,
        exp: expiresAt,
        sig: signature,
        data: buffer.toString("base64"),
      })).toString("base64url");

      const downloadUrl = `${SITE_URL}/api/policy-review/download?token=${token}`;
      fileLinks.push({ name: file.name, size: file.size, url: downloadUrl });
      fileAttachments.push(`${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    }

    // Build document links HTML for email
    const docsHtml = fileLinks.length > 0
      ? fileLinks.map(f => `<a href="${f.url}" style="color:#1a73e8;text-decoration:underline;">${f.name}</a> (${(f.size / 1024).toFixed(1)} KB)`).join("<br>")
      : "None";
    const docsText = fileAttachments.length > 0 ? fileAttachments.join(", ") : "None";

    // Send to n8n webhook
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
