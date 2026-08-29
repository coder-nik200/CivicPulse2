export type IssueCategory =
  | "pothole"
  | "garbage"
  | "streetlight"
  | "obstruction"
  | "waterlogging";
export type IssueStatus =
  | "REPORTED"
  | "AI_ANALYZED"
  | "VERIFIED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "RESOLUTION_VERIFIED"
  | "CLOSED";
export interface StatusEvent {
  status: IssueStatus;
  at: string;
  note?: string;
}
export interface CivicIssue {
  id: string;
  category: IssueCategory;
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
  statusHistory?: StatusEvent[];
  resolution?: {
    afterImageUrl?: string;
    verificationScore?: number;
    citizenConfirmed?: boolean;
  };
}
export interface CivicNotification {
  id: string;
  issueId: string;
  type: "issue_created" | "status_updated";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
