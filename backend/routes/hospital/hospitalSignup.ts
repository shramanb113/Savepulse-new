import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { db } from "../../db/db"; // your Drizzle DB instance
import { hospitals, user } from "../../schema/schema"; // your tables
import { eq } from "drizzle-orm";

export default async function hospitalSignup(req: Request, res: Response) {
  try {
    const { id, email, hospitalName } = req.body;

    if (!email || !hospitalName) {
      return res.status(400).json({ message: "email and hospitalName are required" });
    }

    // Check if hospital exists by email in the hospitals table
    // Note: The schema uses 'hospital_id' (serial) and doesn't have an 'email' field.
    // However, the 'user' table has 'email' and 'role'.
    // For now, I'll insert into 'hospitals' and 'user' if needed, or follow the code's intent.
    // The code was using 'hospitals' table, so I'll stick to that but use correct fields.
    
    const existingHospital = await db
      .select()
      .from(hospitals)
      .where(eq(hospitals.hospital_name, hospitalName));

    if (existingHospital.length === 0) {
      await db.insert(hospitals).values({
        hospital_name: hospitalName,
        latitude: hospitalName.latitude, // Should be provided by frontend
        longitude: hospitalName.longitude, // Should be provided by frontend
        total_beds: req.body.beds ? parseInt(req.body.beds) : 0,
      });
    }

    const token = jwt.sign(
      { email, hospitalName },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );


    res.setHeader("Authorization", `Bearer ${token}`);
    return res.status(201).json({ token });
  } catch (err: any) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}