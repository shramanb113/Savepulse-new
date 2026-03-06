// ============================================================
//  SavePulse — Mock Data
//  Replaces DB/API calls during frontend development
// ============================================================

export type EmergencyType = 'cardiac' | 'trauma' | 'respiratory' | 'maternal';
export type Availability = 'available' | 'limited' | 'full';
export type RequestStatus = 'pending' | 'dispatching' | 'confirmed' | 'arriving' | 'completed';

export interface Hospital {
  id: string;
  name: string;
  address: string;
  distance: string;      // e.g. "1.2 km"
  distanceKm: number;
  erWaitMin: number;     // ER wait in minutes
  traumaLevel: 1 | 2 | 3;
  bedsAvailable: number;
  icuAvailable: boolean;
  hasCardiacUnit: boolean;
  hasTraumaUnit: boolean;
  hasRespUnit: boolean;
  hasMaternalUnit: boolean;
  availability: Availability;
  rating: number;
}

export interface Ambulance {
  id: string;
  driverName: string;
  vehicleType: 'ALS' | 'BLS' | 'MICU';  // Advanced/Basic Life Support / Mobile ICU
  vehicleNumber: string;
  etaMin: number;
  distance: string;
  isAvailable: boolean;
  rating: number;
}

export interface EmergencyRequest {
  id: string;
  patientName: string;
  emergencyType: EmergencyType;
  location: string;
  status: RequestStatus;
  createdAt: string;
  ambulanceId?: string;
  hospitalId?: string;
}

// ============================================================
//  Hospitals
// ============================================================
export const hospitals: Hospital[] = [
  {
    id: 'h1',
    name: 'Apollo Hospitals',
    address: '21 Greams Lane, Off Greams Road, Chennai',
    distance: '0.8 km',
    distanceKm: 0.8,
    erWaitMin: 4,
    traumaLevel: 1,
    bedsAvailable: 12,
    icuAvailable: true,
    hasCardiacUnit: true,
    hasTraumaUnit: true,
    hasRespUnit: true,
    hasMaternalUnit: true,
    availability: 'available',
    rating: 4.8,
  },
  {
    id: 'h2',
    name: 'AIIMS Emergency Centre',
    address: 'Sri Aurobindo Marg, Ansari Nagar West',
    distance: '1.4 km',
    distanceKm: 1.4,
    erWaitMin: 8,
    traumaLevel: 1,
    bedsAvailable: 5,
    icuAvailable: true,
    hasCardiacUnit: true,
    hasTraumaUnit: true,
    hasRespUnit: true,
    hasMaternalUnit: false,
    availability: 'limited',
    rating: 4.9,
  },
  {
    id: 'h3',
    name: 'Fortis Escorts Heart Institute',
    address: 'Okhla Road, Sukhdev Vihar',
    distance: '2.1 km',
    distanceKm: 2.1,
    erWaitMin: 6,
    traumaLevel: 2,
    bedsAvailable: 8,
    icuAvailable: true,
    hasCardiacUnit: true,
    hasTraumaUnit: false,
    hasRespUnit: true,
    hasMaternalUnit: false,
    availability: 'available',
    rating: 4.7,
  },
  {
    id: 'h4',
    name: 'Max Super Specialty Hospital',
    address: '1 Press Enclave Road, Saket',
    distance: '3.0 km',
    distanceKm: 3.0,
    erWaitMin: 12,
    traumaLevel: 2,
    bedsAvailable: 2,
    icuAvailable: false,
    hasCardiacUnit: false,
    hasTraumaUnit: true,
    hasRespUnit: true,
    hasMaternalUnit: true,
    availability: 'limited',
    rating: 4.5,
  },
  {
    id: 'h5',
    name: 'Safdarjung Hospital',
    address: 'Ansari Nagar West, Ring Road',
    distance: '3.7 km',
    distanceKm: 3.7,
    erWaitMin: 22,
    traumaLevel: 1,
    bedsAvailable: 0,
    icuAvailable: false,
    hasCardiacUnit: true,
    hasTraumaUnit: true,
    hasRespUnit: true,
    hasMaternalUnit: true,
    availability: 'full',
    rating: 4.1,
  },
];

// ============================================================
//  Ambulances
// ============================================================
export const ambulances: Ambulance[] = [
  {
    id: 'a1',
    driverName: 'Rajan Kumar',
    vehicleType: 'ALS',
    vehicleNumber: 'DL 01 AB 2234',
    etaMin: 4,
    distance: '0.6 km',
    isAvailable: true,
    rating: 4.9,
  },
  {
    id: 'a2',
    driverName: 'Suresh Yadav',
    vehicleType: 'MICU',
    vehicleNumber: 'DL 03 CC 7890',
    etaMin: 6,
    distance: '1.1 km',
    isAvailable: true,
    rating: 4.7,
  },
  {
    id: 'a3',
    driverName: 'Pradeep Singh',
    vehicleType: 'BLS',
    vehicleNumber: 'DL 07 XY 4512',
    etaMin: 9,
    distance: '1.8 km',
    isAvailable: true,
    rating: 4.6,
  },
  {
    id: 'a4',
    driverName: 'Mohan Verma',
    vehicleType: 'ALS',
    vehicleNumber: 'DL 05 PT 1122',
    etaMin: 11,
    distance: '2.3 km',
    isAvailable: false,
    rating: 4.8,
  },
];

// ============================================================
//  Hospital incoming requests (for Hospital dashboard)
// ============================================================
export interface IncomingRequest {
  id: string;
  patientRef: string;
  emergencyType: EmergencyType;
  location: string;
  distanceKm: number;
  etaMin: number;
  ambulanceDriver: string;
  arrivalTime: string;
  status: 'incoming' | 'accepted' | 'declined';
  urgency: 'critical' | 'high' | 'medium';
  receivedAt: string;
}

export const incomingRequests: IncomingRequest[] = [
  {
    id: 'r1',
    patientRef: 'PAT-0041',
    emergencyType: 'cardiac',
    location: 'Connaught Place, Block D',
    distanceKm: 1.4,
    etaMin: 6,
    ambulanceDriver: 'Rajan Kumar (ALS)',
    arrivalTime: '12:08 AM',
    status: 'incoming',
    urgency: 'critical',
    receivedAt: '12:02 AM',
  },
  {
    id: 'r2',
    patientRef: 'PAT-0039',
    emergencyType: 'trauma',
    location: 'NH-8, Near Mahipalpur Crossing',
    distanceKm: 3.2,
    etaMin: 14,
    ambulanceDriver: 'Suresh Yadav (MICU)',
    arrivalTime: '12:16 AM',
    status: 'accepted',
    urgency: 'high',
    receivedAt: '11:58 PM',
  },
  {
    id: 'r3',
    patientRef: 'PAT-0038',
    emergencyType: 'respiratory',
    location: 'Sarojini Nagar Market',
    distanceKm: 2.0,
    etaMin: 9,
    ambulanceDriver: 'Pradeep Singh (BLS)',
    arrivalTime: '12:11 AM',
    status: 'incoming',
    urgency: 'high',
    receivedAt: '12:01 AM',
  },
];

// ============================================================
//  Helper: filter hospitals by emergency type
// ============================================================
export function filterHospitalsByType(type: EmergencyType): Hospital[] {
  return hospitals.filter(h => {
    if (type === 'cardiac') return h.hasCardiacUnit;
    if (type === 'trauma') return h.hasTraumaUnit;
    if (type === 'respiratory') return h.hasRespUnit;
    if (type === 'maternal') return h.hasMaternalUnit;
    return true;
  });
}

// ============================================================
//  Emergency type metadata
// ============================================================
export const emergencyTypes: Array<{
  id: EmergencyType;
  label: string;
  icon: string;
  color: string;
}> = [
  { id: 'cardiac',     label: 'Cardiac Arrest',    icon: '🫀', color: '#ff3b3b' },
  { id: 'trauma',      label: 'Accident / Trauma',  icon: '🚨', color: '#f59e0b' },
  { id: 'respiratory', label: 'Respiratory',         icon: '🫁', color: '#3b82f6' },
  { id: 'maternal',    label: 'Maternal',             icon: '🤱', color: '#a855f7' },
];

export const vehicleTypeLabel: Record<string, string> = {
  ALS: 'Advanced Life Support',
  BLS: 'Basic Life Support',
  MICU: 'Mobile ICU',
};
