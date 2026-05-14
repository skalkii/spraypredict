# Spray Window Predictor

Mobile-first web app that tells farmers the optimal hourly time windows
to spray pesticides, fungicides, herbicides, or foliar fertilizers in
the next five days at any field location. Free, no signup, no API keys,
powered by Open-Meteo weather data.

Repo: <https://github.com/skalkii/spraypredict>.

---

## What it does

1. Pick a location — browser geolocation, city search, or click a point
   on the map.
2. Pick a spray type — seven profiles covering contact and systemic
   pesticides, contact and systemic fungicides, herbicide, foliar
   fertilizer, and drone application (tighter wind envelope).
3. Get a 5-day hourly forecast color-coded green / amber / rose. Tap
   any hour to see the underlying weather (wind speed + direction,
   gusts, rain risk, Delta-T, humidity) and the human-readable reasons
   each rule fired.

The rules engine is a pure scoring function over agronomic thresholds
(wind, gusts, rain look-ahead, leaf wetness, temperature, humidity,
Delta-T, time-of-day). No ML, no training, no fitting. Thresholds
follow EPA / FAO / ICAR extension guidance and are intentionally
conservative.

## Features

- 7 spray-product profiles (data-table — add a profile, it appears in
  the picker automatically).
- Per-profile wind / gust caps (drone is stricter than ground-rig).
- Sunrise/sunset overlay — night hours are dimmed since spraying in
  darkness usually isn't operable.
- Wind direction arrow + 16-point compass — judge drift trajectory.
- Per-day summary chips (`3 good · 2 marginal · 19 avoid`).
- Best-window banner + full list of detected windows.
- Light / dark / system theme with no flash on load.
- 5 languages: English, हिन्दी (Hindi), मराठी (Marathi), ಕನ್ನಡ
  (Kannada), नेपाली (Nepali). Cookie-persisted, SSR-rendered.
- Pin-on-map via Leaflet + OpenStreetMap (no API key, lazy-loaded —
  only ships if user opens the map).
- Pure server-rendered first paint — no client fetch waterfall.

## Stack

| Layer | Tool | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) + TypeScript | SSR, server components, easy Vercel deploy |
| Styling | Tailwind CSS 3 (custom palette) | Mobile-first utility CSS |
| Weather | Open-Meteo Forecast API | Free, no key, no rate limit non-commercial |
| Geocoding | Open-Meteo Geocoding API | Free, no key |
| Map | Leaflet + OpenStreetMap tiles | No key, lazy-loaded |
| Tests | tsx + Node's assert | Zero test framework |
| Hosting | Vercel free tier | One-click deploy |

Monthly cost: $0. No database, no AI inference, no API keys required
for any feature shipped today.

## Quick start (local)

Prerequisites: Node.js 18 or newer, npm.

```bash
git clone https://github.com/skalkii/spraypredict.git
cd spraypredict
npm install
npm run dev
```

Open <http://localhost:3000> in a browser.

## Commands

```bash
npm run dev      # development server on :3000
npm run build    # production build, runs ESLint + TypeScript checks
npm start        # serve the production build (run build first)
npm run lint     # ESLint only
npm test         # 9 unit tests (rules engine + window detector)
```

## Project layout

```
app/
  api/forecast/route.ts       # GET ?lat=&lng=&sprayType= → scored hours + windows
  api/geocode/route.ts        # GET ?q= → city matches
  forecast/page.tsx           # SSR forecast page
  page.tsx                    # SSR landing page
  layout.tsx                  # root layout, theme init script
  globals.css
  icon.svg                    # favicon (auto-discovered by Next 14)
lib/
  types.ts                    # OpenMeteo + HourScored + Window types
  openmeteo.ts                # API wrapper, retry on 5xx
  delta-t.ts                  # Stull 2011 wet-bulb approximation
  spray-rules.ts              # SPRAY_PROFILES + scoreForecast()
  window-detector.ts          # contiguous green/yellow windows
  format.ts                   # rating colors + day-grouping helpers
  i18n.ts                     # Strings dict for 5 languages
  i18n-server.ts              # cookie-based getLang/getTheme
  theme.ts                    # Theme type + init script string
components/
  Header.tsx Footer.tsx
  LandingClient.tsx
  LocationPicker.tsx MapPicker.tsx SprayTypePicker.tsx
  ForecastCalendar.tsx HourDetailModal.tsx WindowSummary.tsx
  Explainer.tsx
  LanguagePicker.tsx ThemePicker.tsx
  Icons.tsx                   # inline SVG icon set
__tests__/
  spray-rules.test.ts         # 9 scenarios incl. drone profile
```

## API

### GET /api/forecast

Query params:
- `lat` — latitude, e.g. `12.97`
- `lng` — longitude, e.g. `77.59`
- `sprayType` — one of `pesticide_contact`, `pesticide_systemic`,
  `fungicide_contact`, `fungicide_systemic`, `herbicide`,
  `foliar_fertilizer`, `drone`

Returns JSON `{ location, sprayType, sprayLabel, hours[], windows[],
bestWindow }`. 120 hours (5 × 24) per call. Cached for 10 minutes.

```bash
curl -s "http://localhost:3000/api/forecast?lat=12.97&lng=77.59&sprayType=fungicide_contact" | head -c 400
```

### GET /api/geocode

Query params: `q` — city name (≥2 chars).

Returns `{ results: [{ name, latitude, longitude, country, admin1 }] }`.
Cached for 1 hour.

```bash
curl -s "http://localhost:3000/api/geocode?q=Bengaluru"
```

## Spray profiles and thresholds

All profiles share universal thresholds for wind (3–10 km/h ideal,
15 km/h hard cap), gusts (15 yellow, 20 hard cap), rain-in-window
(0 mm, ≤15–25% probability depending on profile), Delta-T (2–8°C
ideal, < 0 or > 12 hard fail), and Delta-T-aware humidity bands.

Profile-specific overrides:

| Profile | Rain-free after | Rain prob threshold | Temp ideal | Wind hard cap | Notes |
|---|---|---|---|---|---|
| Contact pesticide | 4h | 20% | 10–25°C | 15 km/h | Prefers morning / evening when hot |
| Systemic pesticide | 6h | 15% | 10–28°C | 15 km/h | — |
| Contact fungicide | 8h | 15% | 10–25°C | 15 km/h | Hard humidity cap 90%; avoid wet leaves |
| Systemic fungicide | 3h | 25% | 10–28°C | 15 km/h | More humidity-tolerant |
| Herbicide | 6h | 15% | 10–25°C | 15 km/h | Morning / evening preferred |
| Foliar fertilizer | 3h | 30% | 15–25°C | 15 km/h | Hot + sunny triggers leaf-burn red |
| Drone | 4h | 15% | 10–28°C | 12 km/h | Gust hard cap 15 km/h |

Source: `lib/spray-rules.ts`. Add a profile by adding an entry to
`SPRAY_PROFILES` — the picker, API, and routing pick it up
automatically.

## Internationalization

Languages: `en` (default), `hi`, `mr`, `kn`, `ne`. Selection is
persisted in the `lang` cookie. Server reads the cookie, picks the
dictionary, passes pre-translated strings as props to client
components — no client-side hydration mismatch, no flash of English
content.

Adding a language: add the new code to `Lang` in `lib/i18n.ts`, add
the dict entry, add the entry to `LANGS[]`. TypeScript's `Strings`
interface enforces every key is present, so the build fails until
the new language has every string.

Translations shipped today are first-pass and should be reviewed by
a native speaker before being shown to actual farmers. Rule-flag
strings inside the engine (`"Wind too calm (1.5 km/h) — inversion
risk"`) are still English — they include numeric data and need
template support to translate well.

## Theming

Three modes: `light`, `dark`, `system`. The selection is persisted
in the `theme` cookie. An inline blocking script in `<head>` reads
the cookie before paint and adds the `dark` class to `<html>`,
eliminating any dark/light flash on initial load. `system` mode
listens to `prefers-color-scheme` and updates live when the OS
appearance changes.

Traffic-light rating colors (emerald / amber / rose) are kept in
both modes because farmers rely on a universal green/yellow/red
signal.

## Configuration / environment variables

**None for the core app.** No `.env` is needed. Open-Meteo requires
no API key. Vercel deploys with zero environment variables.

Future features that would add keys (none shipped):
- Saved locations: Supabase or any Postgres (`DATABASE_URL`)
- Push alerts: VAPID (`VAPID_PUBLIC`, `VAPID_PRIVATE`, generate via
  `npx web-push generate-vapid-keys`)
- SMS alerts: Twilio (`TWILIO_SID`, `TWILIO_TOKEN`)
- WhatsApp bot: Meta Cloud API (`WHATSAPP_TOKEN`,
  `WHATSAPP_PHONE_ID`)

## Deploy

### Vercel (recommended, free, zero config)

1. Push the repo to GitHub.
2. Open <https://vercel.com/new>, import the repo.
3. Framework auto-detects Next.js. No environment variables. Deploy.

CLI: `npx vercel --yes` from the repo root.

### Anywhere else

```bash
npm run build
npm start
```

Listens on port 3000 by default. Override with `PORT=8080 npm start`.

## Testing on a phone over LAN

```bash
ifconfig en0 | grep "inet "    # find your Mac LAN IP, e.g. 192.168.1.42
PORT=3000 npm run dev
# then on phone, same wifi: http://192.168.1.42:3000
```

Browser geolocation requires HTTPS *except* on `localhost`. Over
LAN IP the geolocate button will block — use city search or pin on
map. Vercel preview deployments are HTTPS, so geo works there.

## Disclaimer

Always follow product label instructions. This tool is a guide, not
a substitute for professional agronomic advice. Weather forecasts
are model output and can be wrong — always cross-check critical
decisions against multiple sources (Windy, AccuWeather, your local
extension service).

## License

MIT.

## Credits

- Weather and geocoding: [Open-Meteo](https://open-meteo.com).
- Map tiles: [OpenStreetMap contributors](https://www.openstreetmap.org/copyright).
- Wet-bulb formula: Stull, R. (2011), *Wet-Bulb Temperature from
  Relative Humidity and Air Temperature*. J. Appl. Meteor. Climatol.,
  50, 2267–2269.
- Built with [Claude Code](https://claude.com/claude-code).
