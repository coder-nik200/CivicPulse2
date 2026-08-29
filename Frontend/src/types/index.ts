export type IssueStatus = "pending" | "in-progress" | "resolved";
export type IssueSeverity = "low" | "medium" | "high" | "critical";

export type IssueCategory =
  | "Pothole"
  | "Streetlight"
  | "Garbage"
  | "Water Leakage"
  | "Sewage"
  | "Broken Sidewalk"
  | "Illegal Dumping"
  | "Traffic Signal";

export type Department =
  | "PWD"
  | "Municipal Corporation"
  | "Sanitation"
  | "Electricity"
  | "Water Board"
  | "Traffic Police";

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  severity: IssueSeverity;
  status: IssueStatus;
  reportedAt: string; // ISO timestamp
  reportedBy: string;
  photoUrl: string;
  afterPhotoUrl?: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  assignedDept: Department | null;
  assignedOfficer?: string;
  aiConfidence: number; // 0-100
  isDuplicateOf?: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  critical: number;
  reportedToday: number;
}
