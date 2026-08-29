// Demo repository used by the standalone backend. It deliberately has no
// external service dependency, so the project works immediately after npm install.
const issues = [];
let nextId = 1040;

const categories = new Set([
  "pothole",
  "garbage",
  "streetlight",
  "obstruction",
  "waterlogging",
]);
const statuses = new Set([
  "REPORTED",
  "AI_ANALYZED",
  "VERIFIED",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "RESOLUTION_VERIFIED",
  "CLOSED",
]);

function assertIssueInput(input) {
  if (!input || !categories.has(input.category))
    throw new Error("A valid category is required");
  if (
    typeof input.imageUrl !== "string" ||
    input.imageUrl.length < 20 ||
    input.imageUrl.length > 8_000_000
  )
    throw new Error("A valid image is required");
  if (
    !Number.isFinite(input.lat) ||
    input.lat < -90 ||
    input.lat > 90 ||
    !Number.isFinite(input.lng) ||
    input.lng < -180 ||
    input.lng > 180
  )
    throw new Error("A valid location is required");
  if (
    typeof input.address !== "string" ||
    input.address.trim().length < 3 ||
    input.address.length > 180
  )
    throw new Error("A valid address is required");
  if (
    input.description &&
    (typeof input.description !== "string" || input.description.length > 500)
  )
    throw new Error("Description must be 500 characters or fewer");
}

function score(category, reports = 1) {
  const base =
    { pothole: 8, waterlogging: 8, obstruction: 7, streetlight: 6, garbage: 5 }[
      category
    ] ?? 4;
  return Math.min(10, base + Math.min(2, (reports - 1) * 0.5));
}

function summary(category, description) {
  return (
    description?.trim() ||
    `A ${category.replaceAll("_", " ")} report needs review by the relevant civic service team.`
  );
}

export async function createIssue(input) {
  assertIssueInput(input);
  const now = new Date().toISOString();
  const duplicate = issues.find(
    (issue) =>
      issue.category === input.category &&
      Math.abs(issue.lat - input.lat) < 0.001 &&
      Math.abs(issue.lng - input.lng) < 0.001 &&
      issue.status !== "CLOSED",
  );
  if (duplicate) {
    duplicate.reportCount += 1;
    duplicate.uniqueReporterCount += 1;
    duplicate.severity = score(duplicate.category, duplicate.reportCount);
    duplicate.priority = Math.round(duplicate.severity * 10);
    duplicate.updatedAt = now;
    return { issue: duplicate, isDuplicate: true };
  }

  const severity = score(input.category);
  const issue = {
    id: `CIV-${nextId++}`,
    category: input.category,
    imageUrl: input.imageUrl,
    lat: input.lat,
    lng: input.lng,
    address: input.address.trim(),
    description: input.description?.trim() || undefined,
    severity,
    confidence: 82,
    priority: Math.round(severity * 10),
    reportCount: 1,
    uniqueReporterCount: 1,
    status: "AI_ANALYZED",
    createdAt: now,
    updatedAt: now,
    aiSummary: summary(input.category, input.description),
  };
  issues.unshift(issue);
  return { issue, isDuplicate: false };
}

export async function getIssues(filters = {}) {
  return issues.filter(
    (issue) =>
      (!filters.category || issue.category === filters.category) &&
      (!filters.status || issue.status === filters.status),
  );
}

export async function getIssueById(id) {
  return issues.find((issue) => issue.id === id) || null;
}

export async function updateIssueStatus(id, status) {
  if (!statuses.has(status)) throw new Error("Invalid status");
  const issue = await getIssueById(id);
  if (!issue) return null;
  issue.status = status;
  issue.updatedAt = new Date().toISOString();
  return issue;
}

export async function upvoteIssue(id) {
  const issue = await getIssueById(id);
  if (!issue) return null;
  issue.reportCount += 1;
  issue.priority = Math.round(score(issue.category, issue.reportCount) * 10);
  issue.updatedAt = new Date().toISOString();
  return issue;
}
