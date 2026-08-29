import { Router } from "express";
import * as issueController from "../controllers/issue.controller.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = Router();

/*
 * Create issue
 * Frontend field name must be: image
 */
router.post("/", upload.single("image"), issueController.create);

/*
 * Get all issues
 */
router.get("/", issueController.getAll);

/*
 * Get single issue
 */
router.get("/:id", issueController.getOne);

/*
 * Update issue status
 */
router.patch("/:id/status", issueController.updateStatus);

/*
 * Upvote issue
 */
router.post("/:id/upvote", issueController.upvote);

export default router;
