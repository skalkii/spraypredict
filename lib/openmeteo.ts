import type {
  OpenMeteoForecast,
  GeocodingResponse,
  GeocodingResult,
} from "./types";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";

const HOURLY_VARS = [
  "temperature_2m",
  "relative_humidity_2m",
  "precipitation_probability",
  "precipitation",
  "wind_speed_10m",
  "wind_gusts_10m",
  "wind_direction_10m",
  "cloud_cover",
  "dew_point_2m",
  "uv_index",
].join(",");

async function fetchWithRetry(url: string, attempts = 3): Promise<Response> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 600 },
        headers: { "User-Agent": "spray-window-predictor/0.1" },
      });
      if (res.ok) return res;
      if (res.status >= 500 && i < attempts - 1) {
        await new Promise((r) => setTimeout(r, 400 * (i + 1)));
        continue;
      }
      throw new Error(`Open-Meteo ${res.status}: ${await res.text()}`);
    } catch (e) {
      lastErr = e;
      if (i === attempts - 1) throw e;
      await new Promise((r) => setTimeout(r, 400 * (i + 1)));
    }
  }
  throw lastErr ?? new Error("fetch failed");
}

export async function fetchForecast(
  lat: number,
  lng: number,
  forecastDays = 5,
): Promise<OpenMeteoForecast> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    hourly: HOURLY_VARS,
    forecast_days: forecastDays.toString(),
    timezone: "auto",
    wind_speed_unit: "kmh",
    precipitation_unit: "mm",
    temperature_unit: "celsius",
  });
  const res = await fetchWithRetry(`${FORECAST_URL}?${params}`);
  return (await res.json()) as OpenMeteoForecast;
}

export async function geocode(query: string, count = 5): Promise<GeocodingResult[]> {
  const params = new URLSearchParams({
    name: query,
    count: count.toString(),
    language: "en",
    format: "json",
  });
  const res = await fetchWithRetry(`${GEOCODE_URL}?${params}`);
  const data = (await res.json()) as GeocodingResponse;
  return data.results ?? [];
}
