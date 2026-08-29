import { NextRequest, NextResponse } from "next/server";
import { issueStore } from "@/lib/issue-store";

export async function GET(request: NextRequest) {
  const lat = Number(request.nextUrl.searchParams.get("lat"));
  const lng = Number(request.nextUrl.searchParams.get("lng"));
  const radius = Math.min(
    Math.max(Number(request.nextUrl.searchParams.get("radius")) || 5, 0.1),
    25,
  );
  if (!Number.isFinite(lat) || !Number.isFinite(lng))
    return NextResponse.json(
      { error: "Valid latitude and longitude are required." },
      { status: 400 },
    );
  const allIssues = await issueStore.all();
  const issues = allIssues.filter((issue) => {
    const distanceKm = Math.hypot(
      (issue.lat - lat) * 111,
      (issue.lng - lng) * 102,
    );
    return distanceKm <= radius;
  });
  return NextResponse.json({ issues, center: { lat, lng }, radius });
}
