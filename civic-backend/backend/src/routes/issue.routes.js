import { Router } from "express";
import * as issueController from "../controllers/issue.controller.js";

const router = Router();

router.post("/", issueController.create);
router.get("/", issueController.getAll);
router.get("/:id", issueController.getOne);
router.patch("/:id/status", issueController.updateStatus);
router.post("/:id/upvote", issueController.upvote);

export default router;
