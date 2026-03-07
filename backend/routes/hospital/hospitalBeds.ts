import { Request, Response } from "express";
import { db } from "../../db/db";
import { hospitals } from "../../schema/schema";
import { eq } from "drizzle-orm";

/**
 * PATCH /hospital/beds
 * Allows hospital to manually update bed counts
 */
export async function updateBedCount(req: Request, res: Response) {
  try {
    const hospitalId = req.hospital!.hospitalId;
    const { icu_beds_available, general_beds_available, oxygen_beds_available } = req.body;

    const updates: any = {};
    if (icu_beds_available !== undefined) updates.icu_beds_available = icu_beds_available;
    if (general_beds_available !== undefined) updates.general_beds_available = general_beds_available;
    if (oxygen_beds_available !== undefined) updates.oxygen_beds_available = oxygen_beds_available;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No bed counts provided for update" });
    }

    await db
      .update(hospitals)
      .set(updates)
      .where(eq(hospitals.hospital_id, hospitalId));

    return res.json({ success: true, message: "Bed counts updated successfully" });
  } catch (err) {
    console.error("Update bed count error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
