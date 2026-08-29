import {
  ListChecks,
  Clock,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  CalendarClock,
} from "lucide-react";
import { StatCard } from "@/components/dashboardComponent/StatCard";
import { ResolutionRateChart } from "@/components/dashboardComponent/ResolutionRateChart";
import { CategoryChart } from "@/components/dashboardComponent/CategoryChart";
import { RecentReports } from "@/components/dashboardComponent/RecentReports";
import LiveMapPreview from "@/components/dashboardComponent/LiveMapPreviewLoader";
import { mockIssues, getStats, getCategoryBreakdown } from "@/lib/mock-data";
import { Navbar } from "@/components";

export default function DashboardPage() {
  const stats = getStats();
  const categoryData = getCategoryBreakdown();
  const recent = [...mockIssues]
    .sort(
      (a, b) =>
        new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime(),
    )
    .slice(0, 5);

  return (
    <>
      <main className="min-h-screen overflow-hidden bg-[#f7f9f8] text-[#10201c]">
        <Navbar />
        <div className="space-y-6 m-5">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Overview of civic infrastructure reports across the city.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <StatCard
              label="Total Issues"
              value={stats.total}
              icon={ListChecks}
              tone="civic"
            />
            <StatCard
              label="Pending"
              value={stats.pending}
              icon={Clock}
              tone="pending"
            />
            <StatCard
              label="In Progress"
              value={stats.inProgress}
              icon={Loader2}
              tone="progress"
            />
            <StatCard
              label="Resolved"
              value={stats.resolved}
              icon={CheckCircle2}
              tone="resolved"
            />
            <StatCard
              label="Critical"
              value={stats.critical}
              icon={AlertTriangle}
              tone="critical"
            />
            <StatCard
              label="Reported Today"
              value={stats.reportedToday}
              icon={CalendarClock}
              tone="warning"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <ResolutionRateChart
                resolved={stats.resolved}
                inProgress={stats.inProgress}
                pending={stats.pending}
              />
            </div>
            <div className="lg:col-span-3">
              <CategoryChart data={categoryData} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <RecentReports issues={recent} />
            </div>
            <div className="lg:col-span-3">
              <LiveMapPreview issues={mockIssues} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
