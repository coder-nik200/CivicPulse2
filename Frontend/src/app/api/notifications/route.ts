import { NextResponse } from "next/server";
import { issueStore } from "@/lib/issue-store";

export async function GET() {
  const notifications = await issueStore.notifications();
  return NextResponse.json({
    notifications,
    unreadCount: notifications.filter((item) => !item.read).length,
  });
}
