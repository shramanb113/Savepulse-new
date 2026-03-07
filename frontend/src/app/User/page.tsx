"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import SOSButton from "@/components/SOSButton";
import EmergencyTypeCard from "@/components/EmergencyTypeCard";
import BottomNav from "@/components/BottomNav";
import { emergencyTypes } from "@/data/emergencyTypes";

export default function Home() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [severity, setSeverity] = useState<number>(3); // Default to medium (1-5)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Auto-detect location on mount for the indicator
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  async function handleSOS() {
    if (!selectedType) {
      alert("Please select an emergency type first.");
      return;
    }

    // Get fresh location at moment of click
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const payload = {
        user_id: "user_guest_123", // Replace with actual auth user ID
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        emergency_type: selectedType,
        severity_level: severity,
      };

      try {
        const res = await fetch("http://localhost:3001/api/sos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          router.push(`/emergency?type=${selectedType}&severity=${severity}`);
        }
      } catch (err) {
        console.error("SOS Request Failed", err);
      }
    });
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-slate-950">
      <Header />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 pb-24 pt-6">
        {/* Hero */}
        <section className="rounded-3xl bg-gradient-to-br from-red-600 to-red-500 p-6 text-white shadow-lg">
          <p className="text-sm font-medium uppercase tracking-widest opacity-80">
            Emergency Service
          </p>
          <h1 className="mt-1 text-3xl font-extrabold">SavePulse</h1>
          <p className="mt-1 text-sm opacity-90">
            Fast ambulance dispatch &amp; intelligent hospital matching
          </p>

          <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/20 px-3 py-2 text-sm backdrop-blur">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className={location ? "" : "animate-pulse"}>
              {location ? "Location Locked" : "Detecting location…"}
            </span>
          </div>
        </section>

        {/* SOS Button */}
        <section className="flex flex-col items-center gap-4">
          <SOSButton onClick={handleSOS} />
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Tap to request an ambulance immediately
          </p>
        </section>

        {/* Severity Slider (New Section based on Schema) */}
        <section className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900">
          <div className="flex justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
              Severity Level
            </h2>
            <span className="text-sm font-bold text-red-600">{severity} / 5</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={severity}
            onChange={(e) => setSeverity(parseInt(e.target.value))}
            className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-red-600 dark:bg-slate-800"
          />
          <div className="mt-2 flex justify-between text-[10px] font-bold text-gray-400">
            <span>MODERATE</span>
            <span>CRITICAL</span>
          </div>
        </section>

        {/* Emergency type selector */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
            Select Emergency Type
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {emergencyTypes.map((type) => (
              <EmergencyTypeCard
                key={type.id}
                emoji={type.emoji}
                title={type.name}
                selected={selectedType === type.id}
                onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
              />
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}