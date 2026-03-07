import { Request, Response } from "express";
import { db } from "../../db/db";
import { requests, hospitals, user } from "../../schema/schema";
import { eq, and } from "drizzle-orm";

/**
 * GET /hospital/requests
 * Returns all requests assigned to this hospital with status "dispatched"
 */
export async function getHospitalRequests(req: Request, res: Response) {
  try {
    const hospitalId = req.hospital!.hospitalId;

    const liveRequests = await db
      .select({
        request_id: requests.request_id,
        user_id: requests.user_id,
        patient_name: user.name,
        latitude: requests.latitude,
        longitude: requests.longitude,
        emergency_type: requests.emergency_type,
        severity_level: requests.severity_level,
        status: requests.status,
        request_timestamp: requests.request_timestamp,
      })
      .from(requests)
      .leftJoin(user, eq(requests.user_id, user.id))
      .where(
        and(
          eq(requests.assigned_hospital_id, hospitalId),
          eq(requests.status, "dispatched")
        )
      );

    return res.json(liveRequests);
  } catch (err) {
    console.error("Get hospital requests error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * POST /hospital/requests/:requestId/accept
 * Accepts a request and decrements the general bed count
 */
export async function acceptRequest(req: Request, res: Response) {
  try {
    const { requestId } = req.params;
    const hospitalId = req.hospital!.hospitalId;

    // 1. Verify request belongs to this hospital and is dispatched
    const requestResult = await db
      .select()
      .from(requests)
      .where(
        and(
          eq(requests.request_id, parseInt(requestId as string)),
          eq(requests.assigned_hospital_id, hospitalId),
          eq(requests.status, "dispatched")
        )
      )
      .limit(1);

    if (!requestResult.length) {
      return res.status(404).json({ message: "Request not found or not in 'dispatched' status" });
    }

    // 2. Transaction: Update status and decrement bed count
    await db.transaction(async (tx) => {
      // Update request status
      await tx
        .update(requests)
        .set({ status: "accepted" })
        .where(eq(requests.request_id, parseInt(requestId as string)));

      // Decrement general beds available (safety check for > 0 omitted for brevity, but recommended)
      const currentHospital = await tx
        .select()
        .from(hospitals)
        .where(eq(hospitals.hospital_id, hospitalId))
        .limit(1);

      if (currentHospital.length && (currentHospital[0].general_beds_available ?? 0) > 0) {
        await tx
          .update(hospitals)
          .set({
            general_beds_available: (currentHospital[0].general_beds_available ?? 0) - 1,
          })
          .where(eq(hospitals.hospital_id, hospitalId));
      }
    });

    return res.json({ success: true, message: "Request accepted and bed reserved" });
  } catch (err) {
    console.error("Accept request error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * POST /hospital/requests/:requestId/decline
 */
export async function declineRequest(req: Request, res: Response) {
  try {
    const { requestId } = req.params;
    const hospitalId = req.hospital!.hospitalId;

    const result = await db
      .update(requests)
      .set({ status: "declined" })
      .where(
        and(
          eq(requests.request_id, parseInt(requestId as string)),
          eq(requests.assigned_hospital_id, hospitalId)
        )
      );

    return res.json({ success: true, message: "Request declined" });
  } catch (err) {
    console.error("Decline request error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
