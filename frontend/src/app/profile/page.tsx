"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  bloodGroup: string | null;
  emergencyContact: string | null;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("http://localhost:3001/user/profile", {
          credentials: "include",
        });

        if (res.status === 401) {
          router.push("/userLogin");
          return;
        }

        if (!res.ok) {
          setError("Failed to load profile.");
          return;
        }

        const data: UserProfile = await res.json();
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
        <Header title="My Profile" showBack={false} />
        <main className="mx-auto flex w-full max-w-md flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
            <p className="text-sm text-gray-500 dark:text-slate-400">Loading profile…</p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-slate-950">
        <Header title="My Profile" showBack={false} />
        <main className="mx-auto flex w-full max-w-md flex-1 items-center justify-center px-4">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">😔 {error}</p>
            <button
              onClick={() => router.push("/userLogin")}
              className="mt-4 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-500"
            >
              Go to Login
            </button>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-slate-950">
      <Header title="My Profile" showBack={false} />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-4 pb-28 pt-6">
        {/* Medical ID Card */}
        <div className="rounded-3xl bg-gradient-to-br from-red-600 to-red-500 p-6 text-white shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest opacity-80">
                Medical ID
              </p>
              <h2 className="mt-1 text-2xl font-extrabold">{profile.name}</h2>
              <p className="mt-0.5 text-sm opacity-90">{profile.email}</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur">
              🩺
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white/20 p-3 text-center backdrop-blur">
              <p className="text-xs opacity-80">Blood Type</p>
              <p className="mt-0.5 text-xl font-extrabold">{profile.bloodGroup || "—"}</p>
            </div>
            <div className="rounded-2xl bg-white/20 p-3 text-center backdrop-blur">
              <p className="text-xs opacity-80">Phone</p>
              <p className="mt-0.5 text-sm font-bold">{profile.phone || "—"}</p>
            </div>
            <div className="rounded-2xl bg-white/20 p-3 text-center backdrop-blur">
              <p className="text-xs opacity-80">Member Since</p>
              <p className="mt-0.5 text-sm font-bold">
                {new Date(profile.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">📍 Address</h3>
          <p className="mt-2 text-sm text-gray-700 dark:text-slate-300">
            {profile.address || "No address on file"}
          </p>
        </div>

        {/* Emergency Contact */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">🚨 Emergency Contact</h3>
          {profile.emergencyContact ? (
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm text-gray-700 dark:text-slate-300">{profile.emergencyContact}</p>
              <a
                href={`tel:${profile.emergencyContact}`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-400 dark:hover:bg-green-900/60"
                aria-label="Call emergency contact"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">Not set</p>
          )}
        </div>

        {/* Edit button */}
        <button className="h-14 w-full rounded-2xl border border-gray-300 bg-white text-base font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">
          ✏️ Edit Profile
        </button>
      </main>

      <BottomNav />
    </div>
  );
}