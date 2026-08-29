export type AreaSeverity = "low" | "moderate" | "high" | "critical";

export function calculateAreaSeverity(issueCount: number): AreaSeverity {
  if (issueCount >= 31) return "critical";
  if (issueCount >= 16) return "high";
  if (issueCount >= 6) return "moderate";
  return "low";
}

export const areaSeverityStyle: Record<AreaSeverity, { color: string; radius: number }> = {
  low: { color: "#287adf", radius: 150 }, moderate: { color: "#d99a00", radius: 250 }, high: { color: "#e87513", radius: 400 }, critical: { color: "#e5484d", radius: 600 },
};
