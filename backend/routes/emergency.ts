import { Router } from "express";
import { findHospitalsInRadius } from "../services/hospitalService";

const router = Router();

router.post("/", async (req, res) => {
  const { latitude, longitude, emergencyType } = req.body;

  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: "Latitude and longitude are required" });
  }

  try {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    const nearbyHospitals = await findHospitalsInRadius({ latitude: lat, longitude: lng });
    
    res.json({
      success: true,
      hospitals: nearbyHospitals,
      message: emergencyType ? `Found hospitals for ${emergencyType}` : "Found nearby hospitals"
    });
  } catch (error) {
    console.error("Emergency API Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
