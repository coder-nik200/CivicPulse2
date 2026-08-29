import Issue from "../models/issue.model.js";

/* =========================================================
   CONSTANTS
========================================================= */

const CATEGORIES = [
  "pothole",
  "garbage",
  "streetlight",
  "obstruction",
  "waterlogging",
];

const STATUSES = [
  "REPORTED",
  "AI_ANALYZED",
  "VERIFIED",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "RESOLUTION_VERIFIED",
  "CLOSED",
];

/* =========================================================
   VALIDATION
========================================================= */

function validateIssueInput(input) {
  if (!input) {
    throw new Error("Issue data is required");
  }

  if (!CATEGORIES.includes(input.category)) {
    throw new Error("A valid category is required");
  }

  if (!input.imageUrl || typeof input.imageUrl !== "string") {
    throw new Error("A valid image is required");
  }

  const lat = Number(input.lat);
  const lng = Number(input.lng);

  if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
    throw new Error("A valid latitude is required");
  }

  if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
    throw new Error("A valid longitude is required");
  }

  if (typeof input.address !== "string" || input.address.trim().length < 3) {
    throw new Error("A valid address is required");
  }

  if (input.description && input.description.length > 500) {
    throw new Error("Description must be 500 characters or fewer");
  }

  return {
    ...input,
    lat,
    lng,
  };
}

/* =========================================================
   SEVERITY
========================================================= */

function calculateSeverity(category, reports = 1) {
  const baseSeverity = {
    pothole: 8,
    waterlogging: 8,
    obstruction: 7,
    streetlight: 6,
    garbage: 5,
  };

  const base = baseSeverity[category] ?? 4;

  return Math.min(10, base + Math.min(2, (reports - 1) * 0.5));
}

/* =========================================================
   AI SUMMARY
========================================================= */

function generateSummary(category, description) {
  if (description?.trim()) {
    return description.trim();
  }

  return `A ${category.replaceAll(
    "_",
    " ",
  )} report requires review by the relevant civic service team.`;
}

/* =========================================================
   CREATE ISSUE
========================================================= */

export async function createIssue(input) {
  const data = validateIssueInput(input);

  /*
   * Find an existing issue very close to the
   * submitted coordinates.
   *
   * 0.001 latitude/longitude is approximately
   * around 100 meters depending on latitude.
   */

  const duplicate = await Issue.findOne({
    category: data.category,

    lat: {
      $gte: data.lat - 0.001,
      $lte: data.lat + 0.001,
    },

    lng: {
      $gte: data.lng - 0.001,
      $lte: data.lng + 0.001,
    },

    status: {
      $ne: "CLOSED",
    },
  });

  /* =====================================================
     DUPLICATE ISSUE
  ===================================================== */

  if (duplicate) {
    duplicate.reportCount = (duplicate.reportCount || 1) + 1;

    duplicate.uniqueReporterCount = (duplicate.uniqueReporterCount || 1) + 1;

    duplicate.severity = calculateSeverity(
      duplicate.category,
      duplicate.reportCount,
    );

    duplicate.priority = Math.round(duplicate.severity * 10);

    duplicate.updatedAt = new Date();

    await duplicate.save();

    return {
      issue: duplicate,
      isDuplicate: true,
    };
  }

  /* =====================================================
     NEW ISSUE
  ===================================================== */

  const severity = calculateSeverity(data.category);

  const issue = await Issue.create({
    id: `CIV-${Date.now()}`,

    category: data.category,

    description: data.description?.trim() || undefined,

    imageUrl: data.imageUrl,

    imagePublicId: data.imagePublicId || undefined,

    thumbnailUrl: data.thumbnailUrl || undefined,

    location: {
      type: "Point",

      /*
       * GeoJSON requires:
       * [longitude, latitude]
       */

      coordinates: [data.lng, data.lat],
    },

    lat: data.lat,

    lng: data.lng,

    address: data.address.trim(),

    severity,

    confidence: data.confidence !== undefined ? Number(data.confidence) : 82,

    priority:
      data.priority !== undefined
        ? Number(data.priority)
        : Math.round(severity * 10),

    status: "AI_ANALYZED",

    reportedBy: data.reportedBy || undefined,

    reporterEmail: data.reporterEmail || undefined,

    reportCount: 1,

    uniqueReporterCount: 1,

    upvotes: 0,

    aiAnalysis: {
      category: data.category,

      confidence: data.confidence !== undefined ? Number(data.confidence) : 82,

      summary: generateSummary(data.category, data.description),

      severity,

      suggestedPriority: Math.round(severity * 10),

      analyzedAt: new Date(),
    },
  });

  return {
    issue,
    isDuplicate: false,
  };
}

/* =========================================================
   GET ALL ISSUES
========================================================= */

export async function getIssues(filters = {}) {
  const query = {};

  if (filters.category) {
    if (!CATEGORIES.includes(filters.category)) {
      throw new Error("Invalid category");
    }

    query.category = filters.category;
  }

  if (filters.status) {
    if (!STATUSES.includes(filters.status)) {
      throw new Error("Invalid status");
    }

    query.status = filters.status;
  }

  return Issue.find(query)
    .populate("reportedBy", "name email phone avatar")
    .populate("verifiedBy", "name email")
    .populate("assignedTo", "name email")
    .sort({
      createdAt: -1,
    });
}

/* =========================================================
   GET SINGLE ISSUE
========================================================= */

export async function getIssueById(id) {
  return Issue.findOne({
    id,
  })
    .populate("reportedBy", "name email phone avatar")
    .populate("verifiedBy", "name email")
    .populate("assignedTo", "name email");
}

/* =========================================================
   GET MY ISSUES
========================================================= */

export async function getMyIssues(userId) {
  if (!userId) {
    throw new Error("Authentication required");
  }

  return Issue.find({
    reportedBy: userId,
  }).sort({
    createdAt: -1,
  });
}

/* =========================================================
   UPDATE ISSUE STATUS
========================================================= */

export async function updateIssueStatus(id, status) {
  const normalizedStatus = String(status).toUpperCase();

  if (!STATUSES.includes(normalizedStatus)) {
    throw new Error("Invalid status");
  }

  const update = {
    status: normalizedStatus,
    updatedAt: new Date(),
  };

  if (normalizedStatus === "RESOLVED") {
    update.resolvedAt = new Date();
  }

  return Issue.findOneAndUpdate(
    {
      id,
    },
    {
      $set: update,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .populate("reportedBy", "name email phone avatar")
    .populate("verifiedBy", "name email")
    .populate("assignedTo", "name email");
}

/* =========================================================
   UPVOTE ISSUE
========================================================= */

export async function upvoteIssue(id) {
  const issue = await Issue.findOne({
    id,
  });

  if (!issue) {
    return null;
  }

  issue.upvotes = (issue.upvotes || 0) + 1;

  issue.reportCount = (issue.reportCount || 1) + 1;

  issue.priority = Math.round(
    calculateSeverity(issue.category, issue.reportCount) * 10,
  );

  issue.updatedAt = new Date();

  await issue.save();

  return issue;
}
