import "dotenv/config";
import { Router } from "express";
import { db } from "../db/db";
import { requests } from "../schema/schema";
import { authenticateUser } from "../middleware/auth";

const router = Router();

const RECOMMENDER_URL = process.env.RECOMMENDER_URL || "http://localhost:8000";

// Protected — requires user authentication
router.post("/", authenticateUser, async (req, res) => {
  const { latitude, longitude, emergencyType } = req.body;
  const userId = req.user!.userId;

  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: "Latitude and longitude are required" });
  }

  try {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    // 1. Save request to database
    const [newRequest] = await db.insert(requests).values({
      user_id: userId,
      latitude: lat,
      longitude: lng,
      emergency_type: emergencyType || "general",
      status: "pending",
    }).returning();

    if (!newRequest) {
      return res.status(500).json({ error: "Failed to create emergency request" });
    }

    const requestId = newRequest.request_id;

    // 2. Call Python FastAPI recommender via HTTP
    const recommenderRes = await fetch(`${RECOMMENDER_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request_id: requestId }),
    });

    if (!recommenderRes.ok) {
      const errorData = await recommenderRes.json().catch(() => ({}));
      console.error(`Recommender API error (${recommenderRes.status}):`, errorData);
      return res.status(500).json({
        error: "Recommender failed",
        details: errorData.detail || `Status ${recommenderRes.status}`,
      });
    }

    const results = await recommenderRes.json();

    res.json({
      success: true,
      requestId: requestId,
      hospitals: results,
      message: emergencyType
        ? `Found recommendations for ${emergencyType}`
        : "Found nearby hospitals",
    });
  } catch (error) {
    console.error("Emergency API Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
