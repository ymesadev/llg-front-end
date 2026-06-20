import { NextResponse } from "next/server";
import contractors from "@/data/florida-contractors.json";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").toLowerCase().trim();
  const trade = searchParams.get("trade") || "";

  if (q.length < 2) return NextResponse.json({ results: [] });

  const results = [];
  for (const c of contractors) {
    if (results.length >= 15) break;
    const name_lower = c.n.toLowerCase();
    if (!name_lower.includes(q)) continue;
    if (trade && trade !== "Other / Not Listed" && c.t !== trade) continue;
    results.push({ name: c.n, license_number: c.l, city: c.c, trade: c.t });
  }

  return NextResponse.json({ results });
}
