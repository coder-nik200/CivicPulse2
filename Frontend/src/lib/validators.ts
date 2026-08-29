import { z } from "zod";

export const issueCategories = [
  "pothole",
  "garbage",
  "streetlight",
  "obstruction",
  "waterlogging",
] as const;
export const issueStatuses = [
  "REPORTED",
  "AI_ANALYZED",
  "VERIFIED",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "RESOLUTION_VERIFIED",
  "CLOSED",
] as const;

export const createIssueSchema = z.object({
  category: z.enum(issueCategories),
  // The demo accepts a browser data URL. Production should store uploads in object storage
  // and submit its signed URL instead.
  imageUrl: z.string().min(20).max(8_000_000),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  address: z.string().trim().min(3).max(180),
  description: z.string().trim().max(1000).optional(),
});
export const updateStatusSchema = z.object({ status: z.enum(issueStatuses) });
