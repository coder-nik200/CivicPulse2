# CivicPulse

CivicPulse is a civic-issue reporting demo with a responsive Next.js frontend and a working API.

## Quick start (recommended)

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The included Next.js API (`/api/issues`) is used automatically, so no database, API key, or second process is required for the demo.

## Map experience

The map page uses Leaflet with OpenStreetMap tiles, real marker coordinates, marker clusters, category and priority filters, synchronized nearby-issue selection, browser geolocation, responsive controls, and live OpenStreetMap/Nominatim place search. Internet access is required by the browser for map tiles and place suggestions.

## API

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/issues` | List issues, optionally filtered by category or status |
| `POST` | `/api/issues` | Create a civic issue from photo, location, and details |
| `GET` | `/api/issues/:id` | Get an issue |
| `PATCH` | `/api/issues/:id` | Update an issue status |

## Optional standalone backend

The matching Express implementation lives at `../civic-backend/backend` and can be run separately:

```bash
cd ../civic-backend/backend
npm install
npm start
```

To use it, create `.env.local` in this directory with `NEXT_PUBLIC_API_URL=http://localhost:5001/api`, then restart the Next.js app. Both implementations intentionally use the same response shapes.

## Notes

- The demo uses in-memory data. Restarting either server resets newly submitted reports.
- Do not add API keys to the frontend; external AI and database services are optional future integrations.

## Full-stack flows

The built-in API is the active source of truth for the running demo. It supports geographically bounded and nearby issue queries, validated lifecycle transitions with status history, dashboard metrics, and event-driven notifications. The admin dashboard refreshes automatically and updates are immediately visible to the map and issue-detail views.
