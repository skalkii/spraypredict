"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

interface Props {
  initialLat?: number;
  initialLng?: number;
  onPick: (lat: number, lng: number) => void;
}

export function MapPicker({ initialLat, initialLng, onPick }: Props) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const markerRef = useRef<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !elRef.current) return;

      const startLat = initialLat ?? 20;
      const startLng = initialLng ?? 0;
      const startZoom = initialLat != null ? 9 : 2;

      const map = L.map(elRef.current, {
        zoomControl: true,
        attributionControl: true,
      }).setView([startLat, startLng], startZoom);
      mapRef.current = map;

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        className: "",
        html:
          `<div style="width:24px;height:24px;border-radius:50% 50% 50% 0;` +
          `background:#C96442;border:3px solid #FAF9F5;` +
          `transform:rotate(-45deg);box-shadow:0 2px 4px rgba(31,31,30,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      });

      if (initialLat != null && initialLng != null) {
        markerRef.current = L.marker([initialLat, initialLng], { icon }).addTo(map);
      }

      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        const { lat, lng } = e.latlng;
        if (markerRef.current) {
          (markerRef.current as { setLatLng: (ll: [number, number]) => void }).setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], { icon }).addTo(map);
        }
        onPick(+lat.toFixed(4), +lng.toFixed(4));
      });
    })();
    return () => {
      cancelled = true;
      if (mapRef.current) {
        (mapRef.current as { remove: () => void }).remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={elRef}
      className="w-full h-64 rounded-xl border border-cream-200 dark:border-ink-700 overflow-hidden z-0 dark:[filter:invert(0.92)_hue-rotate(180deg)_saturate(0.5)]"
      aria-label="Click on the map to pick a location"
    />
  );
}
