export type RuleResult = "green" | "yellow" | "red";

export interface OpenMeteoHourly {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  precipitation_probability: number[];
  precipitation: number[];
  wind_speed_10m: number[];
  wind_gusts_10m: number[];
  wind_direction_10m: number[];
  cloud_cover: number[];
  dew_point_2m: number[];
  uv_index: number[];
}

export interface OpenMeteoForecast {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  utc_offset_seconds: number;
  hourly_units: Record<string, string>;
  hourly: OpenMeteoHourly;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code?: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
}

export interface HourScored {
  time: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  windGusts: number;
  windDirection: number;
  precipitationMm: number;
  precipitationProb: number;
  rainNextWindowMm: number;
  rainNextWindowProb: number;
  rainPast2hMm: number;
  deltaT: number;
  cloudCover: number;
  score: number;
  rating: RuleResult;
  flags: string[];
  positives: string[];
}

export interface SprayWindow {
  startTime: string;
  endTime: string;
  durationHours: number;
  rating: RuleResult;
  avgScore: number;
}

export interface ForecastResponse {
  location: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
  sprayType: string;
  sprayLabel: string;
  hours: HourScored[];
  windows: SprayWindow[];
  bestWindow: SprayWindow | null;
}
