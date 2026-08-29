"use client";
import Link from "next/link";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Construction,
  Lightbulb,
  MapPin,
  Menu,
  Trash2,
  X,
} from "lucide-react";
import { CivicIssue, IssueCategory, IssueStatus } from "@/types/issue";
import { label } from "@/lib/issue";
export const categoryIcon = (category: IssueCategory, size = 16) =>
  category === "pothole" || category === "obstruction" ? (
    <Construction size={size} />
  ) : category === "garbage" ? (
    <Trash2 size={size} />
  ) : category === "streetlight" ? (
    <Lightbulb size={size} />
  ) : (
    <AlertTriangle size={size} />
  );
export { label } from "@/lib/issue";
export function StatusBadge({ status }: { status: IssueStatus }) {
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
      <span className="status-dot">{label(status)}</span>
    </span>
  );
}
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
export function Navbar({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const tone = dark ? "!text-slate-300" : "";
  return (
    <header
      className={`relative ${dark ? "bg-ink text-white" : "bg-white border-b border-slate-100"}`}
    >
      <nav className="mx-auto flex h-[74px] max-w-[1180px] items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-extrabold tracking-tight"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-civic text-white">
            <MapPin size={17} />
          </span>
          CivicFix
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          <Link className={`navlink ${tone}`} href="/">
            Home
          </Link>
          <Link className={`navlink ${tone}`} href="/map">
            Civic Map
          </Link>
          <Link className={`navlink ${tone}`} href="/report">
            Report Issue
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="hidden text-xs font-bold md:block">
            Admin
          </Link>
          <Link
            href="/report"
            className="hidden rounded-lg bg-civic px-4 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-teal-800 sm:block"
          >
            Report Issue
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden"
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      {open && (
        <div
          className={`absolute left-0 right-0 top-[74px] z-50 border-b border-slate-200 px-6 py-4 shadow-lg md:hidden ${dark ? "bg-ink" : "bg-white"}`}
        >
          <div className="mx-auto flex max-w-[1180px] flex-col gap-3 text-sm font-bold">
            <Link onClick={() => setOpen(false)} href="/">
              Home
            </Link>
            <Link onClick={() => setOpen(false)} href="/map">
              Civic Map
            </Link>
            <Link onClick={() => setOpen(false)} href="/issues/CIV-1024">
              Issue details
            </Link>
            <Link onClick={() => setOpen(false)} href="/admin">
              Admin dashboard
            </Link>
            <Link
              onClick={() => setOpen(false)}
              href="/report"
              className="rounded-lg bg-civic px-4 py-3 text-center text-white"
            >
              Report Issue
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
export function IssueCard({
  issue,
  compact = false,
}: {
  issue: CivicIssue;
  compact?: boolean;
}) {
  return (
    <Link
      href={`/issues/${issue.id}`}
      className="group block rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-panel"
    >
      <div className="flex gap-3">
        <img
          className="h-14 w-14 rounded-lg issue-photo"
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
            <StatusBadge status={issue.status} />
            {!compact && (
              <span className="mono text-[10px] font-bold text-slate-500">
                P{issue.priority}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
export function MapCanvas({
  issues,
  selected,
}: {
  issues: CivicIssue[];
  selected?: CivicIssue;
}) {
  return (
    <div
      className="grid-map h-full min-h-[420px] rounded-xl border border-slate-200"
      aria-label="Interactive city issue map"
    >
      {issues.map((issue, i) => (
        <Link
          aria-label={`View ${issue.id}`}
          href={`/issues/${issue.id}`}
          key={issue.id}
          className={`marker ${issue.severity >= 8 ? "critical" : issue.severity >= 6 ? "high" : "medium"}`}
          style={{
            left: `${14 + ((i * 19) % 72)}%`,
            top: `${16 + ((i * 29) % 66)}%`,
          }}
        >
          {categoryIcon(issue.category)}
        </Link>
      ))}
      {selected && (
        <div className="absolute bottom-5 left-5 max-w-[290px] rounded-xl bg-white p-4 shadow-panel">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-extrabold">
                {label(selected.category)}
              </p>
              <p className="mono mt-1 text-[10px] text-slate-500">
                {selected.id}
              </p>
            </div>
            <StatusBadge status={selected.status} />
          </div>
          <p className="mt-3 text-xs text-slate-600">{selected.address}</p>
          <div className="mt-3 flex justify-between text-xs font-bold">
            <span>Severity {selected.severity}</span>
            <span>{selected.reportCount} reports</span>
          </div>
          <Link
            href={`/issues/${selected.id}`}
            className="mt-4 flex items-center gap-1 text-xs font-extrabold text-civic"
          >
            View details <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}
