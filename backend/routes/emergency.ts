import "dotenv/config";
import { Router, Request, Response } from "express";
import { db } from "../db/db";
import { requests } from "../schema/schema";
import { authenticateUser } from "../middleware/auth";
import { eq, and } from "drizzle-orm";

const router = Router();

const RECOMMENDER_URL = process.env.RECOMMENDER_URL || "http://localhost:8000";

// ── GET Recommendations (Initial SOS) ──
router.post("/", authenticateUser, async (req, res) => {
  const { latitude, longitude, emergencyType, severity_level } = req.body;
  const userId = req.user!.userId;

  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: "Latitude and longitude are required" });
  }

  try {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    // 1. Save request to database (initial status 'pending')
    const [newRequest] = await db.insert(requests).values({
      user_id: userId,
      latitude: lat,
      longitude: lng,
      emergency_type: emergencyType || "general",
      severity_level: severity_level || 3,
      status: "pending",
    }).returning();

    if (!newRequest) {
      return res.status(500).json({ error: "Failed to create emergency request" });
    }

    const requestId = newRequest.request_id;

    // 2. Call Python FastAPI recommender
    const recommenderRes = await fetch(`${RECOMMENDER_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request_id: requestId }),
    });

    if (!recommenderRes.ok) {
      const errorData = await recommenderRes.json().catch(() => ({}));
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
      message: "Found nearby hospitals",
    });
  } catch (error) {
    console.error("Emergency API Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Confirm Dispatch to a Specific Hospital ──
router.post("/confirm", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { requestId, hospitalId } = req.body;
    const userId = req.user!.userId;

    if (!requestId || !hospitalId) {
      return res.status(400).json({ message: "requestId and hospitalId are required" });
    }

    const result = await db
      .update(requests)
      .set({
        assigned_hospital_id: hospitalId,
        status: "dispatched",
      })
      .where(
        and(
          eq(requests.request_id, requestId),
          eq(requests.user_id, userId)
        )
      );

    return res.json({ success: true, message: "Dispatch confirmed. Waiting for hospital response." });
  } catch (err) {
    console.error("Confirm dispatch error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// ── Poll Request Status ──
router.get("/status/:requestId", authenticateUser, async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const userId = req.user!.userId;

    const result = await db
      .select()
      .from(requests)
      .where(
        and(
          eq(requests.request_id, parseInt(requestId as string)),
          eq(requests.user_id, userId)
        )
      )
      .limit(1);

    if (!result.length) {
      return res.status(404).json({ message: "Request not found" });
    }

    return res.json({
      status: result[0].status,
      assigned_hospital_id: result[0].assigned_hospital_id,
    });
  } catch (err) {
    console.error("Get status error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
