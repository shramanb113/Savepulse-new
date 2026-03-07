"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-slate-950">
      <Header />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 pb-24 pt-6">

        {/* Hero */}
        <section className="rounded-3xl bg-gradient-to-br from-red-600 to-red-500 p-6 text-white shadow-lg">
          <p className="text-sm font-medium uppercase tracking-widest opacity-80">
            Emergency Service Platform
          </p>
          <h1 className="mt-1 text-3xl font-extrabold">
            SavePulse
          </h1>
          <p className="mt-1 text-sm opacity-90">
            Faster emergency response with intelligent hospital matching.
          </p>
        </section>

        {/* Selection */}
        <section className="flex flex-col gap-4">

          {/* User Option */}
          <button
            onClick={() => router.push("/userSignup")}
            className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-md transition hover:shadow-lg dark:bg-slate-900"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-xl">
              👤
            </div>

            <div className="text-left">
              <h2 className="font-semibold text-gray-800 dark:text-white">
                Sign up as User
              </h2>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Request ambulances instantly during emergencies.
              </p>
            </div>
          </button>

          {/* Hospital Option */}
          <button
            onClick={() => router.push("/hospitalSignup")}
            className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-md transition hover:shadow-lg dark:bg-slate-900"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-xl">
              🏥
            </div>

            <div className="text-left">
              <h2 className="font-semibold text-gray-800 dark:text-white">
                Register as Hospital
              </h2>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Receive emergency dispatch requests from nearby patients.
              </p>
            </div>
          </button>

        </section>

        {/* Info Section */}
        <section className="rounded-3xl bg-white p-5 shadow-md dark:bg-slate-900">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
            How it works
          </h3>

          <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-slate-300">
            <li>🚑 Request emergency ambulance instantly</li>
            <li>📍 Location-based hospital matching</li>
            <li>⚡ Faster emergency response time</li>
          </ul>
        </section>

      </main>

    </div>
  );
}