import * as issueService from "../services/issue.service.js";
import { uploadIssueImage } from "../services/image.service.js";

/* =========================================================
   CREATE ISSUE
   POST /api/issues
========================================================= */

export async function create(req, res) {
  try {
    console.log("========== CREATE ISSUE ==========");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("USER:", req.user?._id);

    /*
     * Accept both names temporarily so the frontend
     * does not break if it still sends issueType.
     */
    const category = (req.body?.category || req.body?.issueType || "")
      .trim()
      .toLowerCase();

    const description = req.body?.description || "";

    /*
     * Accept both coordinate formats.
     */
    const latValue = req.body?.lat ?? req.body?.latitude;

    const lngValue = req.body?.lng ?? req.body?.longitude;

    const address = req.body?.address || "Unknown location";

    /* =====================================================
       CATEGORY VALIDATION
    ===================================================== */

    const allowedCategories = [
      "pothole",
      "garbage",
      "streetlight",
      "obstruction",
      "waterlogging",
    ];

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "A valid category is required",
        receivedBody: req.body,
      });
    }

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
        receivedCategory: category,
        allowedCategories,
      });
    }

    /* =====================================================
       IMAGE VALIDATION
    ===================================================== */

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Issue image is required",
      });
    }

    /* =====================================================
       LOCATION
    ===================================================== */

    const lat = Number(latValue);
    const lng = Number(lngValue);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({
        success: false,
        message: "A valid location is required",
        received: {
          lat: latValue,
          lng: lngValue,
        },
      });
    }

    if (lat < -90 || lat > 90) {
      return res.status(400).json({
        success: false,
        message: "Latitude must be between -90 and 90",
      });
    }

    if (lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        message: "Longitude must be between -180 and 180",
      });
    }

    /* =====================================================
       AUTHENTICATION
    ===================================================== */

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    /* =====================================================
       IMAGE UPLOAD
    ===================================================== */

    const uploadedImage = await uploadIssueImage(req.file);

    if (!uploadedImage?.url) {
      return res.status(500).json({
        success: false,
        message: "Image upload failed",
      });
    }

    console.log("Uploaded image:", uploadedImage);

    /* =====================================================
       CREATE SERVICE DATA
    ===================================================== */

    const issueData = {
      category,

      description: typeof description === "string" ? description.trim() : "",

      lat,

      lng,

      address:
        typeof address === "string" ? address.trim() : "Unknown location",

      imageUrl: uploadedImage.url,

      imagePublicId: uploadedImage.publicId,

      thumbnailUrl: uploadedImage.thumbnailUrl,

      reportedBy: req.user._id,

      reporterEmail: req.user.email,
    };

    console.log("DATA SENT TO ISSUE SERVICE:", issueData);

    /* =====================================================
       CREATE ISSUE
    ===================================================== */

    const result = await issueService.createIssue(issueData);

    /* =====================================================
       RESPONSE
    ===================================================== */

    return res.status(result?.isDuplicate ? 200 : 201).json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error("========== CREATE ISSUE ERROR ==========");

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err?.message || "Failed to create issue",
    });
  }
}

/* =========================================================
   GET ALL
========================================================= */

export async function getAll(req, res) {
  try {
    const issues = await issueService.getIssues(req.query);

    return res.status(200).json({
      success: true,
      count: issues.length,
      issues,
    });
  } catch (err) {
    console.error("Get all issues error:", err);

    return res.status(500).json({
      success: false,
      message: err?.message || "Failed to fetch issues",
    });
  }
}

/* =========================================================
   GET ONE
========================================================= */

export async function getOne(req, res) {
  try {
    const { id } = req.params;

    const issue = await issueService.getIssueById(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    return res.status(200).json({
      success: true,
      issue,
    });
  } catch (err) {
    console.error("Get issue error:", err);

    return res.status(500).json({
      success: false,
      message: err?.message || "Failed to fetch issue",
    });
  }
}

/* =========================================================
   UPDATE STATUS
========================================================= */

export async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const updated = await issueService.updateIssueStatus(id, status);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Issue status updated successfully",
      issue: updated,
    });
  } catch (err) {
    console.error("Update status error:", err);

    return res.status(500).json({
      success: false,
      message: err?.message || "Failed to update issue status",
    });
  }
}

/* =========================================================
   UPVOTE
========================================================= */

export async function upvote(req, res) {
  try {
    const { id } = req.params;

    const result = await issueService.upvoteIssue(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Issue upvoted successfully",
      issue: result,
    });
  } catch (err) {
    console.error("Upvote issue error:", err);

    return res.status(500).json({
      success: false,
      message: err?.message || "Failed to upvote issue",
    });
  }
}
