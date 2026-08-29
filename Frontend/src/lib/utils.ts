import { clsx, type ClassValue } from "clsx";
import { IssueSeverity, IssueStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export const statusMeta: Record<
  IssueStatus,
  { label: string; text: string; bg: string; dot: string }
> = {
  pending: { label: "Pending", text: "text-status-pending", bg: "bg-status-pending-bg", dot: "bg-status-pending" },
  "in-progress": { label: "In Progress", text: "text-status-progress", bg: "bg-status-progress-bg", dot: "bg-status-progress" },
  resolved: { label: "Resolved", text: "text-status-resolved", bg: "bg-status-resolved-bg", dot: "bg-status-resolved" },
};

export const severityMeta: Record<
  IssueSeverity,
  { label: string; text: string; bg: string; dot: string }
> = {
  low: { label: "Low", text: "text-status-pending", bg: "bg-status-pending-bg", dot: "bg-status-pending" },
  medium: { label: "Medium", text: "text-status-warning", bg: "bg-status-warning-bg", dot: "bg-status-warning" },
  high: { label: "High", text: "text-status-warning", bg: "bg-status-warning-bg", dot: "bg-status-warning" },
  critical: { label: "Critical", text: "text-status-critical", bg: "bg-status-critical-bg", dot: "bg-status-critical" },
};
