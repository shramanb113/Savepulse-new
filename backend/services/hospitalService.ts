import { db } from "../db/db";
import { hospitals } from "../schema/schema";

export interface Location {
  latitude: number;
  longitude: number;
}

export const findHospitalsInRadius = async (userLoc: Location, radiusKm: number = 10) => {
  const allHospitals = await db.select().from(hospitals);
  
  return allHospitals.filter(hospital => {
    const distance = calculateDistance(
      userLoc.latitude,
      userLoc.longitude,
      hospital.latitude,
      hospital.longitude
    );
    return distance <= radiusKm;
  }).sort((a, b) => {
    const distA = calculateDistance(userLoc.latitude, userLoc.longitude, a.latitude, a.longitude);
    const distB = calculateDistance(userLoc.latitude, userLoc.longitude, b.latitude, b.longitude);
    return distA - distB;
  });
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
