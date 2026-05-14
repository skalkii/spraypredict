import { NextRequest, NextResponse } from "next/server";
import { fetchForecast } from "@/lib/openmeteo";
import { SPRAY_PROFILES, scoreForecast } from "@/lib/spray-rules";
import { detectWindows, pickBest } from "@/lib/window-detector";
import type { ForecastResponse } from "@/lib/types";

export const revalidate = 600;

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const lat = parseFloat(sp.get("lat") ?? "");
  const lng = parseFloat(sp.get("lng") ?? "");
  const sprayType = sp.get("sprayType") ?? "fungicide_contact";

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "Invalid lat/lng" }, { status: 400 });
  }
  const profile = SPRAY_PROFILES[sprayType];
  if (!profile) {
    return NextResponse.json(
      { error: `Unknown sprayType. Valid: ${Object.keys(SPRAY_PROFILES).join(", ")}` },
      { status: 400 },
    );
  }

  try {
    const raw = await fetchForecast(lat, lng);
    const hours = scoreForecast(raw.hourly, profile);
    const windows = detectWindows(hours);
    const body: ForecastResponse = {
      location: {
        latitude: raw.latitude,
        longitude: raw.longitude,
        timezone: raw.timezone,
      },
      sprayType: profile.id,
      sprayLabel: profile.label,
      hours,
      windows,
      bestWindow: pickBest(windows),
    };
    return NextResponse.json(body);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
