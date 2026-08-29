import Link from "next/link";
import Image from "next/image";
import { ChevronRight, MapPin } from "lucide-react";
import { Issue } from "@/types";
import { Card, CardHeader } from "@/components/common/ui";
import { Badge } from "@/components/common/ui/Badge";
import { statusMeta, timeAgo } from "@/lib/utils";

export function RecentReports({ issues }: { issues: Issue[] }) {
  return (
    <Card>
      <CardHeader
        title="Recent Reports"
        subtitle="Latest citizen submissions"
        action={
          <Link
            href="/issues"
            className="flex items-center gap-0.5 text-sm font-medium text-civic hover:text-civic-dark"
          >
            View all
            <ChevronRight size={15} />
          </Link>
        }
      />
      <ul className="divide-y divide-slate-100 border-t border-slate-100">
        {issues.map((issue) => {
          const meta = statusMeta[issue.status];
          return (
            <li key={issue.id}>
              <Link
                href={`/issues/${issue.id}`}
                className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-slate-50"
              >
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <Image src={issue.photoUrl} alt="" fill sizes="44px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{issue.title}</p>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500">
                    <MapPin size={11} className="shrink-0" />
                    {issue.location.address}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <Badge {...meta} />
                  <span className="font-mono text-[11px] text-slate-400">{timeAgo(issue.reportedAt)}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
