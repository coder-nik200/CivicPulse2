const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export type IssueCategory =
  | "pothole"
  | "garbage"
  | "streetlight"
  | "water_leakage"
  | "road_damage"
  | "other";

export interface SubmitIssueInput {
  file: File;
  category: IssueCategory;
  latitude: number;
  longitude: number;
  address: string;
  description?: string;
  area?: string;
}

export interface Issue {
  _id: string;
  issueId: string;

  issueType: IssueCategory;

  description: string;

  image: {
    url: string;
    publicId?: string;
  };

  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };

  status:
    | "reported"
    | "under_review"
    | "assigned"
    | "in_progress"
    | "resolved"
    | "rejected";

  priority: "low" | "medium" | "high" | "critical";

  emailStatus: "pending" | "sent" | "failed";

  authority?: {
    _id: string;
    name: string;
    department: string;
    email: string;
  };

  reportedBy?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };

  createdAt: string;
  updatedAt: string;
}

interface IssueResponse {
  success: boolean;
  message?: string;
  issue: Issue;
}

interface IssuesResponse {
  success: boolean;
  count?: number;
  issues: Issue[];
}
