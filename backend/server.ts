import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import emergencyRouter from "./routes/emergency";
import hospitalsRouter from "./routes/hospitals";
import userSignup from "./routes/user/userSignup";
import userLogin from "./routes/user/userLogin";
import hospitalSignup from "./routes/hospital/hospitalSignup";
import hospitalLogin from "./routes/hospital/hospitalLogin";
import getUserData from "./routes/user/data";

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

  app.post("/user/signup", userSignup);
  app.post("/user/login", userLogin);
  app.post("/hospital/signup", hospitalSignup);
  app.post("/hospital/login", hospitalLogin);
  app.get("/user/data", getUserData);

  // routes
  app.use("/api/emergency", emergencyRouter);
  app.use("/api/hospitals", hospitalsRouter);

  return app;
};
