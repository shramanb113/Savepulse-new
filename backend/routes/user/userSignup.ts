import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { db } from "../../db/db"; 
import { user } from "../../schema/schema"; 
import { eq } from "drizzle-orm";

export default async function userSignup(req: Request, res: Response) {
  try {
    const { id, email, name, phone, address, bloodGroup, emergencyContact } = req.body;

    if (!id || !email) {
      return res.status(400).json({ message: "id and email are required" });
    }

    // Check if user exists
    const existingUser = await db.select().from(user).where(eq(user.id, id));

    if (existingUser.length === 0) {
      await db.insert(user).values({
        id,
        email,
        name: name || null,
        phone_number: phone || null,      
        address: address || null,         
        bloodGroup: bloodGroup || null,   
        emergencyContact: emergencyContact || null 
      });
    }

    const token = jwt.sign(
      { userId: id, email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.setHeader("Authorization", `Bearer ${token}`);
    return res.status(201).json({ token });
  } catch (err: any) {
    console.error("Signup error details:", err); // Log the full error
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}