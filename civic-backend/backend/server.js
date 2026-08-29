import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDB } from "./src/config/db.js";
import issueRoutes from "./src/routes/issue.routes.js";
import authRoutes from "./src/routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json({ limit: "15mb" }));

app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);

app.get("/health", (_, res) => {
  res.json({
    status: "ok",
    message: "CivicFix backend is running",
  });
});

const PORT = process.env.PORT || 5001;

// Start server with database connection
async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`✓ CivicFix backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("✗ Failed to start server:", error.message);

    process.exit(1);
  }
}

startServer();
