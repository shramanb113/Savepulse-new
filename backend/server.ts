import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import emergencyRouter from "./routes/emergency";
import hospitalsRouter from "./routes/hospitals";

export const createServer = () => {
  const app = express();

  app.use(cors({
    origin: "http://localhost:3000",
  }));
  app.use(express.json());

  // health check
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // routes
  app.use("/api/emergency", emergencyRouter);
  app.use("/api/hospitals", hospitalsRouter);

  return app;
};
