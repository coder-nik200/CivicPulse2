import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import issueRoutes from "./src/routes/issue.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "15mb" }));

app.use("/api/issues", issueRoutes);

app.get("/health", (_, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5001;

// Start server with database connection
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✓ CivicPulse backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("✗ Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();

