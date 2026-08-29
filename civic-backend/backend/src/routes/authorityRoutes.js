import express from "express";

import {
  createAuthority,
  getAuthorities,
} from "../controllers/authorityController.js";

const router = express.Router();

router.post("/", createAuthority);

router.get("/", getAuthorities);

export default router;
