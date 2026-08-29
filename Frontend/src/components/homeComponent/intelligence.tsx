import { demoIssues } from "@/data/demoIssues";
import React from "react";
import { IssueCard } from "../ui";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import MapCanvas from "../common/MapCanvas";

function Intelligence() {
  return;
  <>
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
            {/* <MapCanvas issues={demoIssues} selected={demoIssues[1]} /> */}
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
  </>;
}

export default Intelligence;
