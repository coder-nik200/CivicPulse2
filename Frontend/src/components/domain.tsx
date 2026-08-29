"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Construction,
  Lightbulb,
  MapPin,
  Trash2,
  ArrowRight,
  Check,
} from "lucide-react";
import { CivicIssue, IssueStatus } from "@/types/issue";
import { label } from "@/lib/issue";
import { Badge } from "./index";

// Issue Status Badge
export function IssueStatusBadge({ status }: { status: IssueStatus }) {
  const colors: Record<IssueStatus, string> = {
    REPORTED: "text-blue-700 bg-blue-50 border-blue-100",
    AI_ANALYZED: "text-violet-700 bg-violet-50 border-violet-100",
    VERIFIED: "text-cyan-700 bg-cyan-50 border-cyan-100",
    ASSIGNED: "text-amber-700 bg-amber-50 border-amber-100",
    IN_PROGRESS: "text-amber-800 bg-amber-100 border-amber-200",
    RESOLVED: "text-emerald-700 bg-emerald-50 border-emerald-100",
    RESOLUTION_VERIFIED: "text-emerald-700 bg-emerald-50 border-emerald-100",
    CLOSED: "text-slate-600 bg-slate-100 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-extrabold tracking-wide ${colors[status]}`}
    >
      {label(status)}
    </span>
  );
}

// Severity Badge
export function SeverityBadge({ severity }: { severity: number }) {
  const text =
    severity >= 8
      ? "CRITICAL"
      : severity >= 6
        ? "HIGH"
        : severity >= 3
          ? "MEDIUM"
          : "LOW";
  const color =
    severity >= 8
      ? "text-red-700 bg-red-50"
      : severity >= 6
        ? "text-amber-700 bg-amber-50"
        : "text-blue-700 bg-blue-50";

  return (
    <span
      className={`inline-flex gap-1.5 items-center rounded-md px-2 py-1 text-[10px] font-extrabold ${color}`}
    >
      <AlertTriangle size={12} />
      {text} · {severity.toFixed(1)}
    </span>
  );
}

// Category Icon
export function CategoryIcon({
  category,
  size = 16,
}: {
  category: string;
  size?: number;
}) {
  if (category === "pothole" || category === "obstruction")
    return <Construction size={size} />;
  if (category === "garbage") return <Trash2 size={size} />;
  if (category === "streetlight") return <Lightbulb size={size} />;
  return <AlertTriangle size={size} />;
}

// Issue Card
interface IssueCardProps {
  issue: CivicIssue;
  compact?: boolean;
  hoverable?: boolean;
}

export function IssueCard({
  issue,
  compact = false,
  hoverable = true,
}: IssueCardProps) {
  const cardClass = hoverable
    ? "group block hover:-translate-y-0.5 hover:shadow-lg transition-all"
    : "block";

  return (
    <Link href={`/issues/${issue.id}`} className={cardClass}>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex gap-3">
          <img
            className="h-14 w-14 rounded-lg object-cover"
            src={issue.imageUrl}
            alt={`${label(issue.category)} evidence`}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-extrabold">{label(issue.category)}</p>
              <SeverityBadge severity={issue.severity} />
            </div>
            <p className="mt-1 truncate text-[11px] font-medium text-slate-500">
              <MapPin className="mr-1 inline" size={12} />
              {issue.address}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <IssueStatusBadge status={issue.status} />
              {!compact && (
                <span className="font-mono text-[10px] font-bold text-slate-500">
                  P{issue.priority}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Issue Timeline
interface TimelineEvent {
  status: IssueStatus;
  timestamp: string;
  label: string;
}

export function IssueTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-600">
              <Check size={18} />
            </div>
            {index < events.length - 1 && (
              <div className="mt-2 h-8 w-0.5 bg-slate-200" />
            )}
          </div>
          <div className="pb-4 pt-1">
            <h4 className="font-medium text-slate-900">{event.label}</h4>
            <p className="mt-1 text-sm text-slate-500">{event.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Priority Badge
export function PriorityBadge({ priority }: { priority: number }) {
  const level =
    priority >= 80
      ? "Critical"
      : priority >= 60
        ? "High"
        : priority >= 40
          ? "Medium"
          : "Low";
  const color =
    priority >= 80
      ? "danger"
      : priority >= 60
        ? "warning"
        : priority >= 40
          ? "warning"
          : "neutral";

  return <Badge variant={color}>{level}</Badge>;
}

// Stats Card
interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  description?: string;
  trend?: { value: number; isPositive: boolean };
}

export function StatsCard({
  icon,
  label,
  value,
  description,
  trend,
}: StatsCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          {description && (
            <p className="mt-1 text-xs text-slate-400">{description}</p>
          )}
        </div>
        <div className="text-slate-300">{icon}</div>
      </div>
      {trend && (
        <div
          className={`mt-4 text-sm font-medium ${trend.isPositive ? "text-emerald-600" : "text-red-600"}`}
        >
          {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
        </div>
      )}
    </div>
  );
}

// Issue Map Marker
export function MapMarker({
  category,
  severity,
}: {
  category: string;
  severity: number;
}) {
  const severityClass =
    severity >= 8 ? "critical" : severity >= 6 ? "high" : "medium";

  return (
    <div className={`marker ${severityClass}`}>
      <CategoryIcon category={category} size={16} />
    </div>
  );
}
