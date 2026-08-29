"use client";

import Link from "next/link";
import React from "react";
import {
  ArrowRight,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { label, MapCanvas, SeverityBadge } from "@/components/ui";
import { demoIssues } from "@/data/demoIssues";

function HeroContent() {
     const lead = demoIssues[0];

  return (
    <>
      <div className="relative mx-auto grid max-w-[1240px] gap-12 px-5 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        {/* HERO CONTENT */}

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
            Turn everyday civic problems into evidence-backed action. Report an
            issue, understand its severity, track its progress, and verify the
            resolution.
          </p>

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

        {/* HERO MAP */}

        <div className="relative">
          <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-emerald-200/30 to-teal-100/20 blur-2xl" />

          <div className="relative overflow-hidden rounded-2xl border border-white/80 bg-white p-2 shadow-[0_25px_80px_-30px_rgba(15,23,42,0.35)] sm:rounded-3xl sm:p-3">
            <div className="relative h-[390px] overflow-hidden rounded-xl sm:h-[500px] sm:rounded-2xl">
              <MapCanvas issues={demoIssues.slice(0, 7)} selected={lead} />

              {/* MAP TOP OVERLAY */}

              <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
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

              {/* MAP BOTTOM CARD */}

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
    </>
  );
}

export default HeroContent;
