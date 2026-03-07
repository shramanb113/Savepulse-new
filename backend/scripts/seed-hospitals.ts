import { db } from "../db/db";
import { hospitals } from "../schema/schema";
import { readFileSync } from "fs";
import { resolve } from "path";

async function seedHospitals() {
  const csvPath = resolve(import.meta.dir, "../data/hospitals.csv");
  const csvContent = readFileSync(csvPath, "utf-8");

  const lines = csvContent.trim().split("\n");
  // Skip the header row
  const dataLines = lines.slice(1).filter((line) => line.trim() !== "");

  const hospitalData = dataLines.map((line) => {
    const cols = line.split(",");
    return {
      hospital_name: cols[1],
      latitude: parseFloat(cols[2]),
      longitude: parseFloat(cols[3]),
      trauma_center: cols[4] === "True",
      cardiac_center: cols[5] === "True",
      icu_beds_available: parseInt(cols[6]),
      general_beds_available: parseInt(cols[7]),
      oxygen_beds_available: parseInt(cols[8]),
      total_beds: parseInt(cols[9]),
      current_occupancy_rate: parseFloat(cols[10]),
      hospital_rating: parseFloat(cols[11]),
    };
  });

  console.log(`Parsed ${hospitalData.length} hospitals from CSV`);

  // Clear existing data and insert fresh
  await db.delete(hospitals);
  console.log("Cleared existing hospital data");

  // Insert in batches of 10
  for (let i = 0; i < hospitalData.length; i += 10) {
    const batch = hospitalData.slice(i, i + 10);
    await db.insert(hospitals).values(batch);
    console.log(`Inserted batch ${Math.floor(i / 10) + 1}`);
  }

  console.log(`✅ Successfully seeded ${hospitalData.length} hospitals into PostgreSQL`);
  process.exit(0);
}

seedHospitals().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
