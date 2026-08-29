import { NextRequest, NextResponse } from "next/server";
import { issueStore } from "@/lib/issue-store";
import { createIssueSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");
  const status = request.nextUrl.searchParams.get("status");
  const minLat = Number(request.nextUrl.searchParams.get("minLat"));
  const maxLat = Number(request.nextUrl.searchParams.get("maxLat"));
  const minLng = Number(request.nextUrl.searchParams.get("minLng"));
  const maxLng = Number(request.nextUrl.searchParams.get("maxLng"));
  const hasBounds = [minLat, maxLat, minLng, maxLng].every(Number.isFinite);
  const issues = issueStore
    .all()
    .filter(
      (issue) =>
        (!category || issue.category === category) &&
        (!status || issue.status === status) &&
        (!hasBounds ||
          (issue.lat >= minLat &&
            issue.lat <= maxLat &&
            issue.lng >= minLng &&
            issue.lng <= maxLng)),
    );
  return NextResponse.json({ issues });
}

export async function POST(request: NextRequest) {
  const parsed = createIssueSchema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json(
      {
        error: "Please provide a photo, category and valid location.",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  const input = parsed.data;
  const now = new Date().toISOString();
  const sequence = 1040 + issueStore.all().length;
  const issue = issueStore.create({
    id: `CIV-${sequence}`,
    ...input,
    severity: 0,
    confidence: 0,
    priority: 0,
    reportCount: 1,
    uniqueReporterCount: 1,
    status: "REPORTED",
    createdAt: now,
    updatedAt: now,
    aiSummary: "Analysis has not been completed yet.",
  });
  return NextResponse.json({ issue }, { status: 201 });
}
