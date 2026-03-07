import { Request, Response } from "express";
import { db } from "../../db/db";
import { user } from "../../schema/schema";
import { eq } from "drizzle-orm";

/**
 * GET /user/profile
 * Protected by authenticateUser middleware — req.user is guaranteed.
 * Returns the full user profile from the database.
 */
export default async function getUserProfile(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;

    const result = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!result.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = result[0];

    return res.json({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone_number,
      address: userData.address,
      bloodGroup: userData.bloodGroup,
      emergencyContact: userData.emergencyContact,
      createdAt: userData.createdAt,
    });
  } catch (err) {
    console.error("Get user profile error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
