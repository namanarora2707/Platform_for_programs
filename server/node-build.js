import path from "node:path";
import express from "express";
import { createServer } from "./index.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = createServer();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../client/dist");

// Serve static frontend assets
app.use(express.static(distPath));

// ✅ FIX: use a regex route instead of "/*"
app.get(/^\/(?!api|health).*$/, (req, res) => {
  // Send React app for all non-API, non-health routes
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
