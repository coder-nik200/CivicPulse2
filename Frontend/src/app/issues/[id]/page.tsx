import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Clock3,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
  Activity,
  CircleDot,
} from "lucide-react";

import { issueStore } from "@/lib/issue-store";
import { MapCanvas, Navbar, SeverityBadge, StatusBadge } from "@/components/ui";
import { label } from "@/lib/issue";

export default async function IssuePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const issue = issueStore.find(id);

  if (!issue) return notFound();

  const stages = [
    ["Reported", "10:12 AM", "Issue reported"],
    ["AI Analyzed", "10:13 AM", "AI-assisted analysis completed"],
    ["Verified", "10:18 AM", "Evidence reviewed"],
    [
      "Assigned",
      "10:27 AM",
      `Assigned to ${issue.assignedTeam || "service team"}`,
    ],
    ["In Progress", "11:04 AM", "Work started"],
    ["Resolved", "", ""],
    ["Resolution Verified", "", ""],
    ["Closed", "", ""],
  ];

  const current = Math.max(
    0,
    stages.findIndex(
      (x) => x[0].toUpperCase().replaceAll(" ", "_") === issue.status,
    ),
  );

  const progress = Math.round(((current + 1) / stages.length) * 100);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f5f8f7]">
        <div className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          {/* BACK */}
          <Link
            href="/map"
            className="group mb-6 inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-slate-950"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white transition group-hover:border-slate-300 group-hover:bg-slate-50">
              <ArrowLeft size={14} />
            </span>
            Back to civic map
          </Link>

          {/* HERO */}
          <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            {/* Decorative background */}
            <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-teal-100/50 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-cyan-100/30 blur-3xl" />

            <div className="relative p-5 sm:p-7 lg:p-9">
              <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
                {/* Title */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono text-[10px] font-bold text-slate-500">
                      {issue.id}
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[10px] font-black text-emerald-700">
                      <ShieldCheck size={12} />
                      VERIFIED
                    </span>
                  </div>

                  <h1 className="mt-4 max-w-3xl text-3xl font-black tracking-[-0.055em] text-slate-950 sm:text-4xl lg:text-5xl">
                    {label(issue.category)}
                  </h1>

                  <div className="mt-4 flex max-w-2xl items-start gap-2.5 text-sm leading-6 text-slate-500">
                    <MapPin size={17} className="mt-1 shrink-0 text-civic" />

                    <span>{issue.address}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                  <SeverityBadge severity={issue.severity} />
                  <StatusBadge status={issue.status} />
                </div>
              </div>

              {/* Quick progress */}
              <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                      Resolution progress
                    </p>

                    <p className="mt-1 text-sm font-black text-slate-900">
                      {stages[current]?.[0] || "Reported"}
                    </p>
                  </div>

                  <span className="font-mono text-xs font-bold text-civic">
                    {progress}%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-civic transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* METRICS */}
          <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <MetricCard
              icon={<Activity size={17} />}
              value={`${issue.severity} / 10`}
              label="AI-assisted severity"
              accent="teal"
            />

            <MetricCard
              icon={<Sparkles size={17} />}
              value={`${issue.confidence}%`}
              label="AI confidence"
              accent="purple"
            />

            <MetricCard
              icon={<Users size={17} />}
              value={`${issue.reportCount}`}
              label="Citizen reports"
              accent="blue"
            />

            <MetricCard
              icon={<CircleDot size={17} />}
              value={`${issue.priority}`}
              label="Priority score"
              accent="orange"
            />
          </section>

          {/* EVIDENCE + TIMELINE */}
          <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
            {/* EVIDENCE */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-civic">
                    Issue evidence
                  </p>

                  <h2 className="mt-1 text-lg font-black text-slate-950">
                    Evidence & AI assessment
                  </h2>
                </div>

                <div className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-emerald-700 sm:flex">
                  <Check size={11} />
                  Reviewed
                </div>
              </div>

              <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[1.05fr_.95fr]">
                {/* IMAGE */}
                <div className="group relative overflow-hidden rounded-2xl bg-slate-100">
                  <img
                    src={issue.imageUrl}
                    alt={`${label(issue.category)} evidence`}
                    className="h-72 w-full object-cover transition duration-500 group-hover:scale-[1.02] sm:h-[380px]"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 pt-16">
                    <div className="flex items-center gap-2 text-white">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 backdrop-blur-md">
                        <MapPin size={14} />
                      </div>

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-white/60">
                          Report location
                        </p>

                        <p className="text-xs font-bold">{issue.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI ANALYSIS */}
                <div className="flex flex-col rounded-2xl bg-[#101a1c] p-5 text-white sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-400/10 text-teal-300">
                        <Sparkles size={15} />
                      </span>

                      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-teal-300">
                        AI analysis
                      </p>
                    </div>

                    <span className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-[9px] text-teal-200">
                      {issue.confidence}% confidence
                    </span>
                  </div>

                  <h2 className="mt-6 text-2xl font-black tracking-tight">
                    {label(issue.category)}
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    {issue.aiSummary ||
                      "AI-assisted findings are awaiting review."}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-2">
                    <DarkStat value={`${issue.severity}/10`} label="Severity" />

                    <DarkStat
                      value={`${issue.priority}/100`}
                      label="Priority"
                    />
                  </div>

                  <div className="mt-auto pt-6">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                      <div className="flex gap-2.5">
                        <ShieldCheck
                          size={15}
                          className="mt-0.5 shrink-0 text-teal-300"
                        />

                        <p className="text-[10px] leading-5 text-slate-400">
                          AI identifies patterns from available evidence. Final
                          decisions require human verification.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* TIMELINE */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_40px_rgba(15,23,42,0.04)] sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-civic">
                    Issue lifecycle
                  </p>

                  <h2 className="mt-1 text-lg font-black text-slate-950">
                    Resolution timeline
                  </h2>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                  <Clock3 size={17} />
                </div>
              </div>

              <div className="relative mt-7">
                <div className="absolute bottom-5 left-[15px] top-3 w-px bg-slate-200" />

                <div className="space-y-5">
                  {stages.map(([title, time, detail], i) => {
                    const completed = i <= current;
                    const active = i === current;

                    return (
                      <div key={title} className="relative flex gap-4">
                        <div
                          className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-4 border-white text-[9px] font-black shadow-sm ${
                            completed
                              ? "bg-civic text-white"
                              : "bg-slate-100 text-slate-400"
                          } ${active ? "ring-4 ring-teal-50" : ""}`}
                        >
                          {completed ? (
                            <Check size={12} strokeWidth={3} />
                          ) : (
                            i + 1
                          )}
                        </div>

                        <div className="min-w-0 flex-1 pb-1">
                          <div className="flex items-start justify-between gap-2">
                            <b
                              className={`text-sm font-black ${
                                completed ? "text-slate-900" : "text-slate-400"
                              }`}
                            >
                              {title}
                            </b>

                            {time && (
                              <span className="shrink-0 font-mono text-[9px] text-slate-400">
                                {time}
                              </span>
                            )}
                          </div>

                          {detail && (
                            <p
                              className={`mt-1 text-[10px] leading-5 ${
                                completed ? "text-slate-500" : "text-slate-300"
                              }`}
                            >
                              {detail}
                            </p>
                          )}

                          {active && (
                            <span className="mt-2 inline-flex rounded-full bg-teal-50 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-civic">
                              Current stage
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          {/* LOCATION + COMMUNITY */}
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {/* LOCATION */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.04)]">
              <div className="p-5 sm:p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-civic">
                  Location
                </p>

                <h2 className="mt-2 text-lg font-black text-slate-950">
                  {issue.address}
                </h2>

                <div className="mt-2 flex items-center gap-2">
                  <MapPin size={12} className="text-civic" />

                  <p className="font-mono text-[9px] text-slate-400">
                    {issue.lat.toFixed(6)}°, {issue.lng.toFixed(6)}°
                  </p>
                </div>
              </div>

              <div className="h-64 overflow-hidden sm:h-72">
                <MapCanvas issues={[issue]} selected={issue} />
              </div>
            </section>

            {/* COMMUNITY */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_40px_rgba(15,23,42,0.04)] sm:p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-civic">
                Community evidence
              </p>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-civic">
                  <Users size={23} />
                </div>

                <div>
                  <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                    {issue.reportCount} reports
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {issue.uniqueReporterCount ||
                      Math.max(2, issue.reportCount - 2)}{" "}
                    unique contributors
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <CommunityStat
                  value={`${issue.reportCount}`}
                  label="Total reports"
                />

                <CommunityStat
                  value={`${issue.uniqueReporterCount || Math.max(2, issue.reportCount - 2)}`}
                  label="Contributors"
                />
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <p className="text-sm leading-6 text-slate-600">
                  Multiple reports can strengthen evidence for the same incident
                  and help service teams prioritize action.
                </p>
              </div>

              {issue.id === "CIV-1024" && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 p-3.5">
                  <Users size={14} className="shrink-0 text-amber-700" />

                  <p className="text-xs font-bold text-amber-800">
                    Similar reports merged into CIV-1024
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* RESOLUTION */}
          {issue.resolution && (
            <section className="relative mt-5 overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 sm:p-7">
              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-100/60 blur-3xl" />

              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <Check size={16} strokeWidth={3} />
                    </span>

                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
                      Resolution verification
                    </p>
                  </div>

                  <h2 className="mt-4 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                    The repair is ready for confirmation
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Confirm whether the reported civic issue has actually been
                    resolved. Your response helps keep community data accurate.
                  </p>
                </div>

                <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[190px]">
                  <button className="rounded-xl bg-civic px-5 py-3.5 text-xs font-black text-white shadow-sm transition hover:brightness-95 active:scale-[0.98]">
                    Confirm fixed
                  </button>

                  <button className="rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-xs font-black text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]">
                    Still exists
                  </button>
                </div>
              </div>
            </section>
          )}

          <div className="h-8 sm:h-12" />
        </div>
      </main>
    </>
  );
}

function MetricCard({
  icon,
  value,
  label,
  accent,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  accent: "teal" | "purple" | "blue" | "orange";
}) {
  const accents = {
    teal: "bg-teal-50 text-teal-600",
    purple: "bg-purple-50 text-purple-600",
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.025)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(15,23,42,0.06)] sm:p-5">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${accents[accent]}`}
      >
        {icon}
      </div>

      <b className="mt-4 block font-mono text-lg font-black tracking-tight text-slate-950 sm:text-xl">
        {value}
      </b>

      <span className="mt-1 block text-[10px] font-bold leading-4 text-slate-500">
        {label}
      </span>
    </div>
  );
}

function DarkStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.06] p-3.5">
      <b className="block font-mono text-sm font-black">{value}</b>

      <span className="mt-1 block text-[9px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </span>
    </div>
  );
}

function CommunityStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5">
      <b className="block text-lg font-black text-slate-950">{value}</b>

      <span className="mt-1 block text-[9px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </span>
    </div>
  );
}
