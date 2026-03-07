import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

import { authenticateUser, authenticateHospital } from "./middleware/auth";

import emergencyRouter from "./routes/emergency";
import hospitalsRouter from "./routes/hospitals";
import userSignup from "./routes/user/userSignup";
import userLogin from "./routes/user/userLogin";
import hospitalSignup from "./routes/hospital/hospitalSignup";
import hospitalLogin from "./routes/hospital/hospitalLogin";
import getUserData from "./routes/user/data";
import getUserProfile from "./routes/user/userProfile";
import getHospitalProfile from "./routes/hospital/hospitalProfile";

export const createServer = () => {
  const app = express();

  app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
  }));
  app.use(express.json());
  app.use(cookieParser());

  // health check
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // ── Public auth routes ──
  app.post("/user/signup", userSignup);
  app.post("/user/login", userLogin);
  app.post("/hospital/signup", hospitalSignup);
  app.post("/hospital/login", hospitalLogin);

  // ── Protected user routes ──
  app.get("/user/data", authenticateUser, getUserData);
  app.get("/user/profile", authenticateUser, getUserProfile);

  // ── Protected hospital routes ──
  app.get("/hospital/profile", authenticateHospital, getHospitalProfile);

  // ── API routes ──
  app.use("/api/emergency", emergencyRouter);
  app.use("/api/hospitals", hospitalsRouter);

  return app;
};
