import { Request, Response } from "express";
import { db } from "../../db/db";
import { user, requests, hospitals } from "../../schema/schema";
import { eq, and, or, desc } from "drizzle-orm";

/**
 * GET /user/profile
 * Protected by authenticateUser middleware — req.user is guaranteed.
 * Returns the full user profile from the database plus any active emergency.
 */
export default async function getUserProfile(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;

    // 1. Fetch User Data
    const userResult = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!userResult.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = userResult[0];

    // 2. Fetch Active Emergency (if any)
    const activeReq = await db
      .select({
        id: requests.request_id,
        status: requests.status,
        hospitalName: hospitals.hospital_name,
      })
      .from(requests)
      .leftJoin(hospitals, eq(requests.assigned_hospital_id, hospitals.hospital_id))
      .where(
        and(
          eq(requests.user_id, userId),
          or(
            eq(requests.status, "pending"),
            eq(requests.status, "dispatched"),
            eq(requests.status, "accepted")
          )
        )
      )
      .orderBy(desc(requests.request_timestamp))
      .limit(1);

    return res.json({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone_number,
      address: userData.address,
      bloodGroup: userData.bloodGroup,
      emergencyContact: userData.emergencyContact,
      createdAt: userData.createdAt,
      activeEmergency: activeReq.length > 0 ? activeReq[0] : null,
    });
  } catch (err) {
    console.error("Get user profile error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
