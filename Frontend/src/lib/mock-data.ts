import { Issue } from "@/types";

// Rough center: Rohtak, Haryana
const CENTER = { lat: 28.8955, lng: 76.6066 };

function jitter(base: number, spread = 0.025) {
  return base + (Math.random() - 0.5) * spread;
}

const PHOTOS = [
  "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400&q=60",
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=60",
  "https://images.unsplash.com/photo-1573883430682-1c46b6e0d3ad?w=400&q=60",
  "https://images.unsplash.com/photo-1610987038392-ea0e4c8a71fb?w=400&q=60",
];

function hoursAgo(h: number) {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}

export const mockIssues: Issue[] = [
  {
    id: "CVC-1042",
    title: "Deep pothole blocking half of main lane",
    description:
      "Large pothole (approx 2ft wide) formed after recent rain near the market junction, causing two-wheeler skids during evening traffic.",
    category: "Pothole",
    severity: "critical",
    status: "pending",
    reportedAt: hoursAgo(2),
    reportedBy: "Anita Sharma",
    photoUrl: PHOTOS[0],
    location: { lat: jitter(CENTER.lat), lng: jitter(CENTER.lng), address: "Model Town Rd, near Sector 3 Market" },
    assignedDept: "PWD",
    aiConfidence: 96,
  },
  {
    id: "CVC-1041",
    title: "Streetlight non-functional for 2 weeks",
    description: "Entire stretch outside the community park has been dark, residents raising safety concerns.",
    category: "Streetlight",
    severity: "medium",
    status: "in-progress",
    reportedAt: hoursAgo(30),
    reportedBy: "Ravi Kumar",
    photoUrl: PHOTOS[1],
    location: { lat: jitter(CENTER.lat), lng: jitter(CENTER.lng), address: "Subhash Nagar, opp. City Park" },
    assignedDept: "Electricity",
    assignedOfficer: "Dept. Engineer, N. Verma",
    aiConfidence: 88,
  },
  {
    id: "CVC-1040",
    title: "Garbage pile uncollected for 5 days",
    description: "Overflowing municipal bin attracting stray animals, foul smell reported by multiple citizens.",
    category: "Garbage",
    severity: "high",
    status: "pending",
    reportedAt: hoursAgo(6),
    reportedBy: "Priya Yadav",
    photoUrl: PHOTOS[2],
    location: { lat: jitter(CENTER.lat), lng: jitter(CENTER.lng), address: "Housing Board Colony, Sector 4" },
    assignedDept: "Sanitation",
    aiConfidence: 91,
  },
  {
    id: "CVC-1039",
    title: "Water pipeline leakage flooding street",
    description: "Continuous leakage from underground pipeline waterlogging the road for 3+ days.",
    category: "Water Leakage",
    severity: "critical",
    status: "in-progress",
    reportedAt: hoursAgo(14),
    reportedBy: "Manoj Chauhan",
    photoUrl: PHOTOS[3],
    location: { lat: jitter(CENTER.lat), lng: jitter(CENTER.lng), address: "Delhi Rd, near Rly. Crossing" },
    assignedDept: "Water Board",
    assignedOfficer: "JE, S. Malik",
    aiConfidence: 93,
  },
  {
    id: "CVC-1038",
    title: "Sewage overflow near school gate",
    description: "Open sewage overflow creating unhygienic conditions right outside a primary school entrance.",
    category: "Sewage",
    severity: "critical",
    status: "pending",
    reportedAt: hoursAgo(1),
    reportedBy: "Deepak Singh",
    photoUrl: PHOTOS[2],
    location: { lat: jitter(CENTER.lat), lng: jitter(CENTER.lng), address: "Sector 14, Govt. School Rd" },
    assignedDept: "Sanitation",
    aiConfidence: 90,
  },
  {
    id: "CVC-1037",
    title: "Broken sidewalk tiles, tripping hazard",
    description: "Multiple loose tiles along the footpath, elderly pedestrian reported a fall.",
    category: "Broken Sidewalk",
    severity: "medium",
    status: "resolved",
    reportedAt: hoursAgo(96),
    reportedBy: "Sunita Devi",
    photoUrl: PHOTOS[1],
    afterPhotoUrl: PHOTOS[0],
    location: { lat: jitter(CENTER.lat), lng: jitter(CENTER.lng), address: "Civil Lines, near Bus Stand" },
    assignedDept: "Municipal Corporation",
    assignedOfficer: "Supervisor, R. Dahiya",
    aiConfidence: 85,
  },
  {
    id: "CVC-1036",
    title: "Illegal construction debris dumped on roadside",
    description: "Truckload of debris blocking half the carriageway, no barricading or warning signs.",
    category: "Illegal Dumping",
    severity: "high",
    status: "in-progress",
    reportedAt: hoursAgo(20),
    reportedBy: "Vikas Malik",
    photoUrl: PHOTOS[2],
    location: { lat: jitter(CENTER.lat), lng: jitter(CENTER.lng), address: "Industrial Area, Phase 2" },
    assignedDept: "Municipal Corporation",
    aiConfidence: 79,
    isDuplicateOf: "CVC-1029",
  },
  {
    id: "CVC-1035",
    title: "Traffic signal stuck on red at busy junction",
    description: "Signal malfunction causing long queues and near-miss incidents during peak hours.",
    category: "Traffic Signal",
    severity: "high",
    status: "resolved",
    reportedAt: hoursAgo(50),
    reportedBy: "Kavita Rani",
    photoUrl: PHOTOS[3],
    afterPhotoUrl: PHOTOS[1],
    location: { lat: jitter(CENTER.lat), lng: jitter(CENTER.lng), address: "Jhajjar Rd Junction" },
    assignedDept: "Traffic Police",
    assignedOfficer: "SI, A. Chahal",
    aiConfidence: 97,
  },
  {
    id: "CVC-1034",
    title: "Small pothole cluster near roundabout",
    description: "Series of shallow potholes forming across the roundabout approach lane.",
    category: "Pothole",
    severity: "low",
    status: "pending",
    reportedAt: hoursAgo(4),
    reportedBy: "Naresh Bhardwaj",
    photoUrl: PHOTOS[0],
    location: { lat: jitter(CENTER.lat), lng: jitter(CENTER.lng), address: "Rohtak-Sonipat Rd Roundabout" },
    assignedDept: null,
    aiConfidence: 82,
  },
  {
    id: "CVC-1033",
    title: "Damaged manhole cover, open hazard",
    description: "Manhole cover cracked and partially missing, exposed hole poses serious risk at night.",
    category: "Sewage",
    severity: "critical",
    status: "pending",
    reportedAt: hoursAgo(3),
    reportedBy: "Suresh Kadyan",
    photoUrl: PHOTOS[2],
    location: { lat: jitter(CENTER.lat), lng: jitter(CENTER.lng), address: "Sector 1, Main Market" },
    assignedDept: "Municipal Corporation",
    aiConfidence: 94,
  },
];

export function getCategoryBreakdown() {
  const counts = new Map<string, number>();
  for (const issue of mockIssues) {
    counts.set(issue.category, (counts.get(issue.category) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([category, count]) => ({ category, count }));
}

export function getStats() {
  const total = mockIssues.length;
  const pending = mockIssues.filter((i) => i.status === "pending").length;
  const inProgress = mockIssues.filter((i) => i.status === "in-progress").length;
  const resolved = mockIssues.filter((i) => i.status === "resolved").length;
  const critical = mockIssues.filter((i) => i.severity === "critical").length;
  const reportedToday = mockIssues.filter(
    (i) => Date.now() - new Date(i.reportedAt).getTime() < 24 * 60 * 60 * 1000
  ).length;

  return { total, pending, inProgress, resolved, critical, reportedToday };
}
