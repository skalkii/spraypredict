"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { GeocodingResult } from "@/lib/types";
import { MapPin, Search, Loader } from "./Icons";

const MapPicker = dynamic(() => import("./MapPicker").then((m) => m.MapPicker), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-500 text-sm">
      Loading map…
    </div>
  ),
});

export interface PickedLocation {
  latitude: number;
  longitude: number;
  label: string;
}

interface Props {
  value: PickedLocation | null;
  onChange: (loc: PickedLocation | null) => void;
}

export function LocationPicker({ value, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  function useBrowserGeolocation() {
    if (!navigator.geolocation) {
      setGeoError("Geolocation not supported by this browser");
      return;
    }
    setGeoError(null);
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLoading(false);
        onChange({
          latitude: +pos.coords.latitude.toFixed(4),
          longitude: +pos.coords.longitude.toFixed(4),
          label: `My location (${pos.coords.latitude.toFixed(2)}°, ${pos.coords.longitude.toFixed(2)}°)`,
        });
        setQuery("");
        setResults([]);
      },
      (err) => {
        setGeoLoading(false);
        setGeoError(err.message || "Could not get location");
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
    );
  }

  function pick(r: GeocodingResult) {
    const parts = [r.name, r.admin1, r.country].filter(Boolean);
    onChange({
      latitude: r.latitude,
      longitude: r.longitude,
      label: parts.join(", "),
    });
    setQuery("");
    setResults([]);
  }

  function pickFromMap(lat: number, lng: number) {
    onChange({
      latitude: lat,
      longitude: lng,
      label: `Pinned (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
    });
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={useBrowserGeolocation}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white px-4 py-3 font-medium hover:bg-emerald-700 active:bg-emerald-800 transition disabled:opacity-60"
        disabled={geoLoading}
      >
        {geoLoading ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : (
          <MapPin className="w-5 h-5" />
        )}
        {geoLoading ? "Locating…" : "Use my current location"}
      </button>
      {geoError && <p className="text-sm text-rose-600">{geoError}</p>}

      <div className="text-center text-xs uppercase tracking-wide text-slate-500">
        or search a city
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Bengaluru, Nairobi, Iowa City"
          className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
        {searching && (
          <Loader className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" />
        )}
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setShowMap((v) => !v)}
          className="text-sm text-emerald-700 hover:text-emerald-900 underline"
        >
          {showMap ? "Hide map" : "or pin on a map"}
        </button>
      </div>

      {showMap && (
        <MapPicker
          initialLat={value?.latitude}
          initialLng={value?.longitude}
          onPick={pickFromMap}
        />
      )}

      {results.length > 0 && (
        <ul className="rounded-lg border border-slate-200 bg-white divide-y divide-slate-100 overflow-hidden">
          {results.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => pick(r)}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 active:bg-slate-100"
              >
                <div className="font-medium text-slate-900">{r.name}</div>
                <div className="text-sm text-slate-500">
                  {[r.admin1, r.country].filter(Boolean).join(", ")} ·{" "}
                  {r.latitude.toFixed(2)}°, {r.longitude.toFixed(2)}°
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {value && (
        <div className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-emerald-700">
              Selected
            </div>
            <div className="font-medium text-emerald-900">{value.label}</div>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-sm text-emerald-700 underline hover:text-emerald-900"
          >
            Change
          </button>
        </div>
      )}
    </div>
  );
}
