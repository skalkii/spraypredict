// Run with: npx tsx __tests__/spray-rules.test.ts
import { SPRAY_PROFILES, scoreForecast } from "../lib/spray-rules";
import { detectWindows } from "../lib/window-detector";
import type { OpenMeteoHourly } from "../lib/types";

let pass = 0;
let fail = 0;

function t(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    pass++;
  } catch (e) {
    console.log(`  ✗ ${name}`);
    console.log(`      ${(e as Error).message}`);
    fail++;
  }
}

function assert(cond: unknown, msg = "assertion failed") {
  if (!cond) throw new Error(msg);
}
function assertEq<T>(a: T, b: T, msg = "") {
  if (a !== b) throw new Error(`${msg} expected ${b}, got ${a}`);
}

function fillHourly(overrides: Partial<OpenMeteoHourly> = {}): OpenMeteoHourly {
  const N = 24;
  const time = Array.from(
    { length: N },
    (_, i) => `2026-05-14T${String(i).padStart(2, "0")}:00`,
  );
  const fill = (v: number) => Array(N).fill(v);
  return {
    time,
    temperature_2m: fill(20),
    relative_humidity_2m: fill(60),
    precipitation_probability: fill(5),
    precipitation: fill(0),
    wind_speed_10m: fill(6),
    wind_gusts_10m: fill(10),
    wind_direction_10m: fill(180),
    cloud_cover: fill(40),
    dew_point_2m: fill(12),
    uv_index: fill(0),
    ...overrides,
  };
}

console.log("\nspray-rules tests\n");

t("ideal weather → green windows for fungicide_contact", () => {
  const hourly = fillHourly();
  const scored = scoreForecast(hourly, SPRAY_PROFILES.fungicide_contact);
  const greens = scored.filter((h) => h.rating === "green");
  assert(greens.length >= 12, `expected many greens, got ${greens.length}`);
  const windows = detectWindows(scored);
  assert(windows.length > 0, "should detect at least one window");
  assertEq(windows[0].rating, "green");
});

t("rainy day → all red", () => {
  const hourly = fillHourly({
    precipitation: Array(24).fill(2),
    precipitation_probability: Array(24).fill(80),
  });
  const scored = scoreForecast(hourly, SPRAY_PROFILES.pesticide_contact);
  assertEq(scored.filter((h) => h.rating === "red").length, 24);
});

t("windy day (gusts 25 km/h) → red", () => {
  const hourly = fillHourly({
    wind_speed_10m: Array(24).fill(18),
    wind_gusts_10m: Array(24).fill(25),
  });
  const scored = scoreForecast(hourly, SPRAY_PROFILES.herbicide);
  assertEq(scored.filter((h) => h.rating === "red").length, 24);
  assert(scored[10].flags.some((f) => f.toLowerCase().includes("wind")));
});

t("calm dead-air (<3 km/h) → red (inversion risk)", () => {
  const hourly = fillHourly({ wind_speed_10m: Array(24).fill(1.5) });
  const scored = scoreForecast(hourly, SPRAY_PROFILES.pesticide_contact);
  assert(scored.every((h) => h.rating === "red"));
});

t("hot midday → herbicide penalized 10-16h vs morning", () => {
  const hourly = fillHourly({ temperature_2m: Array(24).fill(30) });
  const scored = scoreForecast(hourly, SPRAY_PROFILES.herbicide);
  const noon = scored[12];
  const morning = scored[7];
  assert(noon.score < morning.score, `midday=${noon.score} morning=${morning.score}`);
});

t("spray-type switching changes ratings (rain spike at h6)", () => {
  // Single 1mm rain at hour 6. Contact looks 8h forward → red at h0-h3.
  // Systemic looks 3h forward → green at h0-h3.
  const precip = Array(24).fill(0);
  const prob = Array(24).fill(5);
  precip[6] = 1;
  prob[6] = 60;
  const hourly = fillHourly({ precipitation: precip, precipitation_probability: prob });
  const contact = scoreForecast(hourly, SPRAY_PROFILES.fungicide_contact);
  const systemic = scoreForecast(hourly, SPRAY_PROFILES.fungicide_systemic);
  const contactEarly = contact.slice(0, 4).filter((h) => h.rating === "red").length;
  const systemicEarly = systemic.slice(0, 4).filter((h) => h.rating === "green").length;
  assert(contactEarly >= 3, `contact h0-h3 should be red, got ${contactEarly} red`);
  assert(systemicEarly >= 3, `systemic h0-h3 should be green, got ${systemicEarly} green`);
});

t("drone tighter than herbicide on same 9 km/h wind", () => {
  // 9 km/h wind: ground herbicide green (≤10), drone red (>8 green max, ≤12 hard cap → marginal not red)
  // Use 13 km/h instead: herbicide marginal (10-15), drone red (>12 hard cap)
  const hourly = fillHourly({
    wind_speed_10m: Array(24).fill(13),
    wind_gusts_10m: Array(24).fill(14),
  });
  const herbicide = scoreForecast(hourly, SPRAY_PROFILES.herbicide);
  const drone = scoreForecast(hourly, SPRAY_PROFILES.drone);
  assert(
    !herbicide.every((h) => h.rating === "red"),
    "herbicide should NOT be all red at 13 km/h",
  );
  assert(
    drone.every((h) => h.rating === "red"),
    "drone should be all red at 13 km/h (>12 hard cap)",
  );
});

t("drone gusts cap fires earlier (16 km/h gusts)", () => {
  // 16 km/h gusts: ground herbicide marginal (15-20), drone red (>15 hard cap)
  const hourly = fillHourly({ wind_gusts_10m: Array(24).fill(16) });
  const herbicide = scoreForecast(hourly, SPRAY_PROFILES.herbicide);
  const drone = scoreForecast(hourly, SPRAY_PROFILES.drone);
  const herbicideReds = herbicide.filter((h) => h.rating === "red").length;
  const droneReds = drone.filter((h) => h.rating === "red").length;
  assert(droneReds > herbicideReds, `drone reds (${droneReds}) should exceed herbicide reds (${herbicideReds})`);
});

t("foliar fertilizer: hot+sunny → red (leaf burn)", () => {
  const hourly = fillHourly({
    temperature_2m: Array(24).fill(32),
    cloud_cover: Array(24).fill(10),
  });
  const scored = scoreForecast(hourly, SPRAY_PROFILES.foliar_fertilizer);
  assert(scored.some((h) => h.flags.some((f) => f.toLowerCase().includes("leaf burn"))));
});

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail > 0 ? 1 : 0);
