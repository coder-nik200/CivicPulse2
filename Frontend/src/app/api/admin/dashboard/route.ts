import { NextResponse } from "next/server";
import { issueStore } from "@/lib/issue-store";

export function GET() { return NextResponse.json({ metrics: issueStore.dashboard(), issues: issueStore.all().slice(0, 50), notifications: issueStore.notifications().slice(0, 8) }); }
