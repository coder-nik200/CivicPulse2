import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  MapPin,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Activity,
  Clock3,
  Users,
  Zap,
} from "lucide-react";

import { demoIssues } from "@/data/demoIssues";

import { IssueCard, MapCanvas, Navbar, SeverityBadge } from "@/components/ui";
import { label } from "@/lib/issue";

const metrics = [
  {
    value: "128",
    label: "Total issues",
    description: "Across 18 city zones",
    icon: MapPin,
  },
  {
    value: "43",
    label: "Open",
    description: "Needs attention",
    icon: CircleAlert,
  },
  {
    value: "31",
    label: "In progress",
    description: "Teams deployed",
    icon: Activity,
  },
  {
    value: "54",
    label: "Resolved",
    description: "This month",
    icon: CheckCircle2,
  },
];

const lifecycle = [
  {
    number: "01",
    title: "Report",
    description: "Photo + location",
    icon: MapPin,
  },
  {
    number: "02",
    title: "Understand",
    description: "AI analyzes evidence",
    icon: ScanSearch,
  },
  {
    number: "03",
    title: "Prioritize",
    description: "Severity + reports",
    icon: Zap,
  },
  {
    number: "04",
    title: "Resolve",
    description: "Authority responds",
    icon: CheckCircle2,
  },
  {
    number: "05",
    title: "Verify",
    description: "Evidence confirms repair",
    icon: ShieldCheck,
  },
];

export default function Home() {
  const lead = demoIssues[0];

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f9f8] text-[#10201c]">
      <Navbar />

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative border-b border-slate-200/80">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-emerald-200/20 blur-3xl" />
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-teal-100/30 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-32 w-32 rounded-full bg-emerald-100/20 blur-2xl" />
        </div>

        <div className="relative mx-auto grid max-w-[1240px] gap-12 px-5 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-16 lg:px-8 lg:py-24">
          {/* Hero copy */}
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-black tracking-[0.16em] text-emerald-700">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              CIVIC INTELLIGENCE PLATFORM
            </div>

            <h1 className="max-w-[680px] text-[2.9rem] font-black leading-[0.98] tracking-[-0.06em] text-[#10201c] sm:text-6xl lg:text-[4.5rem]">
              Report problems.
              <br />
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Drive action.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              Turn everyday civic problems into evidence-backed action. Report
              an issue, understand its severity, track its progress, and verify
              the resolution.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/report"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#123d34] px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0d3029] hover:shadow-xl"
              >
                Report an issue
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/map"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-black text-slate-800 transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                Explore civic map
              </Link>
            </div>

            {/* Trust indicator */}
            <div className="mt-9 flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                <ShieldCheck size={18} className="text-emerald-600" />
              </div>

              <div>
                <p className="text-xs font-black text-slate-800">
                  Evidence-led reporting
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Human-verified outcomes
                </p>
              </div>
            </div>
          </div>

          {/* Hero map */}
          <div className="relative">
            <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-emerald-200/30 to-teal-100/20 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border border-white/80 bg-white p-2 shadow-[0_25px_80px_-30px_rgba(15,23,42,0.35)] sm:rounded-3xl sm:p-3">
              <div className="relative h-[390px] overflow-hidden rounded-xl sm:h-[500px] sm:rounded-2xl">
                <MapCanvas issues={demoIssues.slice(0, 7)} selected={lead} />

                {/* Map overlay */}
                <div className="absolute left-4 top-4 right-4 flex items-start justify-between gap-3">
                  <div className="rounded-xl border border-white/70 bg-white/95 px-3.5 py-3 shadow-lg backdrop-blur">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-black tracking-wider text-slate-500">
                        LIVE SIGNAL
                      </span>
                    </div>

                    <p className="mt-1 text-xs font-black text-slate-900">
                      12 reports added today
                    </p>
                  </div>

                  <div className="hidden rounded-xl border border-white/70 bg-white/95 p-3 shadow-lg backdrop-blur sm:block">
                    <MapPin size={17} className="text-emerald-600" />
                  </div>
                </div>

                {/* Bottom map card */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-white/70 bg-[#10201c]/95 p-3.5 text-white shadow-xl backdrop-blur">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-black">
                        {label(lead.category)}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-300">
                        <MapPin size={11} />
                        Civic issue detected
                      </p>
                    </div>

                    <SeverityBadge severity={lead.severity} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          LIVE STATS
      ========================================================= */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1240px] px-5 py-7 sm:px-6 lg:px-8 lg:py-9">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black tracking-[0.18em] text-emerald-600">
                LIVE CITY STATUS
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Real-time civic activity overview
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 md:grid-cols-4">
            {metrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <div
                  key={metric.label}
                  className="bg-white p-5 transition hover:bg-slate-50 sm:p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-2xl font-medium tracking-tight text-slate-900 sm:text-3xl">
                        {metric.value}
                      </p>

                      <p className="mt-1 text-xs font-black text-slate-800">
                        {metric.label}
                      </p>

                      <p className="mt-1 text-[10px] leading-4 text-slate-500 sm:text-[11px]">
                        {metric.description}
                      </p>
                    </div>

                    <div className="hidden rounded-lg bg-slate-100 p-2 sm:block">
                      <Icon size={15} className="text-emerald-600" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          CITY INTELLIGENCE
      ========================================================= */}

      <section className="mx-auto max-w-[1240px] px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black tracking-[0.18em] text-emerald-600">
              CITY INTELLIGENCE
            </p>

            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.045em] text-slate-900 sm:text-4xl">
              See what is happening around your city
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Explore reported civic issues, identify hotspots, and understand
              where attention is needed most.
            </p>
          </div>

          <Link
            href="/map"
            className="group inline-flex w-fit items-center gap-2 text-sm font-black text-emerald-700"
          >
            Open full map
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="mt-9 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:p-3">
            <div className="h-[400px] overflow-hidden rounded-xl sm:h-[520px]">
              <MapCanvas issues={demoIssues} selected={demoIssues[1]} />
            </div>
          </div>

          <div className="space-y-3">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-slate-900">
                  Recent reports
                </p>
                <p className="mt-1 text-[10px] text-slate-500">
                  Latest civic activity
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                3 recent
              </span>
            </div>

            {demoIssues.slice(0, 3).map((issue) => (
              <IssueCard key={issue.id} issue={issue} compact />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          LIFECYCLE
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#10201c] text-white">
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-[1240px] px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-black tracking-[0.16em] text-emerald-300">
              <Sparkles size={12} />
              THE CIVICPULSE LIFECYCLE
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
              From citizen report to verified resolution.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-400">
              CivicPulse creates a transparent chain of evidence from the moment
              a problem is reported until the repair is verified.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {lifecycle.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.number}
                  className="group relative rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.06]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-300">
                      {item.number}
                    </span>

                    <Icon
                      size={17}
                      className="text-slate-500 transition group-hover:text-emerald-300"
                    />
                  </div>

                  <h3 className="mt-8 text-lg font-black">{item.title}</h3>

                  <p className="mt-2 text-xs text-slate-400">
                    {item.description}
                  </p>

                  {index < lifecycle.length - 1 && (
                    <ArrowRight
                      size={15}
                      className="absolute -right-2.5 top-1/2 hidden text-emerald-400 lg:block"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          RESPONSIBLE AI
      ========================================================= */}

      <section className="mx-auto max-w-[1240px] px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
          {/* Text */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black tracking-[0.16em] text-slate-600">
              <ShieldCheck size={12} />
              RESPONSIBLE AI
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-[-0.045em] text-slate-900 sm:text-4xl">
              Evidence before assumptions.
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-600">
              Every report combines photographic evidence, GPS location, citizen
              reports, AI analysis, and issue history. AI helps teams see the
              signal, not replace human judgment.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <ScanSearch size={18} className="text-emerald-600" />
                <p className="mt-3 text-xs font-black">AI analysis</p>
                <p className="mt-1 text-[10px] text-slate-500">
                  Evidence classification
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <MapPin size={18} className="text-emerald-600" />
                <p className="mt-3 text-xs font-black">GPS verified</p>
                <p className="mt-1 text-[10px] text-slate-500">
                  Precise issue location
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <Users size={18} className="text-emerald-600" />
                <p className="mt-3 text-xs font-black">Community signal</p>
                <p className="mt-1 text-[10px] text-slate-500">
                  Citizen confirmations
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <Clock3 size={18} className="text-emerald-600" />
                <p className="mt-3 text-xs font-black">Issue history</p>
                <p className="mt-1 text-[10px] text-slate-500">
                  Track progress over time
                </p>
              </div>
            </div>
          </div>

          {/* AI analysis card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_25px_70px_-35px_rgba(15,23,42,0.4)] sm:p-5">
            <div className="overflow-hidden rounded-xl bg-slate-100">
              <img
                src={lead.imageUrl}
                alt="Road damage evidence"
                className="h-52 w-full object-cover sm:h-64"
              />
            </div>

            <div className="p-2 pt-5 sm:p-3 sm:pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-emerald-500" />
                    <p className="text-[10px] font-black tracking-[0.15em] text-emerald-600">
                      AI-GENERATED ANALYSIS
                    </p>
                  </div>

                  <h3 className="mt-2 text-2xl font-black text-slate-900">
                    Pothole
                  </h3>
                </div>

                <SeverityBadge severity={lead.severity} />
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                {lead.aiSummary}
              </p>

              <div className="mt-6 grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-100 pt-5">
                <div className="px-2 first:pl-0">
                  <b className="block text-lg font-black text-slate-900">96%</b>
                  <span className="text-[10px] text-slate-500">
                    AI confidence
                  </span>
                </div>

                <div className="px-3">
                  <b className="block text-lg font-black text-slate-900">
                    8.7 / 10
                  </b>
                  <span className="text-[10px] text-slate-500">Severity</span>
                </div>

                <div className="px-3">
                  <b className="block text-lg font-black text-slate-900">92</b>
                  <span className="text-[10px] text-slate-500">Priority</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-[900px] px-5 py-16 text-center sm:px-6 sm:py-20">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
            <MapPin className="text-emerald-600" size={22} />
          </div>

          <h2 className="mt-5 text-3xl font-black tracking-[-0.045em] text-slate-900 sm:text-4xl">
            Your city has problems.
            <br />
            <span className="text-emerald-600">Help make them visible.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500">
            One report can become a verified signal, a prioritized task, and
            eventually a real-world repair.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/report"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#123d34] px-6 py-3.5 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#0d3029]"
            >
              Report an issue
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/map"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-black text-slate-800 transition hover:bg-slate-50"
            >
              View city map
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
