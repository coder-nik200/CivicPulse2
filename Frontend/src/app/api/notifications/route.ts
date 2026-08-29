import { NextResponse } from "next/server";
import { issueStore } from "@/lib/issue-store";

export function GET() {
  const notifications = issueStore.notifications();
  return NextResponse.json({
    notifications,
    unreadCount: notifications.filter((item) => !item.read).length,
  });
}
