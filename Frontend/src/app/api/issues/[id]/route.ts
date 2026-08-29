import { NextRequest, NextResponse } from "next/server";
import { issueStore } from "@/lib/issue-store";
import { updateStatusSchema } from "@/lib/validators";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const issue = await issueStore.find((await params).id);
  return issue
    ? NextResponse.json({ issue })
    : NextResponse.json({ error: "Issue not found" }, { status: 404 });
}
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const parsed = updateStatusSchema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  const issue = await issueStore.updateStatus((await params).id, parsed.data.status);
  return issue
    ? NextResponse.json({ issue })
    : NextResponse.json(
        {
          error:
            "Status change is not allowed from the current lifecycle stage.",
        },
        { status: 409 },
      );
}
