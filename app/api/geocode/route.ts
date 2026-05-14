import { NextRequest, NextResponse } from "next/server";
import { geocode } from "@/lib/openmeteo";

export const revalidate = 3600;

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }
  try {
    const results = await geocode(q, 8);
    return NextResponse.json({ results });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
