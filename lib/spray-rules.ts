import { deltaT } from "./delta-t";
import type {
  HourScored,
  OpenMeteoHourly,
  RuleResult,
} from "./types";

export interface SprayProfile {
  id: string;
  label: string;
  description: string;
  rainFreeAfterHours: number;
  rainProbThreshold: number;
  preferMorningEvening: boolean;
  humidityRange: [number, number];
  tempRange: [number, number];
  humidityHardMax?: number;
  avoidLeafWetness: boolean;
}

export const SPRAY_PROFILES: Record<string, SprayProfile> = {
  pesticide_contact: {
    id: "pesticide_contact",
    label: "Contact pesticide",
    description: "Surface-acting insecticide (e.g., contact pyrethroid).",
    rainFreeAfterHours: 4,
    rainProbThreshold: 20,
    preferMorningEvening: true,
    humidityRange: [40, 80],
    tempRange: [10, 25],
    avoidLeafWetness: true,
  },
  pesticide_systemic: {
    id: "pesticide_systemic",
    label: "Systemic pesticide",
    description: "Plant-absorbed insecticide. Needs uptake window.",
    rainFreeAfterHours: 6,
    rainProbThreshold: 15,
    preferMorningEvening: true,
    humidityRange: [40, 85],
    tempRange: [10, 28],
    avoidLeafWetness: false,
  },
  fungicide_contact: {
    id: "fungicide_contact",
    label: "Contact fungicide",
    description: "Surface fungicide (e.g., Mancozeb). Needs long dry window.",
    rainFreeAfterHours: 8,
    rainProbThreshold: 15,
    preferMorningEvening: false,
    humidityRange: [40, 80],
    tempRange: [10, 25],
    humidityHardMax: 90,
    avoidLeafWetness: true,
  },
  fungicide_systemic: {
    id: "fungicide_systemic",
    label: "Systemic fungicide",
    description: "Absorbed fungicide. More tolerant of humidity.",
    rainFreeAfterHours: 3,
    rainProbThreshold: 25,
    preferMorningEvening: false,
    humidityRange: [40, 85],
    tempRange: [10, 28],
    avoidLeafWetness: false,
  },
  herbicide: {
    id: "herbicide",
    label: "Herbicide",
    description: "Weed killer. Needs uptake window and low drift.",
    rainFreeAfterHours: 6,
    rainProbThreshold: 15,
    preferMorningEvening: true,
    humidityRange: [40, 80],
    tempRange: [10, 25],
    avoidLeafWetness: false,
  },
  foliar_fertilizer: {
    id: "foliar_fertilizer",
    label: "Foliar fertilizer",
    description: "Liquid nutrient via leaves. Cool + humid preferred.",
    rainFreeAfterHours: 3,
    rainProbThreshold: 30,
    preferMorningEvening: true,
    humidityRange: [40, 70],
    tempRange: [15, 25],
    avoidLeafWetness: false,
  },
};

const RED = -10;

function bandedScore(
  value: number,
  green: [number, number],
  yellow: [number, number],
): { delta: number; band: RuleResult } {
  if (value >= green[0] && value <= green[1]) return { delta: 2, band: "green" };
  if (value >= yellow[0] && value <= yellow[1]) return { delta: 1, band: "yellow" };
  return { delta: RED, band: "red" };
}

function hourOfDay(iso: string): number {
  const m = iso.match(/T(\d{2}):/);
  return m ? parseInt(m[1], 10) : -1;
}

function sumWindow(arr: number[], start: number, count: number): number {
  let s = 0;
  for (let i = start; i < start + count && i < arr.length; i++) s += arr[i] ?? 0;
  return s;
}

function maxWindow(arr: number[], start: number, count: number): number {
  let m = 0;
  for (let i = start; i < start + count && i < arr.length; i++) m = Math.max(m, arr[i] ?? 0);
  return m;
}

function sumLookback(arr: number[], end: number, count: number): number {
  let s = 0;
  for (let i = Math.max(0, end - count); i < end; i++) s += arr[i] ?? 0;
  return s;
}

export function scoreHour(
  idx: number,
  hourly: OpenMeteoHourly,
  profile: SprayProfile,
): HourScored {
  const time = hourly.time[idx];
  const temp = hourly.temperature_2m[idx];
  const humidity = hourly.relative_humidity_2m[idx];
  const wind = hourly.wind_speed_10m[idx];
  const gusts = hourly.wind_gusts_10m[idx];
  const windDir = hourly.wind_direction_10m[idx];
  const precip = hourly.precipitation[idx];
  const precipProb = hourly.precipitation_probability[idx];
  const cloudCover = hourly.cloud_cover[idx];

  const dt = deltaT(temp, humidity);

  const rainNextWindowMm = sumWindow(hourly.precipitation, idx, profile.rainFreeAfterHours);
  const rainNextWindowProb = maxWindow(
    hourly.precipitation_probability,
    idx,
    profile.rainFreeAfterHours,
  );
  const rainPast2hMm = sumLookback(hourly.precipitation, idx, 2);

  const flags: string[] = [];
  const positives: string[] = [];
  let score = 0;
  let red = false;

  // Wind speed
  const windBand = bandedScore(wind, [3, 10], [10, 15]);
  if (wind < 3) {
    flags.push(`Wind too calm (${wind.toFixed(1)} km/h) — inversion risk`);
    red = true;
  } else if (wind > 15) {
    flags.push(`Wind too strong (${wind.toFixed(1)} km/h) — drift risk`);
    red = true;
  } else {
    score += windBand.delta;
    if (windBand.band === "green") positives.push(`Wind ideal (${wind.toFixed(1)} km/h)`);
    else flags.push(`Wind marginal (${wind.toFixed(1)} km/h)`);
  }

  // Gusts
  if (gusts > 20) {
    flags.push(`Gusts ${gusts.toFixed(1)} km/h — high drift risk`);
    red = true;
  } else if (gusts > 15) {
    flags.push(`Gusts ${gusts.toFixed(1)} km/h — marginal`);
    score += 1;
  } else {
    score += 2;
  }

  // Rain free after spray
  if (rainNextWindowMm > 0 || rainNextWindowProb > 40) {
    flags.push(
      `Rain expected in next ${profile.rainFreeAfterHours}h (${rainNextWindowMm.toFixed(1)}mm, ${rainNextWindowProb}%)`,
    );
    red = true;
  } else if (rainNextWindowProb > profile.rainProbThreshold) {
    flags.push(`Rain risk ${rainNextWindowProb}% in next ${profile.rainFreeAfterHours}h`);
    score += 1;
  } else {
    score += 2;
    positives.push(`Dry next ${profile.rainFreeAfterHours}h`);
  }

  // Leaf wetness lookback
  if (profile.avoidLeafWetness && rainPast2hMm > 0.5) {
    flags.push(`Leaves wet (${rainPast2hMm.toFixed(1)}mm in last 2h)`);
    red = true;
  } else if (rainPast2hMm > 0) {
    score += 1;
    flags.push(`Light moisture on leaves (${rainPast2hMm.toFixed(1)}mm)`);
  } else {
    score += 2;
  }

  // Temperature
  const [tMin, tMax] = profile.tempRange;
  if (temp < tMin - 2 || temp > tMax + 8) {
    flags.push(`Temp ${temp.toFixed(1)}°C outside safe range`);
    red = true;
  } else if (temp >= tMin && temp <= tMax) {
    score += 2;
    positives.push(`Temp ideal (${temp.toFixed(1)}°C)`);
  } else {
    score += 1;
    flags.push(`Temp ${temp.toFixed(1)}°C marginal`);
  }

  // Humidity
  const [hMin, hMax] = profile.humidityRange;
  const hardHumidityMax = profile.humidityHardMax ?? 95;
  if (humidity < 25 || humidity > hardHumidityMax) {
    flags.push(`Humidity ${humidity}% out of range`);
    red = true;
  } else if (humidity >= hMin && humidity <= hMax) {
    score += 2;
    positives.push(`Humidity ideal (${humidity}%)`);
  } else {
    score += 1;
    flags.push(`Humidity ${humidity}% marginal`);
  }

  // Delta-T
  if (dt < 2) {
    flags.push(`Delta-T ${dt.toFixed(1)}°C — too humid, poor droplet drying`);
    red = true;
  } else if (dt > 10) {
    flags.push(`Delta-T ${dt.toFixed(1)}°C — evaporation risk`);
    red = true;
  } else if (dt >= 2 && dt <= 8) {
    score += 2;
    positives.push(`Delta-T ideal (${dt.toFixed(1)}°C)`);
  } else {
    score += 1;
    flags.push(`Delta-T ${dt.toFixed(1)}°C marginal`);
  }

  // Time-of-day preference (midday penalty when hot)
  const hr = hourOfDay(time);
  if (profile.preferMorningEvening && temp > 28 && hr >= 10 && hr <= 16) {
    flags.push(`Midday heat (${hr}:00, ${temp.toFixed(1)}°C) — drift/evaporation`);
    score -= 3;
  } else if (profile.preferMorningEvening && ((hr >= 6 && hr <= 9) || (hr >= 16 && hr <= 19))) {
    score += 1;
    positives.push(`Good time of day (${hr}:00)`);
  }

  // Foliar fertilizer leaf-burn override
  if (profile.id === "foliar_fertilizer" && temp > 28 && cloudCover < 30) {
    flags.push(`Hot + sunny — leaf burn risk`);
    red = true;
  }

  let rating: RuleResult;
  if (red) {
    rating = "red";
    score = Math.min(score, RED);
  } else if (score >= 10) {
    rating = "green";
  } else if (score >= 5) {
    rating = "yellow";
  } else {
    rating = "red";
  }

  return {
    time,
    temp,
    humidity,
    windSpeed: wind,
    windGusts: gusts,
    windDirection: windDir,
    precipitationMm: precip,
    precipitationProb: precipProb,
    rainNextWindowMm,
    rainNextWindowProb,
    rainPast2hMm,
    deltaT: dt,
    cloudCover,
    score,
    rating,
    flags,
    positives,
  };
}

export function scoreForecast(
  hourly: OpenMeteoHourly,
  profile: SprayProfile,
): HourScored[] {
  return hourly.time.map((_, i) => scoreHour(i, hourly, profile));
}
