import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

export const createServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // health check
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });
  console.log(process.env.DATABASE_URL);

  return app;
};
