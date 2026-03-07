"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

interface HospitalProfile {
  hospital_id: number;
  hospital_name: string;
  latitude: number;
  longitude: number;
  trauma_center: boolean;
  cardiac_center: boolean;
  icu_beds_available: number;
  general_beds_available: number;
  oxygen_beds_available: number;
  total_beds: number;
  current_occupancy_rate: number;
  hospital_rating: number;
}

export default function HospitalProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<HospitalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("http://localhost:3001/hospital/profile", {
          credentials: "include",
        });

        if (res.status === 401) {
          router.push("/hospitalLogin");
          return;
        }

        if (!res.ok) {
          setError("Failed to load hospital profile.");
          return;
        }

        const data: HospitalProfile = await res.json();
        setProfile(data);
      } catch {
        setError("Unable to connect to server.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-slate-950">
        <Header title="Hospital Profile" showBack />
        <main className="mx-auto flex w-full max-w-md flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
            <p className="text-sm text-gray-500 dark:text-slate-400">Loading profile…</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-slate-950">
        <Header title="Hospital Profile" showBack />
        <main className="mx-auto flex w-full max-w-md flex-1 items-center justify-center px-4">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">😔 {error}</p>
            <button
              onClick={() => router.push("/hospitalLogin")}
              className="mt-4 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-500"
            >
              Go to Login
            </button>
          </div>
        </main>
      </div>
    );
  }

  const occupancyPercent = Math.round((profile.current_occupancy_rate ?? 0) * 100);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-slate-950">
      <Header title="Hospital Profile" showBack />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-4 pb-12 pt-6">
        {/* Hospital ID Card */}
        <div className="rounded-3xl bg-gradient-to-br from-red-600 to-red-500 p-6 text-white shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest opacity-80">
                Partner Hospital
              </p>
              <h2 className="mt-1 text-2xl font-extrabold">{profile.hospital_name}</h2>
              <p className="mt-0.5 text-sm opacity-90">
                ID: #{profile.hospital_id}
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur">
              🏥
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white/20 p-3 text-center backdrop-blur">
              <p className="text-xs opacity-80">Rating</p>
              <p className="mt-0.5 text-xl font-extrabold">⭐ {profile.hospital_rating ?? "—"}</p>
            </div>
            <div className="rounded-2xl bg-white/20 p-3 text-center backdrop-blur">
              <p className="text-xs opacity-80">Total Beds</p>
              <p className="mt-0.5 text-xl font-extrabold">{profile.total_beds ?? 0}</p>
            </div>
            <div className="rounded-2xl bg-white/20 p-3 text-center backdrop-blur">
              <p className="text-xs opacity-80">Occupancy</p>
              <p className="mt-0.5 text-xl font-extrabold">{occupancyPercent}%</p>
            </div>
          </div>
        </div>

        {/* Specializations */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">Specializations</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                profile.trauma_center
                  ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                  : "bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400"
              }`}
            >
              {profile.trauma_center ? "✅" : "❌"} Trauma Center
            </span>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                profile.cardiac_center
                  ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                  : "bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400"
              }`}
            >
              {profile.cardiac_center ? "✅" : "❌"} Cardiac Center
            </span>
          </div>
        </div>

        {/* Bed Availability */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">🛏 Bed Availability</h3>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {[
              { label: "ICU", value: profile.icu_beds_available, emoji: "🧊" },
              { label: "General", value: profile.general_beds_available, emoji: "🛏" },
              { label: "Oxygen", value: profile.oxygen_beds_available, emoji: "💨" },
            ].map((bed) => (
              <div
                key={bed.label}
                className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center dark:border-slate-600 dark:bg-slate-700"
              >
                <p className="text-lg">{bed.emoji}</p>
                <p className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">
                  {bed.value ?? 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400">{bed.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">📍 Location</h3>
          <p className="mt-2 text-sm text-gray-700 dark:text-slate-300">
            Lat: {profile.latitude.toFixed(6)}, Lng: {profile.longitude.toFixed(6)}
          </p>
        </div>

        {/* Back to Dashboard */}
        <button
          onClick={() => router.push("/emergency_dashboard_hospital")}
          className="h-14 w-full rounded-2xl bg-red-600 text-base font-semibold text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-500 active:scale-95"
        >
          🚨 Go to Emergency Dashboard
        </button>
      </main>
    </div>
  );
}
