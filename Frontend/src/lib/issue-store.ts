import { demoIssues } from "@/data/demoIssues";
import { CivicIssue, CivicNotification, IssueStatus } from "@/types/issue";

// Replace this module with a database repository (Prisma/Firebase/etc.) in production.
// Keeping it behind this small interface prevents UI routes from depending on storage.
const globalStore = globalThis as unknown as {
  civicIssues?: CivicIssue[];
  civicNotifications?: CivicNotification[];
};
const issues =
  globalStore.civicIssues ?? demoIssues.map((issue) => ({ ...issue }));
globalStore.civicIssues = issues;
const notifications = globalStore.civicNotifications ?? [];
globalStore.civicNotifications = notifications;
const transitions: Record<IssueStatus, IssueStatus[]> = {
  REPORTED: ["AI_ANALYZED"],
  AI_ANALYZED: ["VERIFIED"],
  VERIFIED: ["ASSIGNED"],
  ASSIGNED: ["IN_PROGRESS"],
  IN_PROGRESS: ["RESOLVED"],
  RESOLVED: ["RESOLUTION_VERIFIED"],
  RESOLUTION_VERIFIED: ["CLOSED"],
  CLOSED: [],
};
const addNotification = (
  issue: CivicIssue,
  type: CivicNotification["type"],
  title: string,
  message: string,
) =>
  notifications.unshift({
    id: `NOT-${Date.now()}-${notifications.length}`,
    issueId: issue.id,
    type,
    title,
    message,
    read: false,
    createdAt: new Date().toISOString(),
  });

export const issueStore = {
  all: () => issues,
  find: (id: string) => issues.find((issue) => issue.id === id),
  create: (issue: CivicIssue) => {
    issue.statusHistory = [
      { status: issue.status, at: issue.createdAt, note: "Report submitted" },
    ];
    issues.unshift(issue);
    addNotification(
      issue,
      "issue_created",
      "New civic issue reported",
      `${issue.category} reported near ${issue.address || "your selected location"}.`,
    );
    return issue;
  },
  updateStatus: (id: string, status: IssueStatus) => {
    const issue = issues.find((entry) => entry.id === id);
    if (!issue || !transitions[issue.status].includes(status)) return undefined;
    issue.status = status;
    issue.updatedAt = new Date().toISOString();
    issue.statusHistory = [
      ...(issue.statusHistory || [{ status: "REPORTED", at: issue.createdAt }]),
      { status, at: issue.updatedAt },
    ];
    addNotification(
      issue,
      "status_updated",
      "Issue status updated",
      `${issue.category} at ${issue.address || "the reported location"} is now ${status.replaceAll("_", " ")}.`,
    );
    return issue;
  },
  notifications: () => notifications,
  markNotificationRead: (id: string) => {
    const notification = notifications.find((item) => item.id === id);
    if (notification) notification.read = true;
    return notification;
  },
  dashboard: () => ({
    total: issues.length,
    reported: issues.filter((issue) =>
      ["REPORTED", "AI_ANALYZED", "VERIFIED", "ASSIGNED"].includes(
        issue.status,
      ),
    ).length,
    inProgress: issues.filter((issue) => issue.status === "IN_PROGRESS").length,
    resolved: issues.filter((issue) =>
      ["RESOLVED", "RESOLUTION_VERIFIED", "CLOSED"].includes(issue.status),
    ).length,
    critical: issues.filter((issue) => issue.severity >= 8).length,
  }),
};
