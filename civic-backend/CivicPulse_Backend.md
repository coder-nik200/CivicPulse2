# CivicPulse — Backend Product & Engineering Specification

> **Purpose:** This document is the backend implementation contract for CivicPulse. Give this file to the backend AI coding agent as the primary context before it writes or modifies backend code.
>
> **Hackathon Problem:** #31 — Pothole/Civic Issue Reporter with Map View.
>
> **Database decision:** CivicPulse will use **MongoDB Atlas + Mongoose**. Do not use PostgreSQL for this project.
>
> **Important:** Implement the product pragmatically for a short hackathon. Prefer a simple, reliable architecture over production-scale infrastructure.

---

# 1. Product Idea

## CivicPulse

CivicPulse is an AI-powered civic issue intelligence and resolution-tracking platform.

The official problem asks citizens to report civic issues such as:

- potholes
- garbage
- streetlights

using:

- a photo
- GPS/location

and make those issues visible to others on a shared map.

CivicPulse extends the base problem into a complete operational lifecycle:

```text
Citizen Evidence
      ↓
AI Understanding
      ↓
Verification
      ↓
Priority
      ↓
Authority Action
      ↓
Resolution
      ↓
Resolution Verification
      ↓
Closure
```

The backend is responsible for powering this lifecycle.

---

# 2. Backend Goals

The backend must:

1. Accept civic issue reports.
2. Store issue data in MongoDB.
3. Process uploaded evidence.
4. Use Gemini to classify the issue.
5. Estimate severity and AI confidence.
6. Detect possible duplicate reports.
7. Calculate issue priority.
8. Expose issues to the frontend.
9. Support the issue status lifecycle.
10. Support admin assignment/status changes.
11. Support resolution evidence.
12. Verify a resolution using before/after evidence where possible.
13. Provide stable API contracts for the frontend.
14. Fail gracefully when an external service is unavailable.

---

# 3. Recommended Architecture

Use a simple Node.js + Express backend.

```text
Frontend (Next.js)
        ↓
      REST API
        ↓
Node.js + Express
        │
        ├── Controllers
        │
        ├── Services
        │     ├── AI service
        │     ├── Issue service
        │     ├── Duplicate service
        │     ├── Priority service
        │     └── Resolution service
        │
        └── Config
              ├── MongoDB
              └── Gemini

        ↓
MongoDB Atlas
        +
Image Storage
```

## Important architecture decision

Do NOT add these unless a concrete need appears:

- PostgreSQL
- Socket.IO
- Redis
- Kafka
- GraphQL
- microservices
- separate Python service
- model training pipeline
- complex event bus

This is a hackathon. Reliability and speed matter more than architectural ceremony.

---

# 4. Technology Stack

## Runtime

- Node.js

## Framework

- Express

## Language

- JavaScript initially, or TypeScript if the existing backend is already TypeScript-based.
- Do not migrate languages solely for the sake of this document.

## Database

**MongoDB Atlas**

ODM:

**Mongoose**

Why MongoDB:
- very fast to set up for a hackathon
- natural document structure for issue data
- nested AI/resolution objects are easy to model
- excellent Node.js ecosystem
- supports geospatial queries with `2dsphere` indexes
- useful for the duplicate-nearby-issue workflow

## AI

**Google Gemini multimodal API**

Primary use:
- image understanding
- civic issue classification
- severity estimation
- evidence summarization
- optional before/after resolution comparison

## Image storage

Use either:
- Cloudinary
- Firebase Storage

Pick one and keep the implementation simple.

## Realtime

Do not implement Socket.IO.

Where realtime behavior is useful:
- frontend can use MongoDB-backed polling for the hackathon, or
- use another lightweight mechanism only if already available.

Realtime is not a P0 requirement.

---

# 5. Environment Variables

Use server-side environment variables.

Example:

```env
PORT=5000

MONGODB_URI=mongodb+srv://...

GEMINI_API_KEY=...

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

If Firebase Storage is selected instead of Cloudinary, use the appropriate server-side Firebase credentials.

Never expose secrets in frontend code.

Do NOT use:

```env
NEXT_PUBLIC_GEMINI_API_KEY
```

The frontend calls the backend, and the backend calls Gemini.

---

# 6. Suggested Backend Structure

```text
backend/
│
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── gemini.js
│   │
│   ├── models/
│   │   ├── Issue.js
│   │   ├── Report.js
│   │   └── Activity.js
│   │
│   ├── controllers/
│   │   └── issue.controller.js
│   │
│   ├── routes/
│   │   └── issue.routes.js
│   │
│   ├── services/
│   │   ├── issue.service.js
│   │   ├── ai.service.js
│   │   ├── duplicate.service.js
│   │   ├── priority.service.js
│   │   └── resolution.service.js
│   │
│   ├── middleware/
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│   │
│   └── utils/
│       ├── response.js
│       └── ids.js
│
├── server.js
├── .env
├── .gitignore
└── package.json
```

Do not create a file merely because it looks architecturally clean. Create modules when they own a meaningful responsibility.

---

# 7. Database Setup — MongoDB Atlas

Create a MongoDB Atlas project and cluster.

Recommended database name:

```text
civicpulse
```

Connection:

```env
MONGODB_URI=<your MongoDB Atlas connection string>
```

Create a single reusable connection module:

```text
src/config/db.js
```

Conceptual responsibility:

```text
connectDB()
```

The server should fail fast on startup if the database connection is required but cannot be established.

---

# 8. MongoDB Collections

Use three primary collections.

## 8.1 `issues`

One document represents the canonical civic incident.

Example:

```js
{
  issueId: "CIV-1024",

  category: "pothole",

  description: "Large pothole near the main road",

  imageUrl: "https://...",

  location: {
    type: "Point",
    coordinates: [77.02, 28.45]
  },

  address: "Sector 15",

  severity: 8.7,
  confidence: 0.96,
  priority: 92,

  reportCount: 12,
  uniqueReporterCount: 8,

  status: "IN_PROGRESS",

  isDuplicate: false,
  parentIssueId: null,

  aiSummary: "Large pothole causing significant road hazard.",

  assignedTeam: "Road Maintenance",

  resolution: {
    afterImageUrl: null,
    verificationScore: null,
    citizenConfirmed: false
  },

  createdAt: "...",
  updatedAt: "..."
}
```

### Required MongoDB geospatial index

The `location` field should use GeoJSON and have a `2dsphere` index.

Mongoose concept:

```js
location: {
  type: {
    type: String,
    enum: ["Point"],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
}
```

Then:

```js
IssueSchema.index({ location: "2dsphere" });
```

Coordinates must always be:

```text
[lng, lat]
```

not `[lat, lng]`.

---

## 8.2 `reports`

Each citizen submission is stored separately.

Example:

```js
{
  reportId: "REP-1001",

  issueId: "CIV-1024",

  userId: "demo-user",

  imageUrl: "https://...",

  location: {
    type: "Point",
    coordinates: [77.02, 28.45]
  },

  description: "Large pothole near main road",

  createdAt: "..."
}
```

The reports collection preserves individual evidence even when several reports refer to the same canonical issue.

---

## 8.3 `activities`

Stores the issue lifecycle/audit history.

Example:

```js
{
  issueId: "CIV-1024",

  action: "STATUS_CHANGED",

  performedBy: "admin",

  metadata: {
    from: "ASSIGNED",
    to: "IN_PROGRESS"
  },

  createdAt: "..."
}
```

Examples:

```text
ISSUE_CREATED
AI_ANALYZED
DUPLICATE_MERGED
VERIFIED
ASSIGNED
STATUS_CHANGED
RESOLUTION_SUBMITTED
RESOLUTION_VERIFIED
CLOSED
```

This collection powers the frontend timeline.

---

# 9. Mongoose Models

Create:

```text
src/models/Issue.js
src/models/Report.js
src/models/Activity.js
```

Schemas should provide:

- required fields
- enums
- reasonable string lengths
- defaults where useful
- timestamps

Use:

```js
timestamps: true
```

where appropriate.

Do not over-model the system.

---

# 10. Issue Status Lifecycle

Canonical lifecycle:

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

Use a fixed enum.

Example:

```js
const ISSUE_STATUSES = [
  "REPORTED",
  "AI_ANALYZED",
  "VERIFIED",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "RESOLUTION_VERIFIED",
  "CLOSED"
];
```

Do not silently accept arbitrary status strings.

---

# 11. API Design

Keep REST API small and predictable.

## 11.1 Create Issue

```http
POST /api/issues
```

Request:

```json
{
  "imageUrl": "https://...",
  "lat": 28.45,
  "lng": 77.02,
  "description": "Large pothole near main road",
  "userId": "demo-user"
}
```

Backend flow:

```text
validate request
    ↓
create initial report / issue
    ↓
AI analysis
    ↓
duplicate check
    ↓
priority calculation
    ↓
update issue
    ↓
write activity events
    ↓
return frontend-ready object
```

Response:

```json
{
  "success": true,
  "issue": {
    "id": "CIV-1024",
    "category": "pothole",
    "confidence": 0.96,
    "severity": 8.7,
    "priority": 92,
    "status": "AI_ANALYZED",
    "reportCount": 1
  }
}
```

---

# 12. Get All Issues

```http
GET /api/issues
```

Optional query parameters:

```text
category
status
minSeverity
maxSeverity
sort
limit
```

Example:

```http
GET /api/issues?status=IN_PROGRESS&sort=priority_desc
```

Response:

```json
{
  "success": true,
  "issues": []
}
```

Do not overbuild query functionality.

---

# 13. Get Single Issue

```http
GET /api/issues/:id
```

Response:

```json
{
  "success": true,
  "issue": {},
  "activity": []
}
```

The frontend should be able to render the full Issue Details page from this response.

---

# 14. Update Status

```http
PATCH /api/issues/:id/status
```

Request:

```json
{
  "status": "IN_PROGRESS",
  "performedBy": "admin"
}
```

Backend must:

1. Verify the issue exists.
2. Validate the target status.
3. Update the issue.
4. Create an activity record.
5. Return the updated issue.

Do not accept `priority` or `severity` from the client during a status update.

---

# 15. Assign Issue

Optional dedicated endpoint:

```http
PATCH /api/issues/:id/assign
```

Request:

```json
{
  "assignedTeam": "Road Maintenance",
  "performedBy": "admin"
}
```

Update:

```text
assignedTeam
status = ASSIGNED
```

Create an activity record.

If a separate endpoint creates unnecessary work, assignment can be incorporated into the status workflow, but the assigned team must still be stored.

---

# 16. Submit Resolution

```http
POST /api/issues/:id/resolve
```

Request:

```json
{
  "afterImageUrl": "https://...",
  "performedBy": "admin"
}
```

Backend:

```text
receive after image
      ↓
store evidence
      ↓
optional Gemini before/after analysis
      ↓
calculate verification score
      ↓
mark RESOLVED
      ↓
write activity
```

Response:

```json
{
  "success": true,
  "issueId": "CIV-1024",
  "verificationScore": 94,
  "status": "RESOLVED"
}
```

---

# 17. Citizen Resolution Confirmation

Optional endpoint:

```http
POST /api/issues/:id/confirm-resolution
```

Request:

```json
{
  "confirmed": true,
  "userId": "demo-user"
}
```

If the citizen says the issue still exists:

```json
{
  "confirmed": false
}
```

Do not close a disputed issue automatically.

---

# 18. AI Service

Create:

```text
src/services/ai.service.js
```

Main function:

```js
analyzeIssueImage(imageUrl)
```

Input:
- civic issue image
- optional description

Return structured JSON only.

Expected shape:

```json
{
  "category": "pothole",
  "confidence": 0.96,
  "severity": 8.7,
  "hazard": "high",
  "roadBlocked": false,
  "summary": "Large pothole on a paved road."
}
```

Allowed categories:

```text
pothole
garbage
streetlight
unknown
```

Do not allow arbitrary model-generated categories into the canonical database field.

---

# 19. Gemini Prompt Strategy

Conceptual prompt:

```text
You are a civic infrastructure inspection assistant.

Analyze the provided image and identify whether it contains:
- pothole
- garbage
- streetlight damage
- unknown

Return ONLY valid JSON.

Fields:
category
confidence (0 to 1)
severity (0 to 10)
hazard ("low" | "medium" | "high" | "critical")
roadBlocked (boolean)
summary

Do not claim facts that are not visually supported.
If uncertain, use "unknown" and lower confidence.
```

The backend must:

1. receive model output
2. parse it
3. validate it
4. normalize values
5. store only validated data

Never store arbitrary raw LLM JSON as trusted business data.

---

# 20. AI Failure Strategy

External APIs can fail.

AI failure must NOT destroy the user's report.

Correct flow:

```text
Citizen report
      ↓
save issue/report
      ↓
Gemini fails
      ↓
issue remains stored
      ↓
status = REPORTED
      ↓
AI fields remain null/default
```

Response:

```json
{
  "success": true,
  "issue": {
    "id": "CIV-1025",
    "status": "REPORTED",
    "aiPending": true
  }
}
```

Do not return a hard failure merely because AI failed after the report was safely stored.

---

# 21. Priority Engine

Create:

```text
src/services/priority.service.js
```

Do not ask Gemini for the final priority score.

Gemini provides:

```text
severity
confidence
```

Backend calculates deterministic priority.

Possible MVP formula:

```text
priority =
  severityWeight
  + reportCountWeight
  + locationWeight
```

Example:

```js
const rawScore =
  severity * 6 +
  Math.min(reportCount, 10) * 2 +
  roadWeight * 10;
```

Normalize to `0–100`.

The exact weights can be tuned during the hackathon.

The important properties are:

- deterministic
- explainable
- based on actual issue data
- not controlled by the frontend

---

# 22. Duplicate Detection

Create:

```text
src/services/duplicate.service.js
```

## MVP approach

Do NOT immediately build image embeddings or vector infrastructure.

First use MongoDB geospatial queries.

Check:

1. same/related category
2. close geographic distance
3. active/non-closed issue
4. optionally a reasonable time window

Example concept:

```js
{
  category: "pothole",
  status: { $nin: ["CLOSED"] },
  location: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [lng, lat]
      },
      $maxDistance: 100
    }
  }
}
```

If a match is found:

```json
{
  "isDuplicate": true,
  "parentIssueId": "CIV-1024"
}
```

---

# 23. Duplicate Report Behaviour

Never delete the citizen's report.

Example:

```text
Report #1
      ↓
CIV-1024

Report #2
      ↓
nearby match
      ↓
attach to CIV-1024

Report #3
      ↓
same hotspot
      ↓
attach to CIV-1024
```

Canonical incident:

```text
CIV-1024
12 reports
8 unique contributors
```

The `reports` collection preserves the evidence; the `issues` collection represents the canonical problem.

---

# 24. Resolution Verification

Create:

```text
src/services/resolution.service.js
```

Inputs:
- before image
- after image

Optional Gemini response:

```json
{
  "beforeSeverity": 8.7,
  "afterSeverity": 1.2,
  "verificationScore": 94,
  "summary": "The pothole appears substantially repaired."
}
```

Important:
- AI output is an assessment, not unquestionable proof.
- Store both pieces of evidence.
- Allow citizen confirmation.
- If disputed, do not blindly close.

Recommended flow:

```text
RESOLVED
   ↓
RESOLUTION_VERIFIED
   ↓
CLOSED
```

---

# 25. Activity / Audit Trail

Every meaningful change should create an activity record.

Example:

```js
{
  issueId: "CIV-1024",
  action: "STATUS_CHANGED",
  performedBy: "admin",
  metadata: {
    from: "ASSIGNED",
    to: "IN_PROGRESS"
  },
  createdAt: new Date()
}
```

This powers the frontend timeline.

Do not reconstruct lifecycle history only from the issue's `updatedAt`.

---

# 26. MongoDB Query Strategy

Keep queries simple.

For the MVP, the main query patterns are:

### All issues

```js
Issue.find().sort({ priority: -1 })
```

### Filtered issues

```js
Issue.find({
  status: "IN_PROGRESS",
  category: "pothole"
})
```

### Single issue

```js
Issue.findOne({ issueId })
```

### Nearby duplicate search

Use `$near` with a `2dsphere` index.

### Activity timeline

```js
Activity.find({ issueId }).sort({ createdAt: 1 })
```

Do not add complex aggregation pipelines until the simple queries are working.

---

# 27. Useful MongoDB Indexes

At minimum:

```text
issues.location → 2dsphere
issues.issueId → unique
issues.status
issues.category
issues.priority
activities.issueId
reports.issueId
```

Create indexes only for actual query patterns.

---

# 28. Validation

Validate every incoming request.

At minimum:
- required fields
- valid latitude
- valid longitude
- valid image URL/reference
- allowed issue categories
- allowed statuses
- reasonable description length

Coordinates should satisfy:

```text
lat: -90 to 90
lng: -180 to 180
```

Reject malformed input cleanly.

Example:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "lat and lng are required."
  }
}
```

---

# 29. Error Handling

Use centralized Express error middleware.

Success:

```json
{
  "success": true,
  "data": {}
}
```

Failure:

```json
{
  "success": false,
  "error": {
    "code": "SOME_CODE",
    "message": "Human-readable message"
  }
}
```

Do not expose stack traces to clients.

---

# 30. HTTP Status Guidelines

Use:

```text
200 — successful read/update
201 — successful creation
400 — malformed request
404 — issue not found
409 — invalid state/conflict
422 — validation failure
500 — unexpected server error
502/503 — external service failure when appropriate
```

Do not overcomplicate status codes.

---

# 31. Image Handling

Preferred flow:

```text
Frontend
   ↓
Image upload service
   ↓
imageUrl
   ↓
POST /api/issues
   ↓
Backend/Gemini
```

Do not send enormous base64 payloads through multiple JSON layers unless unavoidable.

Recommended:
- compress large images
- upload once
- store remote URL
- send URL to backend

---

# 32. Location Handling

Every issue must store:

```text
lat
lng
```

Internally, MongoDB should store them as:

```js
{
  type: "Point",
  coordinates: [lng, lat]
}
```

Human-readable address is optional.

Do not block issue creation because reverse geocoding fails.

Coordinates are the primary location source.

---

# 33. Realtime Strategy

Do NOT use Socket.IO.

For this hackathon, realtime behavior is not a core requirement.

Options:

### Preferred
Frontend reads current issue state after mutations.

### Optional
Frontend uses lightweight polling or another already-configured mechanism.

The priority is:

```text
correct data > realtime infrastructure
```

Do not spend hackathon time building a dedicated realtime server.

---

# 34. Authentication

Authentication is not P0.

For a hackathon demo:

```text
demo-user
admin
```

can be used.

If authentication already exists, integrate it without changing the main domain model.

Do NOT spend most of the hackathon building OAuth.

---

# 35. Admin Authorization

Roles:

```text
CITIZEN
ADMIN
```

Admin operations:
- assignment
- status changes
- resolution submission

Citizen operations:
- create report
- view issues
- confirm resolution

For the demo, authorization can be lightweight, but keep admin-specific operations isolated in the code.

---

# 36. P0 — Must Work

These are mandatory:

- [ ] Express server
- [ ] MongoDB Atlas connection
- [ ] Mongoose models
- [ ] `issues` collection
- [ ] `reports` collection
- [ ] `activities` collection
- [ ] POST /api/issues
- [ ] GET /api/issues
- [ ] GET /api/issues/:id
- [ ] Gemini classification
- [ ] severity
- [ ] confidence
- [ ] issue status
- [ ] priority calculation
- [ ] basic status update
- [ ] activity timeline

---

# 37. P1 — Build After P0

- [ ] duplicate detection using MongoDB geospatial query
- [ ] report aggregation
- [ ] assignment endpoint
- [ ] resolution evidence
- [ ] before/after AI verification
- [ ] citizen confirmation
- [ ] lightweight realtime refresh/listening

---

# 38. P2 — Only If Time Remains

- [ ] image embeddings
- [ ] advanced geo clustering
- [ ] hotspot prediction
- [ ] social-media ingestion
- [ ] notifications
- [ ] reputation system
- [ ] advanced analytics
- [ ] large-scale geospatial optimization

Do not work on P2 while P0 is broken.

---

# 39. Development Order

Follow this exact order.

## Step 1 — Server

Make:

```text
GET /
```

return:

```json
{
  "success": true,
  "message": "CivicPulse Backend is running"
}
```

## Step 2 — MongoDB

Create:

```text
src/config/db.js
```

Connect to MongoDB Atlas.

Verify connection before continuing.

## Step 3 — Mongoose Models

Create:
- Issue
- Report
- Activity

Add the `2dsphere` location index.

## Step 4 — POST /api/issues

Initially implement with a dummy AI response if necessary.

Goal:

```text
POST
 ↓
validate
 ↓
MongoDB
 ↓
JSON response
```

## Step 5 — Gemini

Replace dummy AI with real multimodal analysis.

## Step 6 — Priority

Calculate deterministic priority.

## Step 7 — GET APIs

Frontend can now consume real data.

## Step 8 — Status lifecycle

Implement:
- verify
- assign
- in progress
- resolved
- resolution verified
- closed

## Step 9 — Duplicate detection

Use MongoDB `$near` + `2dsphere`.

## Step 10 — Resolution verification

Add after-image workflow.

## Step 11 — Integration

Connect frontend and backend.

---

# 40. Frontend Integration Contract

Frontend expects issue objects with:

```text
id
category
imageUrl
lat
lng
address
severity
confidence
priority
reportCount
status
aiSummary
assignedTeam
createdAt
updatedAt
```

Backend owns:

```text
category
severity
confidence
priority
duplicate decision
```

Frontend must not calculate these business-critical values.

---

# 41. End-to-End Example

User submits pothole photo.

```text
POST /api/issues
        ↓
validate
        ↓
save report/issue
        ↓
Gemini
        ↓
{
 category: pothole,
 severity: 8.7,
 confidence: 0.96
}
        ↓
MongoDB geospatial duplicate check
        ↓
priority = 92
        ↓
update issue
        ↓
activity = AI_ANALYZED
        ↓
response
```

Admin:

```text
ASSIGNED
   ↓
IN_PROGRESS
   ↓
RESOLVED
```

Resolution:

```text
POST /api/issues/CIV-1024/resolve
        ↓
after image
        ↓
Gemini comparison
        ↓
verificationScore = 94
        ↓
RESOLUTION_VERIFIED
        ↓
CLOSED
```

---

# 42. Demo Reliability Strategy

Do not rely on every external service during the presentation.

Prepare:
- seeded MongoDB demo issues
- known working images
- known working AI prompt
- fallback demo data
- fallback issue creation if AI fails

Primary demo issue:

```text
CIV-1024

Pothole
Severity: 8.7
Confidence: 96%
Reports: 12
Priority: 92
Status: IN_PROGRESS
```

Only one new issue needs to be created live during the demo.

---

# 43. Testing Checklist

## API
- [ ] server starts
- [ ] MongoDB connects
- [ ] GET /
- [ ] POST /api/issues
- [ ] GET /api/issues
- [ ] GET /api/issues/:id
- [ ] PATCH status
- [ ] resolve issue

## AI
- [ ] valid civic image
- [ ] unclear image
- [ ] unsupported object
- [ ] Gemini failure

## Database
- [ ] issue saved
- [ ] report saved
- [ ] activity saved
- [ ] timestamps correct
- [ ] geospatial index works
- [ ] duplicate lookup works

## Edge Cases
- [ ] missing coordinates
- [ ] invalid coordinates
- [ ] missing image
- [ ] invalid status
- [ ] unknown issue ID
- [ ] duplicate issue

---

# 44. Security

Minimum requirements:

- keep secrets in `.env`
- never expose Gemini key
- validate incoming data
- do not trust client-provided priority/severity
- do not log credentials
- do not return MongoDB credentials
- keep admin operations protected when real authentication exists

The frontend may send:

```text
imageUrl
lat
lng
description
```

The backend decides:

```text
category
severity
confidence
priority
duplicate status
```

---

# 45. Observability

Use useful server logs.

Example:

```text
[DB] MongoDB connected
[ISSUE] CIV-1024 created
[AI] analysis started
[AI] category=pothole confidence=0.96
[DUPLICATE] no match
[PRIORITY] score=92
[ISSUE] CIV-1024 updated
```

Do not log:
- secrets
- API keys
- sensitive credentials
- unnecessary personal data

---

# 46. Coding Rules for the AI Agent

1. Inspect the current repository before changing files.
2. Reuse existing working code.
3. Do not rewrite the whole backend unnecessarily.
4. Do not introduce a dependency without a concrete need.
5. Preserve API contracts once frontend integration begins.
6. Validate all LLM output.
7. Handle Gemini/database/storage failures gracefully.
8. Keep controllers thin.
9. Keep business logic in services.
10. Keep Mongoose data access predictable.
11. Do not add speculative features.
12. Prefer the smallest working change.
13. Test after every meaningful milestone.

---

# 47. AI Agent Execution Behaviour

The coding agent should follow:

```text
UNDERSTAND
   ↓
INSPECT REPO
   ↓
CHECK EXISTING FILES
   ↓
PLAN SMALLEST CHANGE
   ↓
IMPLEMENT
   ↓
RUN/TEST
   ↓
FIX ERRORS
   ↓
SUMMARIZE
```

Do not assume files exist.

Do not delete working architecture just because another pattern looks cleaner.

---

# 48. Current MVP Boundary

MVP is successful when this exact path works:

```text
Citizen
  ↓
photo + GPS
  ↓
POST /api/issues
  ↓
MongoDB
  ↓
Gemini
  ↓
category + severity + confidence
  ↓
priority
  ↓
MongoDB
  ↓
frontend issue page
  ↓
admin status update
  ↓
resolution image
  ↓
verification
  ↓
closed
```

Everything beyond this is secondary.

---

# 49. Product Differentiators

The backend must enable these three differentiators:

## 1. Duplicate Intelligence

Multiple reports strengthen one canonical incident.

```text
12 reports
8 unique contributors
1 civic incident
```

## 2. Priority Intelligence

Issues are ranked by severity and impact, not only by submission time.

## 3. Resolution Verification

The system does not treat:

> "Marked resolved"

as automatically equal to:

> "Evidence indicates the problem was actually fixed."

---

# 50. Final Backend Mental Model

The central domain object is:

```text
CivicIssue
```

The backend pipeline is:

```text
CREATE
  ↓
UNDERSTAND
  ↓
AGGREGATE
  ↓
PRIORITIZE
  ↓
OPERATE
  ↓
VERIFY
  ↓
CLOSE
```

CivicPulse is not simply a complaint database.

It is a **civic issue intelligence and resolution loop**.

---

# 51. Agent Instruction — Start Here

When this document is given to the coding agent:

1. Inspect the current backend repository.
2. Confirm Node.js + Express setup.
3. Confirm MongoDB + Mongoose setup.
4. Create/verify the folder structure.
5. Implement the health endpoint.
6. Connect MongoDB Atlas.
7. Implement the Mongoose `Issue`, `Report`, and `Activity` models.
8. Add the geospatial index.
9. Implement `POST /api/issues`.
10. Test it with a sample request.
11. Only after the database flow works, integrate Gemini.
12. Keep each milestone runnable.

Do not jump directly into every feature.

The first success criterion is:

```text
POST /api/issues
        ↓
MongoDB document saved
        ↓
valid JSON response
```

Then continue to:

```text
Gemini
→ priority
→ duplicate detection
→ lifecycle
→ resolution verification
```

---

# Product North Star

## CivicPulse

**See a problem → prove it → understand it → prioritize it → fix it → verify it.**

Every backend feature should strengthen that loop.
