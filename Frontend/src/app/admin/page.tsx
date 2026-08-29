"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  CheckCircle2,
  Clock3,
  MapPinned,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import { Navbar, SeverityBadge, StatusBadge } from "@/components/ui";
import { CivicIssue, CivicNotification, IssueStatus } from "@/types/issue";
import { label } from "@/lib/issue";

type Metrics = {
  total: number;
  reported: number;
  inProgress: number;
  resolved: number;
  critical: number;
};
const nextStatus: Partial<Record<IssueStatus, IssueStatus>> = {
  REPORTED: "AI_ANALYZED",
  AI_ANALYZED: "VERIFIED",
  VERIFIED: "ASSIGNED",
  ASSIGNED: "IN_PROGRESS",
  IN_PROGRESS: "RESOLVED",
  RESOLVED: "RESOLUTION_VERIFIED",
  RESOLUTION_VERIFIED: "CLOSED",
};

export default function Admin() {
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [metrics, setMetrics] = useState<Metrics>();
  const [notifications, setNotifications] = useState<CivicNotification[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/dashboard", {
        cache: "no-store",
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setIssues(data.issues);
      setMetrics(data.metrics);
      setNotifications(data.notifications);
    } catch {
      setMessage("Unable to load the operations dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
    const timer = window.setInterval(load, 30000);
    return () => window.clearInterval(timer);
  }, []);
  const advance = async (issue: CivicIssue) => {
    const next = nextStatus[issue.status];
    if (!next) return;
    setMessage("");
    const response = await fetch(`/api/issues/${issue.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (!response.ok) {
      const data = await response.json();
      setMessage(data.error || "Update failed.");
      return;
    }
    await load();
    setMessage(`${issue.id} moved to ${label(next)}.`);
  };
  const filtered = useMemo(
    () =>
      issues
        .filter(
          (issue) =>
            (status === "all" || issue.status === status) &&
            `${issue.id} ${issue.address} ${issue.category}`
              .toLowerCase()
              .includes(query.toLowerCase()),
        )
        .sort((a, b) => b.priority - a.priority),
    [issues, query, status],
  );
  const cards = [
    {
      label: "Total reports",
      value: metrics?.total ?? 0,
      Icon: Activity,
      color: "text-blue-600",
    },
    {
      label: "Pending review",
      value: metrics?.reported ?? 0,
      Icon: Clock3,
      color: "text-amber-600",
    },
    {
      label: "In progress",
      value: metrics?.inProgress ?? 0,
      Icon: MapPinned,
      color: "text-civic",
    },
    {
      label: "Resolved",
      value: metrics?.resolved ?? 0,
      Icon: CheckCircle2,
      color: "text-emerald-600",
    },
    {
      label: "Critical",
      value: metrics?.critical ?? 0,
      Icon: ShieldAlert,
      color: "text-red-600",
    },
  ];
  return (
    <>
      <Navbar dark />
      <main className="min-h-screen bg-[#f4f7f6]">
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-3xl bg-[#101a1c] p-6 text-white sm:p-9">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[.2em] text-teal-300">
                  Civic operations
                </p>
                <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
                  Real-time issue management
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-400">
                  Live reports, lifecycle updates, and operational priorities
                  from the CivicFix API.
                </p>
              </div>
              <button
                onClick={load}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-xs font-bold hover:bg-white/20"
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />{" "}
                Refresh
              </button>
            </div>
          </section>
          <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
            {cards.map(({ label, value, Icon, color }) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
              >
                <Icon className={color} size={18} />
                <b className={`mt-4 block font-mono text-2xl ${color}`}>
                  {value}
                </b>
                <span className="text-xs font-bold text-slate-600">
                  {label}
                </span>
              </div>
            ))}
          </section>
          <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_320px]">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-10 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-civic"
                  placeholder="Search issue, category or location"
                />
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold"
                >
                  {[
                    "all",
                    "REPORTED",
                    "AI_ANALYZED",
                    "VERIFIED",
                    "ASSIGNED",
                    "IN_PROGRESS",
                    "RESOLVED",
                    "RESOLUTION_VERIFIED",
                    "CLOSED",
                  ].map((item) => (
                    <option key={item} value={item}>
                      {item === "all" ? "All statuses" : label(item)}
                    </option>
                  ))}
                </select>
              </div>
              {message && (
                <p className="mx-5 mt-4 rounded-xl bg-teal-50 p-3 text-xs font-semibold text-civic">
                  {message}
                </p>
              )}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="bg-slate-50 text-[9px] uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="p-4">Issue</th>
                      <th>Location</th>
                      <th>Severity</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((issue) => (
                      <tr
                        key={issue.id}
                        className="border-t border-slate-100 text-xs"
                      >
                        <td className="p-4">
                          <Link
                            className="font-mono font-bold text-civic"
                            href={`/issues/${issue.id}`}
                          >
                            {issue.id}
                          </Link>
                          <b className="ml-2">{label(issue.category)}</b>
                        </td>
                        <td className="max-w-48 truncate">{issue.address}</td>
                        <td>
                          <SeverityBadge severity={issue.severity} />
                        </td>
                        <td>
                          <StatusBadge status={issue.status} />
                        </td>
                        <td>
                          {nextStatus[issue.status] ? (
                            <button
                              onClick={() => advance(issue)}
                              className="rounded-lg bg-civic px-2.5 py-1.5 text-[10px] font-black text-white"
                            >
                              Advance
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400">
                              Closed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!loading && filtered.length === 0 && (
                <p className="p-8 text-center text-sm text-slate-500">
                  No civic issues match the current filters.
                </p>
              )}
            </div>
            <aside className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-[10px] font-black uppercase tracking-wider text-civic">
                Recent activity
              </p>
              <h2 className="mt-2 text-lg font-black">Notifications</h2>
              <div className="mt-4 space-y-3">
                {notifications.length ? (
                  notifications.map((notification) => (
                    <Link
                      key={notification.id}
                      href={`/issues/${notification.issueId}`}
                      className="block rounded-xl bg-slate-50 p-3 hover:bg-teal-50"
                    >
                      <b className="text-xs">{notification.title}</b>
                      <span className="mt-1 block text-[10px] leading-4 text-slate-500">
                        {notification.message}
                      </span>
                    </Link>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">
                    No notifications yet.
                  </p>
                )}
              </div>
            </aside>
          </section>
        </div>
      </main>
    </>
  );
}
