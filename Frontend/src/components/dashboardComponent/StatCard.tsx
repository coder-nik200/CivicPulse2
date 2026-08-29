import { LucideIcon } from "lucide-react";
import { Card } from "@/components/common/ui";
import { cn } from "@/lib/utils";

type Tone = "civic" | "pending" | "progress" | "resolved" | "critical" | "warning";

const TONE_MAP: Record<Tone, { bg: string; text: string; ring: string }> = {
  civic: { bg: "bg-civic-light", text: "text-civic-dark", ring: "ring-civic/10" },
  pending: { bg: "bg-status-pending-bg", text: "text-status-pending", ring: "ring-status-pending/10" },
  progress: { bg: "bg-status-progress-bg", text: "text-status-progress", ring: "ring-status-progress/10" },
  resolved: { bg: "bg-status-resolved-bg", text: "text-status-resolved", ring: "ring-status-resolved/10" },
  critical: { bg: "bg-status-critical-bg", text: "text-status-critical", ring: "ring-status-critical/10" },
  warning: { bg: "bg-status-warning-bg", text: "text-status-warning", ring: "ring-status-warning/10" },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  hint,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone: Tone;
  hint?: string;
}) {
  const t = TONE_MAP[tone];
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-1.5 font-display text-2xl font-semibold text-ink">{value}</p>
          {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
        </div>
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-4",
            t.bg,
            t.text,
            t.ring
          )}
        >
          <Icon size={17} strokeWidth={2.25} />
        </span>
      </div>
    </Card>
  );
}
