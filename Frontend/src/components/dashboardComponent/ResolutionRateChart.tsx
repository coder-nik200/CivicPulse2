"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardHeader } from "@/components/common/ui";

export function ResolutionRateChart({
  resolved,
  inProgress,
  pending,
}: {
  resolved: number;
  inProgress: number;
  pending: number;
}) {
  const total = resolved + inProgress + pending;
  const rate = total === 0 ? 0 : Math.round((resolved / total) * 100);

  const data = [
    { name: "Resolved", value: resolved, color: "#0f766e" },
    { name: "In Progress", value: inProgress, color: "#2563eb" },
    { name: "Pending", value: pending, color: "#64748b" },
  ];

  return (
    <Card>
      <CardHeader title="Resolution Rate" subtitle="Share of issues resolved to date" />
      <div className="relative flex items-center justify-center px-4 pb-4">
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={3}
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="pointer-events-none absolute flex flex-col items-center">
          <span className="font-display text-3xl font-semibold text-ink">{rate}%</span>
          <span className="text-xs text-slate-500">resolved</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 border-t border-slate-100 px-5 py-3">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
            {d.name} ({d.value})
          </div>
        ))}
      </div>
    </Card>
  );
}
