import { NextResponse } from "next/server";
import { issueStore } from "@/lib/issue-store";

export async function GET() {
  const [metrics, allIssues, notifications] = await Promise.all([
    issueStore.dashboard(),
    issueStore.all(),
    issueStore.notifications(),
  ]);

  return NextResponse.json({
    metrics,
    issues: allIssues.slice(0, 50),
    notifications: notifications.slice(0, 8),
  });
}
