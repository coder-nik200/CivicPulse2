import React from "react";
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

function CityStatus() {
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

  return (
    <>
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
    </>
  );
}

export default CityStatus;
