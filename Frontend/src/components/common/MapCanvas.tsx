import { CivicIssue } from "@/types/issue";
import Link from "next/link";
import { categoryIcon, label, StatusBadge } from "../ui";
import { ArrowRight } from "lucide-react";

export default function MapCanvas({
  issues,
  selected,
}: {
  issues: CivicIssue[];
  selected?: CivicIssue;
}) {
  return (
    <div
      className="relative h-full min-h-[420px] w-full overflow-hidden rounded-xl border border-slate-200 bg-[#e8f0ed]"
      aria-label="Interactive city issue map"
    >
      {/* Map background */}

      <div className="absolute inset-0 opacity-70">
        <div className="absolute left-[15%] top-0 h-full w-[7px] rotate-[18deg] bg-white shadow-sm" />
        <div className="absolute left-[45%] top-[-10%] h-[120%] w-[9px] rotate-[-22deg] bg-white shadow-sm" />
        <div className="absolute right-[22%] top-[-10%] h-[120%] w-[8px] rotate-[35deg] bg-white shadow-sm" />

        <div className="absolute left-0 top-[35%] h-[8px] w-full rotate-[4deg] bg-white shadow-sm" />
        <div className="absolute left-[-10%] top-[67%] h-[7px] w-[120%] rotate-[-8deg] bg-white shadow-sm" />

        <div className="absolute left-[25%] top-[20%] h-20 w-20 rounded-full bg-emerald-200/50" />
        <div className="absolute right-[15%] top-[45%] h-28 w-28 rounded-full bg-emerald-200/40" />
        <div className="absolute bottom-[12%] left-[45%] h-24 w-24 rounded-full bg-teal-200/40" />
      </div>

      {/* Map markers */}

      {issues.map((issue, index) => {
        const markerColor =
          issue.severity >= 8
            ? "bg-red-500"
            : issue.severity >= 6
              ? "bg-amber-500"
              : "bg-blue-500";

        return (
          <Link
            key={issue.id}
            href={`/issues/${issue.id}`}
            aria-label={`View ${issue.id}`}
            className={`absolute z-20 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-white text-white shadow-lg transition duration-200 hover:z-30 hover:scale-125 ${markerColor}`}
            style={{
              left: `${14 + ((index * 19) % 72)}%`,
              top: `${16 + ((index * 29) % 66)}%`,
            }}
          >
            {categoryIcon(issue.category, 15)}
          </Link>
        );
      })}

      {/* Selected issue */}

      {selected && (
        <div className="absolute bottom-5 left-5 z-30 w-[calc(100%-40px)] max-w-[290px] rounded-xl border border-white/70 bg-white/95 p-4 shadow-xl backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-extrabold">
                {label(selected.category)}
              </p>

              <p className="mt-1 font-mono text-[10px] text-slate-500">
                {selected.id}
              </p>
            </div>

            <StatusBadge status={selected.status} />
          </div>

          <p className="mt-3 text-xs text-slate-600">{selected.address}</p>

          <div className="mt-3 flex justify-between text-xs font-bold text-slate-700">
            <span>Severity {selected.severity}</span>

            <span>{selected.reportCount} reports</span>
          </div>

          <Link
            href={`/issues/${selected.id}`}
            className="mt-4 flex items-center gap-1 text-xs font-extrabold text-emerald-700"
          >
            View details
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Map controls */}

      <div className="absolute right-4 top-4 z-20 flex flex-col gap-2">
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-lg border border-white bg-white/95 text-lg font-bold text-slate-700 shadow-md"
          aria-label="Zoom in"
        >
          +
        </button>

        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-lg border border-white bg-white/95 text-lg font-bold text-slate-700 shadow-md"
          aria-label="Zoom out"
        >
          −
        </button>
      </div>
    </div>
  );
}
