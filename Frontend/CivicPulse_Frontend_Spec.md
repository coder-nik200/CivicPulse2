# CivicPulse — Frontend Product & Engineering Specification

> Hackathon Problem #31: Pothole/Civic Issue Reporter with Map View. The official statement asks for citizen reporting of potholes, garbage, or streetlights using a photo and GPS pin, visible on a shared map. The specification below turns that base requirement into a stronger AI-powered civic issue lifecycle.

## 1. Product Overview

**Product:** CivicPulse

**Positioning:** AI-powered civic issue intelligence and resolution-tracking platform.

Core lifecycle:

**Citizen Evidence → AI Understanding → Verification → Priority → Authority Action → Resolution → Verification → Closure**

The frontend must make this lifecycle obvious.

### Users

**Citizen**
- Report a civic issue.
- Upload photo.
- Share/use location.
- View nearby issues.
- Track an issue.
- Confirm whether a resolved issue is actually fixed.

**Authority/Admin**
- View all issues.
- See issues on a map.
- Review AI analysis.
- Prioritize issues.
- Assign teams.
- Change status.
- Mark issues resolved.
- Review resolution evidence.

---

# 2. Product Principles

### Evidence First
Every issue should be represented with:
- Photo
- Location
- Category
- AI confidence
- Severity
- Report count
- Status
- Timeline

### Prioritize, Don't Just List
The admin dashboard must make it immediately obvious which issues deserve attention first.

### AI Is Analysis, Not Absolute Truth
Use wording such as:
- `Pothole — 96% AI confidence`
- `Severity — 8.7/10`

Do not present AI as infallible.

### Lifecycle Visibility
A citizen should always know where their issue stands.

### Demo First
Prioritize the features that make the hackathon demo strong. Avoid low-value features that create engineering overhead.

---

# 3. Recommended Frontend Stack

## Core
- Next.js
- React
- TypeScript
- Tailwind CSS

## UI
- shadcn/ui
- Lucide icons

## Forms
- React Hook Form
- Zod where validation is useful

## Map
- Leaflet
- React-Leaflet
- OpenStreetMap tiles

## Backend Integration
- Next.js Route Handlers
- Firebase Firestore
- Firebase Storage or Cloudinary

## Realtime
Do **not** build Socket.IO for this hackathon.
Use Firestore realtime listeners where needed.

---

# 4. Frontend Architecture

Recommended structure:

```text
src/
├── app/
│   ├── page.tsx
│   ├── report/
│   │   └── page.tsx
│   ├── map/
│   │   └── page.tsx
│   ├── issues/
│   │   └── [id]/
│   │       └── page.tsx
│   └── admin/
│       ├── page.tsx
│       └── issues/
│           └── [id]/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── issue/
│   ├── map/
│   ├── dashboard/
│   ├── report/
│   └── timeline/
│
├── lib/
│   ├── api.ts
│   ├── firebase.ts
│   └── utils.ts
│
├── hooks/
│   ├── useIssues.ts
│   ├── useIssue.ts
│   └── useGeolocation.ts
│
├── types/
│   └── issue.ts
│
└── data/
    └── demoIssues.ts
```

---

# 5. Core Screens

Build these five screens first.

## Screen 1 — Landing / Home

### Goal
A visitor should understand the product in 5–10 seconds.

Suggested structure:

```text
------------------------------------------------
Navbar
CivicPulse                         Report Issue
------------------------------------------------

        Report what affects
        your everyday life.

   Turn civic problems into
   evidence-backed action.

      [ Report an Issue ]
      [ Explore Civic Map ]

------------------------------------------------
LIVE CITY STATUS

  128 Issues     43 Open     31 In Progress
  54 Resolved
------------------------------------------------

        Civic hotspot preview map
------------------------------------------------
```

Primary CTA:
**Report an Issue**

Secondary CTA:
**Explore Civic Map**

Avoid making this a long marketing website.

---

# 6. Screen 2 — Report Issue

This is the most important citizen flow.

## User flow

```text
Upload Photo
     ↓
Get Location
     ↓
Optional Description
     ↓
Submit
     ↓
AI Analysis
     ↓
Result
```

### Initial UI

```text
------------------------------------------------
Report a Civic Issue
------------------------------------------------

[ Upload / Take Photo ]

Supported examples:
Pothole • Garbage • Streetlight

------------------------------------------------

Issue Location

[ Use My Current Location ]

Location:
Sector 15, Gurgaon

------------------------------------------------

Description (Optional)

[ Large text input ]

------------------------------------------------

        [ Analyze & Report ]
------------------------------------------------
```

### Analysis loading state

```text
Analyzing your report...

✓ Reading image
✓ Identifying issue
✓ Estimating severity
● Checking nearby reports
```

### Result state

```text
Issue Detected

Pothole
96% AI Confidence

Severity
8.7 / 10

Priority
92 / 100

[ View Issue ]
```

---

# 7. Screen 3 — Civic Map

The map is a major visual feature.

Show:
- Issue markers
- Current user location when available
- Category filters
- Status filters
- Severity filters
- Selected issue preview

Example filter bar:

```text
[ All ]
[ Potholes ]
[ Garbage ]
[ Streetlights ]

[ Open ]
[ In Progress ]
[ Resolved ]
```

### Marker behaviour

Visualize severity using:
- size
- icon
- label
- color as a secondary signal

Do not rely only on color.

### Marker click

Show a compact preview:

```text
Pothole
Severity 8.7

Sector 15

12 citizen reports

IN PROGRESS

[ View Details ]
```

---

# 8. Screen 4 — Issue Details

This page must clearly explain one issue.

## Header

```text
Pothole
CIV-1024

HIGH PRIORITY
Severity 8.7/10
```

## Evidence

```text
BEFORE

[ Large issue photo ]

AI Analysis
Pothole
96% confidence

Severity
8.7 / 10
```

## Location
Show a small map.

## Citizen reports

```text
12 citizen reports
8 unique contributors
```

## Lifecycle timeline

```text
● Reported
│
● AI Analyzed
│
● Verified
│
● Assigned
│
● In Progress
│
○ Resolved
│
○ Closed
```

## Activity timeline

```text
10:12 AM
Issue reported

10:13 AM
AI analysis completed

10:18 AM
Duplicate reports merged

10:27 AM
Assigned to Road Maintenance

11:04 AM
Work started
```

---

# 9. Screen 5 — Admin Dashboard

This is the primary judge-facing screen.

The dashboard should communicate:

> This system helps authorities decide what needs attention first.

## Top metrics

```text
Total Issues        128
Open                 43
In Progress          31
Resolved              54
```

Optional:

```text
Critical              9
High Priority         24
```

## Priority queue

```text
URGENT ISSUES

#1
Pothole
Sector 15
Priority 95
12 reports
[Review]

#2
Garbage Overflow
Sector 22
Priority 89
9 reports
[Review]
```

## Main dashboard areas

1. KPI cards
2. Large civic issue map
3. Priority queue
4. Issue table
5. Issue details drawer/page

Suggested table columns:

```text
Issue
Location
Category
Severity
Reports
Priority
Status
Action
```

---

# 10. Issue Lifecycle

The frontend must support:

```text
REPORTED
   ↓
AI_ANALYZED
   ↓
VERIFIED
   ↓
ASSIGNED
   ↓
IN_PROGRESS
   ↓
RESOLVED
   ↓
RESOLUTION_VERIFIED
   ↓
CLOSED
```

Use one TypeScript source of truth:

```ts
export type IssueStatus =
  | "REPORTED"
  | "AI_ANALYZED"
  | "VERIFIED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "RESOLUTION_VERIFIED"
  | "CLOSED";
```

Do not scatter status strings through components.

---

# 11. Frontend Data Model

```ts
export interface CivicIssue {
  id: string;

  category: "pothole" | "garbage" | "streetlight";

  description?: string;

  imageUrl: string;

  lat: number;
  lng: number;
  address?: string;

  severity: number;
  confidence: number;
  priority: number;

  reportCount: number;
  uniqueReporterCount?: number;

  status: IssueStatus;

  isDuplicate?: boolean;
  parentIssueId?: string | null;

  createdAt: string;
  updatedAt: string;

  assignedTeam?: string | null;

  aiSummary?: string;

  resolution?: {
    afterImageUrl?: string;
    verificationScore?: number;
    citizenConfirmed?: boolean;
  };
}
```

---

# 12. API Contract

The frontend must be able to develop against these contracts before the backend is complete.

## Create Issue

```http
POST /api/issues
```

Request:

```json
{
  "imageUrl": "https://...",
  "lat": 28.45,
  "lng": 77.02,
  "description": "Large pothole near the road"
}
```

Response:

```json
{
  "id": "CIV-1024",
  "category": "pothole",
  "confidence": 0.96,
  "severity": 8.7,
  "priority": 92,
  "status": "AI_ANALYZED",
  "aiSummary": "Large pothole on a paved road"
}
```

## Get Issues

```http
GET /api/issues
```

Response:

```json
{
  "issues": []
}
```

## Get Single Issue

```http
GET /api/issues/:id
```

## Update Status

```http
PATCH /api/issues/:id/status
```

Request:

```json
{
  "status": "IN_PROGRESS"
}
```

## Resolve

```http
POST /api/issues/:id/resolve
```

Request:

```json
{
  "afterImageUrl": "https://..."
}
```

---

# 13. Mock-First Frontend Strategy

The frontend must **not wait for the backend**.

Create demo data immediately:

```ts
export const demoIssues: CivicIssue[] = [
  {
    id: "CIV-1024",
    category: "pothole",
    imageUrl: "/demo/pothole-1.jpg",
    lat: 28.45,
    lng: 77.02,
    address: "Sector 15",
    severity: 8.7,
    confidence: 0.96,
    priority: 92,
    reportCount: 12,
    status: "IN_PROGRESS",
    createdAt: "2026-08-29T10:12:00Z",
    updatedAt: "2026-08-29T11:04:00Z",
    assignedTeam: "Road Maintenance",
    aiSummary: "Large pothole causing significant road hazard."
  }
];
```

First build the complete frontend with this.

Then replace:

```ts
demoIssues
```

with API/fetch/listener data.

This is the key parallel-development strategy.

---

# 14. Reusable Components

Create these instead of duplicating UI.

## IssueCard
Display:
- image
- category
- severity
- priority
- status
- location
- report count

## SeverityBadge
Examples:
- LOW
- MEDIUM
- HIGH
- CRITICAL

## StatusBadge
Examples:
- REPORTED
- VERIFIED
- IN PROGRESS
- RESOLVED
- CLOSED

## IssueTimeline
Displays lifecycle.

## IssueMap
Receives:

```ts
issues: CivicIssue[]
```

## IssueFilters
Category / status / severity.

## PriorityCard
For the admin priority queue.

## AIAnalysisCard
Displays:
- category
- confidence
- severity
- hazard
- summary

---

# 15. State Management

Do not introduce Redux unless required.

Use:
- `useState` for local state
- URL parameters for filters where useful
- API/Firebase for server state

Example:

```text
Report page
    ↓
submitIssue()
    ↓
POST /api/issues
    ↓
redirect to /issues/CIV-1024
```

Admin:

```text
GET /api/issues
    ↓
Issue list
    ↓
Filter
    ↓
Select
    ↓
Issue details
```

---

# 16. Loading States

Every async interaction needs feedback.

### Upload

```text
Uploading image...
```

### AI

```text
Analyzing civic issue...
```

### Map

```text
Loading issue map...
```

### Dashboard

```text
Loading civic intelligence...
```

Do not show an empty screen during network requests.

---

# 17. Error States

### Location denied

```text
We could not access your location.

You can continue by placing the pin manually.
```

### Upload failure

```text
Upload failed.
Please try again.
```

### AI failure

Do not break issue creation.

```text
AI analysis temporarily unavailable.

Your issue has still been submitted.
```

The backend may save the issue without AI fields and allow later processing.

---

# 18. UI/UX Direction

Visual character:

**Civic infrastructure command center**

Use:
- clean typography
- map-centric layouts
- data-driven cards
- strong hierarchy
- controlled use of rounded surfaces
- clear status and severity indicators
- strong whitespace

Avoid:
- excessive gradients
- large marketing animations
- excessive glassmorphism
- too many charts
- overly colorful government-portal styling
- every UI element having a unique color

The app should look like a serious operational tool.

---

# 19. Core Visual Story

The UI should make this sequence obvious:

```text
Citizen Reports
      ↓
Photo + GPS
      ↓
AI Understanding
      ↓
Severity
      ↓
Duplicate Detection
      ↓
Priority
      ↓
Authority
      ↓
Resolution
      ↓
Verification
```

---

# 20. Realtime Strategy

Do **not** use Socket.IO for the hackathon.

Use Firestore realtime listeners where useful:

```text
Firestore
   ↓
onSnapshot()
   ↓
Admin Dashboard
   ↓
New issue appears automatically
```

This provides the visual effect of a realtime civic command center without an additional socket server.

---

# 21. Map Strategy

MVP requirements:
- issue markers
- marker click
- current location
- map centering
- category filters
- status filters
- issue preview

Only add later:
- marker clustering
- heatmap
- hotspot visualization

Priority:

**Working map > fancy map**

---

# 22. Mobile Strategy

Citizen reporting should be mobile-first.

Report flow must work on:
- mobile
- tablet
- desktop

Admin dashboard can be desktop-first.

Do not spend excessive time perfecting every possible breakpoint.

---

# 23. Team Responsibilities

## You — Backend / AI / Integration

Own:
- Firebase
- Firestore
- API routes
- Gemini integration
- issue lifecycle logic
- priority logic
- duplicate logic
- resolution verification
- final integration
- deployment

## Nitish — Frontend Lead

Own:
- page architecture
- design system
- layout
- map
- report flow
- dashboard
- issue details
- API integration

## Third Member — Frontend Support

Own:
- reusable cards
- buttons
- badges
- image upload UI
- forms
- responsive fixes
- loading states
- empty states
- demo data
- visual QA

---

# 24. Development Sequence

## Phase 1 — Skeleton

Frontend:
```text
Home
Report
Map
Issue Detail
Admin
```

Backend:
```text
Firebase
Gemini
POST /issues
GET /issues
```

## Phase 2 — Core Flow

Must work end-to-end:

```text
Photo
  ↓
Upload
  ↓
API
  ↓
Gemini
  ↓
Firestore
  ↓
Issue detail
```

This is the first major milestone.

## Phase 3 — Map + Dashboard

```text
Firestore
   ↓
Issues
   ↓
Map
   ↓
Admin priority queue
```

## Phase 4 — Intelligence

Add:
- priority score
- duplicate detection
- issue clustering
- resolution verification

## Phase 5 — Polish

Add:
- animations
- loading states
- empty states
- responsive fixes
- consistent spacing/typography
- demo data
- visual cleanup

---

# 25. Priority Algorithm Expectations

Frontend should **not** calculate business logic.

Backend returns:

```json
{
  "severity": 8.7,
  "priority": 92
}
```

Frontend only visualizes it.

Example:

```text
Priority 92
███████████████████░
HIGH PRIORITY
```

Do not duplicate the backend scoring formula in frontend.

---

# 26. Duplicate Issue UX

When a possible duplicate is detected:

```text
We found a nearby report that may describe
the same civic issue.

CIV-1024
Pothole — Sector 15
12 reports

[ Add My Evidence ]
[ Report as Different Issue ]
```

The UX should make it clear that multiple reports strengthen one incident.

---

# 27. Resolution Verification UX

When authority marks an issue resolved:

```text
Issue marked as resolved.

Upload an after-photo to verify the repair.

[ Upload Resolution Photo ]
```

Then:

```text
Resolution Analysis

Before severity: 8.7
After severity: 1.2

Verification confidence: 94%

[ Confirm Fixed ]
[ Still Exists ]
```

This should be one of the strongest visual/demo moments.

---

# 28. Demo Data Strategy

Prepare at least 8–12 realistic issues.

Suggested mix:
- 5 potholes
- 3 garbage issues
- 2 streetlights
- 1 critical road obstruction

Statuses:

```text
3 REPORTED
2 VERIFIED
2 ASSIGNED
2 IN_PROGRESS
2 RESOLVED
1 CLOSED
```

Use realistic locations within one demo city.

---

# 29. Primary Demo Issue

At least one issue should show:
- high severity
- multiple citizen reports
- high priority
- assigned team
- in-progress state
- resolution photo
- final verification

Example:

```text
CIV-1024

Pothole
Severity: 8.7
Confidence: 96%
Reports: 12
Priority: 92
Status: IN PROGRESS
```

---

# 30. Performance / Reliability Rules

Avoid:
- repeated full data fetches
- unnecessary client rerenders
- multiple Gemini requests per report
- huge image uploads
- multiple map instances on the same page

Optimize only after the core flow works.

---

# 31. Security Rules

Never expose secret API keys to the client.

Do not use:

```text
NEXT_PUBLIC_GEMINI_API_KEY
```

Correct architecture:

```text
Frontend
   ↓
/api/issues
   ↓
Server
   ↓
Gemini
```

---

# 32. Explicitly Do NOT Build

Because hackathon time is limited, avoid:
- full social media integrations
- complex user profiles
- complex authentication
- chat between citizens and authorities
- large notification systems
- custom GIS
- microservices
- Socket.IO server
- Redux without a real need
- PostgreSQL unless required
- model training
- complex prediction systems
- huge analytics suites

Focus on the product story.

---

# 33. Feature Priority

## P0 — Must Work
- Report issue
- Image upload
- GPS
- Gemini classification
- Severity
- Firestore storage
- Map
- Issue detail
- Admin dashboard
- Status lifecycle

## P1 — Add After P0
- duplicate detection
- priority scoring
- realtime dashboard updates
- resolution verification
- report aggregation

## P2 — Only If There Is Time
- heatmaps
- social signal integration
- advanced analytics
- prediction
- citizen reputation
- notifications
- advanced charts

---

# 34. Judge Demo Flow

Target duration: ~3 minutes.

### Step 1
Open CivicPulse.

Say:

> "Anyone can report a civic issue with evidence and location."

### Step 2
Submit a pothole photo.

### Step 3
Show:

```text
Pothole
96% confidence
Severity 8.7
```

### Step 4
Open issue details.

Show:
- 12 citizen reports
- Priority 92
- lifecycle timeline

### Step 5
Open admin dashboard.

Show issue at top of priority queue.

### Step 6
Assign team.

Status:

```text
ASSIGNED → IN_PROGRESS
```

### Step 7
Upload after photo.

### Step 8
Show:

```text
Resolution confidence: 94%
```

### Closing line

> "CivicPulse does not stop when a complaint is submitted. It tracks whether the problem was actually resolved."

---

# 35. Definition of Done

Frontend is hackathon-ready when:

- [ ] Landing page works
- [ ] Report form works
- [ ] Image preview works
- [ ] GPS works, with fallback
- [ ] AI result displays
- [ ] Issue details render from API
- [ ] Map displays issues
- [ ] Filters work
- [ ] Admin dashboard works
- [ ] Priority queue works
- [ ] Status changes are visible
- [ ] Resolution verification UI works
- [ ] Loading states exist
- [ ] Error states exist
- [ ] Mobile report flow works
- [ ] Deployment works
- [ ] Demo data is ready

---

# 36. Frontend Mental Model

Do not think:

> "I am building five pages."

Think:

> "I am visualizing one civic issue moving through an operational lifecycle."

The most important domain object is:

```text
CivicIssue
```

Everything else exists to help users:

**create → understand → track → prioritize → resolve → verify**

---

# 37. Immediate Tasks

## Nitish

1. Create Next.js frontend.
2. Create the five routes.
3. Create shared layout and navbar.
4. Create reusable buttons/cards/badges.
5. Build Report Issue page.
6. Build Admin dashboard skeleton.
7. Build Map page using mock issues.

## Third Member

1. IssueCard.
2. SeverityBadge.
3. StatusBadge.
4. Upload component.
5. Loading states.
6. Empty states.
7. Responsive fixes.
8. Demo dataset.

## You

1. Create Firebase.
2. Define Firestore schema.
3. Define shared TypeScript types.
4. Create `/api/issues`.
5. Integrate Gemini.
6. Save AI response to Firestore.
7. Return frontend-ready JSON.
8. Integrate status/priority/resolution APIs.

---

# 38. Golden Team Rule

**Do not wait for another team member.**

Frontend can use mock data.

Backend can use Postman/curl.

AI can be tested independently.

Integration happens only after both sides have stable contracts.

**Contract first → Parallel development → Integration → Demo polish**

---

# Product North Star

## CivicPulse
### "See a problem → prove it → prioritize it → fix it → verify it."

Every feature that does not strengthen this sentence is secondary.
