"use client";

import { useState, Suspense, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import HospitalCard from "@/components/HospitalCard";
import { emergencyTypes } from "@/data/emergencyTypes";
import type { Hospital, AvailabilityStatus } from "@/data/hospitals";

interface BetterHospital extends Hospital {
  score?: number;
}

function HospitalsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const typeId = searchParams.get("type") ?? "";
  const locationName = searchParams.get("location") ?? "Your location";

  const [recommended, setRecommended] = useState<BetterHospital[]>([]);
  const [requestId, setRequestId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<"none" | "confirming" | "pending" | "accepted" | "declined">("none");
  
  const pollInterval = useRef<NodeJS.Timeout | null>(null);

  const emergency = emergencyTypes.find((t) => t.id === typeId);

  // Initial Fetch: Get Recommendations
  useEffect(() => {
    async function fetchRecommendations() {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser");
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            const response = await fetch("http://localhost:3001/api/emergency", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                latitude,
                longitude,
                emergencyType: typeId,
              }),
            });

            const data = await response.json();

            if (data.success) {
              setRequestId(data.requestId);
              const mappedHospitals = data.hospitals.map((h: any) => ({
                id: String(h.hospital_id),
                name: h.hospital_name,
                distance: `${(Math.random() * 5 + 1).toFixed(1)} km away`,
                distanceKm: 0,
                specializations: h.cardiac_center ? ["Cardiac Care"] : h.trauma_center ? ["Trauma Center"] : [],
                availability: (h.icu_beds_available > 0 ? "available" : "busy") as AvailabilityStatus,
                etaMinutes: Math.floor(Math.random() * 15 + 5),
                address: `Hospital Address for ${h.hospital_name}`,
                phone: "+1 (555) 000-0000",
                score: h.score,
              }));
              setRecommended(mappedHospitals);
            } else {
              setError(data.error || "Failed to fetch recommendations");
            }
          } catch (err) {
            setError("Failed to connect to backend");
          } finally {
            setLoading(false);
          }
        },
        (geoErr) => {
          setError(`Location error: ${geoErr.message}`);
          setLoading(false);
        }
      );
    }

    fetchRecommendations();
  }, [typeId]);

  // Polling for Status
  useEffect(() => {
    if (dispatchStatus === "pending" && requestId) {
      pollInterval.current = setInterval(async () => {
        try {
          const res = await fetch(`http://localhost:3001/api/emergency/status/${requestId}`, {
            credentials: "include",
          });
          const data = await res.json();

          if (data.status === "accepted") {
            setDispatchStatus("accepted");
            if (pollInterval.current) clearInterval(pollInterval.current);
          } else if (data.status === "declined") {
            setDispatchStatus("declined");
            if (pollInterval.current) clearInterval(pollInterval.current);
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 3000);
    }

    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [dispatchStatus, requestId]);

  async function handleConfirmDispatch() {
    if (!requestId || !selectedHospital) return;
    
    setDispatchStatus("confirming");
    try {
      const res = await fetch("http://localhost:3001/api/emergency/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          requestId: requestId,
          hospitalId: parseInt(selectedHospital.id),
        }),
      });

      if (res.ok) {
        setDispatchStatus("pending");
      } else {
        setError("Failed to confirm dispatch");
        setDispatchStatus("none");
      }
    } catch (err) {
      setError("Connection error");
      setDispatchStatus("none");
    }
  }

  // UI: Success State
  if (dispatchStatus === "accepted" && selectedHospital) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-slate-950">
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-800">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Request Accepted!</h1>
            <p className="mt-2 text-gray-500 dark:text-slate-400">Help is on the way. Stay calm.</p>
          </div>
          <div className="w-full rounded-2xl bg-gray-50 p-4 dark:bg-slate-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-slate-400">Hospital</span>
              <span className="font-semibold text-gray-900 dark:text-white">{selectedHospital.name}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-slate-400">Estimated Arrival</span>
              <span className="font-bold text-red-600 dark:text-red-400">~{selectedHospital.etaMinutes} minutes</span>
            </div>
          </div>
          <button className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 text-base font-bold text-white shadow transition-colors hover:bg-blue-700">
            Track Your Ambulance
          </button>
          <Link href="/User" className="text-sm font-medium text-gray-500 underline hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200">Back to Home</Link>
        </div>
      </div>
    );
  }

  // UI: Pending State
  if (dispatchStatus === "pending") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-slate-950">
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-800">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Waiting for Hospital...</h1>
            <p className="mt-2 text-gray-500 dark:text-slate-400">The hospital is reviewing your request.</p>
          </div>
          <div className="w-full rounded-2xl bg-gray-50 p-4 dark:bg-slate-700 text-center">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Sent to: {selectedHospital?.name}</p>
          </div>
        </div>
      </div>
    );
  }

  // UI: Declined State
  if (dispatchStatus === "declined") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-slate-950">
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-800">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40 text-3xl">⚠️</div>
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Request Declined</h1>
            <p className="mt-2 text-gray-500 dark:text-slate-400">The hospital is currently unable to accept your request.</p>
          </div>
          <button onClick={() => { setDispatchStatus("none"); setSelectedHospital(null); }} className="h-14 w-full rounded-2xl bg-red-600 text-white font-bold">Pick Another Hospital</button>
        </div>
      </div>
    );
  }

  // UI: Selection State
  if (selectedHospital) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-slate-950">
        <Header title="Confirm Dispatch" showBack />
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-8 pt-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Dispatch to</h2>
            <p className="mt-1 text-xl font-extrabold text-red-600 dark:text-red-400">{selectedHospital.name}</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{selectedHospital.address}</p>
          </div>
          <div className="flex gap-3">
            <button disabled={dispatchStatus === "confirming"} onClick={() => setSelectedHospital(null)} className="flex-1 h-14 rounded-2xl border border-gray-300 bg-white text-gray-700 font-semibold">Change</button>
            <button disabled={dispatchStatus === "confirming"} onClick={handleConfirmDispatch} className="flex-[2] h-14 rounded-2xl bg-red-600 text-white font-bold">
              {dispatchStatus === "confirming" ? "Confirming..." : "Confirm Dispatch"}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-slate-950">
      <Header title="Nearby Hospitals" showBack />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pb-8 pt-6">
        {loading ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
            <p className="text-gray-500">Finding the best hospitals for you...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-red-50 p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 font-bold text-red-700 underline">Try Again</button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recommended.map((hospital) => (
              <HospitalCard key={hospital.id} hospital={hospital} onSelect={() => setSelectedHospital(hospital)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function HospitalsPage() {
  return (
    <Suspense><HospitalsPageContent /></Suspense>
  );
}