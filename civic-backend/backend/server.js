import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDB } from "./src/config/db.js";

import issueRoutes from "./src/routes/issue.routes.js";
import authRoutes from "./src/routes/auth.routes.js";

dotenv.config();

const app = express();

/* =========================================================
   CORS
========================================================= */

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

/* =========================================================
   BODY PARSERS
========================================================= */

app.use(
  express.json({
    limit: "15mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "15mb",
  }),
);

/* =========================================================
   COOKIES
========================================================= */

app.use(cookieParser());

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    message: "🚀 CivicPlus backend is running",
  });
});

/* =========================================================
   ROUTES
========================================================= */

app.use("/api/auth", authRoutes);

app.use("/api/issues", issueRoutes);

/* =========================================================
   404 HANDLER
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use((error, req, res, next) => {
  console.error("GLOBAL ERROR:", error);

  res.status(error.status || 500).json({
    success: false,

    message: error.message || "Internal server error",
  });
});

/* =========================================================
   SERVER
========================================================= */

const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 CivicPlus backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("✗ Failed to start server:", error);

    process.exit(1);
  }
}

startServer();
