import { NextResponse } from "next/server";
import { createHash } from "crypto";

const DOWNLOAD_SECRET = process.env.POLICY_DOWNLOAD_SECRET || "llg-policy-review-secret-2026-xK9m";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return new NextResponse("Missing token", { status: 400 });
    }

    // Decode token
    let payload;
    try {
      payload = JSON.parse(Buffer.from(token, "base64url").toString());
    } catch {
      return new NextResponse("Invalid token", { status: 400 });
    }

    const { id, name, type, exp, sig, data } = payload;

    // Verify signature
    const expectedPayload = `${id}:${name}:${exp}`;
    const expectedSig = createHash("sha256").update(expectedPayload + DOWNLOAD_SECRET).digest("hex").slice(0, 32);
    if (sig !== expectedSig) {
      return new NextResponse("Invalid signature", { status: 403 });
    }

    // Check expiry
    if (Date.now() > exp) {
      return new NextResponse("Download link expired. Please contact us at (833) 657-4812.", { status: 410 });
    }

    // Decode and serve file
    const fileBuffer = Buffer.from(data, "base64");
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": type || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${name}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("[policy-review/download] error:", err);
    return new NextResponse("Server error", { status: 500 });
  }
}
