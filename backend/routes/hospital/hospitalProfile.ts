import { Request, Response } from "express";
import { db } from "../../db/db";
import { hospitals } from "../../schema/schema";
import { eq } from "drizzle-orm";

/**
 * GET /hospital/profile
 * Protected by authenticateHospital middleware — req.hospital is guaranteed.
 * Returns the full hospital profile from the database.
 */
export default async function getHospitalProfile(req: Request, res: Response) {
  try {
    const hospitalId = req.hospital!.hospitalId;

    const result = await db
      .select()
      .from(hospitals)
      .where(eq(hospitals.hospital_id, hospitalId))
      .limit(1);

    if (!result.length) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    const h = result[0];

    return res.json({
      hospital_id: h.hospital_id,
      hospital_name: h.hospital_name,
      latitude: h.latitude,
      longitude: h.longitude,
      trauma_center: h.trauma_center,
      cardiac_center: h.cardiac_center,
      icu_beds_available: h.icu_beds_available,
      general_beds_available: h.general_beds_available,
      oxygen_beds_available: h.oxygen_beds_available,
      total_beds: h.total_beds,
      current_occupancy_rate: h.current_occupancy_rate,
      hospital_rating: h.hospital_rating,
    });
  } catch (err) {
    console.error("Get hospital profile error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
