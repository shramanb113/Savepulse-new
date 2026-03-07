import { Router } from "express";
import { db } from "../db/db";
import { requests } from "../schema/schema";
import path from "path";

const router = Router();

router.post("/", async (req, res) => {
  const { latitude, longitude, emergencyType, userId } = req.body;

  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: "Latitude and longitude are required" });
  }

  try {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    // 1. Save request to database
    const [newRequest] = await db.insert(requests).values({
      user_id: userId || "anonymous",
      latitude: lat,
      longitude: lng,
      emergency_type: emergencyType || "general",
      status: "pending",
    }).returning();

    if (!newRequest) {
      return res.status(500).json({ error: "Failed to create emergency request" });
    }

    const requestId = newRequest.request_id;

    // 2. Call Python recommender using Bun.spawn
    const proc = Bun.spawn(["python", "-m", "recommender.recommend", String(requestId)], {
      cwd: path.resolve(process.cwd(), ".."),
    });

    const stdout = await new Response(proc.stdout).text();
    const stderr = await new Response(proc.stderr).text();
    const exitCode = await proc.exited;

    if (exitCode !== 0) {
      console.error(`Recommender error (Exit ${exitCode}): ${stderr}`);
      return res.status(500).json({ error: "Recommender failed", details: stderr });
    }

    try {
      const results = JSON.parse(stdout);
      res.json({
        success: true,
        requestId: requestId,
        hospitals: results,
        message: emergencyType ? `Found recommendations for ${emergencyType}` : "Found nearby hospitals"
      });
    } catch (parseError) {
      console.error(`JSON Parse error: ${parseError}`);
      res.status(500).json({ error: "Failed to parse recommender output", stdout });
    }

  } catch (error) {
    console.error("Emergency API Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
