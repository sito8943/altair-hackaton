# Health Risk Command Center

A Vite + React single-page application that simulates a clinical "command center" for assessing individual health risks. It guides care teams through a multi-step intake, persists answers locally, optionally calls a predictive API, and renders an interactive dashboard with explanations, fairness cues, and exportable summaries.

## Summary
- **Patient intake flow:** Splash screen plus three guided steps (demographics, vitals, lifestyle) built with Material UI and animated transitions.
- **Local persistence & validation:** Form state is saved to `localStorage`, validated per-step, and can be reset via a confirmation dialog.
- **Realtime scoring:** Submissions hit `/health` for readiness checks and `/predict` for scores, or fall back to deterministic mock data via a feature flag.
- **Results intelligence:** The `ResultView` renders gauges, radar charts, risk factor explanations, what-if sliders, and fairness/data-quality callouts.
- **Modern toolchain:** React 19, React Router 7, TypeScript 5.9, MUI 7, Emotion, Vite 7, and Recharts for visualizations.

## Requirements
- Node.js **18.18+** (or any runtime officially supported by Vite 7)
- npm **10+** (ships with Node 18; pnpm/yarn work if you prefer)
- Access to the REST API you plan to query (or enable the mock flag)

## Getting Started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Create your env file** by copying `.env.example` to `.env` and updating the values described below.
3. **Run the development server**
   ```bash
   npm run dev
   ```
4. Visit the printed URL (default `http://localhost:5173`) and walk through the intake. Routing is handled by `BrowserRouter`, so keep the dev server running while testing.

## Environment Variables
All configuration is read via Vite's `import.meta.env` namespace. Use `.env` (ignored by Git) to override defaults.

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL of the predictive service. The frontend calls `GET /health` and `POST /predict` relative to this host. Include protocol (e.g., `https://your-api.ngrok-free.dev`). |
| `VITE_ENABLE_MOCK_API` | When set to `"true"`, the app skips network calls, fakes a short delay, and returns `src/data/mockPredictionResult.ts`. Perfect for demos or offline work. |
| `VITE_ENABLE_SOCIO_DEMO_FIELDS` | Toggles extended socioeconomic fields in the payload. Disable to only collect clinical vitals/lifestyle data. |

> Tip: Use `VITE_ENABLE_MOCK_API=true` while building UI and flip it off once the backend is reachable.

## Available Scripts
- `npm run dev` – start Vite in development mode with HMR.
- `npm run build` – type-check via `tsc -b` and create a production build in `dist/`.
- `npm run preview` – serve the production build locally for QA.
- `npm run lint` – run ESLint (includes React/TypeScript rules configured in `eslint.config.js`).
- `npm run deploy` – Firebase Hosting deploy (targets the `altair-hackathon` site defined in `firebase.json`).

## Project Structure (excerpt)
```
src/
  components/
    HealthStepperForm.tsx     # Multi-step intake wizard & validation
    ResultView.tsx            # Interactive dashboard for prediction output
    SplashScreen.tsx          # Landing page + CTA to launch intake
    health-stepper/*          # Sidebar, navigation, reset controls, animations
  config/featureFlags.ts      # Reads env vars for mock + socio-demo toggles
  data/mockPredictionResult.ts# Static fallback payload used in mock mode
  services/api.ts             # Axios client + `/predict` & `/health` helpers
  utils/normalizeResult.ts    # Normalizes backend payloads for UI consumption
```

## Features
- **Guided wizard UX:** Desktop sidebar & mobile stepper, animated transitions (`react-transition-group`), contextual alerts, and reset confirmations.
- **Client-side persistence:** Intake values are auto-saved via `localStorage` and rehydrated on reload; a storage key handles migration.
- **Calculated payloads:** BMI and other derived numbers are computed before sending to the API, respecting the socio-demographic flag.
- **Health service integration:** `checkApiHealth` pings `/health` once the app mounts; `predictRisk` serializes snake_case payloads for `/predict`.
- **Data storytelling:** Result cards highlight highest-risk conditions, top drivers/protective factors, fairness metrics, radar comparisons, and a what-if simulator with sliders.
- **Export for records:** Users can jump back to intake or trigger a browser print (PDF export) straight from the dashboard.

## How to Use
1. Navigate to `/` to see the Splash screen and click **Launch Intake**.
2. Complete each intake step. Required fields are validated before you can continue.
3. Click **Submit & Generate** on the final step. The app will either:
   - call your backend (`POST /predict`) and normalize the response, or
   - return the mock payload if `VITE_ENABLE_MOCK_API=true`.
4. Review the **Results** dashboard:
   - Gauge + chips summarize overall risk & trend.
   - Disease cards list probabilities and explanation drivers.
   - Data quality, fairness, and scenario sliders suggest next actions.
   - Use **Exportar PDF** to print/save the entire screen.
5. Click **Back to intake** to adjust answers; state persists unless you reset the form.

## Deployment Notes
- Production builds live in `dist/` (static assets). Host anywhere that can serve SPA assets or run `npm run deploy` for Firebase Hosting.
- Ensure environment variables are injected at build time (e.g., `.env.production` or CI secrets). Vite inlines `VITE_*` vars when bundling.

## Troubleshooting
- **API unreachable:** Check the browser console for Axios errors. Most failures show a fallback message guiding you to verify the backend.
- **Health check keeps failing:** Confirm that `GET {VITE_API_BASE_URL}/health` returns `{ status: "ok" }` and that CORS/ngrok headers allow browser traffic.
- **Stale form data:** Use the reset button (top-right of the form panel) to clear stored answers and start fresh.

Feel free to extend the UI, add new steps, or plug into a different inference endpoint—the architecture favors modular components and clear data contracts.

