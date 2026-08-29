import { NextResponse } from "next/server";
import { issueStore } from "@/lib/issue-store";

export async function PATCH(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const notification = await issueStore.markNotificationRead((await params).id);
  return notification
    ? NextResponse.json({ notification })
    : NextResponse.json({ error: "Notification not found" }, { status: 404 });
}
