import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const country = request.headers.get("x-vercel-ip-country") || "";
    
    await fetch("https://tracker.aiagent.attorney/hit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, country }),
    }).catch(() => {});
  } catch {}
  
  return NextResponse.json({ ok: true });
}
