import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { db } from "../../db/db"; 
import { hospitals } from "../../schema/schema"; 
import { eq } from "drizzle-orm";

export default async function hospitalSignup(req: Request, res: Response) {
  try {
    const { 
      hospital_name, 
      email, 
      latitude, 
      longitude, 
      trauma_center, 
      cardiac_center, 
      icu_beds_available, 
      general_beds_available, 
      oxygen_beds_available,
      total_beds 
    } = req.body;

    // 1. Validation
    if (!email || !hospital_name || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ 
        message: "Missing required fields: email, hospital_name, and location coordinates are mandatory." 
      });
    }

    // 2. Check for existing hospital (using name as a unique check based on your logic)
    const existingHospital = await db
      .select()
      .from(hospitals)
      .where(eq(hospitals.hospital_name, hospital_name))
      .limit(1);

    if (existingHospital.length > 0) {
      return res.status(409).json({ message: "A hospital with this name is already registered." });
    }

    // 3. Insert into Drizzle DB
    // hospital_id is 'serial', so it auto-generates
    const [newHospital] = await db.insert(hospitals).values({
      hospital_name: hospital_name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      trauma_center: Boolean(trauma_center),
      cardiac_center: Boolean(cardiac_center),
      icu_beds_available: Number(icu_beds_available) || 0,
      general_beds_available: Number(general_beds_available) || 0,
      oxygen_beds_available: Number(oxygen_beds_available) || 0,
      total_beds: Number(total_beds) || 0,
    }).returning();

    // 4. Generate JWT
    const token = jwt.sign(
      { 
        hospitalId: newHospital.hospital_id, 
        email, 
        role: "hospital" 
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // 5. Response
    res.setHeader("Authorization", `Bearer ${token}`);
    return res.status(201).json({ 
      message: "Hospital registered successfully",
      token,
      hospitalId: newHospital.hospital_id 
    });

  } catch (err: any) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}